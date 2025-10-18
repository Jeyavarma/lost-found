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

// Test endpoint
router.get('/test', auth, adminAuth, async (req, res) => {
  res.json({ 
    message: 'Admin API is working!', 
    user: req.user,
    timestamp: new Date()
  });
});

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
      $or: [
        { approved: { $exists: false } },
        { approved: false }
      ]
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
    // Get items that don't have approved field or are not approved
    const items = await Item.find({ 
      $or: [
        { approved: { $exists: false } },
        { approved: false }
      ]
    })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
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

// Create new user
router.post('/users', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password, role, phone, studentId, department, year, shift, rollNumber } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ 
      name, 
      email, 
      password, 
      role: role || 'student', 
      phone, 
      studentId, 
      department, 
      year, 
      shift, 
      rollNumber 
    });
    
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user details
router.get('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (!updateData.password) {
      delete updateData.password;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset user password
router.post('/reset-password', auth, adminAuth, async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending claims
router.get('/claims/pending', auth, adminAuth, async (req, res) => {
  try {
    const claims = await Item.find({ 
      status: 'claimed',
      verificationStatus: 'pending'
    })
    .populate('reportedBy claimedBy', 'name email')
    .sort({ claimDate: -1 });
    
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/Reject claim
router.post('/claims/:itemId/:action', auth, adminAuth, async (req, res) => {
  try {
    const { itemId, action } = req.params;
    const { adminNotes } = req.body;
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }
    
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (action === 'approve') {
      item.status = 'verified';
      item.verificationStatus = 'approved';
    } else {
      item.status = 'found';
      item.verificationStatus = 'rejected';
      item.claimedBy = undefined;
      item.claimDate = undefined;
      item.ownershipProof = undefined;
    }
    
    item.adminNotes = adminNotes;
    await item.save();
    
    res.json({ message: `Claim ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export database
router.get('/export-database', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const items = await Item.find().populate('reportedBy', 'name email');
    
    const exportData = {
      timestamp: new Date().toISOString(),
      users,
      items,
      stats: {
        totalUsers: users.length,
        totalItems: items.length
      }
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=mcc-backup-${new Date().toISOString().split('T')[0]}.json`);
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all data (DANGEROUS)
router.delete('/clear-all-data', auth, adminAuth, async (req, res) => {
  try {
    // Only allow in development or with special confirmation
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Operation not allowed in production' });
    }
    
    await User.deleteMany({ role: { $ne: 'admin' } }); // Keep admin users
    await Item.deleteMany({});
    
    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;