// src/components/common/StatCard.js
// A KPI/metric card used in dashboard and reports
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function StatCard({ label, value, sub, color, emoji, style }) {
  return (
    <View style={[styles.card, style]}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.value, color && { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value ?? '—'}
      </Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
      {sub && <Text style={styles.sub} numberOfLines={1}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  sub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
