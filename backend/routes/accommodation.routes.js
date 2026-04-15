const express = require('express');
const router = express.Router();
const accommodationController = require('../controllers/accommodation.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', accommodationController.getAllAccommodation);
router.get('/:id', accommodationController.getAccommodationById);

// Admin only routes
router.post('/', verifyToken, verifyAdmin, accommodationController.createAccommodation);
router.put('/:id', verifyToken, verifyAdmin, accommodationController.updateAccommodation);
router.delete('/:id', verifyToken, verifyAdmin, accommodationController.deleteAccommodation);

module.exports = router;
