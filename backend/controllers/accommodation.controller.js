const pool = require('../config/database');

// Get all accommodation
const getAllAccommodation = async (req, res) => {
  try {
    const { type, available } = req.query;

    let query = 'SELECT * FROM accommodation WHERE 1=1';
    const params = [];
    let paramCount = 1;

    // Filter by type if provided
    if (type) {
      query += ` AND type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    // Filter by availability if provided
    if (available !== undefined) {
      query += ` AND available = $${paramCount}`;
      params.push(available === 'true');
      paramCount++;
    }

    query += ' ORDER BY rating DESC, price_per_night ASC';

    const result = await pool.query(query, params);

    res.json({
      accommodation: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Get accommodation error:', error);
    res.status(500).json({
      error: 'Error fetching accommodation'
    });
  }
};

// Get single accommodation by ID
const getAccommodationById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM accommodation WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Accommodation not found'
      });
    }

    res.json({
      accommodation: result.rows[0]
    });

  } catch (error) {
    console.error('Get accommodation error:', error);
    res.status(500).json({
      error: 'Error fetching accommodation'
    });
  }
};

// Create new accommodation (admin only)
const createAccommodation = async (req, res) => {
  try {
    const {
      name, type, description, location, price_per_night,
      capacity, amenities, image_url, rating, available
    } = req.body;

    if (!name || !type || !description || !location || !price_per_night || !capacity) {
      return res.status(400).json({
        error: 'Name, type, description, location, price_per_night, and capacity are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO accommodation (name, type, description, location, price_per_night, capacity, amenities, image_url, rating, available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, type, description, location, price_per_night, capacity, amenities, image_url, rating, available !== false]
    );

    res.status(201).json({
      message: 'Accommodation created successfully',
      accommodation: result.rows[0]
    });

  } catch (error) {
    console.error('Create accommodation error:', error);
    res.status(500).json({
      error: 'Error creating accommodation'
    });
  }
};

// Update accommodation (admin only)
const updateAccommodation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, type, description, location, price_per_night,
      capacity, amenities, image_url, rating, available
    } = req.body;

    const result = await pool.query(
      `UPDATE accommodation
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           description = COALESCE($3, description),
           location = COALESCE($4, location),
           price_per_night = COALESCE($5, price_per_night),
           capacity = COALESCE($6, capacity),
           amenities = COALESCE($7, amenities),
           image_url = COALESCE($8, image_url),
           rating = COALESCE($9, rating),
           available = COALESCE($10, available)
       WHERE id = $11
       RETURNING *`,
      [name, type, description, location, price_per_night, capacity, amenities, image_url, rating, available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Accommodation not found'
      });
    }

    res.json({
      message: 'Accommodation updated successfully',
      accommodation: result.rows[0]
    });

  } catch (error) {
    console.error('Update accommodation error:', error);
    res.status(500).json({
      error: 'Error updating accommodation'
    });
  }
};

// Delete accommodation (admin only)
const deleteAccommodation = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM accommodation WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Accommodation not found'
      });
    }

    res.json({
      message: 'Accommodation deleted successfully'
    });

  } catch (error) {
    console.error('Delete accommodation error:', error);
    res.status(500).json({
      error: 'Error deleting accommodation'
    });
  }
};

module.exports = {
  getAllAccommodation,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
};
