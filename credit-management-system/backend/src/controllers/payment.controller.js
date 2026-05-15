// src/controllers/payment.controller.js
const paymentService = require('../services/payment.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const { getShopId } = require('./customer.controller');

/**
 * @swagger
 * /payments:
 *   post:
 *     tags: [Payments]
 *     summary: Record a payment against a specific transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [transactionId, amount]
 *             properties:
 *               transactionId: { type: string }
 *               amount: { type: number, example: 200.00 }
 *               method: { type: string, enum: [CASH, MOBILE_MONEY, BANK_TRANSFER, OTHER] }
 *               reference: { type: string, example: "MTN-REF-12345" }
 *               notes: { type: string }
 */
const recordPayment = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const payment = await paymentService.recordPayment(shopId, req.body);
  return sendCreated(res, payment, 'Payment recorded successfully');
});

/**
 * @swagger
 * /payments/bulk:
 *   post:
 *     tags: [Payments]
 *     summary: Bulk payment — distribute across all pending transactions (oldest first)
 */
const bulkPayment = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await paymentService.bulkPayment(shopId, req.body);
  return sendCreated(res, result, 'Bulk payment applied successfully');
});

/**
 * @swagger
 * /payments/customer/{customerId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment history for a customer
 */
const getHistory = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await paymentService.getHistory(req.params.customerId, shopId, req.query);
  return sendSuccess(res, result, 'Payment history retrieved');
});

module.exports = { recordPayment, bulkPayment, getHistory };
