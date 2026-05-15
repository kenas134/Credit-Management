// src/routes/report.routes.js
const express = require('express');
const router = express.Router();

const { getOutstanding, getAging, getPaymentTrend, getKPIs } = require('../controllers/report.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/outstanding', getOutstanding);
router.get('/aging', getAging);
router.get('/payment-trend', getPaymentTrend);
router.get('/kpis', getKPIs);

module.exports = router;
