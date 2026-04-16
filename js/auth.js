/**
 * auth.js - Simple Authentication System
 * For educational purposes - Beskydy Region Tourism Website
 */

// Demo user accounts (in real app, this would be in database)
const DEMO_USERS = {
    'user@beskydy.cz': {
        password: 'userpass123',
        name: 'Demo User',
        email: 'user@beskydy.cz',
        userType: 'registered',
        phone: '+420 123 456 789'
    },
    'admin@beskydy.cz': {
        password: 'adminpass123',
        name: 'Admin User',
        email: 'admin@beskydy.cz',
        userType: 'admin',
        phone: '+420 999 888 777'
    }
};

/**
 * Check if user is logged in
 * @returns {Object|null} User object or null
 */
function checkAuth() {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
        try {
            return JSON.parse(userJSON);
        } catch (e) {
            return null;
        }
    }
    return null;
}

/**
 * Login function - Updated to use backend API
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<boolean>} Success status
 */
async function login(email, password) {
    try {
        // Use backend API for authentication (from api.js)
        if (typeof AuthAPI !== 'undefined') {
            // Backend API authentication
            const result = await AuthAPI.login(email, password);

            // Show success message
            showMessage('Login successful! Redirecting...', 'success');

            // Redirect based on user type
            setTimeout(() => {
                // Determine base path based on current location
                const basePath = window.location.pathname.includes('/pages/') ? '../' : 'pages/';

                if (result.user.role === 'admin') {
                    window.location.href = basePath + 'admin/admin-dashboard.html';
                } else {
                    window.location.href = basePath + 'user/user-profile.html';
                }
            }, 1000);

            return true;
        } else {
            // Fallback to old demo system if API not available
            const user = DEMO_USERS[email];

            if (user && user.password === password) {
                // Create user session (without password)
                const userSession = {
                    name: user.name,
                    email: user.email,
                    userType: user.userType,
                    phone: user.phone,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString()
                };

                // Save to localStorage
                localStorage.setItem('user', JSON.stringify(userSession));

                // Show success message
                showMessage('Login successful! Redirecting...', 'success');

                // Redirect based on user type
                setTimeout(() => {
                    // Determine base path based on current location
                    const basePath = window.location.pathname.includes('/pages/') ? '../' : 'pages/';

                    if (user.userType === 'admin') {
                        window.location.href = basePath + 'admin/admin-dashboard.html';
                    } else {
                        window.location.href = basePath + 'user/user-profile.html';
                    }
                }, 1000);

                return true;
            } else {
                showMessage('Invalid email or password', 'error');
                return false;
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage(error.message || 'Login failed. Please try again.', 'error');
        return false;
    }
}

/**
 * Register new user (demo - in real app would save to database)
 * @param {Object} userData - User registration data
 * @returns {boolean} Success status
 */
function register(userData) {
    // Check if email already exists
    if (DEMO_USERS[userData.email]) {
        showMessage('Email already registered', 'error');
        return false;
    }

    // Validate password strength
    if (userData.password.length < 8) {
        showMessage('Password must be at least 8 characters', 'error');
        return false;
    }

    // Check if passwords match
    if (userData.password !== userData.confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return false;
    }

    // In real app, would save to database
    // For demo, just show success and redirect to login
    showMessage('Registration successful! Please login.', 'success');

    setTimeout(() => {
        // If already in auth folder, use login.html, otherwise use pages/auth/login.html
        const loginPath = window.location.pathname.includes('/pages/auth/') ? 'login.html' : 'pages/auth/login.html';
        window.location.href = loginPath;
    }, 1500);

    return true;
}

/**
 * Logout user
 */
function logout() {
    // Remove both user data and JWT token
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    showMessage('Logged out successfully', 'success');

    setTimeout(() => {
        // Get the current path
        const currentPath = window.location.pathname;

        // Determine correct path to index.html based on current location
        let indexPath = '/';

        // If we're in a subdirectory, calculate relative path
        if (currentPath.includes('/pages/admin/')) {
            indexPath = '../../index.html';
        } else if (currentPath.includes('/pages/user/')) {
            indexPath = '../../index.html';
        } else if (currentPath.includes('/pages/auth/')) {
            indexPath = '../../index.html';
        } else if (currentPath.includes('/pages/public/')) {
            indexPath = '../../index.html';
        } else if (currentPath.includes('/pages/booking/')) {
            indexPath = '../../index.html';
        } else if (currentPath.includes('/pages/')) {
            indexPath = '../index.html';
        } else {
            indexPath = 'index.html';
        }

        console.log('Logging out, redirecting to:', indexPath);
        window.location.href = indexPath;
    }, 1000);
}

/**
 * Check if user is admin
 * @returns {boolean}
 */
function isAdmin() {
    const user = checkAuth();
    // Support both 'role' (from backend API) and 'userType' (from old demo system)
    return user && (user.role === 'admin' || user.userType === 'admin');
}

/**
 * Show message to user
 * @param {string} message - Message text
 * @param {string} type - Message type (success, error, info)
 */
function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(messageEl);

    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

/**
 * Update navigation based on login status
 */
function updateNavigation() {
    const user = checkAuth();
    const nav = document.querySelector('.nav-menu');

    if (user && nav) {
        // Determine base path
        const inPages = window.location.pathname.includes('/pages/');
        const basePath = inPages ? '../' : 'pages/';

        // Remove login/register links if they exist
        const loginLinks = nav.querySelectorAll('a[href*="login.html"], a[href*="register.html"]');
        loginLinks.forEach(link => link.parentElement.remove());

        // Check if user menu already exists (prevent duplicates)
        const existingProfile = nav.querySelector('a[href*="user-profile.html"], a[href*="admin-dashboard.html"]');
        const existingLogout = nav.querySelector('a[onclick*="logout"]');

        if (!existingProfile) {
            // Add user menu
            const userMenu = document.createElement('li');
            const isUserAdmin = user.role === 'admin' || user.userType === 'admin';
            userMenu.innerHTML = isUserAdmin
                ? `<a href="${basePath}admin/admin-dashboard.html">Admin Dashboard</a>`
                : `<a href="${basePath}user/user-profile.html">Profile</a>`;
            nav.appendChild(userMenu);
        }

        if (!existingLogout) {
            // Add logout link
            const logoutLink = document.createElement('li');
            logoutLink.innerHTML = `<a href="#" onclick="logout(); return false;">Logout</a>`;
            nav.appendChild(logoutLink);
        }
    }
}

// Login form handler
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        await login(email, password);
    });
}

