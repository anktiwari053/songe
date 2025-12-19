/**
 * Song Routes
 */

const express = require('express');
const router = express.Router();
const { getAllSongs, searchSongs, getSongById } = require('../controllers/songController');

// Public routes
router.get('/', getAllSongs);
router.get('/search', searchSongs);
router.get('/:id', getSongById);

module.exports = router;

