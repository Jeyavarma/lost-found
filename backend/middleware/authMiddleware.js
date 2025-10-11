const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (MongoDB) - handle both id and userId
      const userId = decoded.id || decoded.userId;
      req.user = await User.findById(userId).select('-password');
      req.userId = userId;

      if (!req.user) {
        console.log('❌ User not found for ID:', userId);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      console.log('✅ User authenticated:', req.user.name);

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
