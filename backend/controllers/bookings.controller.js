const pool = require('../config/database');

// Create new booking (authenticated users only)
const createBooking = async (req, res) => {
  try {
    const {
      booking_type, item_id, check_in_date, check_out_date,
      number_of_guests, total_price, special_requests
    } = req.body;

    // Validation
    if (!booking_type || !item_id || !check_in_date || !number_of_guests || !total_price) {
      return res.status(400).json({
        error: 'Booking type, item ID, check-in date, number of guests, and total price are required'
      });
    }

    // Validate booking type
    if (!['accommodation', 'activity'].includes(booking_type)) {
      return res.status(400).json({
        error: 'Booking type must be either "accommodation" or "activity"'
      });
    }

    // For accommodation bookings, check_out_date is required
    if (booking_type === 'accommodation' && !check_out_date) {
      return res.status(400).json({
        error: 'Check-out date is required for accommodation bookings'
      });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, booking_type, item_id, check_in_date, check_out_date, number_of_guests, total_price, special_requests, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user.id, booking_type, item_id, check_in_date, check_out_date, number_of_guests, total_price, special_requests, 'pending']
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      error: 'Error creating booking'
    });
  }
};

// Get all bookings for current user
const getUserBookings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      bookings: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      error: 'Error fetching bookings'
    });
  }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT b.*, u.email, u.first_name, u.last_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND b.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ' ORDER BY b.created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      bookings: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      error: 'Error fetching bookings'
    });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT b.*, u.email, u.first_name, u.last_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    const booking = result.rows[0];

    // Check if user owns this booking or is admin
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied. You can only view your own bookings.'
      });
    }

    res.json({
      booking: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: 'Error fetching booking'
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Status is required'
      });
    }

    // Validate status
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be: pending, confirmed, cancelled, or completed'
      });
    }

    // Check if booking exists and user has permission
    const bookingCheck = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );

    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    const booking = bookingCheck.rows[0];

    // Users can only cancel their own bookings
    // Admins can change to any status
    if (req.user.role !== 'admin') {
      if (booking.user_id !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({
          error: 'Users can only cancel their bookings'
        });
      }
    }

    const result = await pool.query(
      `UPDATE bookings
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    res.json({
      message: 'Booking status updated successfully',
      booking: result.rows[0]
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      error: 'Error updating booking status'
    });
  }
};

// Delete booking (admin only)
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    res.json({
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      error: 'Error deleting booking'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
};
