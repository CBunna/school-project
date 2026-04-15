const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activities.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', activitiesController.getAllActivities);
router.get('/:id', activitiesController.getActivityById);

// Admin only routes
router.post('/', verifyToken, verifyAdmin, activitiesController.createActivity);
router.put('/:id', verifyToken, verifyAdmin, activitiesController.updateActivity);
router.delete('/:id', verifyToken, verifyAdmin, activitiesController.deleteActivity);

module.exports = router;
