// src/validators/auth.validator.js
// Joi validation schemas for auth routes

const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^(09|07|\+2519|\+2517)\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Ethiopian number (e.g., 09..., 07..., +2519...)',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string().trim().email().optional().allow(''),
  password: Joi.string().trim().min(6).max(100).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  shopName: Joi.string().trim().min(2).max(200).required().messages({
    'any.required': 'Shop name is required',
  }),
  shopAddress: Joi.string().trim().optional().allow(''),
});

const loginSchema = Joi.object({
  phone: Joi.string().trim().required().messages({ 'any.required': 'Phone number is required' }),
  password: Joi.string().trim().required().messages({ 'any.required': 'Password is required' }),
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
