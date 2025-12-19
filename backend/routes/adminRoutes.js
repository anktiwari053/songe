/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const { uploadAudioAndImage, uploadImage } = require('../middleware/uploadMiddleware');
const {
  uploadSong,
  updateSong,
  deleteSong,
  getAllSongsAdmin
} = require('../controllers/adminController');

// All routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Get all songs (admin view)
router.get('/songs', getAllSongsAdmin);

// Upload new song (audio + optional cover image)
router.post('/songs/upload', uploadAudioAndImage, uploadSong);

// Update song (with optional cover image)
router.put('/songs/:id', uploadImage, updateSong);

// Delete song
router.delete('/songs/:id', deleteSong);

module.exports = router;

