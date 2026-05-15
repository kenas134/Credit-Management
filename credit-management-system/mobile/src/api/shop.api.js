// mobile/src/api/shop.api.js
import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const shopApi = {
  get: () => api.get(ENDPOINTS.SHOP),
  update: (data) => api.put(ENDPOINTS.SHOP, data),
};
