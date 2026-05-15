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
    current: { count: 0, amount: 0 },       // Not yet due
    days1_30: { count: 0, amount: 0 },       // 1–30 days overdue
    days31_60: { count: 0, amount: 0 },      // 31–60 days overdue
    days61_90: { count: 0, amount: 0 },      // 61–90 days overdue
    over90: { count: 0, amount: 0 },         // 90+ days overdue (write-off risk)
    total: { count: 0, amount: 0 },
  };

  transactions.forEach((tx) => {
    if (!tx.dueDate) return;

    const outstanding = tx.amount - (tx.payments?.reduce((s, p) => s + p.amount, 0) || 0);
    if (outstanding <= 0) return;

    const daysOverdue = Math.floor((now - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24));

    buckets.total.count += 1;
    buckets.total.amount += outstanding;

    if (daysOverdue <= 0) {
      buckets.current.count += 1;
      buckets.current.amount += outstanding;
    } else if (daysOverdue <= 30) {
      buckets.days1_30.count += 1;
      buckets.days1_30.amount += outstanding;
    } else if (daysOverdue <= 60) {
      buckets.days31_60.count += 1;
      buckets.days31_60.amount += outstanding;
    } else if (daysOverdue <= 90) {
      buckets.days61_90.count += 1;
      buckets.days61_90.amount += outstanding;
    } else {
      buckets.over90.count += 1;
      buckets.over90.amount += outstanding;
    }
  });

  // Round all amounts
  Object.keys(buckets).forEach((key) => {
    buckets[key].amount = Math.round(buckets[key].amount * 100) / 100;
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
