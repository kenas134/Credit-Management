// src/repositories/user.repository.js
// Data access layer for Users

const prisma = require('../config/db');

const userRepository = {
  /**
   * Find a user by phone number
   */
  findByPhone: (phone) =>
    prisma.user.findUnique({ where: { phone } }),

  /**
   * Find a user by ID
   */
  findById: (id) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, phone: true, email: true, role: true, isActive: true, createdAt: true },
    }),

  /**
   * Create a new user
   */
  create: (data) => prisma.user.create({ data }),

  /**
   * Update user fields
   */
  update: (id, data) => prisma.user.update({ where: { id }, data }),

  /**
   * Store a refresh token for a user
   */
  saveRefreshToken: (id, refreshToken) =>
    prisma.user.update({ where: { id }, data: { refreshToken } }),

  /**
   * Clear the refresh token on logout
   */
  clearRefreshToken: (id) =>
    prisma.user.update({ where: { id }, data: { refreshToken: null } }),

  /**
   * Find user by refresh token
   */
  findByRefreshToken: (refreshToken) =>
    prisma.user.findFirst({ where: { refreshToken } }),
};

module.exports = userRepository;
