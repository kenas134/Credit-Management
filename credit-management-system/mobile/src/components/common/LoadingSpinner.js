// src/components/common/LoadingSpinner.js
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function LoadingSpinner({ message = 'Loading...', size = 'large', fullScreen = false }) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
