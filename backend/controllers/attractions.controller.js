const pool = require('../config/database');

// Get all attractions
const getAllAttractions = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM attractions ORDER BY rating DESC, name ASC'
    );

    res.json({
      attractions: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Get attractions error:', error);
    res.status(500).json({
      error: 'Error fetching attractions'
    });
  }
};

// Get single attraction by ID
const getAttractionById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM attractions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Attraction not found'
      });
    }

    res.json({
      attraction: result.rows[0]
    });

  } catch (error) {
    console.error('Get attraction error:', error);
    res.status(500).json({
      error: 'Error fetching attraction'
    });
  }
};

// Create new attraction (admin only)
const createAttraction = async (req, res) => {
  try {
    const { name, description, location, elevation, image_url, category, rating } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({
        error: 'Name, description, and location are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO attractions (name, description, location, elevation, image_url, category, rating)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, location, elevation, image_url, category, rating]
    );

    res.status(201).json({
      message: 'Attraction created successfully',
      attraction: result.rows[0]
    });

  } catch (error) {
    console.error('Create attraction error:', error);
    res.status(500).json({
      error: 'Error creating attraction'
    });
  }
};

// Update attraction (admin only)
const updateAttraction = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, elevation, image_url, category, rating } = req.body;

    const result = await pool.query(
      `UPDATE attractions
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           location = COALESCE($3, location),
           elevation = COALESCE($4, elevation),
           image_url = COALESCE($5, image_url),
           category = COALESCE($6, category),
           rating = COALESCE($7, rating)
       WHERE id = $8
       RETURNING *`,
      [name, description, location, elevation, image_url, category, rating, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Attraction not found'
      });
    }

    res.json({
      message: 'Attraction updated successfully',
      attraction: result.rows[0]
    });

  } catch (error) {
    console.error('Update attraction error:', error);
    res.status(500).json({
      error: 'Error updating attraction'
    });
  }
};

// Delete attraction (admin only)
const deleteAttraction = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM attractions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Attraction not found'
      });
    }

    res.json({
      message: 'Attraction deleted successfully'
    });

  } catch (error) {
    console.error('Delete attraction error:', error);
    res.status(500).json({
      error: 'Error deleting attraction'
    });
  }
};

module.exports = {
  getAllAttractions,
  getAttractionById,
  createAttraction,
  updateAttraction,
  deleteAttraction
};
