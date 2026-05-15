// src/routes/index.js
// Central route aggregator

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const customerRoutes = require('./customer.routes');
const creditRoutes = require('./credit.routes');
const paymentRoutes = require('./payment.routes');
const reportRoutes = require('./report.routes');
const notificationRoutes = require('./notification.routes');
const dashboardRoutes = require('./dashboard.routes');

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/credit', creditRoutes);
router.use('/payments', paymentRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Credit Management System API',
    version: '1.0.0',
    status: 'running',
    endpoints: ['/auth', '/customers', '/credit', '/payments', '/reports', '/notifications', '/dashboard'],
    docs: '/api/docs',
  });
});

module.exports = router;
