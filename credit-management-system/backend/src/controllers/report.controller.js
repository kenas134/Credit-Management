// src/controllers/report.controller.js
const reportService = require('../services/report.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { getShopId } = require('./customer.controller');

/**
 * @swagger
 * /reports/outstanding:
 *   get:
 *     tags: [Reports]
 *     summary: Outstanding balances for all customers
 */
const getOutstanding = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await reportService.getOutstandingBalances(shopId);
  return sendSuccess(res, result, 'Outstanding balances report');
});

/**
 * @swagger
 * /reports/aging:
 *   get:
 *     tags: [Reports]
 *     summary: Aging analysis — debt grouped by overdue period
 */
const getAging = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await reportService.getAgingReport(shopId);
  return sendSuccess(res, result, 'Aging report generated');
});

/**
 * @swagger
 * /reports/payment-trend:
 *   get:
 *     tags: [Reports]
 *     summary: Monthly payment trend (last 6 months)
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: integer, default: 6 }
 */
const getPaymentTrend = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const months = parseInt(req.query.months) || 6;
  const result = await reportService.getPaymentTrend(shopId, months);
  return sendSuccess(res, result, 'Payment trend data');
});

/**
 * @swagger
 * /reports/kpis:
 *   get:
 *     tags: [Reports]
 *     summary: Dashboard KPI summary
 */
const getKPIs = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);
  const result = await reportService.getDashboardKPIs(shopId);
  return sendSuccess(res, result, 'KPIs retrieved');
});

module.exports = { getOutstanding, getAging, getPaymentTrend, getKPIs };
