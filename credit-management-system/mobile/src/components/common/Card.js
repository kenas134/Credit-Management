// src/components/common/Card.js
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function Card({ children, onPress, style, padding = 16 }) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { padding }, style]}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});
