// mobile/src/api/customer.api.js
// Customer API service

import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const customerApi = {
  getAll: (params) => api.get(ENDPOINTS.CUSTOMERS, { params }),
  getById: (id) => api.get(ENDPOINTS.CUSTOMER(id)),
  create: (data) => api.post(ENDPOINTS.CUSTOMERS, data),
  update: (id, data) => api.put(ENDPOINTS.CUSTOMER(id), data),
  deactivate: (id) => api.delete(ENDPOINTS.CUSTOMER(id)),
  updateCreditLimit: (id, data) => api.patch(ENDPOINTS.CUSTOMER_CREDIT_LIMIT(id), data),
  refreshRisk: (id) => api.post(ENDPOINTS.CUSTOMER_RISK(id)),
};
