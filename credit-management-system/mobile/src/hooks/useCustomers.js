// mobile/src/hooks/useCustomers.js
// React Query hooks for customer data

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../api/customer.api';
import Toast from 'react-native-toast-message';

export const CUSTOMERS_KEY = 'customers';

export const useCustomers = (params = {}) => {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, params],
    queryFn: () => customerApi.getAll(params).then((r) => r.data.data),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, id],
    queryFn: () => customerApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      Toast.show({ type: 'success', text1: 'Customer added successfully' });
    },
    onError: (err) =>
      Toast.show({ type: 'error', text1: 'Failed to add customer', text2: err.response?.data?.message }),
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => customerApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      Toast.show({ type: 'success', text1: 'Customer updated' });
    },
    onError: (err) =>
      Toast.show({ type: 'error', text1: 'Update failed', text2: err.response?.data?.message }),
  });
};

export const useDeactivateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => customerApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
      Toast.show({ type: 'success', text1: 'Customer deactivated' });
    },
    onError: (err) =>
      Toast.show({ type: 'error', text1: 'Cannot deactivate', text2: err.response?.data?.message }),
  });
};
