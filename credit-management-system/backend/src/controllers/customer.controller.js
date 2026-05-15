// src/controllers/customer.controller.js
// HTTP layer for customer management

const customerService = require('../services/customer.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const { buildPaginationMeta } = require('../utils/pagination');

/**
 * @swagger
 * /customers:
 *   get:
 *     tags: [Customers]
 *     summary: Get all customers for the authenticated shop
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, nickname, or phone
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 */
const getAll = asyncHandler(async (req, res) => {
  const shopId = req.user.shopId || await getShopId(req.user.id);
  const { customers, total } = await customerService.getAll(shopId, req.query);
  const { page, limit } = require('../utils/pagination').getPagination(req.query);

  return res.status(200).json({
    success: true,
    message: 'Customers retrieved',
    data: customers,
    pagination: buildPaginationMeta(total, page, limit),
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Get a single customer with full credit profile
 */
const getById = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const customer = await customerService.getById(req.params.id, shopId);
  return sendSuccess(res, customer, 'Customer retrieved');
});

/**
 * @swagger
 * /customers:
 *   post:
 *     tags: [Customers]
 *     summary: Add a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, phone]
 *             properties:
 *               fullName: { type: string, example: "Abena Owusu" }
 *               nickname: { type: string, example: "Nana" }
 *               phone: { type: string, example: "+233244111001" }
 *               address: { type: string }
 *               creditLimit: { type: number, example: 3000 }
 */
const create = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const customer = await customerService.create(shopId, req.body);
  return sendCreated(res, customer, 'Customer added successfully');
});

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     tags: [Customers]
 *     summary: Update customer information
 */
const update = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const customer = await customerService.update(req.params.id, shopId, req.body);
  return sendSuccess(res, customer, 'Customer updated successfully');
});

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     tags: [Customers]
 *     summary: Deactivate a customer (soft delete)
 */
const deactivate = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  await customerService.deactivate(req.params.id, shopId);
  return sendSuccess(res, null, 'Customer deactivated successfully');
});

/**
 * @swagger
 * /customers/{id}/credit-limit:
 *   patch:
 *     tags: [Customers]
 *     summary: Update a customer's credit limit
 */
const updateCreditLimit = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await customerService.updateCreditLimit(req.params.id, shopId, req.body.creditLimit);
  return sendSuccess(res, result, 'Credit limit updated');
});

/**
 * @swagger
 * /customers/{id}/risk:
 *   post:
 *     tags: [Customers]
 *     summary: Recalculate risk score for a customer
 */
const refreshRisk = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await customerService.refreshRiskScore(req.params.id, shopId);
  return sendSuccess(res, result, 'Risk score refreshed');
});

// Helper: get shop ID from user ID
const getShopId = async (userId) => {
  const prisma = require('../config/db');
  const shop = await prisma.shop.findUnique({ where: { ownerId: userId }, select: { id: true } });
  if (!shop) throw new (require('../middlewares/error.middleware').AppError)('Shop not found for this user', 404);
  return shop.id;
};

module.exports = { getAll, getById, create, update, deactivate, updateCreditLimit, refreshRisk, getShopId };
