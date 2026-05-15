// src/controllers/auth.controller.js
// Handles HTTP layer for authentication

const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new shop owner
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, password, shopName]
 *             properties:
 *               name: { type: string, example: "Ato Mensah" }
 *               phone: { type: string, example: "+233244001234" }
 *               email: { type: string, example: "ato@shop.com" }
 *               password: { type: string, example: "password123" }
 *               shopName: { type: string, example: "Ato's Mini Mart" }
 *               shopAddress: { type: string, example: "Osu, Accra" }
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Phone number already in use
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return sendCreated(res, result, 'Registration successful. Welcome!');
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with phone and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, password]
 *             properties:
 *               phone: { type: string, example: "+233244001234" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Login successful with tokens
 *       401:
 *         description: Invalid credentials
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, result, 'Login successful');
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     security: []
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshToken(refreshToken);
  return sendSuccess(res, tokens, 'Token refreshed');
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and revoke refresh token
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  return sendSuccess(res, null, 'Logged out successfully');
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return sendSuccess(res, user, 'Profile retrieved');
});

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     tags: [Auth]
 *     summary: Change user password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  return sendSuccess(res, null, 'Password changed successfully. Please log in again.');
});

module.exports = { register, login, refreshToken, logout, getMe, changePassword };
