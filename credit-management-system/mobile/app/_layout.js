// mobile/app/_layout.js
// Root layout — providers, fonts, and global setup

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import useAuthStore from '../src/store/auth.store';
import useOfflineSync from '../src/hooks/useOfflineSync';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 2,
    },
  },
});

function RootLayoutInner() {
  useOfflineSync();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="customer/[id]" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="customer/add" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="payment/record" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="notification/index" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="report/index" options={{ presentation: 'card', headerShown: false }} />
      <Stack.Screen name="profile/index" options={{ presentation: 'card', headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <RootLayoutInner />
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
