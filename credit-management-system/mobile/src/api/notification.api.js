// mobile/src/api/notification.api.js
import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const notificationApi = {
  getAll: (params) => api.get(ENDPOINTS.NOTIFICATIONS, { params }),
  markAsRead: (id) => api.patch(ENDPOINTS.MARK_READ(id)),
  markAllAsRead: () => api.patch(ENDPOINTS.MARK_ALL_READ),
};
