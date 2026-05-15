// src/utils/apiResponse.js
// Standardized API response helpers

/**
 * Send a successful response
 * @param {Response} res - Express response object
 * @param {*} data - Response payload
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send a created response (201)
 */
const sendCreated = (res, data = null, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send an error response
 * @param {Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 400)
 * @param {Array} errors - Validation error details
 */
const sendError = (res, message = 'An error occurred', statusCode = 400, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send a paginated response
 */
const sendPaginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { sendSuccess, sendCreated, sendError, sendPaginated };
