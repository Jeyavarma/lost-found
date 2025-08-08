const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserNotifications } = require('../controllers/notificationController');

// @route   GET /api/notifications
// @desc    Get all notifications for the logged-in user
// @access  Private
router.get('/', protect, getUserNotifications);

module.exports = router;
