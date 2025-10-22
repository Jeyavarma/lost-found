require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const notificationRoutes = require('./routes/notifications');
const feedbackRoutes = require('./routes/feedback');
const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/admin');
const { authLimiter, apiLimiter, securityHeaders, csrfProtection } = require('./middleware/security');

const app = express();

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
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://lost-found-mcc.vercel.app',
        'https://mcc-lost-found.vercel.app', 
        'https://lost-found-79xn.onrender.com',
        /\.vercel\.app$/,
        'http://localhost:3000',
        'http://localhost:3002'
      ]
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/items', apiLimiter, itemRoutes);
app.use('/api/claims', apiLimiter, require('./routes/claims'));
app.use('/api/notifications', apiLimiter, notificationRoutes);
app.use('/api/feedback', apiLimiter, feedbackRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/seed', require('./routes/seed'));
app.use('/api', healthRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});