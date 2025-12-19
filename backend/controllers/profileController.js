/**
 * Profile Controller
 * Handles user profile operations
 */

const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user with favorites count
    const user = await User.findById(userId).populate('favorites');

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalFavorites: user.favorites.length,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

