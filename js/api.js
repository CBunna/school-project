/**
 * API Integration Layer
 * Connects frontend to backend API
 */

// Automatically detect environment and use correct API URL
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'  // Local development
    : 'https://beskydy-backend.onrender.com/api';  // Production on Render

/**
 * Helper function to get JWT token from localStorage
 */
function getAuthToken() {
    return localStorage.getItem('token');
}

/**
 * Helper function to make authenticated API requests
 */
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Authentication API calls
 */
const AuthAPI = {
    /**
     * Login user with email and password
     * @param {string} email
     * @param {string} password
     * @returns {Promise} User data and JWT token
     */
    async login(email, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise} User data and JWT token
     */
    async register(userData) {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    /**
     * Logout user (client-side only)
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
};

/**
 * Attractions API calls
 */
const AttractionsAPI = {
    /**
     * Get all attractions
     * @returns {Promise<Array>} List of attractions
     */
    async getAll() {
        return await apiRequest('/attractions');
    },

    /**
     * Get single attraction by ID
     * @param {number} id - Attraction ID
     * @returns {Promise<Object>} Attraction data
     */
    async getById(id) {
        return await apiRequest(`/attractions/${id}`);
    }
};

/**
 * Accommodation API calls
 */
const AccommodationAPI = {
    /**
     * Get all accommodation
     * @returns {Promise<Array>} List of accommodations
     */
    async getAll() {
        return await apiRequest('/accommodation');
    },

    /**
     * Get single accommodation by ID
     * @param {number} id - Accommodation ID
     * @returns {Promise<Object>} Accommodation data
     */
    async getById(id) {
        return await apiRequest(`/accommodation/${id}`);
    }
};

/**
 * Activities API calls
 */
const ActivitiesAPI = {
    /**
     * Get all activities
     * @returns {Promise<Array>} List of activities
     */
    async getAll() {
        return await apiRequest('/activities');
    }
};

/**
 * Bookings API calls
 */
const BookingsAPI = {
    /**
     * Get all bookings (admin only)
     * @returns {Promise<Array>} List of bookings
     */
    async getAll() {
        return await apiRequest('/bookings');
    },

    /**
     * Create new booking
     * @param {Object} bookingData - Booking information
     * @returns {Promise<Object>} Created booking
     */
    async create(bookingData) {
        return await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }
};

/**
 * Contact API calls
 */
const ContactAPI = {
    /**
     * Submit contact form
     * @param {Object} contactData - Contact form data
     * @returns {Promise<Object>} Submission confirmation
     */
    async submit(contactData) {
        return await apiRequest('/contact', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    },

    /**
     * Get all contact submissions (admin only)
     * @returns {Promise<Array>} List of contacts
     */
    async getAll() {
        return await apiRequest('/contact');
    }
};

/**
 * Example Usage:
 *
 * // Login
 * try {
 *     const result = await AuthAPI.login('user@beskydy.cz', 'userpass123');
 *     console.log('Logged in:', result.user);
 * } catch (error) {
 *     console.error('Login failed:', error);
 * }
 *
 * // Get attractions
 * try {
 *     const attractions = await AttractionsAPI.getAll();
 *     console.log('Attractions:', attractions);
 * } catch (error) {
 *     console.error('Failed to load attractions:', error);
 * }
 *
 * // Create booking
 * try {
 *     const booking = await BookingsAPI.create({
 *         user_id: 1,
 *         booking_type: 'accommodation',
 *         item_name: 'Hotel Beskyd',
 *         check_in: '2025-06-15',
 *         check_out: '2025-06-18',
 *         guests: 2,
 *         total_price: 270.00
 *     });
 *     console.log('Booking created:', booking);
 * } catch (error) {
 *     console.error('Booking failed:', error);
 * }
 */
