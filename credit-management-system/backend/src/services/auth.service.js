// src/services/auth.service.js
// Business logic for authentication

const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateTokenPair, verifyToken } = require('../utils/generateToken');
const { AppError } = require('../middlewares/error.middleware');

const authService = {
  /**
   * Register a new shop owner with their shop
   */
  register: async ({ name, phone, email, password, shopName, shopAddress }) => {
    const existing = await userRepository.findByPhone(phone);
    if (existing) throw new AppError('A user with this phone number already exists', 409);

    const hashed = await hashPassword(password);

    // Create user and shop in one Prisma transaction
    const prisma = require('../config/db');
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, phone, email, password: hashed, role: 'OWNER' },
      });
      await tx.shop.create({
        data: { name: shopName, address: shopAddress, ownerId: newUser.id },
      });
      return newUser;
    });

    const tokens = generateTokenPair(user);
    await userRepository.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
      ...tokens,
    };
  },

  /**
   * Login with phone + password
   */
  login: async ({ phone, password }) => {
    let normalizedPhone = phone.trim();
    
    // Normalize Ethiopian formats: +2519... -> 09...
    if (normalizedPhone.startsWith('+251')) {
      normalizedPhone = '0' + normalizedPhone.slice(4);
    }

    let user = await userRepository.findByPhone(normalizedPhone);
    
    // Fallback: try adding +251 if not found
    if (!user && normalizedPhone.startsWith('0')) {
      user = await userRepository.findByPhone('+251' + normalizedPhone.slice(1));
    }

    if (!user) throw new AppError('Invalid phone number or password', 401);
    if (!user.isActive) throw new AppError('Your account has been deactivated', 403);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new AppError('Invalid phone number or password', 401);

    const tokens = generateTokenPair(user);
    await userRepository.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
      ...tokens,
    };
  },

  /**
   * Refresh access token using a valid refresh token
   */
  refreshToken: async (refreshToken) => {
    let decoded;
    try {
      decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await userRepository.findByRefreshToken(refreshToken);
    if (!user) throw new AppError('Refresh token has been revoked', 401);

    const tokens = generateTokenPair(user);
    await userRepository.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  },

  /**
   * Logout — clear refresh token
   */
  logout: async (userId) => {
    await userRepository.clearRefreshToken(userId);
  },

  /**
   * Change user password
   */
  changePassword: async (userId, currentPassword, newPassword) => {
    const prisma = require('../config/db');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    const hashed = await hashPassword(newPassword);
    await userRepository.update(userId, { password: hashed });
    await userRepository.clearRefreshToken(userId); // force re-login
  },

  /**
   * Get current user profile with shop info
   */
  getMe: async (userId) => {
    const prisma = require('../config/db');
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, phone: true, email: true, role: true, createdAt: true,
        shop: { select: { id: true, name: true, address: true, phone: true } },
      },
    });
  },
};

module.exports = authService;
