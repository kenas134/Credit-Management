// src/utils/calculateRisk.js
// AI-inspired risk scoring for customers

/**
 * Calculate a risk score for a customer based on their repayment behaviour
 * Returns a score 0.0 (safest) to 10.0 (most risky)
 * @param {Object} customer - Customer with creditAccount and transactions
 * @returns {{ score: number, level: string, factors: string[] }}
 */
const calculateRiskScore = (customer) => {
  let score = 0;
  const factors = [];

  const account = customer.creditAccount;
  if (!account) return { score: 0, level: 'LOW', factors: [] };

  const transactions = account.transactions || [];
  const payments = transactions.flatMap((tx) => tx.payments || []);

  // Factor 1: Current balance vs credit limit (0–3 points)
  const utilizationRate = account.creditLimit > 0 ? account.currentBalance / account.creditLimit : 0;
  if (utilizationRate > 0.9) { score += 3; factors.push('Balance near credit limit'); }
  else if (utilizationRate > 0.6) { score += 1.5; factors.push('High credit utilization'); }

  // Factor 2: Overdue transactions (0–3 points)
  const overdueCount = transactions.filter((tx) => tx.status === 'OVERDUE').length;
  if (overdueCount >= 3) { score += 3; factors.push('Multiple overdue accounts'); }
  else if (overdueCount === 2) { score += 2; factors.push('2 overdue transactions'); }
  else if (overdueCount === 1) { score += 1; factors.push('1 overdue transaction'); }

  // Factor 3: Payment history (0–2 points)
  const totalTransactions = transactions.length;
  const paidTransactions = transactions.filter((t) => t.status === 'PAID').length;
  if (totalTransactions > 0) {
    const paymentRate = paidTransactions / totalTransactions;
    if (paymentRate < 0.3) { score += 2; factors.push('Poor repayment history'); }
    else if (paymentRate < 0.6) { score += 1; factors.push('Inconsistent repayment'); }
  }

  // Factor 4: Longest overdue gap (0–2 points)
  const now = new Date();
  const maxOverdueDays = transactions
    .filter((tx) => tx.status === 'OVERDUE' && tx.dueDate)
    .reduce((max, tx) => {
      const days = Math.floor((now - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24));
      return Math.max(max, days);
    }, 0);

  if (maxOverdueDays > 90) { score += 2; factors.push('Debt overdue 90+ days'); }
  else if (maxOverdueDays > 30) { score += 1; factors.push('Debt overdue 30+ days'); }

  // Determine risk level
  let level;
  if (score <= 2) level = 'LOW';
  else if (score <= 4) level = 'MEDIUM';
  else if (score <= 7) level = 'HIGH';
  else level = 'CRITICAL';

  // Trust score is inverse of risk (10 = safest)
  const trustScore = Math.max(0, Math.round((10 - score) * 10) / 10);

  return { score: Math.min(10, score), level, factors, trustScore };
};

/**
 * Predict likelihood of repayment within X days
 * Simple heuristic model based on past behavior
 * @param {Object} customer
 * @param {number} days - Prediction window in days
 * @returns {number} Probability 0.0–1.0
 */
const predictRepaymentLikelihood = (customer, days = 30) => {
  const account = customer.creditAccount;
  if (!account) return 0.5;

  const transactions = account.transactions || [];
  const paidCount = transactions.filter((t) => t.status === 'PAID').length;
  const total = transactions.length;

  if (total === 0) return 0.7; // No history — give benefit of doubt

  const baseRate = paidCount / total;
  const daysFactor = Math.min(1, days / 30); // More time = more likely
  const balanceFactor = account.currentBalance > account.creditLimit * 0.8 ? 0.8 : 1;

  return Math.min(1, Math.round(baseRate * daysFactor * balanceFactor * 100) / 100);
};

module.exports = { calculateRiskScore, predictRepaymentLikelihood };
