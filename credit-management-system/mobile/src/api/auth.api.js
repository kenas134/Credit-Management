// mobile/src/api/auth.api.js
import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const authApi = {
  register: (data) => api.post(ENDPOINTS.REGISTER, data),
  login: (data) => api.post(ENDPOINTS.LOGIN, data),
  logout: () => api.post(ENDPOINTS.LOGOUT),
  refreshToken: (refreshToken) => api.post(ENDPOINTS.REFRESH, { refreshToken }),
  getMe: () => api.get(ENDPOINTS.ME),
  changePassword: (data) => api.put(ENDPOINTS.CHANGE_PASSWORD, data),
};
