// mobile/src/hooks/useCredits.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditApi } from '../api/credit.api';
import Toast from 'react-native-toast-message';

export const LEDGER_KEY = 'ledger';
export const ACCOUNT_KEY = 'accountSummary';

export const useLedger = (customerId, params = {}) =>
  useQuery({
    queryKey: [LEDGER_KEY, customerId, params],
    queryFn: () => creditApi.getLedger(customerId, params).then((r) => r.data.data),
    enabled: !!customerId,
  });

export const useAccountSummary = (customerId) =>
  useQuery({
    queryKey: [ACCOUNT_KEY, customerId],
    queryFn: () => creditApi.getAccountSummary(customerId).then((r) => r.data.data),
    enabled: !!customerId,
  });

export const useCreateCredit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: creditApi.createCredit,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [LEDGER_KEY, variables.customerId] });
      queryClient.invalidateQueries({ queryKey: [ACCOUNT_KEY, variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      Toast.show({ type: 'success', text1: 'Credit entry recorded' });
    },
    onError: (err) =>
      Toast.show({ type: 'error', text1: 'Failed to record credit', text2: err.response?.data?.message }),
  });
};
