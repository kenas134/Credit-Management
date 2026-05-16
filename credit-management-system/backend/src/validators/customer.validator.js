// src/validators/customer.validator.js
// Joi validation schemas for customer routes

const Joi = require('joi');

const createCustomerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(150).required().messages({
    'any.required': 'Customer full name is required',
  }),
  nickname: Joi.string().trim().max(50).optional().allow(''),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a valid international format',
      'any.required': 'Phone is required',
    }),
  alternatePhone: Joi.string().trim().pattern(/^\+?[1-9]\d{7,14}$/).optional().allow(''),
  address: Joi.string().trim().max(300).optional().allow(''),
  notes: Joi.string().trim().max(500).optional().allow(''),
  creditLimit: Joi.number().positive().max(1000000).optional().default(5000),
});

const updateCustomerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(150).optional(),
  nickname: Joi.string().trim().max(50).optional().allow(''),
  alternatePhone: Joi.string().pattern(/^\+?[1-9]\d{7,14}$/).optional().allow(''),
  address: Joi.string().trim().max(300).optional().allow(''),
  notes: Joi.string().trim().max(500).optional().allow(''),
  isActive: Joi.boolean().optional(),
});

const updateCreditLimitSchema = Joi.object({
  creditLimit: Joi.number().positive().max(1000000).required().messages({
    'any.required': 'Credit limit is required',
    'number.positive': 'Credit limit must be a positive number',
  }),
  reason: Joi.string().trim().max(200).optional(),
});

module.exports = { createCustomerSchema, updateCustomerSchema, updateCreditLimitSchema };
