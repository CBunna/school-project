const pool = require('../config/database');

// Submit contact form (public)
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Name, email, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, subject, created_at`,
      [name, email, phone, subject, message, 'new']
    );

    res.status(201).json({
      message: 'Contact form submitted successfully. We will get back to you soon!',
      contact: result.rows[0]
    });

  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      error: 'Error submitting contact form'
    });
  }
};

// Get all contact messages (admin only)
const getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      contacts: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      error: 'Error fetching contact messages'
    });
  }
};

// Get single contact message by ID (admin only)
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM contacts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Contact message not found'
      });
    }

    // Mark as read if it's new
    if (result.rows[0].status === 'new') {
      await pool.query(
        'UPDATE contacts SET status = $1 WHERE id = $2',
        ['read', id]
      );
    }

    res.json({
      contact: result.rows[0]
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      error: 'Error fetching contact message'
    });
  }
};

// Update contact status (admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Status is required'
      });
    }

    // Validate status
    if (!['new', 'read', 'responded', 'archived'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be: new, read, responded, or archived'
      });
    }

    const result = await pool.query(
      'UPDATE contacts SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Contact message not found'
      });
    }

    res.json({
      message: 'Contact status updated successfully',
      contact: result.rows[0]
    });

  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      error: 'Error updating contact status'
    });
  }
};

// Delete contact message (admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM contacts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Contact message not found'
      });
    }

    res.json({
      message: 'Contact message deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      error: 'Error deleting contact message'
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
};
