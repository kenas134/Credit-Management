// mobile/src/api/notification.api.js
// Notification API service

import api from './axios';
import { ENDPOINTS } from '../constants/endpoints';

export const notificationApi = {
  getAll: (params) => api.get(ENDPOINTS.NOTIFICATIONS, { params }),
  markAsRead: (id) => api.patch(ENDPOINTS.NOTIFICATION_READ(id)),
  markAllAsRead: () => api.patch(ENDPOINTS.NOTIFICATIONS_READ_ALL),
};
