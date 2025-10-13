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
    service: 'MCC Lost & Found API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: statusMap[dbStatus],
    mongodb_connected: dbStatus === 1,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors_enabled: true,
    rate_limiting: true,
    security_headers: true
  });
});

module.exports = router;