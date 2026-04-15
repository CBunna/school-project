const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// All booking routes require authentication
router.post('/', verifyToken, bookingsController.createBooking);
router.get('/my-bookings', verifyToken, bookingsController.getUserBookings);
router.get('/:id', verifyToken, bookingsController.getBookingById);
router.put('/:id/status', verifyToken, bookingsController.updateBookingStatus);

// Admin only routes
router.get('/', verifyToken, verifyAdmin, bookingsController.getAllBookings);
router.delete('/:id', verifyToken, verifyAdmin, bookingsController.deleteBooking);

module.exports = router;
