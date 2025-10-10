const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const upload = require('../middleware/cloudinaryUpload');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('reportedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const items = await Item.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-items', auth, async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.userId })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/potential-matches', auth, async (req, res) => {
  try {
    // Get user's items to find potential matches
    const userItems = await Item.find({ reportedBy: req.userId });
    
    // Simple matching logic: opposite status items in similar categories/locations
    const matches = await Item.find({
      reportedBy: { $ne: req.userId }, // Not user's own items
      $or: [
        { status: 'found' }, // Show found items if user has lost items
        { status: 'lost' }   // Show lost items if user has found items
      ]
    })
    .populate('reportedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(6);
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const uploadFields = upload.fields([
  { name: 'itemImage', maxCount: 1 },
  { name: 'locationImage', maxCount: 1 }
]);

router.post('/', auth, uploadFields, async (req, res) => {
  try {
    const { contactName, contactEmail, contactPhone, date, time, ...otherFields } = req.body;
    
    const itemData = {
      ...otherFields,
      reportedBy: req.userId,
      contactInfo: `${contactName} - ${contactEmail}${contactPhone ? ` - ${contactPhone}` : ''}`,
      dateLostFound: date ? new Date(date) : undefined,
      timeLostFound: time || undefined,
      timeReported: new Date().toLocaleTimeString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        hour12: true 
      })
    };
    
    if (req.files) {
      if (req.files.itemImage) {
        itemData.imageUrl = req.files.itemImage[0].path;
      }
      if (req.files.locationImage) {
        itemData.locationImageUrl = req.files.locationImage[0].path;
      }
    }
    
    const item = new Item(itemData);
    await item.save();
    await item.populate('reportedBy', 'name email');
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const events = [
      'Madras Day Celebrations',
      'Annual Sports Meet', 
      'Cultural Festival',
      'Freshers Day',
      'College Day',
      'Inter-Collegiate Events',
      'Alumni Meet',
      'Science Exhibition'
    ];
    
    const eventData = await Promise.all(
      events.map(async (eventName) => {
        const items = await Item.find({ event: eventName })
          .populate('reportedBy', 'name email')
          .sort({ createdAt: -1 });
        
        const lostCount = items.filter(item => item.status === 'lost').length;
        const foundCount = items.filter(item => item.status === 'found').length;
        
        return {
          name: eventName,
          totalItems: items.length,
          lostCount,
          foundCount,
          status: 'active',
          items
        };
      })
    );
    
    res.json(eventData.filter(event => event.totalItems > 0));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/events/:eventName', async (req, res) => {
  try {
    const { eventName } = req.params;
    const items = await Item.find({ event: eventName })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    
    const lostItems = items.filter(item => item.status === 'lost');
    const foundItems = items.filter(item => item.status === 'found');
    
    res.json({
      eventName,
      totalItems: items.length,
      lostCount: lostItems.length,
      foundCount: foundItems.length,
      lostItems,
      foundItems,
      allItems: items
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reportedBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('reportedBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;