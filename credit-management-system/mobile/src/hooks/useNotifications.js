// mobile/src/hooks/useNotifications.js
// React Query hooks for notifications

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import Toast from 'react-native-toast-message';

export const NOTIF_KEY = 'notifications';

export const useNotifications = (params = {}) =>
  useQuery({
    queryKey: [NOTIF_KEY, params],
    queryFn: () => notificationApi.getAll(params).then((r) => r.data),
  });

export const useMarkAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationApi.markAsRead(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [NOTIF_KEY] }),
  });
};

export const useMarkAllAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead().then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTIF_KEY] });
      Toast.show({ type: 'success', text1: 'All notifications marked as read' });
    },
  });
};
