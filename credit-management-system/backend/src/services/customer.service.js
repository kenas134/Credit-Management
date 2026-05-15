// src/services/customer.service.js
// Business logic for customer management

const customerRepository = require('../repositories/customer.repository');
const { calculateRiskScore } = require('../utils/calculateRisk');
const { AppError } = require('../middlewares/error.middleware');
const prisma = require('../config/db');

const customerService = {
  /**
   * Get a shop's customers with pagination and search
   */
  getAll: async (shopId, queryParams) => {
    const { getPagination } = require('../utils/pagination');
    const { page, limit, skip } = getPagination(queryParams);
    const { search, isActive } = queryParams;

    const result = await customerRepository.findAll({
      shopId,
      search,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      page, limit, skip,
    });

    return result;
  },

  /**
   * Get a single customer's full profile
   */
  getById: async (id, shopId) => {
    const customer = await customerRepository.findById(id, shopId);
    if (!customer) throw new AppError('Customer not found', 404);

    // Attach risk analysis
    const risk = calculateRiskScore(customer);
    return { ...customer, riskAnalysis: risk };
  },

  /**
   * Create a new customer with their credit account
   */
  create: async (shopId, data) => {
    // Check for duplicate phone within same shop
    const existing = await customerRepository.findByPhone(data.phone, shopId);
    if (existing) {
      throw new AppError('A customer with this phone number already exists in this shop', 409);
    }

    const customer = await customerRepository.create({ ...data, shopId });
    return customer;
  },

  /**
   * Update customer information
   */
  update: async (id, shopId, data) => {
    const existing = await customerRepository.findById(id, shopId);
    if (!existing) throw new AppError('Customer not found', 404);

    // Check for phone conflict on update
    if (data.phone && data.phone !== existing.phone) {
      const conflict = await customerRepository.findByPhone(data.phone, shopId);
      if (conflict) throw new AppError('Another customer already uses this phone number', 409);
    }

    return customerRepository.update(id, data);
  },

  /**
   * Deactivate (soft delete) a customer
   */
  deactivate: async (id, shopId) => {
    const existing = await customerRepository.findById(id, shopId);
    if (!existing) throw new AppError('Customer not found', 404);

    if (existing.creditAccount?.currentBalance > 0) {
      throw new AppError(
        `Cannot deactivate customer with outstanding balance of ${existing.creditAccount.currentBalance}`,
        400
      );
    }

    return customerRepository.deactivate(id);
  },

  /**
   * Update a customer's credit limit
   */
  updateCreditLimit: async (customerId, shopId, creditLimit) => {
    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) throw new AppError('Customer not found', 404);

    return prisma.creditAccount.update({
      where: { customerId },
      data: { creditLimit },
    });
  },

  /**
   * Recalculate and save risk score for a customer
   */
  refreshRiskScore: async (customerId, shopId) => {
    const customer = await customerRepository.findById(customerId, shopId);
    if (!customer) throw new AppError('Customer not found', 404);

    const { trustScore, level } = calculateRiskScore(customer);
    return customerRepository.updateRisk(customerId, trustScore, level);
  },
};

module.exports = customerService;
