// src/utils/asyncHandler.js
// Wraps async route handlers to eliminate try/catch boilerplate

/**
 * Wraps an async Express route handler and forwards errors to next()
 * @param {Function} fn - Async route handler
 * @returns {Function} Wrapped handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
