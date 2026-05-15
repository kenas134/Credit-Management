// mobile/src/hooks/usePayments.js
// React Query hooks for payments

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/payment.api';
import Toast from 'react-native-toast-message';

export const PAYMENTS_KEY = 'payments';

export const usePaymentHistory = (params = {}) =>
  useQuery({
    queryKey: [PAYMENTS_KEY, params],
    queryFn: () => paymentApi.getHistory(params).then((r) => r.data),
  });

export const useRecordPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentApi.recordPayment(data).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['ledger', vars.customerId] });
      qc.invalidateQueries({ queryKey: ['customers', vars.customerId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
      Toast.show({ type: 'success', text1: '💰 Payment recorded!', text2: `GH₵${vars.amount} received` });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Payment failed', text2: err?.response?.data?.message || 'Please try again' });
    },
  });
};

export const useBulkPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => paymentApi.bulkPayment(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ledger'] });
      qc.invalidateQueries({ queryKey: ['customers'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      Toast.show({ type: 'success', text1: '✅ Bulk payment processed' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Bulk payment failed', text2: err?.response?.data?.message });
    },
  });
};
