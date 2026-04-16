const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Get all users (Admin only)
router.get('/', verifyAdmin, usersController.getAllUsers);

// Get user statistics (Admin only)
router.get('/stats', verifyAdmin, usersController.getUserStats);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Update user
router.put('/:id', usersController.updateUser);

// Delete user (Admin only)
router.delete('/:id', verifyAdmin, usersController.deleteUser);

module.exports = router;
