// mobile/src/hooks/useShop.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopApi } from '../api/shop.api';
import Toast from 'react-native-toast-message';

export const SHOP_KEY = 'shop';

export const useShop = () =>
  useQuery({
    queryKey: [SHOP_KEY],
    queryFn: () => shopApi.get().then((r) => r.data),
  });

export const useUpdateShop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => shopApi.update(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SHOP_KEY] });
      Toast.show({ type: 'success', text1: 'Shop updated successfully' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Failed to update shop', text2: err?.response?.data?.message });
    },
  });
};
