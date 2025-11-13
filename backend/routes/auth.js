
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const LoginAttempt = require('../models/LoginAttempt');
const UserActivity = require('../models/UserActivity');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    // Input validation
    if (!email || !password) {
      await LoginAttempt.create({
        email: email || 'unknown',
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'Missing credentials'
      });
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    
    // Check if user is suspended
    if (user && !user.isActive) {
      const suspendedUntil = user.suspendedUntil;
      if (!suspendedUntil || new Date() < suspendedUntil) {
        await LoginAttempt.create({
          email,
          ipAddress,
          userAgent,
          success: false,
          failureReason: 'Account suspended',
          userId: user._id
        });
        return res.status(403).json({ 
          message: 'Account suspended', 
          reason: user.suspensionReason,
          suspendedUntil: suspendedUntil
        });
      } else {
        // Auto-unsuspend if suspension period expired
        user.isActive = true;
        user.suspendedUntil = null;
        user.suspensionReason = null;
        await user.save();
      }
    }
    
    if (!user || !(await user.comparePassword(password))) {
      await LoginAttempt.create({
        email,
        ipAddress,
        userAgent,
        success: false,
        failureReason: 'Invalid credentials',
        userId: user?._id
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login
    await LoginAttempt.create({
      email,
      ipAddress,
      userAgent,
      success: true,
      userId: user._id
    });
    
    // Log user activity
    await UserActivity.create({
      userId: user._id,
      action: 'login',
      details: {
        ipAddress,
        userAgent
      }
    });

    // Update last login
    user.lastLogin = new Date();
    user.loginAttempts = 0; // Reset failed attempts
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, studentId, shift, department, year, rollNumber, role } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Prevent admin creation through regular registration
    const userRole = (role === 'admin') ? 'student' : (role || 'student');

    const user = new User({ 
      name, 
      email, 
      password, 
      role: userRole,
      phone,
      studentId,
      shift,
      department,
      year,
      rollNumber
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Input validation with safer regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    
    // Sanitize email
    const sanitizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await OTP.deleteMany({ email: sanitizedEmail });
    await new OTP({ email: sanitizedEmail, otp }).save();
    
    res.json({ 
      message: 'OTP sent to your email',
      otp: otp
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to generate OTP' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    
    // Input validation
    if (!email || !otp || !password) {
      return res.status(400).json({ error: 'Email, OTP and password are required' });
    }
    
    // Sanitize inputs
    const sanitizedEmail = String(email).toLowerCase().trim();
    const sanitizedOtp = String(otp).replace(/[^0-9]/g, '');
    
    const otpDoc = await OTP.findOne({ email: sanitizedEmail, otp: sanitizedOtp });
    if (!otpDoc) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    const user = await User.findOne({ email: sanitizedEmail });
    user.password = password;
    await user.save();
    
    await OTP.deleteOne({ _id: otpDoc._id });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});



// Create first admin account (only if no admin exists)
router.post('/create-first-admin', async (req, res) => {
  try {
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin account already exists. Use login instead.' });
    }

    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const user = new User({ 
      name, 
      email, 
      password, 
      role: 'admin'
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'First admin account created successfully',
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/validate', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;