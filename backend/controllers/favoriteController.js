/**
 * Favorite Controller
 * Handles adding and removing favorite songs
 */

const User = require('../models/User');
const Song = require('../models/Song');

// Add song to favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const songId = req.params.songId;

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Get user with favorites
    const user = await User.findById(userId);

    // Check if already in favorites
    if (user.favorites.includes(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Song already in favorites'
      });
    }

    // Add to favorites
    user.favorites.push(songId);
    await user.save();

    res.json({
      success: true,
      message: 'Song added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
};

// Remove song from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const songId = req.params.songId;

    // Get user with favorites
    const user = await User.findById(userId);

    // Check if in favorites
    if (!user.favorites.includes(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Song not in favorites'
      });
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(
      fav => fav.toString() !== songId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Song removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
};

// Get user's favorite songs
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user with populated favorites
    const user = await User.findById(userId).populate('favorites');

    res.json({
      success: true,
      count: user.favorites.length,
      songs: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

// Check if song is favorite
exports.checkFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const songId = req.params.songId;

    const user = await User.findById(userId);
    const isFavorite = user.favorites.includes(songId);

    res.json({
      success: true,
      isFavorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking favorite status',
      error: error.message
    });
  }
};

