const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user
router.post('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, password, role, phone, studentId, shift, department, year, rollNumber } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, role, phone, studentId, shift, department, year, rollNumber });
    await user.save();
    
    res.status(201).json({ message: 'User created successfully', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all items
router.get('/items', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const items = await Item.find().populate('reportedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item
router.put('/items/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item
router.delete('/items/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ status: 'lost' });
    const foundItems = await Item.countDocuments({ status: 'found' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReports = await Item.countDocuments({ createdAt: { $gte: today } });
    
    const totalFeedback = await Feedback.countDocuments();
    
    res.json({
      totalUsers,
      totalItems,
      lostItems,
      foundItems,
      todayReports,
      totalFeedback
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all feedback
router.get('/feedback', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk operations
router.post('/bulk-delete-items', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { itemIds } = req.body;
    await Item.deleteMany({ _id: { $in: itemIds } });
    res.json({ message: `${itemIds.length} items deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/bulk-delete-users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userIds } = req.body;
    await User.deleteMany({ _id: { $in: userIds } });
    res.json({ message: `${userIds.length} users deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;