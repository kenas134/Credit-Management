// src/services/notification.service.js
const notificationRepository = require('../repositories/notification.repository');
const { getPagination } = require('../utils/pagination');

const notificationService = {
  getAll: async (userId, queryParams) => {
    const { page, limit, skip } = getPagination(queryParams);
    const notifications = await notificationRepository.findByUserId(userId, { skip, limit });
    const unreadCount = await notificationRepository.countUnread(userId);
    return { notifications, unreadCount };
  },
  markAsRead: (id) => notificationRepository.markAsRead(id),
  markAllAsRead: (userId) => notificationRepository.markAllAsRead(userId),
};

module.exports = notificationService;
