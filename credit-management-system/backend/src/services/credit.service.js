// src/services/credit.service.js
// Business logic for credit accounts and transactions

const creditRepository = require('../repositories/credit.repository');
const customerRepository = require('../repositories/customer.repository');
const notificationRepository = require('../repositories/notification.repository');
const { AppError } = require('../middlewares/error.middleware');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const prisma = require('../config/db');

const creditService = {
  /**
   * Get a customer's full credit ledger
   */
  getLedger: async (customerId, shopId, queryParams) => {
    // Verify customer belongs to this shop
    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) throw new AppError('Customer not found', 404);

    const { page, limit, skip } = getPagination(queryParams);
    const account = await creditRepository.findAccountWithTransactions(customerId, { skip, limit });
    if (!account) throw new AppError('Credit account not found', 404);

    const total = await prisma.transaction.count({
      where: { creditAccountId: account.id },
    });

    return {
      account,
      pagination: buildPaginationMeta(total, page, limit),
    };
  },

  /**
   * Record a new credit entry (customer buys on credit)
   */
  createCredit: async (shopId, { customerId, amount, description, dueDate, reference }) => {
    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) throw new AppError('Customer not found', 404);
    if (!customer.creditAccount) throw new AppError('Customer has no credit account', 400);
    if (!customer.isActive) throw new AppError('Cannot create credit for an inactive customer', 400);

    const { currentBalance, creditLimit } = customer.creditAccount;
    if (currentBalance + amount > creditLimit) {
      throw new AppError(
        `This credit of ${amount} would exceed the credit limit of ${creditLimit}. Current balance: ${currentBalance}`,
        400
      );
    }

    const transaction = await creditRepository.createCredit({
      creditAccountId: customer.creditAccount.id,
      amount,
      description,
      dueDate,
      reference,
    });

    // Create Notification for the shop owner
    const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { ownerId: true } });
    await notificationRepository.create({
      type: 'SYSTEM',
      title: 'New Credit Issued',
      message: `Issued ETB ${amount} credit to ${customer.fullName}. New balance: ETB ${currentBalance + amount}.`,
      userId: shop?.ownerId,
      customerId: customer.id,
    });

    return transaction;
  },

  /**
   * Void a transaction (reverse credit entry)
   */
  voidTransaction: async (transactionId, shopId, reason) => {
    const transaction = await creditRepository.findTransactionById(transactionId);
    if (!transaction) throw new AppError('Transaction not found', 404);

    // Verify ownership
    if (transaction.creditAccount.customer.shopId !== shopId) {
      throw new AppError('Unauthorized', 403);
    }

    if (transaction.isVoid) throw new AppError('Transaction is already voided', 400);
    if (transaction.payments.length > 0) {
      throw new AppError('Cannot void a transaction that has payments recorded', 400);
    }

    const totalPaid = transaction.payments.reduce((s, p) => s + p.amount, 0);
    return creditRepository.voidTransaction(transactionId, reason, totalPaid);
  },

  /**
   * Update credit limit for a customer
   */
  updateCreditLimit: async (customerId, shopId, creditLimit, reason) => {
    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) throw new AppError('Customer not found', 404);
    if (!customer.creditAccount) throw new AppError('No credit account found', 404);

    if (creditLimit < customer.creditAccount.currentBalance) {
      throw new AppError(
        `New credit limit (${creditLimit}) cannot be less than current balance (${customer.creditAccount.currentBalance})`,
        400
      );
    }

    return creditRepository.updateCreditLimit(customer.creditAccount.id, creditLimit);
  },

  /**
   * Get summary of a customer's account
   */
  getAccountSummary: async (customerId, shopId) => {
    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) throw new AppError('Customer not found', 404);

    const account = customer.creditAccount;
    if (!account) throw new AppError('No credit account found', 404);

    const utilizationRate = account.creditLimit > 0
      ? ((account.currentBalance / account.creditLimit) * 100).toFixed(1)
      : 0;

    return {
      customerId,
      customerName: customer.fullName,
      creditLimit: account.creditLimit,
      currentBalance: account.currentBalance,
      availableCredit: account.creditLimit - account.currentBalance,
      totalPaid: account.totalPaid,
      totalCredited: account.totalCredited,
      utilizationRate: `${utilizationRate}%`,
      riskLevel: customer.riskLevel,
      trustScore: customer.trustScore,
    };
  },
};

module.exports = creditService;
