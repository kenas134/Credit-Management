// src/controllers/notification.controller.js
const notificationService = require('../services/notification.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications for current user
 */
const getAll = asyncHandler(async (req, res) => {
  const result = await notificationService.getAll(req.user.id, req.query);
  return sendSuccess(res, result, 'Notifications retrieved');
});

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAsRead(req.params.id);
  return sendSuccess(res, result, 'Notification marked as read');
});

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  return sendSuccess(res, result, 'All notifications marked as read');
});

module.exports = { getAll, markAsRead, markAllAsRead };
