// src/jobs/overdue.job.js
// Marks past-due transactions as OVERDUE and alerts shop owners

const cron = require('node-cron');
const prisma = require('../config/db');
const { logger } = require('../utils/logger');
const { calculateRiskScore } = require('../utils/calculateRisk');

const markOverdue = async () => {
  logger.info('[OverdueJob] Running overdue check...');

  try {
    const now = new Date();

    // Find all PENDING/PARTIAL transactions whose due date has passed
    const overdueTransactions = await prisma.transaction.findMany({
      where: {
        status: { in: ['PENDING', 'PARTIAL'] },
        dueDate: { lt: now },
        isVoid: false,
      },
      include: {
        creditAccount: {
          include: {
            customer: {
              include: { shop: { include: { owner: true } } },
            },
            transactions: { include: { payments: true } },
          },
        },
        payments: true,
      },
    });

    logger.info(`[OverdueJob] Found ${overdueTransactions.length} overdue transactions`);

    for (const tx of overdueTransactions) {
      const customer = tx.creditAccount.customer;
      const owner = customer.shop.owner;
      const paid = tx.payments.reduce((s, p) => s + p.amount, 0);
      const outstanding = tx.amount - paid;
      const daysOverdue = Math.floor((now - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24));

      // Update transaction status to OVERDUE
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { status: 'OVERDUE' },
      });

      // Recalculate customer risk score
      const { trustScore, level } = calculateRiskScore(customer);
      await prisma.customer.update({
        where: { id: customer.id },
        data: { trustScore, riskLevel: level },
      });

      // Create overdue alert notification
      await prisma.notification.upsert({
        where: {
          // Use a compound unique — create one if it doesn't exist for this tx
          id: `overdue-${tx.id}`,
        },
        update: {},
        create: {
          id: `overdue-${tx.id}`,
          type: 'OVERDUE_ALERT',
          title: `Overdue Payment — ${daysOverdue} Day(s)`,
          message: `${customer.fullName} has not paid GHS ${outstanding.toFixed(2)}. ${daysOverdue} day(s) overdue.`,
          userId: owner.id,
          customerId: customer.id,
          status: 'UNREAD',
          metadata: { transactionId: tx.id, daysOverdue, outstanding },
        },
      });

      logger.info(`[OverdueJob] Marked overdue: ${customer.fullName} — GHS ${outstanding} (${daysOverdue}d)`);
    }

    logger.info('[OverdueJob] Completed successfully');
  } catch (err) {
    logger.error('[OverdueJob] Error:', err.message);
  }
};

/**
 * Start the overdue cron job
 * Runs every day at midnight
 */
const startOverdueJob = () => {
  cron.schedule('0 0 * * *', markOverdue, {
    timezone: 'Africa/Accra',
  });
  logger.info('[OverdueJob] Scheduled: daily at midnight');
};

module.exports = { startOverdueJob, markOverdue };
