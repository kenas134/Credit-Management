// src/repositories/payment.repository.js
// Data access layer for Payments

const prisma = require('../config/db');

const paymentRepository = {
  /**
   * Record a payment and update transaction + account balance atomically
   * Handles partial and full payments
   */
  recordPayment: async ({ transactionId, amount, method, reference, notes, paymentDate }) => {
    return prisma.$transaction(async (tx) => {
      // Fetch the transaction with existing payments
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: { payments: true, creditAccount: true },
      });

      if (!transaction) throw new Error('Transaction not found');
      if (transaction.isVoid) throw new Error('Cannot pay a voided transaction');

      const totalPaid = transaction.payments.reduce((s, p) => s + p.amount, 0);
      const remaining = transaction.amount - totalPaid;

      if (amount > remaining) {
        throw new Error(`Payment amount (${amount}) exceeds remaining balance (${remaining})`);
      }

      // Create the payment record
      const payment = await tx.payment.create({
        data: {
          transactionId,
          amount,
          method: method || 'CASH',
          reference,
          notes,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        },
      });

      // Update transaction status
      const newTotalPaid = totalPaid + amount;
      const newStatus = newTotalPaid >= transaction.amount ? 'PAID' : 'PARTIAL';
      await tx.transaction.update({
        where: { id: transactionId },
        data: { status: newStatus },
      });

      // Reduce account balance
      await tx.creditAccount.update({
        where: { id: transaction.creditAccountId },
        data: {
          currentBalance: { decrement: amount },
          totalPaid: { increment: amount },
        },
      });

      return { payment, transaction: { ...transaction, status: newStatus } };
    });
  },

  /**
   * Bulk payment — distribute against oldest pending transactions first
   */
  bulkPayment: async ({ customerId, amount, method, notes }) => {
    return prisma.$transaction(async (tx) => {
      const account = await tx.creditAccount.findUnique({
        where: { customerId },
        include: {
          transactions: {
            where: { status: { in: ['PENDING', 'PARTIAL', 'OVERDUE'] }, isVoid: false },
            include: { payments: true },
            orderBy: { createdAt: 'asc' }, // oldest first
          },
        },
      });

      if (!account) throw new Error('Credit account not found');

      let remaining = amount;
      const paymentsCreated = [];

      for (const transaction of account.transactions) {
        if (remaining <= 0) break;
        const paid = transaction.payments.reduce((s, p) => s + p.amount, 0);
        const due = transaction.amount - paid;
        const payAmount = Math.min(remaining, due);

        const payment = await tx.payment.create({
          data: { transactionId: transaction.id, amount: payAmount, method, notes },
        });

        const newPaid = paid + payAmount;
        const newStatus = newPaid >= transaction.amount ? 'PAID' : 'PARTIAL';
        await tx.transaction.update({ where: { id: transaction.id }, data: { status: newStatus } });

        paymentsCreated.push(payment);
        remaining -= payAmount;
      }

      await tx.creditAccount.update({
        where: { customerId },
        data: {
          currentBalance: { decrement: amount - remaining },
          totalPaid: { increment: amount - remaining },
        },
      });

      return { paymentsCreated, amountApplied: amount - remaining };
    });
  },

  /**
   * Get payment history for a customer
   */
  findByCustomerId: (customerId, { skip = 0, limit = 20 } = {}) =>
    prisma.payment.findMany({
      where: { transaction: { creditAccount: { customerId } } },
      include: { transaction: { select: { description: true, amount: true } } },
      orderBy: { paymentDate: 'desc' },
      skip,
      take: limit,
    }),

  /**
   * Get payment by ID
   */
  findById: (id) =>
    prisma.payment.findUnique({
      where: { id },
      include: { transaction: { include: { creditAccount: { include: { customer: true } } } } },
    }),
};

module.exports = paymentRepository;
