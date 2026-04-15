const pool = require('../config/database');

// Get all activities
const getAllActivities = async (req, res) => {
  try {
    const { type, difficulty, available } = req.query;

    let query = 'SELECT * FROM activities WHERE 1=1';
    const params = [];
    let paramCount = 1;

    // Filter by type if provided
    if (type) {
      query += ` AND type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    // Filter by difficulty if provided
    if (difficulty) {
      query += ` AND difficulty = $${paramCount}`;
      params.push(difficulty);
      paramCount++;
    }

    // Filter by availability if provided
    if (available !== undefined) {
      query += ` AND available = $${paramCount}`;
      params.push(available === 'true');
      paramCount++;
    }

    query += ' ORDER BY type ASC, price ASC';

    const result = await pool.query(query, params);

    res.json({
      activities: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      error: 'Error fetching activities'
    });
  }
};

// Get single activity by ID
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM activities WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({
      activity: result.rows[0]
    });

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      error: 'Error fetching activity'
    });
  }
};

// Create new activity (admin only)
const createActivity = async (req, res) => {
  try {
    const {
      name, type, description, duration, difficulty,
      price, season, image_url, available
    } = req.body;

    if (!name || !type || !description || !duration || !difficulty || !price) {
      return res.status(400).json({
        error: 'Name, type, description, duration, difficulty, and price are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO activities (name, type, description, duration, difficulty, price, season, image_url, available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, type, description, duration, difficulty, price, season, image_url, available !== false]
    );

    res.status(201).json({
      message: 'Activity created successfully',
      activity: result.rows[0]
    });

  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      error: 'Error creating activity'
    });
  }
};

// Update activity (admin only)
const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, type, description, duration, difficulty,
      price, season, image_url, available
    } = req.body;

    const result = await pool.query(
      `UPDATE activities
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           description = COALESCE($3, description),
           duration = COALESCE($4, duration),
           difficulty = COALESCE($5, difficulty),
           price = COALESCE($6, price),
           season = COALESCE($7, season),
           image_url = COALESCE($8, image_url),
           available = COALESCE($9, available)
       WHERE id = $10
       RETURNING *`,
      [name, type, description, duration, difficulty, price, season, image_url, available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({
      message: 'Activity updated successfully',
      activity: result.rows[0]
    });

  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      error: 'Error updating activity'
    });
  }
};

// Delete activity (admin only)
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM activities WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({
      message: 'Activity deleted successfully'
    });

  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      error: 'Error deleting activity'
    });
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
