// mobile/src/store/sync.store.js
// Offline sync queue using Zustand + AsyncStorage

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = 'offline_sync_queue';

const useSyncStore = create((set, get) => ({
  queue: [],
  isSyncing: false,
  isOnline: true,

  setOnline: (status) => set({ isOnline: status }),

  /**
   * Load queue from storage on startup
   */
  loadQueue: async () => {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (raw) set({ queue: JSON.parse(raw) });
  },

  /**
   * Add an operation to the offline queue
   */
  enqueue: async (operation) => {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...operation,
      createdAt: new Date().toISOString(),
      retries: 0,
    };
    const queue = [...get().queue, item];
    set({ queue });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return item;
  },

  /**
   * Remove a synced item from the queue
   */
  dequeue: async (id) => {
    const queue = get().queue.filter((item) => item.id !== id);
    set({ queue });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  /**
   * Process and sync the queue when back online
   */
  syncQueue: async (apiCallback) => {
    const { queue, isSyncing } = get();
    if (isSyncing || queue.length === 0) return;

    set({ isSyncing: true });
    for (const item of queue) {
      try {
        await apiCallback(item);
        await get().dequeue(item.id);
      } catch (e) {
        // Increment retry count
        const updated = get().queue.map((q) =>
          q.id === item.id ? { ...q, retries: q.retries + 1, error: e.message } : q
        );
        set({ queue: updated });
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
      }
    }
    set({ isSyncing: false });
  },

  clearQueue: async () => {
    set({ queue: [] });
    await AsyncStorage.removeItem(QUEUE_KEY);
  },
}));

export default useSyncStore;
