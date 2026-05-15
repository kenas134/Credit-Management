// mobile/src/api/auth.api.js
// Auth API service

import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const authApi = {
  register: (data) => api.post(ENDPOINTS.REGISTER, data),
  login: (data) => api.post(ENDPOINTS.LOGIN, data),
  logout: () => api.post(ENDPOINTS.LOGOUT),
  refresh: (data) => api.post(ENDPOINTS.REFRESH, data),
  getMe: () => api.get(ENDPOINTS.ME),
  changePassword: (data) => api.patch(ENDPOINTS.CHANGE_PASSWORD, data),
};
