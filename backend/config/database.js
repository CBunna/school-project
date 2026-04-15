const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
// Support both DATABASE_URL (Render) and individual env vars (local development)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,  // Increased to 10 seconds for Render
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5433,
        user: process.env.DB_USER || 'beskydy_user',
        password: process.env.DB_PASSWORD || 'beskydy_password',
        database: process.env.DB_NAME || 'beskydy_db',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

// Test database connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
