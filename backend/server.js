require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const notificationRoutes = require('./routes/notifications');
const feedbackRoutes = require('./routes/feedback');
const healthRoutes = require('./routes/health');

const app = express();

app.use(cors({
  origin: ['http://localhost:3002', 'https://*.vercel.app', 'https://vercel.app'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api', healthRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});