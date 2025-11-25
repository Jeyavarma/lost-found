require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config/environment');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const notificationRoutes = require('./routes/notifications');
const feedbackRoutes = require('./routes/feedback');
const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/admin');
const { authLimiter, apiLimiter, securityHeaders, csrfProtection } = require('./middleware/security');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://lost-found-mcc.vercel.app',
          'https://mcc-lost-found.vercel.app', 
          'https://lost-found-79xn.onrender.com',
          /\.vercel\.app$/
        ]
      : ['http://localhost:3000', 'http://localhost:3002'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Trust proxy for rate limiting on Render
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(securityHeaders);
app.use(csrfProtection);
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://lost-found-mcc.vercel.app',
      'https://mcc-lost-found.vercel.app', 
      'https://lost-found-79xn.onrender.com',
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:3001'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // Allow any vercel.app subdomain
    if (origin.match(/https:\/\/.*\.vercel\.app$/)) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));
app.use(express.json({ limit: '10mb' }));

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    if (config.NODE_ENV === 'production') {
      process.exit(1)
    }
  });

// Special route for first admin creation (no middleware)
app.post('/api/auth/create-first-admin', express.json(), async (req, res) => {
  try {
    const User = require('./models/User');
    const jwt = require('jsonwebtoken');
    
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin account already exists' });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ name, email, password, role: 'admin' });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'Admin created successfully',
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/items', apiLimiter, itemRoutes);
app.use('/api/claims', apiLimiter, require('./routes/claims'));
app.use('/api/ai', apiLimiter, require('./routes/ai-search'));
app.use('/api/notifications', apiLimiter, notificationRoutes);
app.use('/api/feedback', apiLimiter, feedbackRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/users', apiLimiter, require('./routes/users'));
app.use('/api/analytics', apiLimiter, require('./routes/analytics'));
app.use('/api/moderation', apiLimiter, require('./routes/moderation'));
app.use('/api/messaging', apiLimiter, require('./routes/messaging'));
app.use('/api/system-flow', apiLimiter, require('./routes/system-flow'));
app.use('/api/visual-ai', apiLimiter, require('./routes/visual-ai'));
app.use('/api/chat', apiLimiter, require('./routes/chat'));
app.use('/api/presence', apiLimiter, require('./routes/presence'));

// Socket.io chat handler
const { handleConnection } = require('./socket/chatHandler');
handleConnection(io);

// Start message cleanup job (with error handling)
try {
  const { startCleanupJob } = require('./jobs/messageCleanup');
  startCleanupJob();
} catch (error) {
  console.error('Failed to start cleanup job:', error.message);
  console.log('Server will continue without cleanup job');
}

app.use('/api', healthRoutes);
app.use('/uploads', express.static('uploads'));

// Serve admin creation page
app.get('/create-admin', (req, res) => {
  res.sendFile(__dirname + '/create-admin.html');
});

// Error handling middleware (must be last)
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io chat enabled`);
  console.log(`Message cleanup job started`);
});