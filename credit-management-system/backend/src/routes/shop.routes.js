// src/routes/shop.routes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { getShopId } = require('../controllers/customer.controller');
const prisma = require('../config/db');

/**
 * GET /api/v1/shop
 * Returns the current user's shop info
 */
router.get('/', asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  return sendSuccess(res, shop, 'Shop info retrieved');
}));

/**
 * PUT /api/v1/shop
 * Updates shop name, address, phone
 */
router.put('/', asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const { name, address, phone } = req.body;

  const updated = await prisma.shop.update({
    where: { id: shopId },
    data: {
      ...(name    && { name }),
      ...(address !== undefined && { address }),
      ...(phone   !== undefined && { phone }),
    },
  });

  return sendSuccess(res, updated, 'Shop updated successfully');
}));

module.exports = router;
