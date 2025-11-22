const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const Item = require('../models/Item');
const BlockedUser = require('../models/BlockedUser');
const authMiddleware = require('../middleware/authMiddleware');
const {
  chatMessageLimiter,
  chatRoomLimiter,
  checkBlocked,
  validateMessage,
  checkRoomPermissions,
  preventSelfChat,
  logChatActivity,
  checkAccountStanding
} = require('../middleware/chatSecurity');

// Get user's chat rooms
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      'participants.userId': req.user.id,
      status: 'active'
    })
    .populate('itemId', 'title category imageUrl status')
    .populate('participants.userId', 'name email role')
    .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

// Get or create chat room for an item
router.post('/room/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Check if item exists
    const item = await Item.findById(itemId).populate('reportedBy', 'name email');
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Prevent self-chat
    if (item.reportedBy._id.toString() === userId) {
      return res.status(400).json({ error: 'Cannot start chat with yourself' });
    }

    // Check if room already exists
    let room = await ChatRoom.findOne({ itemId })
      .populate('itemId', 'title category imageUrl status')
      .populate('participants.userId', 'name email role');

    if (!room) {
      // Create new room
      const participants = [
        {
          userId: item.reportedBy._id,
          role: item.type === 'lost' ? 'owner' : 'finder'
        }
      ];

      // Add current user if different from item owner
      if (userId !== item.reportedBy._id.toString()) {
        participants.push({
          userId,
          role: item.type === 'lost' ? 'finder' : 'owner'
        });
      }

      room = new ChatRoom({
        itemId,
        participants
      });
      await room.save();
      await room.populate('itemId', 'title category imageUrl status');
      await room.populate('participants.userId', 'name email role');
    } else {
      // Add user to existing room if not already a participant
      const isParticipant = room.participants.some(p => 
        p.userId._id.toString() === userId
      );

      if (!isParticipant) {
        room.participants.push({
          userId,
          role: item.type === 'lost' ? 'finder' : 'owner'
        });
        await room.save();
        await room.populate('participants.userId', 'name email role');
      }
    }

    res.json(room);
  } catch (error) {
    console.error('Create/get chat room error:', error);
    res.status(500).json({ error: 'Failed to create chat room' });
  }
});

// Get messages for a chat room
router.get('/room/:roomId/messages', 
  authMiddleware, 
  checkAccountStanding,
  checkRoomPermissions,
  async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const maxLimit = Math.min(parseInt(limit), 100); // Max 100 messages per request

    // Verify user is participant
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    const isParticipant = room.participants.some(p => 
      p.userId.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get total message count for this room
    const totalMessages = await Message.countDocuments({ roomId });
    
    // Limit total messages per room to 1000
    if (totalMessages > 1000) {
      // Delete oldest messages beyond limit
      const oldMessages = await Message.find({ roomId })
        .sort({ createdAt: 1 })
        .limit(totalMessages - 1000)
        .select('_id');
      
      const oldMessageIds = oldMessages.map(msg => msg._id);
      await Message.deleteMany({ _id: { $in: oldMessageIds } });
    }

    const messages = await Message.find({ roomId })
      .populate('senderId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(maxLimit)
      .skip((page - 1) * maxLimit);

    res.json({
      messages: messages.reverse(),
      totalMessages: Math.min(totalMessages, 1000),
      hasMore: (page * maxLimit) < Math.min(totalMessages, 1000)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark messages as read
router.post('/room/:roomId/read', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { 
        roomId, 
        senderId: { $ne: userId },
        'readBy.userId': { $ne: userId }
      },
      { 
        $push: { 
          readBy: { 
            userId, 
            readAt: new Date() 
          } 
        } 
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Search messages in a room
router.get('/room/:roomId/search', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { q, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    // Verify user is participant
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    const isParticipant = room.participants.some(p => 
      p.userId.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({
      roomId,
      content: { $regex: q.trim(), $options: 'i' },
      type: 'text'
    })
    .populate('senderId', 'name email')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json(messages);
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ error: 'Failed to search messages' });
  }
});

// Block user
router.post('/block/:userId', 
  authMiddleware, 
  checkAccountStanding,
  logChatActivity('user_blocked'),
  async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const blockerId = req.user.id;

    if (userId === blockerId) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    // Check if already blocked
    const existing = await BlockedUser.findOne({ blockerId, blockedUserId: userId });
    if (existing) {
      return res.status(400).json({ error: 'User already blocked' });
    }

    const blockedUser = new BlockedUser({
      blockerId,
      blockedUserId: userId,
      reason: reason?.trim()
    });

    await blockedUser.save();
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

// Unblock user
router.delete('/block/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const blockerId = req.user.id;

    await BlockedUser.deleteOne({ blockerId, blockedUserId: userId });
    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

// Get blocked users
router.get('/blocked', authMiddleware, async (req, res) => {
  try {
    const blocked = await BlockedUser.find({ blockerId: req.user.id })
      .populate('blockedUserId', 'name email')
      .sort({ createdAt: -1 });

    res.json(blocked);
  } catch (error) {
    console.error('Get blocked users error:', error);
    res.status(500).json({ error: 'Failed to get blocked users' });
  }
});

module.exports = router;