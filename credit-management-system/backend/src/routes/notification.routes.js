// src/routes/notification.routes.js
const express = require('express');
const router = express.Router();

const { getAll, markAsRead, markAllAsRead } = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', getAll);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

module.exports = router;
