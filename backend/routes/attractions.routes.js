const express = require('express');
const router = express.Router();
const attractionsController = require('../controllers/attractions.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', attractionsController.getAllAttractions);
router.get('/:id', attractionsController.getAttractionById);

// Admin only routes
router.post('/', verifyToken, verifyAdmin, attractionsController.createAttraction);
router.put('/:id', verifyToken, verifyAdmin, attractionsController.updateAttraction);
router.delete('/:id', verifyToken, verifyAdmin, attractionsController.deleteAttraction);

module.exports = router;
