// src/repositories/credit.repository.js
// Data access layer for CreditAccounts and Transactions

const prisma = require('../config/db');

const creditRepository = {
  /**
   * Get credit account by customer ID
   */
  findAccountByCustomerId: (customerId) =>
    prisma.creditAccount.findUnique({
      where: { customerId },
      include: {
        customer: { select: { fullName: true, phone: true, shopId: true } },
      },
    }),

  /**
   * Get full account with recent transactions
   */
  findAccountWithTransactions: (customerId, { skip = 0, limit = 20 } = {}) =>
    prisma.creditAccount.findUnique({
      where: { customerId },
      include: {
        transactions: {
          include: { payments: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        },
        customer: { select: { fullName: true, nickname: true, riskLevel: true } },
      },
    }),

  /**
   * Create a credit transaction and update account balance atomically
   */
  createCredit: async ({ creditAccountId, amount, description, dueDate, reference }) => {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          creditAccountId,
          type: 'CREDIT',
          amount,
          description,
          dueDate,
          reference,
          status: 'PENDING',
        },
      });

      await tx.creditAccount.update({
        where: { id: creditAccountId },
        data: {
          currentBalance: { increment: amount },
          totalCredited: { increment: amount },
        },
      });

      return transaction;
    });
  },

  /**
   * Find transaction by ID
   */
  findTransactionById: (id) =>
    prisma.transaction.findUnique({
      where: { id },
      include: { payments: true, creditAccount: { include: { customer: true } } },
    }),

  /**
   * Update transaction status
   */
  updateTransactionStatus: (id, status) =>
    prisma.transaction.update({ where: { id }, data: { status } }),

  /**
   * Update credit account balance
   */
  updateAccountBalance: (id, data) =>
    prisma.creditAccount.update({ where: { id }, data }),

  /**
   * Update credit limit
   */
  updateCreditLimit: (accountId, creditLimit) =>
    prisma.creditAccount.update({ where: { id: accountId }, data: { creditLimit } }),

  /**
   * Void a transaction
   */
  voidTransaction: async (transactionId, reason, currentBalance) => {
    return prisma.$transaction(async (tx) => {
      const txn = await tx.transaction.findUnique({ where: { id: transactionId } });
      await tx.transaction.update({
        where: { id: transactionId },
        data: { isVoid: true, voidReason: reason, status: 'WRITTEN_OFF' },
      });
      // Reverse balance impact
      await tx.creditAccount.update({
        where: { id: txn.creditAccountId },
        data: { currentBalance: { decrement: txn.amount - currentBalance } },
      });
      return txn;
    });
  },

  /**
   * Get all overdue transactions (for cron jobs)
   */
  findAllOverdue: () =>
    prisma.transaction.findMany({
      where: { status: { in: ['PENDING', 'PARTIAL'] }, dueDate: { lt: new Date() } },
      include: {
        creditAccount: {
          include: {
            customer: { include: { shop: { include: { owner: true } } } },
          },
        },
        payments: true,
      },
    }),

  /**
   * Get transactions for a shop for report generation
   */
  findByShopId: (shopId, filters = {}) =>
    prisma.transaction.findMany({
      where: {
        creditAccount: { customer: { shopId } },
        ...filters,
      },
      include: {
        payments: true,
        creditAccount: { include: { customer: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
};

module.exports = creditRepository;
