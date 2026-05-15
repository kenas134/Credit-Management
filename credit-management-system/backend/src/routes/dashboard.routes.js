// src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();

const { getDashboard } = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);
router.get('/', getDashboard);

module.exports = router;
