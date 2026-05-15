// mobile/src/api/customer.api.js
import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const customerApi = {
  getAll: (params) => api.get(ENDPOINTS.CUSTOMERS, { params }),
  getById: (id) => api.get(ENDPOINTS.CUSTOMER(id)),
  create: (data) => api.post(ENDPOINTS.CUSTOMERS, data),
  update: (id, data) => api.put(ENDPOINTS.CUSTOMER(id), data),
  deactivate: (id) => api.delete(ENDPOINTS.CUSTOMER(id)),
  updateCreditLimit: (id, creditLimit) => api.patch(ENDPOINTS.CUSTOMER_LIMIT(id), { creditLimit }),
  refreshRisk: (id) => api.post(ENDPOINTS.CUSTOMER_RISK(id)),
};
