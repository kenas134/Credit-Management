// mobile/src/api/payment.api.js
import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const paymentApi = {
  recordPayment: (data) => api.post(ENDPOINTS.PAYMENTS, data),
  bulkPayment: (data) => api.post(ENDPOINTS.BULK_PAYMENT, data),
  getHistory: (customerId, params) => api.get(ENDPOINTS.PAYMENT_HISTORY(customerId), { params }),
};
