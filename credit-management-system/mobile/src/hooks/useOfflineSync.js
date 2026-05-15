// mobile/src/hooks/useOfflineSync.js
// Monitors network state and triggers sync when back online

import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
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

export const useOfflineSync = () => {
  const { setOnline, syncQueue, queue, loadQueue } = useSyncStore();

  useEffect(() => {
    loadQueue();

    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable;
      setOnline(online);

      if (online && queue.length > 0) {
        Toast.show({
          type: 'info',
          text1: 'Back online',
          text2: `Syncing ${queue.length} offline operation(s)...`,
        });
        syncQueue(processItem);
      }
    });

    return () => unsubscribe();
  }, []);
};
