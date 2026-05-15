// mobile/src/hooks/useCustomers.js
// React Query hooks for customer data

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customer.api';
import Toast from 'react-native-toast-message';

export const CUSTOMERS_KEY = 'customers';

export const useCustomers = (params = {}) =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, params],
    queryFn: () => customerApi.getAll(params).then((r) => r.data),
  });

export const useCustomer = (id) =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, id],
    queryFn: () => customerApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => customerApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      Toast.show({ type: 'success', text1: '✅ Customer added successfully' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Failed to add customer', text2: err?.response?.data?.message });
    },
  });
};

export const useUpdateCustomer = (id) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => customerApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      Toast.show({ type: 'success', text1: 'Customer updated' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Update failed', text2: err?.response?.data?.message });
    },
  });
};

export const useRefreshRisk = (id) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => customerApi.refreshRisk(id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY, id] });
      Toast.show({ type: 'success', text1: 'Risk score updated' });
    },
  });
};
