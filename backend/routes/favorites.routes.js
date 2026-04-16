const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All favorites routes require authentication
router.get('/', verifyToken, favoritesController.getUserFavorites);
router.post('/', verifyToken, favoritesController.addFavorite);
router.delete('/:id', verifyToken, favoritesController.removeFavorite);
router.delete('/:item_type/:item_id', verifyToken, favoritesController.removeFavoriteByItem);
router.get('/check/:item_type/:item_id', verifyToken, favoritesController.checkFavorite);

module.exports = router;
