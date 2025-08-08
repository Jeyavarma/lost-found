require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://10.10.54.72:3000'],
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve static files from uploads folder

// Basic Route
app.get('/', (req, res) => {
  res.send('Lost & Found API is running...');
});

// Routes
const authRoutes = require('./routes/authroutes');
const itemRoutes = require('./routes/items');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5001;

// Sync database and start server
db.sequelize.sync().then(() => {
  console.log('Database synced successfully.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
