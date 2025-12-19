/**
 * Song Controller
 * Handles all song-related operations
 */

const Song = require('../models/Song');
const fs = require('fs');
const path = require('path');

// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    
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

// Search songs
exports.searchSongs = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search in title and artist fields (case-insensitive)
    const songs = await Song.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { artist: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: songs.length,
      songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching songs',
      error: error.message
    });
  }
};

// Get single song by ID
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.json({
      success: true,
      song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching song',
      error: error.message
    });
  }
};

