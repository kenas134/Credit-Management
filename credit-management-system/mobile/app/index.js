// mobile/app/index.js
// Entry redirect — checks auth and routes accordingly

import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../src/store/auth.store';
import COLORS from '../src/constants/colors';

export default function Index() {
  const router = useRouter();
  const { token, isInitialized, initAuth } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initAuth();
    };
    init();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    if (token) {
      router.replace('/(tabs)/dashboard');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isInitialized, token]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
  },
});
