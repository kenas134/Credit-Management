// mobile/src/store/auth.store.js
// Zustand store for authentication state with AsyncStorage persistence

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth.api';

const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'user_data';

const useAuthStore = create((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  isInitialized: false,

  // Restore auth state from AsyncStorage on app boot
  initAuth: async () => {
    try {
      const [token, refreshToken, userJson] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);
      const user = userJson ? JSON.parse(userJson) : null;
      set({ token, refreshToken, user, isInitialized: true });
    } catch {
      set({ isInitialized: true });
    }
  },

  // Called after successful login/register
  setAuth: async ({ token, refreshToken, user }) => {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, token),
      AsyncStorage.setItem(REFRESH_KEY, refreshToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
    ]);
    set({ token, refreshToken, user });
  },

  // Update stored tokens (called by axios refresh interceptor)
  updateTokens: async ({ token, refreshToken }) => {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, token),
      AsyncStorage.setItem(REFRESH_KEY, refreshToken),
    ]);
    set({ token, refreshToken });
  },

  // Full logout
  logout: async () => {
    try {
      await authApi.logout();
    } catch (_) {}
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    set({ token: null, refreshToken: null, user: null });
  },
}));

export default useAuthStore;
