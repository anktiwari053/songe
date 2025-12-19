/**
 * Favorite Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite
} = require('../controllers/favoriteController');

// All routes require authentication
router.use(authenticate);

router.get('/', getFavorites);
router.get('/check/:songId', checkFavorite);
router.post('/:songId', addFavorite);
router.delete('/:songId', removeFavorite);

module.exports = router;

