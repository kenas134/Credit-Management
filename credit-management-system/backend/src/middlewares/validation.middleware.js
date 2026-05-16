// src/middlewares/validation.middleware.js
// Joi schema validation middleware

const Joi = require('joi');
const { sendError } = require('../utils/apiResponse');

/**
 * Validates req.body against a Joi schema
 * @param {Object} schema - Joi schema object
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message.replace(/['"]/g, ''));
    return sendError(res, 'Validation failed', 422, errors);
  }

  req.body = value;
  next();
};

/**
 * Validates req.query against a Joi schema
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false, allowUnknown: true });

  if (error) {
    const errors = error.details.map((d) => d.message.replace(/['"]/g, ''));
    return sendError(res, 'Invalid query parameters', 422, errors);
  }

  req.query = value;
  next();
};

/**
 * Validates req.params against a Joi schema
 */
const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message.replace(/['"]/g, ''));
    return sendError(res, 'Invalid path parameters', 422, errors);
  }

  req.params = value;
  next();
};

module.exports = { validate, validateQuery, validateParams };
