const express = require('express');
const jwt = require('jsonwebtoken');
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/cloudinaryUpload');
const router = express.Router();

// Load image matching service
let imageMatching = null;
try {
  imageMatching = require('../services/hashImageMatching');
  console.log('✅ Hash-based image matching loaded');
} catch (error) {
  console.log('⚠️ Image matching service not available:', error.message);
}

// Background image processing function
async function processImageMatching(item) {
  if (!imageMatching || !item.imageUrl) return;
  
  try {
    const features = await imageMatching.extractFeatures(item.imageUrl);
    
    if (features) {
      item.imageFeatures = features;
      
      const oppositeStatus = item.status === 'lost' ? 'found' : 'lost';
      const existingItems = await Item.find({ 
        status: oppositeStatus,
        imageFeatures: { $exists: true, $ne: [] },
        _id: { $ne: item._id }
      });
      
      if (existingItems.length > 0) {
        const matches = await imageMatching.findMatches(item, existingItems);
        
        if (matches.length > 0) {
          item.potentialMatches = matches.map(match => ({
            itemId: match.item._id,
            similarity: match.similarity,
            confidence: match.confidence
          }));
          
          for (const match of matches) {
            await Item.findByIdAndUpdate(match.item._id, {
              $push: {
                potentialMatches: {
                  itemId: item._id,
                  similarity: match.similarity,
                  confidence: match.confidence
                }
              }
            });
          }
        }
      }
      
      await item.save();
      console.log('✅ Background image processing completed for:', item.title);
    }
  } catch (error) {
    console.error('❌ Background image processing error:', error.message);
  }
}

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
      .populate('potentialMatches.itemId', 'title description imageUrl status reportedBy location createdAt')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get AI-based potential matches for user's items
