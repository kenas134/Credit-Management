// src/repositories/customer.repository.js
// Data access layer for Customers

const prisma = require('../config/db');

const customerRepository = {
  /**
   * Get all customers for a shop with pagination and search
   */
  findAll: async ({ shopId, search, isActive, page, limit, skip }) => {
    const where = {
      shopId,
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { nickname: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          creditAccount: {
            select: { currentBalance: true, creditLimit: true, totalPaid: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return { customers, total };
  },

  /**
   * Get a single customer with full credit account details
   */
  findById: (id, shopId) =>
    prisma.customer.findFirst({
      where: { id, shopId },
      include: {
        creditAccount: {
          include: {
            transactions: {
              include: { payments: true },
              orderBy: { createdAt: 'desc' },
              take: 20,
            },
          },
        },
      },
    }),

  /**
   * Find customer by phone within a shop
   */
  findByPhone: (phone, shopId) =>
    prisma.customer.findFirst({ where: { phone, shopId } }),

  /**
   * Create a new customer + credit account in a transaction
   */
  create: async ({ shopId, creditLimit = 5000, ...customerData }) => {
    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: { ...customerData, shopId },
      });
      await tx.creditAccount.create({
        data: { customerId: customer.id, creditLimit },
      });
      return customer;
    });
  },

  /**
   * Update customer fields
   */
  update: (id, data) =>
    prisma.customer.update({
      where: { id },
      data,
      include: { creditAccount: true },
    }),

  /**
   * Soft-delete a customer
   */
  deactivate: (id) =>
    prisma.customer.update({ where: { id }, data: { isActive: false } }),

  /**
   * Update trust score and risk level
   */
  updateRisk: (id, trustScore, riskLevel) =>
    prisma.customer.update({ where: { id }, data: { trustScore, riskLevel } }),
};

module.exports = customerRepository;
