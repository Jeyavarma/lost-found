const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Working chat system with in-memory storage
const chatRooms = new Map();
const messages = new Map();

// Get user's chat rooms
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const userRooms = Array.from(chatRooms.values())
      .filter(room => room.participants.some(p => p.userId === req.user.id))
      .map(room => ({
        ...room,
        lastMessage: messages.get(room._id)?.[messages.get(room._id)?.length - 1] || null,
        unreadCount: 0
      }));
    
    res.json(userRooms);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

// Create item-based chat room
router.post('/room/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const roomId = `item_${itemId}_${Date.now()}`;
    
    const room = {
      _id: roomId,
      itemId: { _id: itemId, title: 'Item Chat', status: 'active' },
      participants: [
        { userId: { _id: req.user.id, name: req.user.name, email: req.user.email }, role: 'participant' }
      ],
      type: 'item',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    chatRooms.set(roomId, room);
    messages.set(roomId, []);
    
    res.json(room);
  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({ error: 'Failed to create chat room' });
  }
});

// Create direct chat between users
router.post('/direct', authMiddleware, async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const roomId = `direct_${req.user.id}_${otherUserId}_${Date.now()}`;
    
    const room = {
      _id: roomId,
      itemId: null,
      participants: [
        { userId: { _id: req.user.id, name: req.user.name, email: req.user.email }, role: 'participant' },
        { userId: { _id: otherUserId, name: 'User', email: 'user@example.com' }, role: 'participant' }
      ],
      type: 'direct',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    chatRooms.set(roomId, room);
    messages.set(roomId, []);
    
    res.json(room);
  } catch (error) {
    console.error('Create direct chat error:', error);
    res.status(500).json({ error: 'Failed to create direct chat' });
  }
});

// Get messages for a room
router.get('/room/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const roomMessages = messages.get(roomId) || [];
    res.json({ messages: roomMessages, hasMore: false });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/room/:roomId/message', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, type = 'text' } = req.body;
    
    const message = {
      _id: `msg_${Date.now()}`,
      roomId,
      senderId: { _id: req.user.id, name: req.user.name, email: req.user.email },
      content,
      type,
      createdAt: new Date(),
      deliveryStatus: 'sent'
    };
    
    if (!messages.has(roomId)) {
      messages.set(roomId, []);
    }
    
    messages.get(roomId).push(message);
    
    // Update room timestamp
    const room = chatRooms.get(roomId);
    if (room) {
      room.updatedAt = new Date();
    }
    
    res.json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;

// Export for cleanup
module.exports.chatRooms = chatRooms;
module.exports.messages = messages;