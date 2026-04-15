const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// Public route
router.post('/', contactController.submitContact);

// Admin only routes
router.get('/', verifyToken, verifyAdmin, contactController.getAllContacts);
router.get('/:id', verifyToken, verifyAdmin, contactController.getContactById);
router.put('/:id/status', verifyToken, verifyAdmin, contactController.updateContactStatus);
router.delete('/:id', verifyToken, verifyAdmin, contactController.deleteContact);

module.exports = router;
