// mobile/src/store/auth.store.js
// Zustand store for authentication state

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth.api';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // true on startup while checking storage

  /**
   * Initialize auth state from AsyncStorage (called on app start)
   */
  initialize: async () => {
    try {
      const [token, userStr] = await AsyncStorage.multiGet(['accessToken', 'user']);
      const accessToken = token[1];
      const user = userStr[1] ? JSON.parse(userStr[1]) : null;

      if (accessToken && user) {
        set({ accessToken, user, isAuthenticated: true });
      }
    } catch (e) {
      // Storage read failed — start fresh
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Login and persist tokens
   */
  login: async (credentials) => {
    const res = await authApi.login(credentials);
    const { accessToken, refreshToken, user } = res.data.data;

    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
      ['user', JSON.stringify(user)],
    ]);

    set({ accessToken, refreshToken, user, isAuthenticated: true });
    return res.data;
  },

  /**
   * Register and persist tokens
   */
  register: async (data) => {
    const res = await authApi.register(data);
    const { accessToken, refreshToken, user } = res.data.data;

    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
      ['user', JSON.stringify(user)],
    ]);

    set({ accessToken, refreshToken, user, isAuthenticated: true });
    return res.data;
  },

  /**
   * Logout and clear storage
   */
  logout: async () => {
    try { await authApi.logout(); } catch (e) { /* ignore */ }
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  /**
   * Update user profile in state and storage
   */
  setUser: async (user) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
