// src/services/report.service.js
// Report and analytics generation

const reportRepository = require('../repositories/report.repository');
const { calculateAging } = require('../utils/calculateAging');

const reportService = {
  /**
   * Outstanding balances report
   */
  getOutstandingBalances: async (shopId) => {
    const customers = await reportRepository.getOutstandingBalances(shopId);
    const total = customers.reduce((s, c) => s + (c.creditAccount?.currentBalance || 0), 0);
    return { customers, totalOutstanding: Math.round(total * 100) / 100 };
  },

  /**
   * Aging analysis — groups overdue debt into time buckets
   */
  getAgingReport: async (shopId) => {
    const transactions = await reportRepository.getTransactionsForAging(shopId);
    const aging = calculateAging(transactions);

    // Group by customer
    const byCustomer = {};
    transactions.forEach((tx) => {
      const cust = tx.creditAccount.customer;
      if (!byCustomer[cust.id]) {
        byCustomer[cust.id] = { customer: cust, transactions: [] };
      }
      byCustomer[cust.id].transactions.push(tx);
    });

    return { aging, customerBreakdown: Object.values(byCustomer) };
  },

  /**
   * Payment trend data for charts
   */
  getPaymentTrend: async (shopId, months = 6) => {
    const payments = await reportRepository.getPaymentTrend(shopId, months);

    // Group by month
    const grouped = {};
    payments.forEach(({ amount, paymentDate }) => {
      const key = new Date(paymentDate).toISOString().slice(0, 7); // "YYYY-MM"
      grouped[key] = (grouped[key] || 0) + amount;
    });

    return Object.entries(grouped).map(([month, total]) => ({ month, total }));
  },

  /**
   * Dashboard KPIs
   */
  getDashboardKPIs: async (shopId) => {
    const kpis = await reportRepository.getShopKPIs(shopId);

    // High-risk customers
    const prisma = require('../config/db');
    const highRiskCount = await prisma.customer.count({
      where: { shopId, riskLevel: { in: ['HIGH', 'CRITICAL'] }, isActive: true },
    });

    return { ...kpis, highRiskCount };
  },
};

module.exports = reportService;
