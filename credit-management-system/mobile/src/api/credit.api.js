// mobile/src/api/credit.api.js
import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const creditApi = {
  getLedger: (customerId, params) => api.get(ENDPOINTS.LEDGER(customerId), { params }),
  getAccountSummary: (customerId) => api.get(ENDPOINTS.ACCOUNT_SUMMARY(customerId)),
  createCredit: (data) => api.post(ENDPOINTS.CREDIT, data),
  voidTransaction: (txId, reason) => api.patch(ENDPOINTS.VOID_TRANSACTION(txId), { reason }),
  updateCreditLimit: (customerId, creditLimit) =>
    api.patch(`/api/v1/credit/${customerId}/limit`, { creditLimit }),
};