// Register form handler
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const userData = {
            name: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            country: document.getElementById('country').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value
        };

        // Check terms agreement
        if (!document.getElementById('terms').checked) {
            showMessage('You must agree to the terms and conditions', 'error');
            return;
        }

        // Check GDPR consent
        if (!document.getElementById('gdpr').checked) {
            showMessage('You must consent to GDPR policy', 'error');
            return;
        }

        register(userData);
    });

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('password-strength');

    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 'Weak';
            let color = '#dc3545';

            if (password.length >= 8) {
                strength = 'Medium';
                color = '#ffc107';
            }
            if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
                strength = 'Strong';
                color = '#28a745';
            }

            strengthIndicator.textContent = `Password strength: ${strength}`;
            strengthIndicator.style.color = color;
        });
    }

    // Password match indicator
    const confirmPasswordInput = document.getElementById('confirm-password');
    const matchIndicator = document.getElementById('password-match');

    if (confirmPasswordInput && matchIndicator && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value === passwordInput.value && this.value.length > 0) {
                matchIndicator.textContent = 'Passwords match ✓';
                matchIndicator.style.color = '#28a745';
            } else if (this.value.length > 0) {
                matchIndicator.textContent = 'Passwords do not match ✗';
                matchIndicator.style.color = '#dc3545';
            } else {
                matchIndicator.textContent = '';
            }
        });
    }
}

// Update navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});
