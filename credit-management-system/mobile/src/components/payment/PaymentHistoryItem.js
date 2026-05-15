// src/components/payment/PaymentHistoryItem.js
// Single row in a payment history list
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import { formatGHS } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function PaymentHistoryItem({ payment }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>💰</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.amount}>{formatGHS(payment.amount)}</Text>
        <Text style={styles.sub}>
          {payment.customerName || '—'} · {formatDate(payment.createdAt)}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>PAID</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(16,185,129,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 18 },
  info: { flex: 1 },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.success,
  },
  sub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(16,185,129,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
});
