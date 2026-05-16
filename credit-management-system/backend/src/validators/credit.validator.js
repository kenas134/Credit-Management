// src/validators/credit.validator.js
// Joi schemas for credit/transaction routes

const Joi = require('joi');

const createCreditSchema = Joi.object({
  customerId: Joi.string().trim().required().messages({ 'any.required': 'Customer ID is required' }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'Amount is required',
    'number.positive': 'Amount must be positive',
  }),
  description: Joi.string().trim().max(500).optional().allow('').messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  dueDate: Joi.date().greater('now').optional().messages({
    'date.greater': 'Due date must be in the future',
  }),
  reference: Joi.string().trim().max(100).optional().allow(''),
});

const adjustBalanceSchema = Joi.object({
  amount: Joi.number().required().messages({ 'any.required': 'Amount is required' }),
  description: Joi.string().trim().max(500).required().messages({
    'any.required': 'Reason for adjustment is required',
  }),
});

const voidTransactionSchema = Joi.object({
  reason: Joi.string().trim().min(5).max(300).required().messages({
    'any.required': 'Void reason is required',
    'string.min': 'Reason must be at least 5 characters',
  }),
});

module.exports = { createCreditSchema, adjustBalanceSchema, voidTransactionSchema };
