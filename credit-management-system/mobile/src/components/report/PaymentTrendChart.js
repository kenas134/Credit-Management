// src/components/report/PaymentTrendChart.js
// Simple bar chart for monthly payment trends
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import COLORS from '../../constants/colors';
import { formatGHS } from '../../utils/formatCurrency';

export default function PaymentTrendChart({ data = [] }) {
  if (!data.length) return null;

  const max = Math.max(...data.map(d => d.amount || 0), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Trend</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chart}>
          {data.map((item, idx) => {
            const pct = (item.amount || 0) / max;
            const barHeight = Math.max(pct * 100, 4);

            return (
              <View key={idx} style={styles.barWrap}>
                <Text style={styles.barValue} numberOfLines={1}>
                  {item.amount > 0 ? formatGHS(item.amount, false) : ''}
                </Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: pct > 0.7 ? COLORS.success : COLORS.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel} numberOfLines={1}>{item.month}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 8,
    paddingBottom: 4,
  },
  barWrap: {
    alignItems: 'center',
    width: 48,
  },
  barValue: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginBottom: 4,
    width: 48,
    textAlign: 'center',
  },
  barContainer: {
    height: 100,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 28,
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 6,
    width: 48,
    textAlign: 'center',
  },
});