router.get('/ai-matches', auth, async (req, res) => {
  try {
    const userItems = await Item.find({ reportedBy: req.userId })
      .populate({
        path: 'potentialMatches.itemId',
        populate: {
          path: 'reportedBy',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    
    const allMatches = [];
    userItems.forEach(item => {
      item.potentialMatches.forEach(match => {
        if (match.itemId) {
          allMatches.push({
            userItem: {
              _id: item._id,
              title: item.title,
              status: item.status,
              imageUrl: item.imageUrl
            },
            matchedItem: match.itemId,
            similarity: match.similarity,
            confidence: match.confidence,
            matchedAt: match.matchedAt,
            viewed: match.viewed
          });
        }
      });
    });
    
    res.json(allMatches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/potential-matches', auth, async (req, res) => {
  try {
    // Get user's items to find potential matches
    const userItems = await Item.find({ reportedBy: req.userId });
    
    if (userItems.length === 0) {
      return res.json([]);
    }
    
    // Get all items from other users with opposite status
    const allItems = await Item.find({
      reportedBy: { $ne: req.userId },
      $or: [
        { status: 'found' },
        { status: 'lost' }
      ]
    }).populate('reportedBy', 'name email');
    
    // Smart matching algorithm
    const matches = [];
    
    userItems.forEach(userItem => {
      const oppositeStatus = userItem.status === 'lost' ? 'found' : 'lost';
      
      allItems.forEach(item => {
        if (item.status === oppositeStatus) {
          let score = 0;
          
          // 1. Category/Product name matching (40 points)
          if (userItem.category && item.category && 
              userItem.category.toLowerCase() === item.category.toLowerCase()) {
            score += 40;
          }
          
          // 2. Location matching (30 points)
          if (userItem.location && item.location) {
            const userLoc = userItem.location.toLowerCase();
            const itemLoc = item.location.toLowerCase();
            if (userLoc.includes(itemLoc) || itemLoc.includes(userLoc)) {
              score += 30;
            }
          }
          
          // 3. Color matching in title/description (20 points)
          const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'brown', 'pink', 'purple', 'orange', 'gray', 'grey', 'silver', 'gold'];
          const userText = `${userItem.title} ${userItem.description}`.toLowerCase();
          const itemText = `${item.title} ${item.description}`.toLowerCase();
          
          colors.forEach(color => {
            if (userText.includes(color) && itemText.includes(color)) {
              score += 20;
            }
          });
          
          // 4. Brand matching (25 points)
          const brands = ['apple', 'samsung', 'sony', 'nike', 'adidas', 'hp', 'dell', 'lenovo', 'canon', 'nikon'];
          brands.forEach(brand => {
            if (userText.includes(brand) && itemText.includes(brand)) {
              score += 25;
            }
          });
          
          // 5. Size matching (15 points)
          const sizes = ['small', 'medium', 'large', 'big', 'tiny', 'huge', 'mini'];
          sizes.forEach(size => {
            if (userText.includes(size) && itemText.includes(size)) {
              score += 15;
            }
          });
          
          // 6. Time proximity (10 points)
          const userDate = new Date(userItem.dateLostFound || userItem.createdAt);
          const itemDate = new Date(item.dateLostFound || item.createdAt);
          const daysDiff = Math.abs((userDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 7) score += 10; // Within a week
          else if (daysDiff <= 30) score += 5; // Within a month
          
          // 7. Material/Texture matching (10 points)
          const materials = ['leather', 'plastic', 'metal', 'fabric', 'wood', 'glass', 'rubber', 'cotton', 'silk', 'denim'];
          materials.forEach(material => {
            if (userText.includes(material) && itemText.includes(material)) {
              score += 10;
            }
          });
          
          // 8. Condition matching (5 points)
          const conditions = ['new', 'old', 'damaged', 'worn', 'broken', 'cracked', 'scratched', 'mint'];
          conditions.forEach(condition => {
            if (userText.includes(condition) && itemText.includes(condition)) {
              score += 5;
            }
          });
          
          // 9. Special features matching (15 points)
          const features = ['cracked screen', 'missing button', 'sticker', 'engraving', 'keychain', 'charm', 'case', 'cover'];
          features.forEach(feature => {
            if (userText.includes(feature) && itemText.includes(feature)) {
              score += 15;
            }
          });
          
          // 10. Value indicators (10 points)
          const values = ['expensive', 'cheap', 'valuable', 'priceless', 'costly', 'budget', 'premium'];
          values.forEach(value => {
            if (userText.includes(value) && itemText.includes(value)) {
              score += 10;
            }
          });
          
          // 11. Keyword matching (3 points)
          const userWords = userText.split(/\s+/).filter(word => word.length > 2);
          const itemWords = itemText.split(/\s+/).filter(word => word.length > 2);
          
          userWords.forEach(userWord => {
            itemWords.forEach(itemWord => {
              if (userWord === itemWord) {
                score += 3;
              }
            });
          });
          
          // Add to matches if score is above threshold
          if (score >= 10) {
            matches.push({ ...item.toObject(), matchScore: Math.min(score, 100) });
          }
        }
      });
    });
    
    // Remove duplicates and sort by score
    const uniqueMatches = matches.reduce((acc, current) => {
      const existing = acc.find(item => item._id.toString() === current._id.toString());
      if (!existing || current.matchScore > existing.matchScore) {
        return acc.filter(item => item._id.toString() !== current._id.toString()).concat(current);
      }
      return acc;
    }, []);
    
    // Sort by match score (highest first) and limit to 6
    const sortedMatches = uniqueMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
    
    res.json(sortedMatches);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const uploadFields = (req, res, next) => {
  console.log('📁 Upload middleware - Processing files...');
  
  const uploadHandler = upload.fields([
    { name: 'itemImage', maxCount: 1 },
    { name: 'locationImage', maxCount: 1 }
  ]);
  
  uploadHandler(req, res, (err) => {
    if (err) {
      console.error('❌ Upload error:', err);
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }
    
    console.log('✅ Upload completed - Files:', req.files ? Object.keys(req.files) : 'None');
    next();
  });
};

// Optional auth middleware - sets user if token is valid, but doesn't block request
const optionalAuth = async (req, res, next) => {
  let token;
  
  console.log('🔍 OptionalAuth - Headers:', req.headers.authorization ? 'Auth header present' : 'No auth header');
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔑 Token extracted, verifying...');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded, user ID:', decoded.userId || decoded.id);
      
      const userId = decoded.userId || decoded.id;
      const user = await User.findById(userId).select('-password');
      
      if (user) {
        req.user = user;
        req.userId = userId;
        console.log('👤 User found and set:', user.name);
      } else {
        console.log('❌ User not found in database for ID:', userId);
      }
    } catch (error) {
      // Token invalid, but continue without auth
      console.log('❌ Token validation failed:', error.message);
    }
  }
  
  next();
};

router.post('/', uploadFields, optionalAuth, async (req, res) => {
  try {
    console.log('📝 POST /api/items - Request received');
    console.log('📋 Request body keys:', Object.keys(req.body));
    console.log('📁 Files:', req.files ? Object.keys(req.files) : 'None');
    
    const { contactName, contactEmail, contactPhone, date, time, status, ...otherFields } = req.body;
    
    // Input validation
    if (!status || !['lost', 'found'].includes(status)) {
      console.log('❌ Invalid status:', status);
      return res.status(400).json({ message: 'Valid status (lost/found) is required' });
    }
    
    if (!contactName || !contactEmail) {
      console.log('❌ Missing required fields - contactName:', !!contactName, 'contactEmail:', !!contactEmail);
      return res.status(400).json({ message: 'Contact name and email are required' });
    }
    
    // Use safer email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(contactEmail)) {
      console.log('❌ Invalid email format:', contactEmail);
      return res.status(400).json({ message: 'Valid email address is required' });
    }
    
    // Sanitize inputs
    const sanitize = (str) => String(str).replace(/[<>"'&]/g, '').trim();
    const sanitizedData = {
      contactName: sanitize(contactName),
      contactEmail: sanitize(contactEmail),
      contactPhone: contactPhone ? sanitize(contactPhone) : undefined
    };
    
    console.log('📝 Item submission - Status:', status, 'User ID:', req.userId || 'None');
    
    // Business rule: Lost items require authentication, Found items can be anonymous
    if (status === 'lost' && !req.userId) {
      console.log('❌ Lost item submission blocked - no authentication');
      return res.status(401).json({ message: 'Authentication required to report lost items' });
    }
    
    // Ensure all required fields are present
    if (!otherFields.title || !otherFields.description || !otherFields.category || !otherFields.location) {
      console.log('❌ Missing required item fields');
      console.log('Title:', !!otherFields.title, 'Description:', !!otherFields.description, 'Category:', !!otherFields.category, 'Location:', !!otherFields.location);
      return res.status(400).json({ message: 'Title, description, category, and location are required' });
    }
    
    const itemData = {
      ...otherFields,
      status,
      reportedBy: req.userId || null,
      contactInfo: `${sanitizedData.contactName} - ${sanitizedData.contactEmail}${sanitizedData.contactPhone ? ` - ${sanitizedData.contactPhone}` : ''}`,
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
        console.log('📷 Item image uploaded:', itemData.imageUrl);
      }
      if (req.files.locationImage) {
        itemData.locationImageUrl = req.files.locationImage[0].path;
        console.log('📍 Location image uploaded:', itemData.locationImageUrl);
      }
    }
    
    console.log('💾 Creating item with data:', { ...itemData, imageUrl: itemData.imageUrl ? 'SET' : 'NONE' });
    
    const item = new Item(itemData);
    await item.save();
    
    console.log('✅ Item saved successfully with ID:', item._id);
    
    // Process image matching in background after response
    if (itemData.imageUrl) {
      setImmediate(async () => {
        try {
          console.log('🔄 Starting background image processing for:', item.title);
          await processImageMatching(item);
        } catch (error) {
          console.error('❌ Background image processing failed:', error.message);
        }
      });
    }
    
    await item.populate('reportedBy', 'name email');
    console.log('✅ Item submission completed successfully');
    res.status(201).json(item);
  } catch (error) {
    console.error('❌ Item submission error:', error);
    console.error('Error stack:', error.stack);
    
    // Send more specific error message
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: validationErrors });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const events = [
      'Deepwoods',
      'Moonshadow',
      'Octavia',
      'Barnes Hall Day',
      'Martin Hall Day',
      'Games Fury',
      'Founders Day',
      'Cultural Festival'
    ];
    
    const eventData = await Promise.all(
      events.map(async (eventName) => {
        // Check both event and culturalEvent fields for backward compatibility
        const items = await Item.find({ 
          $or: [
            { event: eventName },
            { culturalEvent: eventName }
          ]
        })
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
    const items = await Item.find({ 
      $or: [
        { event: eventName },
        { culturalEvent: eventName }
      ]
    })
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

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if user owns this item
    if (item.reportedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim an item
router.post('/:id/claim', auth, async (req, res) => {
  try {
    const { ownershipProof, additionalInfo } = req.body;
    
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.status !== 'found') {
      return res.status(400).json({ message: 'Item is not available for claiming' });
    }
    
    if (item.claimedBy) {
      return res.status(400).json({ message: 'Item is already claimed' });
    }
    
    item.status = 'claimed';
    item.claimedBy = req.userId;
    item.claimDate = new Date();
    item.ownershipProof = ownershipProof;
    item.additionalClaimInfo = additionalInfo;
    item.verificationStatus = 'pending';
    
    await item.save();
    
    res.json({ message: 'Claim submitted successfully. Awaiting admin verification.', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;