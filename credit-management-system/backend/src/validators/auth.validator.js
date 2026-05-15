// src/validators/auth.validator.js
// Joi validation schemas for auth routes

const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid international format',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().email().optional().allow(''),
  password: Joi.string().min(6).max(100).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  shopName: Joi.string().trim().min(2).max(200).required().messages({
    'any.required': 'Shop name is required',
  }),
  shopAddress: Joi.string().trim().optional().allow(''),
});

const loginSchema = Joi.object({
  phone: Joi.string().required().messages({ 'any.required': 'Phone number is required' }),
  password: Joi.string().required().messages({ 'any.required': 'Password is required' }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters',
  }),
});

module.exports = { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema };
