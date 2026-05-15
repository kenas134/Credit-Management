// src/controllers/dashboard.controller.js
const reportService = require('../services/report.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { getShopId } = require('./customer.controller');
const prisma = require('../config/db');

/**
 * @swagger
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get full dashboard summary (KPIs + overdue + recent activity)
 */
const getDashboard = asyncHandler(async (req, res) => {
  const shopId = await getShopId(req.user.id);

  const [kpis, overdueCustomers, recentTransactions] = await Promise.all([
    reportService.getDashboardKPIs(shopId),

    // Top 5 overdue customers
    prisma.customer.findMany({
      where: {
        shopId,
        isActive: true,
        creditAccount: {
          transactions: { some: { status: 'OVERDUE' } },
        },
      },
      include: {
        creditAccount: {
          select: {
            currentBalance: true,
            transactions: {
              where: { status: 'OVERDUE' },
              select: { amount: true, dueDate: true },
            },
          },
        },
      },
      take: 5,
    }),

    // Last 10 transactions across shop
    prisma.transaction.findMany({
      where: { creditAccount: { customer: { shopId } }, isVoid: false },
      include: {
        creditAccount: {
          include: { customer: { select: { fullName: true, phone: true } } },
        },
        payments: { select: { amount: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return sendSuccess(res, { kpis, overdueCustomers, recentTransactions }, 'Dashboard data loaded');
});

module.exports = { getDashboard };
