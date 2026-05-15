// shared/constants/index.js
// Shared constants between backend and mobile

module.exports = {
  ROLES: { OWNER: 'OWNER', STAFF: 'STAFF', ADMIN: 'ADMIN' },

  TRANSACTION_TYPES: {
    CREDIT: 'CREDIT',
    PAYMENT: 'PAYMENT',
    ADJUSTMENT: 'ADJUSTMENT',
  },

  PAYMENT_STATUS: {
    PENDING: 'PENDING',
    PARTIAL: 'PARTIAL',
    PAID: 'PAID',
    OVERDUE: 'OVERDUE',
    WRITTEN_OFF: 'WRITTEN_OFF',
  },

  ACCOUNT_STATUS: {
    ACTIVE: 'ACTIVE',
    OVERDUE: 'OVERDUE',
    SUSPENDED: 'SUSPENDED',
    CLOSED: 'CLOSED',
  },

  NOTIFICATION_TYPES: {
    PAYMENT_REMINDER: 'PAYMENT_REMINDER',
    OVERDUE_ALERT: 'OVERDUE_ALERT',
    PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
    CREDIT_LIMIT_WARNING: 'CREDIT_LIMIT_WARNING',
    SYSTEM: 'SYSTEM',
  },

  RISK_LEVELS: {
    LOW: { min: 0, max: 3.9, label: 'Low Risk', color: '#22c55e' },
    MEDIUM: { min: 4, max: 6.9, label: 'Medium Risk', color: '#f59e0b' },
    HIGH: { min: 7, max: 10, label: 'High Risk', color: '#ef4444' },
  },

  AGING_BUCKETS: {
    CURRENT: { min: 0, max: 30, label: 'Current (0-30 days)' },
    DAYS_30: { min: 31, max: 60, label: '31-60 Days' },
    DAYS_60: { min: 61, max: 90, label: '61-90 Days' },
    DAYS_90: { min: 91, max: Infinity, label: '90+ Days (Critical)' },
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
};
