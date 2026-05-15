// mobile/src/api/report.api.js
// Report and dashboard API service

import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const reportApi = {
  getDashboard: () => api.get(ENDPOINTS.DASHBOARD),
  getOutstanding: () => api.get(ENDPOINTS.OUTSTANDING),
  getAging: () => api.get(ENDPOINTS.AGING),
  getPaymentTrend: () => api.get(ENDPOINTS.PAYMENT_TREND),
  getKPIs: () => api.get(ENDPOINTS.KPIS),
};
