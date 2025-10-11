const express = require('express');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    // Mock notifications for now
    const notifications = [
      {
        id: 1,
        message: 'Someone found an item matching your lost phone description',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        message: 'Your reported item has been viewed 5 times',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;