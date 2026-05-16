// src/utils/calculateAging.js
// Aging analysis — categorizes outstanding debt by how overdue it is

/**
 * Categorizes a list of overdue transactions into aging buckets
 * @param {Array} transactions - Array of transaction objects with dueDate and amount
 * @returns {Object} Aging report with buckets
 */
const calculateAging = (transactions) => {
  const now = new Date();

  const buckets = {
    current: { count: 0, total: 0 },       // Not yet due
    days30: { count: 0, total: 0 },        // 1–30 days overdue
    days60: { count: 0, total: 0 },        // 31–60 days overdue
    days90: { count: 0, total: 0 },        // 61+ days overdue
    total: { count: 0, total: 0 },
  };

  transactions.forEach((tx) => {
    if (!tx.dueDate) return;

    const outstanding = tx.amount - (tx.payments?.reduce((s, p) => s + p.amount, 0) || 0);
    if (outstanding <= 0) return;

    const daysOverdue = Math.floor((now - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24));

    buckets.total.count += 1;
    buckets.total.total += outstanding;

    if (daysOverdue <= 0) {
      buckets.current.count += 1;
      buckets.current.total += outstanding;
    } else if (daysOverdue <= 30) {
      buckets.days30.count += 1;
      buckets.days30.total += outstanding;
    } else if (daysOverdue <= 60) {
      buckets.days60.count += 1;
      buckets.days60.total += outstanding;
    } else {
      buckets.days90.count += 1;
      buckets.days90.total += outstanding;
    }
  });

  // Round all totals
  Object.keys(buckets).forEach((key) => {
    buckets[key].total = Math.round(buckets[key].total * 100) / 100;
  });

  return buckets;
};

/**
 * Calculate days overdue for a single transaction
 * @param {Date} dueDate
 * @returns {number} Days overdue (negative = not yet due)
 */
const getDaysOverdue = (dueDate) => {
  if (!dueDate) return 0;
  const now = new Date();
  return Math.floor((now - new Date(dueDate)) / (1000 * 60 * 60 * 24));
};

module.exports = { calculateAging, getDaysOverdue };
