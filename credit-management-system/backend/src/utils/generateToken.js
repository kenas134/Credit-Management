// src/utils/generateToken.js
// JWT token generation utilities

const jwt = require('jsonwebtoken');

/**
 * Generate an access token (short-lived)
 * @param {Object} payload - Token payload (userId, role, etc.)
 * @returns {string} Signed JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: 'credit-management-system',
  });
};

/**
 * Generate a refresh token (long-lived)
 * @param {Object} payload
 * @returns {string} Signed JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'credit-management-system',
  });
};

/**
 * Verify a JWT token
 * @param {string} token
 * @param {string} secret
 * @returns {Object} Decoded payload
 */
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

/**
 * Generate both access and refresh tokens for a user
 * @param {Object} user - User object with id, role
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokenPair = (user) => {
  const payload = {
    userId: user.id,
    role: user.role,
    phone: user.phone,
  };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ userId: user.id }),
  };
};

module.exports = { generateAccessToken, generateRefreshToken, verifyToken, generateTokenPair };
