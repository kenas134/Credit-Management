// src/components/report/AgingBucket.js
// Aging analysis bucket card for the reports screen
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import { formatGHS } from '../../utils/formatCurrency';

const BUCKET_CONFIG = {
  'current':    { label: 'Current',    color: COLORS.success, emoji: '✅' },
  '1-30':       { label: '1-30 days',  color: COLORS.primary, emoji: '🕐' },
  '31-60':      { label: '31-60 days', color: COLORS.warning, emoji: '⚠️' },
  '61-90':      { label: '61-90 days', color: '#f97316',      emoji: '🔶' },
  '90+':        { label: '90+ days',   color: COLORS.danger,  emoji: '🔴' },
};

export default function AgingBucket({ buckets = {} }) {
  const entries = Object.entries(BUCKET_CONFIG);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aging Analysis</Text>
      {entries.map(([key, cfg]) => {
        const data = buckets[key] || { count: 0, amount: 0 };
        const hasData = data.count > 0;

        return (
          <View key={key} style={styles.row}>
            <Text style={styles.emoji}>{cfg.emoji}</Text>
            <View style={styles.info}>
              <Text style={styles.label}>{cfg.label}</Text>
              <Text style={styles.count}>{data.count} account{data.count !== 1 ? 's' : ''}</Text>
            </View>
            <Text style={[styles.amount, { color: hasData ? cfg.color : COLORS.textMuted }]}>
              {formatGHS(data.amount || 0)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  emoji: {
    fontSize: 18,
    width: 28,
    marginRight: 10,
  },
  info: { flex: 1 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  count: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
