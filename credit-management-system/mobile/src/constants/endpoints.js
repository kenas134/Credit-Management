// mobile/src/constants/endpoints.js
// All API endpoint paths

const BASE = '/api/v1';

export const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE}/auth/register`,
  LOGIN: `${BASE}/auth/login`,
  LOGOUT: `${BASE}/auth/logout`,
  REFRESH: `${BASE}/auth/refresh`,
  ME: `${BASE}/auth/me`,
  CHANGE_PASSWORD: `${BASE}/auth/change-password`,

  // Customers
  CUSTOMERS: `${BASE}/customers`,
  CUSTOMER: (id) => `${BASE}/customers/${id}`,
  CUSTOMER_CREDIT_LIMIT: (id) => `${BASE}/customers/${id}/credit-limit`,
  CUSTOMER_RISK: (id) => `${BASE}/customers/${id}/refresh-risk`,

  // Credit / Ledger
  CREDITS: `${BASE}/credits`,
  LEDGER: (customerId) => `${BASE}/credits/${customerId}/ledger`,
  ACCOUNT_SUMMARY: (customerId) => `${BASE}/credits/${customerId}/summary`,
  VOID_TRANSACTION: (txId) => `${BASE}/credits/transactions/${txId}/void`,

  // Payments
  PAYMENTS: `${BASE}/payments`,
  BULK_PAYMENT: `${BASE}/payments/bulk`,
  PAYMENT_HISTORY: `${BASE}/payments/history`,

  // Reports
  OUTSTANDING: `${BASE}/reports/outstanding`,
  AGING: `${BASE}/reports/aging`,
  PAYMENT_TREND: `${BASE}/reports/payment-trend`,
  KPIS: `${BASE}/reports/kpis`,
  DASHBOARD: `${BASE}/dashboard`,

  // Notifications
  NOTIFICATIONS: `${BASE}/notifications`,
  NOTIFICATION_READ: (id) => `${BASE}/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: `${BASE}/notifications/read-all`,
};
