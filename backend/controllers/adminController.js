/**
 * Admin Controller
 * Handles admin operations: upload, update, delete songs
 */

const Song = require('../models/Song');
const fs = require('fs');
const path = require('path');

// Upload new song
exports.uploadSong = async (req, res) => {
  try {
    const { title, artist, genre } = req.body;

    // Validation
    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        message: 'Title and artist are required'
      });
    }

    // Check if audio file exists (req.files for multiple files)
    const audioFile = req.files?.audio?.[0];
    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    // Get cover image if provided
    const coverImageFile = req.files?.coverImage?.[0];
    const coverImageUrl = coverImageFile 
      ? `/uploads/images/${coverImageFile.filename}`
      : '/uploads/images/default-cover.jpg';

    // Create song record
    const song = await Song.create({
      title,
      artist,
      genre: genre || '',
      audioUrl: `/uploads/audio/${audioFile.filename}`,
      coverImage: coverImageUrl,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Song uploaded successfully',
      song
    });
  } catch (error) {
    // Delete uploaded files if song creation fails
    if (req.files) {
      if (req.files.audio?.[0]) {
        const audioPath = path.join(__dirname, '../../uploads/audio', req.files.audio[0].filename);
        if (fs.existsSync(audioPath)) {
          fs.unlinkSync(audioPath);
        }
      }
      if (req.files.coverImage?.[0]) {
        const imagePath = path.join(__dirname, '../../uploads/images', req.files.coverImage[0].filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading song',
      error: error.message
    });
  }
};

// Update song
exports.updateSong = async (req, res) => {
  try {
    const songId = req.params.id;
    const { title, artist, genre } = req.body;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Update fields
    if (title) song.title = title;
    if (artist) song.artist = artist;
    if (genre !== undefined) song.genre = genre;

    // Handle cover image upload if provided
    if (req.file) {
      // Delete old cover image if exists
      if (song.coverImage && song.coverImage !== '/uploads/images/default-cover.jpg') {
        const oldImagePath = path.join(__dirname, '../../', song.coverImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      song.coverImage = `/uploads/images/${req.file.filename}`;
    }

    await song.save();

    res.json({
      success: true,
      message: 'Song updated successfully',
      song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating song',
      error: error.message
    });
  }
};

// Delete song
exports.deleteSong = async (req, res) => {
  try {
    const songId = req.params.id;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Delete audio file
    if (song.audioUrl) {
      const audioPath = path.join(__dirname, '../../', song.audioUrl);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }

    // Delete cover image if not default
    if (song.coverImage && song.coverImage !== '/uploads/images/default-cover.jpg') {
      const imagePath = path.join(__dirname, '../../', song.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove from all users' favorites
    const User = require('../models/User');
    await User.updateMany(
      { favorites: songId },
      { $pull: { favorites: songId } }
    );

    // Delete song record
    await Song.findByIdAndDelete(songId);

    res.json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting song',
      error: error.message
    });
  }
};

// Get all songs (admin view with more details)
exports.getAllSongsAdmin = async (req, res) => {
  try {
    const songs = await Song.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: songs.length,
      songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching songs',
      error: error.message
    });
  }
};

