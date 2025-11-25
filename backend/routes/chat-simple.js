const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Simple chat routes without complex middleware
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    // For now, return empty array to prevent 404
    res.json([]);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

router.post('/room/:itemId', authMiddleware, async (req, res) => {
  try {
    // For now, return a mock room to prevent 404
    res.json({
      _id: 'mock-room',
      itemId: req.params.itemId,
      participants: [],
      status: 'active'
    });
  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({ error: 'Failed to create chat room' });
  }
});

// Direct chat between users
router.post('/direct', authMiddleware, async (req, res) => {
  try {
    const { otherUserId } = req.body;
    res.json({
      _id: 'mock-direct-room',
      itemId: null,
      participants: [
        { userId: req.user.id, role: 'participant' },
        { userId: otherUserId, role: 'participant' }
      ],
      type: 'direct',
      status: 'active'
    });
  } catch (error) {
    console.error('Create direct chat error:', error);
    res.status(500).json({ error: 'Failed to create direct chat' });
  }
});

module.exports = router;