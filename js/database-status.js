// Database Connection Status Monitor
// Checks if backend and database are accessible

let lastHealthCheck = null;
let healthCheckInterval = null;

// Check backend and database health
async function checkBackendHealth() {
    try {
        const response = await fetch('http://localhost:3001/api/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const health = await response.json();
        lastHealthCheck = health;

        return {
            backendUp: true,
            databaseUp: health.database?.status === 'connected',
            details: health
        };

    } catch (error) {
        console.error('❌ Backend health check failed:', error);
        lastHealthCheck = null;

        return {
            backendUp: false,
            databaseUp: false,
            error: error.message
        };
    }
}

// Show database error message to user
function showDatabaseError(status) {
    const errorContainer = document.getElementById('database-error');

    if (!errorContainer) {
        // Create error container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'database-error';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #dc3545;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 90%;
            text-align: center;
        `;
        document.body.appendChild(container);
    }

    const container = document.getElementById('database-error');

    if (!status.backendUp) {
        container.innerHTML = `
            <strong>⚠️ Backend Server Not Running</strong>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">
                Please start the backend server: <code style="background: rgba(0,0,0,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">cd backend && npm run dev</code>
            </p>
        `;
        container.style.display = 'block';
    } else if (!status.databaseUp) {
        container.innerHTML = `
            <strong>⚠️ Database Not Connected</strong>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">
                The database is not accessible. Please check:
            </p>
            <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem; font-size: 0.9rem; text-align: left;">
                <li>Docker container is running: <code style="background: rgba(0,0,0,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">docker ps</code></li>
                <li>Start database: <code style="background: rgba(0,0,0,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">docker start beskydy-postgres</code></li>
                <li>Check .env file database credentials</li>
            </ul>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.9;">
                Error: ${status.details?.database?.error || 'Connection failed'}
            </p>
        `;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// Hide database error message
function hideDatabaseError() {
    const errorContainer = document.getElementById('database-error');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

// Start monitoring database connection
function startDatabaseMonitoring(intervalMs = 30000) {
    // Initial check
    checkBackendHealth().then(status => {
        if (!status.backendUp || !status.databaseUp) {
            showDatabaseError(status);
        }
    });

    // Periodic checks
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
    }

    healthCheckInterval = setInterval(async () => {
        const status = await checkBackendHealth();

        if (!status.backendUp || !status.databaseUp) {
            showDatabaseError(status);
        } else {
            hideDatabaseError();
        }
    }, intervalMs);
}

// Stop monitoring
function stopDatabaseMonitoring() {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
        healthCheckInterval = null;
    }
}

// Enhanced error handler for API requests
function handleDatabaseError(error, context = '') {
    console.error(`Database error in ${context}:`, error);

    // Check if it's a connection error
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        showMessage('Cannot connect to server. Please check if backend is running.', 'error');

        // Show detailed error banner
        checkBackendHealth().then(showDatabaseError);

        return {
            userMessage: 'Server connection failed. Please try again later.',
            technicalError: error.message
        };
    }

    return {
        userMessage: error.message || 'An error occurred. Please try again.',
        technicalError: error.message
    };
}

// Auto-start monitoring when page loads (for authenticated pages only)
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Only monitor on pages that need database (not login/public pages)
        const path = window.location.pathname;
        const needsDatabase = path.includes('admin') || path.includes('user') || path.includes('booking');

        if (needsDatabase) {
            console.log('🔍 Starting database connection monitoring...');
            startDatabaseMonitoring(30000); // Check every 30 seconds
        }
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        stopDatabaseMonitoring();
    });
}
