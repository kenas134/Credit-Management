// mobile/src/hooks/usePayments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/payment.api';
import Toast from 'react-native-toast-message';

export const PAYMENTS_KEY = 'payments';

export const usePaymentHistory = (customerId) =>
  useQuery({
    queryKey: [PAYMENTS_KEY, customerId],
    queryFn: () => paymentApi.getHistory(customerId).then((r) => r.data.data),
    enabled: !!customerId,
  });

export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApi.recordPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger'] });
      queryClient.invalidateQueries({ queryKey: ['accountSummary'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
      Toast.show({ type: 'success', text1: 'Payment recorded successfully!' });
    },
    onError: (err) =>
      Toast.show({ type: 'error', text1: 'Payment failed', text2: err.response?.data?.message }),
  });
};

export const useBulkPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApi.bulkPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      Toast.show({ type: 'success', text1: 'Bulk payment applied!' });
    },
    onError: (err) =>
      Toast.show({ type: 'error', text1: 'Bulk payment failed', text2: err.response?.data?.message }),
  });
};
