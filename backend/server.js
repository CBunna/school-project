const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS configuration
// Support multiple origins for development and production
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'https://beskydy-frontend.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('   Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const attractionsRoutes = require('./routes/attractions.routes');
const accommodationRoutes = require('./routes/accommodation.routes');
const activitiesRoutes = require('./routes/activities.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const contactRoutes = require('./routes/contact.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const usersRoutes = require('./routes/users.routes');
const setupRoutes = require('./routes/setup.routes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attractions', attractionsRoutes);
app.use('/api/accommodation', accommodationRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/setup', setupRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const { checkDatabaseConnection } = require('./config/database');
  const dbHealth = await checkDatabaseConnection();

  res.json({
    status: dbHealth.connected ? 'OK' : 'DEGRADED',
    message: 'Beskydy Tourism API is running',
    timestamp: new Date().toISOString(),
    database: dbHealth.connected ? {
      status: 'connected',
      timestamp: dbHealth.timestamp
    } : {
      status: 'disconnected',
      error: dbHealth.error
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Beskydy Tourism API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      attractions: '/api/attractions',
      accommodation: '/api/accommodation',
      activities: '/api/activities',
      bookings: '/api/bookings',
      contact: '/api/contact',
      favorites: '/api/favorites'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   🏔️  Beskydy Tourism API Server                 ║
║                                                   ║
║   Server running on: http://localhost:${PORT}     ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                   ║
║   API Endpoints:                                  ║
║   • POST /api/auth/register                       ║
║   • POST /api/auth/login                          ║
║   • GET  /api/attractions                         ║
║   • GET  /api/accommodation                       ║
║   • GET  /api/activities                          ║
║   • POST /api/bookings                            ║
║   • POST /api/contact                             ║
╚═══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
