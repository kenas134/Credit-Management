// src/tests/unit/payment.test.js
// Unit tests for payment calculation logic

const { calculateAging, getDaysOverdue } = require('../../utils/calculateAging');
const { calculateRiskScore } = require('../../utils/calculateRisk');

describe('Aging Calculation', () => {
  const mockTransactions = [
    // Current (not due yet)
    {
      amount: 500,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      payments: [],
    },
    // 1-30 days overdue
    {
      amount: 300,
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      payments: [],
    },
    // 31-60 days overdue
    {
      amount: 800,
      dueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      payments: [{ amount: 200 }],
    },
    // Over 90 days
    {
      amount: 1200,
      dueDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
      payments: [],
    },
  ];

  it('should categorize transactions into correct buckets', () => {
    const aging = calculateAging(mockTransactions);

    expect(aging.current.count).toBe(1);
    expect(aging.current.amount).toBe(500);

    expect(aging.days1_30.count).toBe(1);
    expect(aging.days1_30.amount).toBe(300);

    expect(aging.days31_60.count).toBe(1);
    expect(aging.days31_60.amount).toBe(600); // 800 - 200 paid

    expect(aging.over90.count).toBe(1);
    expect(aging.over90.amount).toBe(1200);

    expect(aging.total.count).toBe(4);
  });

  it('getDaysOverdue should return negative for future dates', () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    expect(getDaysOverdue(futureDate)).toBeLessThan(0);
  });

  it('getDaysOverdue should return positive for past dates', () => {
    const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    expect(getDaysOverdue(pastDate)).toBeGreaterThan(0);
  });
});

describe('Risk Score Calculation', () => {
  it('should return LOW risk for customer with no debt', () => {
    const customer = {
      creditAccount: {
        creditLimit: 5000,
        currentBalance: 0,
        transactions: [],
      },
    };
    const { level } = calculateRiskScore(customer);
    expect(level).toBe('LOW');
  });

  it('should return HIGH risk for customer with multiple overdue transactions', () => {
    const customer = {
      creditAccount: {
        creditLimit: 1000,
        currentBalance: 950,
        transactions: [
          { status: 'OVERDUE', amount: 400, dueDate: new Date(Date.now() - 45 * 86400000), payments: [] },
          { status: 'OVERDUE', amount: 350, dueDate: new Date(Date.now() - 60 * 86400000), payments: [] },
          { status: 'OVERDUE', amount: 200, dueDate: new Date(Date.now() - 20 * 86400000), payments: [] },
        ],
      },
    };
    const { level, score } = calculateRiskScore(customer);
    expect(['HIGH', 'CRITICAL']).toContain(level);
    expect(score).toBeGreaterThan(4);
  });

  it('should return null-safe result when no credit account', () => {
    const customer = { creditAccount: null };
    const result = calculateRiskScore(customer);
    expect(result.level).toBe('LOW');
    expect(result.score).toBe(0);
  });
});
