// src/validators/payment.validator.js
// Joi schemas for payment routes

const Joi = require('joi');

const recordPaymentSchema = Joi.object({
  transactionId: Joi.string().required().messages({
    'any.required': 'Transaction ID is required',
  }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'Payment amount is required',
    'number.positive': 'Payment amount must be positive',
  }),
  method: Joi.string()
    .valid('CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'OTHER')
    .optional()
    .default('CASH'),
  reference: Joi.string().trim().max(100).optional().allow(''),
  notes: Joi.string().trim().max(300).optional().allow(''),
  paymentDate: Joi.date().max('now').optional(),
});

const bulkPaymentSchema = Joi.object({
  customerId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string()
    .valid('CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'OTHER')
    .optional()
    .default('CASH'),
  notes: Joi.string().trim().max(300).optional().allow(''),
});

module.exports = { recordPaymentSchema, bulkPaymentSchema };
