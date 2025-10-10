const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'OK',
    database: statusMap[dbStatus],
    timestamp: new Date().toISOString(),
    mongodb_connected: dbStatus === 1
  });
});

module.exports = router;