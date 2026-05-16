// src/repositories/report.repository.js
// Data access for report generation

const prisma = require('../config/db');

const reportRepository = {
  /**
   * Get outstanding balances for all active customers in a shop
   */
  getOutstandingBalances: (shopId) =>
    prisma.customer.findMany({
      where: { shopId, isActive: true, creditAccount: { currentBalance: { gt: 0 } } },
      include: {
        creditAccount: {
          select: { currentBalance: true, creditLimit: true, totalPaid: true, totalCredited: true },
        },
      },
      orderBy: { creditAccount: { currentBalance: 'desc' } },
    }),

  /**
   * Get all transactions for aging analysis
   */
  getTransactionsForAging: (shopId) =>
    prisma.transaction.findMany({
      where: {
        creditAccount: { customer: { shopId } },
        status: { in: ['PENDING', 'PARTIAL', 'OVERDUE'] },
        isVoid: false,
      },
      include: {
        payments: true,
        creditAccount: { include: { customer: { select: { fullName: true, phone: true } } } },
      },
    }),

  /**
   * Get payment trend data (last N months)
   */
  getPaymentTrend: async (shopId, months = 6) => {
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    return prisma.payment.findMany({
      where: {
        createdAt: { gte: since },
        transaction: { creditAccount: { customer: { shopId } } },
        isVoid: false,
      },
      select: { amount: true, paymentDate: true, method: true },
      orderBy: { paymentDate: 'asc' },
    });
  },

  /**
   * Get shop-level KPI summary
   */
  getShopKPIs: async (shopId) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalCustomers, activeDebtors, totalOutstanding, recentPayments, overdueCount, paidToday, writtenOff, avgRiskScore] = await Promise.all([
      prisma.customer.count({ where: { shopId, isActive: true } }),
      prisma.customer.count({
        where: { shopId, isActive: true, creditAccount: { currentBalance: { gt: 0 } } },
      }),
      prisma.creditAccount.aggregate({
        where: { customer: { shopId } },
        _sum: { currentBalance: true, totalPaid: true },
      }),
      prisma.payment.aggregate({
        where: {
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
          transaction: { creditAccount: { customer: { shopId } } },
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.count({
        where: {
          status: 'OVERDUE',
          creditAccount: { customer: { shopId } },
        },
      }),
      prisma.payment.aggregate({
        where: {
          createdAt: { gte: todayStart },
          transaction: { creditAccount: { customer: { shopId } } },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          status: 'WRITTEN_OFF',
          creditAccount: { customer: { shopId } },
        },
        _sum: { amount: true },
      }),
      prisma.customer.aggregate({
        where: { shopId },
        _avg: { trustScore: true },
      }),
    ]);

    const outSum = totalOutstanding._sum.currentBalance || 0;
    const paidSum = totalOutstanding._sum.totalPaid || 0;
    const collectionRate = outSum + paidSum > 0 ? Math.round((paidSum / (outSum + paidSum)) * 100) : 0;

    return {
      totalCustomers,
      activeDebtors,
      activeCredits: activeDebtors,
      totalOutstanding: outSum,
      monthlyPaymentsTotal: recentPayments._sum.amount || 0,
      monthlyPaymentsCount: recentPayments._count,
      overdueCount,
      paidToday: paidToday._sum.amount || 0,
      writtenOff: writtenOff._sum.amount || 0,
      avgRiskScore: avgRiskScore._avg.trustScore ? avgRiskScore._avg.trustScore.toFixed(1) : 0,
      collectionRate,
    };
  },
};

module.exports = reportRepository;
