const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attractions', attractionsRoutes);
app.use('/api/accommodation', accommodationRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Beskydy Tourism API is running',
    timestamp: new Date().toISOString()
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
      contact: '/api/contact'
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
