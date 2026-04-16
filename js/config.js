/**
 * Configuration for Production Deployment
 * Update these values when deploying to production
 */

// API Configuration
const CONFIG = {
    // Backend API URL
    // Local: http://localhost:3001/api
    // Render: https://your-backend-url.onrender.com/api
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001/api'
        : 'https://beskydy-backend.onrender.com/api',
    
    // Environment
    ENV: window.location.hostname === 'localhost' ? 'development' : 'production',
    
    // Features
    ENABLE_ANALYTICS: false,
    ENABLE_ERROR_TRACKING: false,
};

// Log configuration on load
console.log('🔧 App Configuration:', CONFIG);
