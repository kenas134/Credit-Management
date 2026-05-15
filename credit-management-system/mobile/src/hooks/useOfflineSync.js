// mobile/src/hooks/useOfflineSync.js
// Monitors network state and triggers sync when back online

import { useEffect } from 'react';
import useSyncStore from '../store/sync.store';
import { creditApi } from '../api/credit.api';
import { paymentApi } from '../api/payment.api';
import Toast from 'react-native-toast-message';

const processItem = async (item) => {
  switch (item.type) {
    case 'CREATE_CREDIT':
      return creditApi.createCredit(item.payload);
    case 'RECORD_PAYMENT':
      return paymentApi.recordPayment(item.payload);
    default:
      throw new Error(`Unknown sync operation: ${item.type}`);
  }
};

// Default export so _layout.js can do: import useOfflineSync from '...'
export default function useOfflineSync() {
  const { setOnline, syncQueue, queue, loadQueue } = useSyncStore();

  useEffect(() => {
    loadQueue();

    // Use fetch-based connectivity check (no NetInfo needed)
    let interval;
    const checkConnectivity = async () => {
      try {
        await fetch('https://www.google.com/generate_204', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        setOnline(true);
        if (queue.length > 0) {
          Toast.show({
            type: 'info',
            text1: 'Back online',
            text2: `Syncing ${queue.length} offline operation(s)...`,
          });
          syncQueue(processItem);
        }
      } catch {
        setOnline(false);
      }
    };

    // Check every 30 seconds
    interval = setInterval(checkConnectivity, 30000);
    checkConnectivity();

    return () => clearInterval(interval);
  }, []);
}
