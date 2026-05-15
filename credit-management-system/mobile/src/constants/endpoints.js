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
  CUSTOMER_RISK: (id) => `${BASE}/customers/${id}/risk`,
  CUSTOMER_LIMIT: (id) => `${BASE}/customers/${id}/credit-limit`,

  // Credit
  CREDIT: `${BASE}/credit`,
  LEDGER: (customerId) => `${BASE}/credit/${customerId}/ledger`,
  ACCOUNT_SUMMARY: (customerId) => `${BASE}/credit/${customerId}/summary`,
  VOID_TRANSACTION: (txId) => `${BASE}/credit/${txId}/void`,

  // Payments
  PAYMENTS: `${BASE}/payments`,
  BULK_PAYMENT: `${BASE}/payments/bulk`,
  PAYMENT_HISTORY: (customerId) => `${BASE}/payments/customer/${customerId}`,

  // Reports
  OUTSTANDING: `${BASE}/reports/outstanding`,
  AGING: `${BASE}/reports/aging`,
  PAYMENT_TREND: `${BASE}/reports/payment-trend`,
  KPIS: `${BASE}/reports/kpis`,

  // Dashboard
  DASHBOARD: `${BASE}/dashboard`,

  // Notifications
  NOTIFICATIONS: `${BASE}/notifications`,
  MARK_READ: (id) => `${BASE}/notifications/${id}/read`,
  MARK_ALL_READ: `${BASE}/notifications/read-all`,
};

export default ENDPOINTS;
