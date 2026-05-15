// src/controllers/credit.controller.js
// HTTP layer for credit accounts and transactions

const creditService = require('../services/credit.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const { getShopId } = require('./customer.controller');

/**
 * @swagger
 * /credit/{customerId}/ledger:
 *   get:
 *     tags: [Credit]
 *     summary: Get full credit ledger for a customer
 */
const getLedger = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await creditService.getLedger(req.params.customerId, shopId, req.query);
  return sendSuccess(res, result, 'Credit ledger retrieved');
});

/**
 * @swagger
 * /credit/{customerId}/summary:
 *   get:
 *     tags: [Credit]
 *     summary: Get account summary (balance, limit, utilization)
 */
const getAccountSummary = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await creditService.getAccountSummary(req.params.customerId, shopId);
  return sendSuccess(res, result, 'Account summary retrieved');
});

/**
 * @swagger
 * /credit:
 *   post:
 *     tags: [Credit]
 *     summary: Record a new credit entry (customer buys on credit)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerId, amount]
 *             properties:
 *               customerId: { type: string }
 *               amount: { type: number, example: 450.00 }
 *               description: { type: string, example: "Rice 25kg, oil 5L" }
 *               dueDate: { type: string, format: date }
 *               reference: { type: string }
 */
const createCredit = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const transaction = await creditService.createCredit(shopId, req.body);
  return sendCreated(res, transaction, 'Credit entry recorded successfully');
});

/**
 * @swagger
 * /credit/{transactionId}/void:
 *   patch:
 *     tags: [Credit]
 *     summary: Void a transaction (must have no payments)
 */
const voidTransaction = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await creditService.voidTransaction(req.params.transactionId, shopId, req.body.reason);
  return sendSuccess(res, result, 'Transaction voided');
});

/**
 * @swagger
 * /credit/{customerId}/limit:
 *   patch:
 *     tags: [Credit]
 *     summary: Update credit limit for a customer
 */
const updateCreditLimit = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await creditService.updateCreditLimit(
    req.params.customerId, shopId, req.body.creditLimit, req.body.reason
  );
  return sendSuccess(res, result, 'Credit limit updated');
});

module.exports = { getLedger, getAccountSummary, createCredit, voidTransaction, updateCreditLimit };
