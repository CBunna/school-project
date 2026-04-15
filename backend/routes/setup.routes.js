const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

/**
 * ONE-TIME DATABASE SETUP ENDPOINT
 *
 * This endpoint initializes the database with schema and sample data.
 * Only run this ONCE after deploying to production.
 *
 * Visit: https://your-backend.onrender.com/api/setup?secret=YOUR_SECRET_KEY
 */
router.get('/', async (req, res) => {
  try {
    // Security check - require secret key
    const secretKey = req.query.secret || req.headers['x-setup-secret'];
    const expectedSecret = process.env.SETUP_SECRET || 'beskydy-setup-2025';

    if (secretKey !== expectedSecret) {
      return res.status(403).json({
        error: 'Unauthorized',
        message: 'Invalid setup secret. Add ?secret=YOUR_SECRET to the URL',
        hint: 'Set SETUP_SECRET environment variable in Render dashboard'
      });
    }

    console.log('🔧 Starting database setup...');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await pool.query(schema);

    // Verify setup
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const attractionsCount = await pool.query('SELECT COUNT(*) FROM attractions');
    const accommodationCount = await pool.query('SELECT COUNT(*) FROM accommodation');

    console.log('✅ Database setup completed successfully!');

    res.json({
      success: true,
      message: '✅ Database initialized successfully!',
      statistics: {
        users: userCount.rows[0].count,
        attractions: attractionsCount.rows[0].count,
        accommodation: accommodationCount.rows[0].count
      },
      credentials: {
        admin: 'admin@beskydy.cz / adminpass123',
        user: 'user@beskydy.cz / userpass123'
      },
      nextSteps: [
        '1. Test login with demo credentials',
        '2. For security, remove this endpoint or disable SETUP_SECRET',
        '3. Your website is ready to use!'
      ]
    });

  } catch (error) {
    console.error('❌ Database setup error:', error);

    res.status(500).json({
      error: 'Database setup failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      troubleshooting: [
        'Check database connection string is correct',
        'Ensure PostgreSQL database is created',
        'Verify database credentials in environment variables'
      ]
    });
  }
});

/**
 * Check if database is already initialized
 */
router.get('/check', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(result.rows[0].count);

    res.json({
      initialized: userCount > 0,
      userCount: userCount,
      message: userCount > 0
        ? 'Database is already initialized'
        : 'Database needs initialization - visit /api/setup?secret=YOUR_SECRET'
    });
  } catch (error) {
    res.json({
      initialized: false,
      error: error.message,
      message: 'Database not initialized - visit /api/setup?secret=YOUR_SECRET'
    });
  }
});

module.exports = router;
