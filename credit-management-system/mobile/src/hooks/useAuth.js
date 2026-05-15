// mobile/src/hooks/useAuth.js
// Auth hook using React Query + Zustand store

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../store/auth.store';
import { authApi } from '../api/auth.api';
import Toast from 'react-native-toast-message';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => Toast.show({ type: 'success', text1: 'Welcome back!' }),
    onError: (err) =>
      Toast.show({ type: 'error', text1: 'Login failed', text2: err.response?.data?.message || 'Check credentials' }),
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => Toast.show({ type: 'success', text1: 'Account created!' }),
    onError: (err) =>
      Toast.show({ type: 'error', text1: 'Registration failed', text2: err.response?.data?.message }),
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      Toast.show({ type: 'success', text1: 'Logged out' });
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
