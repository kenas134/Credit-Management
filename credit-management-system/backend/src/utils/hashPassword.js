// src/utils/hashPassword.js
// Password hashing utilities using bcryptjs

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Stored hash
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };
