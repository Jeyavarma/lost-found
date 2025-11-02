const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const BlockedUser = require('../models/BlockedUser');
const jwt = require('jsonwebtoken');

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = { id: decoded.userId, role: decoded.role };
    socket.userId = user.id;
    socket.userRole = user.role;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

const handleConnection = (io) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);

    // Join chat room
    socket.on('join_room', async (roomId) => {
      try {
        // Verify user is participant
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Chat room not found' });
          return;
        }

        const isParticipant = room.participants.some(p => 
          p.userId.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(roomId);
        socket.currentRoom = roomId;
        socket.emit('joined_room', { roomId });
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { messageId, roomId, content, type = 'text' } = data;

        if (!socket.currentRoom || socket.currentRoom !== roomId) {
          socket.emit('message_failed', { 
            messageId, 
            error: 'Not in this room' 
          });
          return;
        }

        // Create message
        const message = new Message({
          roomId,
          senderId: socket.userId,
          content: content.trim(),
          type,
          clientMessageId: messageId
        });

        await message.save();
        await message.populate('senderId', 'name email role');

        // Update room's last message
        await ChatRoom.findByIdAndUpdate(roomId, {
          lastMessage: {
            content: content.trim(),
            senderId: socket.userId,
            timestamp: new Date()
          },
          updatedAt: new Date()
        });

        // Emit delivery confirmation to sender
        socket.emit('message_delivered', {
          messageId,
          serverMessageId: message._id
        });

        // Emit to all room participants
        io.to(roomId).emit('new_message', {
          ...message.toObject(),
          clientMessageId: messageId
        });

        // Send notification to other participants
        const room = await ChatRoom.findById(roomId);
        room.participants.forEach(participant => {
          if (participant.userId.toString() !== socket.userId) {
            io.to(`user_${participant.userId}`).emit('message_notification', {
              roomId,
              message: message.content,
              senderName: message.senderId.name,
              itemTitle: room.itemId?.title
            });
          }
        });

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_failed', { 
          messageId: data.messageId, 
          error: 'Failed to send message' 
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { roomId, isTyping } = data;
      if (socket.currentRoom === roomId) {
        socket.to(roomId).emit('user_typing', {
          userId: socket.userId,
          isTyping
        });
      }
    });

    // Leave room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      socket.currentRoom = null;
      socket.emit('left_room', { roomId });
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.userId} disconnected:`, reason);
    });

    // Message reactions
    socket.on('add_reaction', async (data) => {
      try {
        const { messageId, emoji } = data;
        
        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Remove existing reaction from this user
        message.reactions = message.reactions.filter(r => 
          r.userId.toString() !== socket.userId
        );
        
        // Add new reaction
        message.reactions.push({
          userId: socket.userId,
          emoji
        });
        
        await message.save();
        
        // Emit to all room participants
        io.to(message.roomId.toString()).emit('reaction_added', {
          messageId,
          userId: socket.userId,
          emoji,
          reactions: message.reactions
        });
      } catch (error) {
        console.error('Add reaction error:', error);
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    // Remove reaction
    socket.on('remove_reaction', async (data) => {
      try {
        const { messageId } = data;
        
        const message = await Message.findById(messageId);
        if (!message) return;

        message.reactions = message.reactions.filter(r => 
          r.userId.toString() !== socket.userId
        );
        
        await message.save();
        
        io.to(message.roomId.toString()).emit('reaction_removed', {
          messageId,
          userId: socket.userId,
          reactions: message.reactions
        });
      } catch (error) {
        console.error('Remove reaction error:', error);
      }
    });

    // Mark messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { messageIds } = data;
        
        await Message.updateMany(
          { 
            _id: { $in: messageIds },
            'readBy.userId': { $ne: socket.userId }
          },
          { 
            $push: { 
              readBy: { 
                userId: socket.userId,
                readAt: new Date()
              }
            }
          }
        );

        // Notify other participants about read status
        const messages = await Message.find({ _id: { $in: messageIds } });
        messages.forEach(message => {
          io.to(message.roomId.toString()).emit('messages_read', {
            messageIds: [message._id],
            userId: socket.userId
          });
        });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Handle connection restored (for processing queued messages)
    socket.on('connection_restored', () => {
      console.log(`User ${socket.userId} connection restored`);
      socket.emit('ready_for_queue');
    });

    // Health check ping/pong
    socket.on('ping', (timestamp) => {
      socket.emit('pong', timestamp);
    });
  });
};

module.exports = { handleConnection };