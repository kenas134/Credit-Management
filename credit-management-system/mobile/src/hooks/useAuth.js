// mobile/src/hooks/useAuth.js
// Auth hooks using React Query mutations + Zustand store

import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../store/auth.store';
import { authApi } from '../api/auth.api';
import Toast from 'react-native-toast-message';

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (data) => authApi.register(data).then((r) => r.data),
    onSuccess: (res) => {
      const { accessToken: token, refreshToken, user } = res.data;
      setAuth({ token, refreshToken, user });
      Toast.show({ type: 'success', text1: '🎉 Account created!', text2: `Welcome to CreditManager` });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Registration failed', text2: err?.response?.data?.message || 'Please try again' });
    },
  });
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => authApi.login(data).then((r) => r.data),
    onSuccess: (res) => {
      const { accessToken: token, refreshToken, user } = res.data;
      setAuth({ token, refreshToken, user });
      qc.clear();
      Toast.show({ type: 'success', text1: 'Welcome back! 👋' });
    },
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Login failed', text2: err?.response?.data?.message || 'Invalid credentials' });
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await logout();
      qc.clear();
    },
    onError: () => {
      // Even on error, local state is cleared
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data) => authApi.changePassword(data).then((r) => r.data),
    onError: (err) => {
      Toast.show({ type: 'error', text1: 'Failed', text2: err?.response?.data?.message || 'Could not update password' });
    },
  });
