// mobile/src/api/credit.api.js
// Credit API service

import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const creditApi = {
  getLedger: (customerId, params) => api.get(ENDPOINTS.LEDGER(customerId), { params }),
  getAccountSummary: (customerId) => api.get(ENDPOINTS.ACCOUNT_SUMMARY(customerId)),
  createCredit: (data) => api.post(ENDPOINTS.CREDITS, data),
  voidTransaction: (txId) => api.patch(ENDPOINTS.VOID_TRANSACTION(txId)),
  updateCreditLimit: (customerId, data) => api.patch(ENDPOINTS.CUSTOMER_CREDIT_LIMIT(customerId), data),
};
