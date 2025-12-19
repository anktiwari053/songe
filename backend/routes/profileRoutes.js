/**
 * Profile Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/profileController');

// All routes require authentication
router.use(authenticate);

router.get('/', getProfile);

module.exports = router;

