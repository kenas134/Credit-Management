// mobile/src/hooks/useCredits.js
// React Query hooks for credit accounts and transactions

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditApi } from '../api/credit.api';
import Toast from 'react-native-toast-message';

export const LEDGER_KEY = 'ledger';

export const useLedger = (customerId, params = {}) =>
  useQuery({
    queryKey: [LEDGER_KEY, customerId, params],
    queryFn: () => creditApi.getLedger(customerId, params).then((r) => r.data),
    enabled: !!customerId,
  });

export const useAccountSummary = (customerId) =>
  useQuery({
    queryKey: ['account', customerId],
    queryFn: () => creditApi.getAccountSummary(customerId).then((r) => r.data),
    enabled: !!customerId,
  });

export const useCreateCredit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => creditApi.createCredit(data).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [LEDGER_KEY, vars.customerId] });
      qc.invalidateQueries({ queryKey: ['customers', vars.customerId] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      Toast.show({ type: 'success', text1: '📤 Credit issued successfully' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Credit failed', text2: err?.response?.data?.message });
    },
  });
};

export const useVoidTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionId) => creditApi.voidTransaction(transactionId).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEDGER_KEY] });
      Toast.show({ type: 'success', text1: 'Transaction voided' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Could not void transaction', text2: err?.response?.data?.message });
    },
  });
};
