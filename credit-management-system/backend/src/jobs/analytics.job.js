// src/jobs/analytics.job.js
// Runs weekly analytics — recalculates all customer risk scores

const cron = require('node-cron');
const prisma = require('../config/db');
const { logger } = require('../utils/logger');
const { calculateRiskScore } = require('../utils/calculateRisk');

const runAnalytics = async () => {
  logger.info('[AnalyticsJob] Running weekly risk recalculation...');

  try {
    const customers = await prisma.customer.findMany({
      where: { isActive: true },
      include: {
        creditAccount: {
          include: { transactions: { include: { payments: true } } },
        },
      },
    });

    let updated = 0;
    for (const customer of customers) {
      const { trustScore, level } = calculateRiskScore(customer);
      await prisma.customer.update({
        where: { id: customer.id },
        data: { trustScore, riskLevel: level },
      });
      updated++;
    }

    logger.info(`[AnalyticsJob] Updated risk scores for ${updated} customers`);
  } catch (err) {
    logger.error('[AnalyticsJob] Error:', err.message);
  }
};

/**
 * Start the analytics cron job
 * Runs every Sunday at 1:00 AM
 */
const startAnalyticsJob = () => {
  cron.schedule('0 1 * * 0', runAnalytics, { timezone: 'Africa/Accra' });
  logger.info('[AnalyticsJob] Scheduled: weekly on Sunday at 01:00');
};

module.exports = { startAnalyticsJob, runAnalytics };
