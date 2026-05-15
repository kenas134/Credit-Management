// src/repositories/notification.repository.js
const prisma = require('../config/db');

const notificationRepository = {
  create: (data) => prisma.notification.create({ data }),
  createMany: (data) => prisma.notification.createMany({ data }),
  findByUserId: (userId, { skip = 0, limit = 30 } = {}) =>
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  markAsRead: (id) =>
    prisma.notification.update({ where: { id }, data: { status: 'READ', readAt: new Date() } }),
  markAllAsRead: (userId) =>
    prisma.notification.updateMany({
      where: { userId, status: 'UNREAD' },
      data: { status: 'READ', readAt: new Date() },
    }),
  countUnread: (userId) =>
    prisma.notification.count({ where: { userId, status: 'UNREAD' } }),
};

module.exports = notificationRepository;
