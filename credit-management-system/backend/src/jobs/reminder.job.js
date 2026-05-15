// src/jobs/reminder.job.js
// Sends payment reminders for transactions due in the next 3 days

const cron = require('node-cron');
const prisma = require('../config/db');
const { logger } = require('../utils/logger');

const sendReminders = async () => {
  logger.info('[ReminderJob] Running payment reminder check...');

  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  try {
    // Find transactions due within next 3 days that are still pending/partial
    const upcoming = await prisma.transaction.findMany({
      where: {
        status: { in: ['PENDING', 'PARTIAL'] },
        dueDate: { gte: now, lte: in3Days },
        isVoid: false,
      },
      include: {
        creditAccount: {
          include: {
            customer: {
              include: {
                shop: { include: { owner: true } },
              },
            },
          },
        },
        payments: true,
      },
    });

    logger.info(`[ReminderJob] Found ${upcoming.length} upcoming due transactions`);

    for (const tx of upcoming) {
      const customer = tx.creditAccount.customer;
      const owner = customer.shop.owner;
      const paid = tx.payments.reduce((s, p) => s + p.amount, 0);
      const remaining = tx.amount - paid;
      const daysLeft = Math.ceil((new Date(tx.dueDate) - now) / (1000 * 60 * 60 * 24));

      // Create notification for shop owner
      await prisma.notification.create({
        data: {
          type: 'PAYMENT_REMINDER',
          title: `Payment Due in ${daysLeft} Day(s)`,
          message: `${customer.fullName} (${customer.phone}) owes GHS ${remaining.toFixed(2)}. Due in ${daysLeft} day(s).`,
          userId: owner.id,
          customerId: customer.id,
          status: 'UNREAD',
          metadata: {
            transactionId: tx.id,
            dueDate: tx.dueDate,
            remaining,
          },
        },
      });

      logger.info(`[ReminderJob] Reminder created for ${customer.fullName} — GHS ${remaining}`);
    }

    logger.info('[ReminderJob] Completed successfully');
  } catch (err) {
    logger.error('[ReminderJob] Error:', err.message);
  }
};

/**
 * Start the reminder cron job
 * Runs every day at 8:00 AM
 */
const startReminderJob = () => {
  cron.schedule('0 8 * * *', sendReminders, {
    timezone: 'Africa/Accra',
  });
  logger.info('[ReminderJob] Scheduled: daily at 08:00');
};

module.exports = { startReminderJob, sendReminders };
