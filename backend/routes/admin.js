const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get admin dashboard stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ status: 'lost' });
    const foundItems = await Item.countDocuments({ status: 'found' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReports = await Item.countDocuments({ 
      createdAt: { $gte: today } 
    });

    const pendingItems = await Item.countDocuments({ 
      approved: { $ne: true } 
    });

    res.json({
      totalUsers,
      totalItems,
      lostItems,
      foundItems,
      todayReports,
      pendingItems,
      resolvedItems: foundItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent items
router.get('/recent-items', auth, adminAuth, async (req, res) => {
  try {
    const items = await Item.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending items for moderation
router.get('/pending-items', auth, adminAuth, async (req, res) => {
  try {
    const items = await Item.find({ approved: { $ne: true } })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flagged items
router.get('/flagged-items', auth, adminAuth, async (req, res) => {
  try {
    const items = await Item.find({ flagged: true })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Moderate item (approve/reject)
router.post('/moderate-item/:id', auth, adminAuth, async (req, res) => {
  try {
    const { action } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (action === 'approve') {
      item.approved = true;
      item.flagged = false;
    } else if (action === 'reject') {
      await Item.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Item removed' });
    }

    await item.save();
    res.json({ message: 'Item moderated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system metrics
router.get('/system-metrics', auth, adminAuth, async (req, res) => {
  try {
    const activeUsers = await User.countDocuments({ 
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });
    
    const totalItems = await Item.countDocuments();
    const matchesFound = await Item.countDocuments({ status: 'found' });
    
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    
    const memoryUsage = Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100);
    
    res.json({
      metrics: {
        activeUsers,
        totalItems,
        matchesFound,
        systemHealth: 'healthy',
        uptime: `${uptimeHours}h ${uptimeMinutes}m`,
        memoryUsage,
        cpuUsage: Math.floor(Math.random() * 30) + 10, // Mock CPU usage
        dbConnections: 5
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get audit logs (mock for now)
router.get('/audit-logs', auth, adminAuth, async (req, res) => {
  try {
    // Mock audit logs - in production, implement proper audit logging
    const logs = [
      {
        _id: '1',
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'LOGIN',
        resource: 'Admin Dashboard',
        details: 'Admin user logged in',
        ipAddress: req.ip,
        timestamp: new Date(),
        severity: 'low'
      }
    ];
    
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get login attempts (mock for now)
router.get('/login-attempts', auth, adminAuth, async (req, res) => {
  try {
    // Mock login attempts - in production, implement proper login tracking
    const attempts = [
      {
        _id: '1',
        email: req.user.email,
        success: true,
        ipAddress: req.ip,
        timestamp: new Date(),
        userAgent: req.get('User-Agent')
      }
    ];
    
    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system config
router.get('/system-config', auth, adminAuth, async (req, res) => {
  try {
    // Mock system config - in production, store in database
    const config = {
      categories: ['Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Sports Equipment'],
      locations: ['Main Building', 'Library', 'Cafeteria', 'Hostel A', 'Hostel B', 'Sports Complex', 'Auditorium'],
      departments: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'],
      hostels: ['Hostel A', 'Hostel B', 'Hostel C', 'Day Scholar'],
      autoMatchEnabled: true,
      emailNotifications: true,
      maxImageSize: 5,
      sessionTimeout: 24
    };
    
    res.json({ config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update system config
router.put('/system-config', auth, adminAuth, async (req, res) => {
  try {
    // In production, save to database
    res.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete any item (lost/found)
router.delete('/items/:id', auth, adminAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update any item
router.put('/items/:id', auth, adminAuth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('reportedBy', 'name email');
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;