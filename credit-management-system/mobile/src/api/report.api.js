// mobile/src/api/report.api.js
import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const reportApi = {
  getOutstanding: () => api.get(ENDPOINTS.OUTSTANDING),
  getAging: () => api.get(ENDPOINTS.AGING),
  getPaymentTrend: (months = 6) => api.get(ENDPOINTS.PAYMENT_TREND, { params: { months } }),
  getKPIs: () => api.get(ENDPOINTS.KPIS),
  getDashboard: () => api.get(ENDPOINTS.DASHBOARD),
};
