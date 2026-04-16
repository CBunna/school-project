const pool = require('../config/database');

// Get all favorites for current user
const getUserFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        f.id as favorite_id,
        f.item_type,
        f.item_id,
        f.created_at,
        CASE
          WHEN f.item_type = 'attraction' THEN (SELECT row_to_json(a.*) FROM attractions a WHERE a.id = f.item_id)
          WHEN f.item_type = 'accommodation' THEN (SELECT row_to_json(ac.*) FROM accommodation ac WHERE ac.id = f.item_id)
          WHEN f.item_type = 'activity' THEN (SELECT row_to_json(act.*) FROM activities act WHERE act.id = f.item_id)
        END as item_details
       FROM favorites f
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    res.json({
      favorites: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({
      error: 'Error fetching favorites'
    });
  }
};

// Add item to favorites
const addFavorite = async (req, res) => {
  try {
    const { item_type, item_id } = req.body;

    // Validation
    if (!item_type || !item_id) {
      return res.status(400).json({
        error: 'Item type and item ID are required'
      });
    }

    // Validate item type
    if (!['attraction', 'accommodation', 'activity'].includes(item_type)) {
      return res.status(400).json({
        error: 'Item type must be either "attraction", "accommodation", or "activity"'
      });
    }

    // Check if item exists in the appropriate table
    let itemCheck;
    if (item_type === 'attraction') {
      itemCheck = await pool.query('SELECT id FROM attractions WHERE id = $1', [item_id]);
    } else if (item_type === 'accommodation') {
      itemCheck = await pool.query('SELECT id FROM accommodation WHERE id = $1', [item_id]);
    } else if (item_type === 'activity') {
      itemCheck = await pool.query('SELECT id FROM activities WHERE id = $1', [item_id]);
    }

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({
        error: `${item_type} not found`
      });
    }

    // Check if already in favorites
    const existingFavorite = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND item_type = $2 AND item_id = $3',
      [req.user.id, item_type, item_id]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({
        error: 'Item is already in your favorites'
      });
    }

    // Add to favorites
    const result = await pool.query(
      `INSERT INTO favorites (user_id, item_type, item_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, item_type, item_id]
    );

    res.status(201).json({
      message: 'Added to favorites successfully',
      favorite: result.rows[0]
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      error: 'Error adding to favorites'
    });
  }
};

// Remove item from favorites
const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Favorite not found or you do not have permission to remove it'
      });
    }

    res.json({
      message: 'Removed from favorites successfully'
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      error: 'Error removing from favorites'
    });
  }
};

// Remove favorite by item type and item ID
const removeFavoriteByItem = async (req, res) => {
  try {
    const { item_type, item_id } = req.params;

    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND item_type = $2 AND item_id = $3 RETURNING *',
      [req.user.id, item_type, item_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Favorite not found'
      });
    }

    res.json({
      message: 'Removed from favorites successfully'
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      error: 'Error removing from favorites'
    });
  }
};

// Check if item is in favorites
const checkFavorite = async (req, res) => {
  try {
    const { item_type, item_id } = req.params;

    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND item_type = $2 AND item_id = $3',
      [req.user.id, item_type, item_id]
    );

    res.json({
      isFavorite: result.rows.length > 0,
      favorite: result.rows.length > 0 ? result.rows[0] : null
    });

  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      error: 'Error checking favorite status'
    });
  }
};

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  removeFavoriteByItem,
  checkFavorite
};
