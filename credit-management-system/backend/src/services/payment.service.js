// src/services/payment.service.js
// Business logic for payments

const paymentRepository = require('../repositories/payment.repository');
const customerRepository = require('../repositories/customer.repository');
const creditRepository = require('../repositories/credit.repository');
const notificationRepository = require('../repositories/notification.repository');
const { AppError } = require('../middlewares/error.middleware');
const { getPagination } = require('../utils/pagination');
const prisma = require('../config/db');

const paymentService = {
  /**
   * Record a single payment against a specific transaction
   */
  recordPayment: async (shopId, paymentData) => {
    const { transactionId } = paymentData;

    // Verify transaction belongs to this shop
    const transaction = await creditRepository.findTransactionById(transactionId);
    if (!transaction) throw new AppError('Transaction not found', 404);
    if (transaction.creditAccount.customer.shopId !== shopId) {
      throw new AppError('Unauthorized', 403);
    }

    const { payment, transaction: updatedTx } = await paymentRepository.recordPayment(paymentData);

    // Get shop owner ID to notify
    const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { ownerId: true } });

    // Send notification if fully paid
    if (updatedTx.status === 'PAID') {
      await notificationRepository.create({
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Received — Fully Settled',
        message: `${transaction.creditAccount.customer.fullName} has fully paid ETB ${transaction.amount}. Balance cleared.`,
        userId: shop?.ownerId, 
        customerId: transaction.creditAccount.customer.id,
      });
    }

    return payment;
  },

  /**
   * Bulk payment — distribute across all pending transactions oldest-first
   */
  bulkPayment: async (shopId, { customerId, amount, method, notes }) => {
    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) throw new AppError('Customer not found', 404);

    if (amount > customer.creditAccount.currentBalance) {
      throw new AppError(
        `Payment amount (${amount}) exceeds outstanding balance (${customer.creditAccount.currentBalance})`,
        400
      );
    }

    const result = await paymentRepository.bulkPayment({ customerId, amount, method, notes });

    // Get shop owner ID
    const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { ownerId: true } });

    // Notification
    await notificationRepository.create({
      type: 'PAYMENT_RECEIVED',
      title: 'Bulk Payment Received',
      message: `${customer.fullName} paid ETB ${result.amountApplied} across ${result.paymentsCreated.length} transactions.`,
      userId: shop?.ownerId,
      customerId,
    });

    return result;
  },

  /**
   * Get payment history for a customer
   */
  getHistory: async (customerId, shopId, queryParams) => {
    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) throw new AppError('Customer not found', 404);

    const { page, limit, skip } = getPagination(queryParams);
    const payments = await paymentRepository.findByCustomerId(customerId, { skip, limit });

    return {
      payments,
      totalPaid: customer.creditAccount?.totalPaid || 0,
    };
  },
};

module.exports = paymentService;
