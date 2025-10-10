const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../backend/routes/auth');
const itemRoutes = require('../backend/routes/items');
const notificationRoutes = require('../backend/routes/notifications');
const feedbackRoutes = require('../backend/routes/feedback');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('../backend/uploads'));

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);

module.exports = app;