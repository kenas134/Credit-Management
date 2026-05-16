// src/components/customer/BalanceCard.js
// Large balance display card on the customer detail screen
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import { formatGHS } from '../../utils/formatCurrency';

export default function BalanceCard({ account, onIssueCredit, onRecordPayment }) {
  const balance = account?.currentBalance ?? 0;
  const creditLimit = account?.creditLimit ?? 0;
  const utilization = creditLimit > 0 ? Math.min((balance / creditLimit) * 100, 100) : 0;

  const barColor =
    utilization > 80 ? COLORS.danger :
    utilization > 50 ? COLORS.warning :
    COLORS.success;

  return (
    <View style={styles.card}>
      {/* Balance */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.balanceLabel}>Outstanding Balance</Text>
          <Text style={[styles.balance, { color: balance > 0 ? COLORS.danger : COLORS.success }]}>
            {formatGHS(balance)}
          </Text>
        </View>
        <View style={styles.limitBox}>
          <Text style={styles.limitLabel}>Credit Limit</Text>
          <Text style={styles.limitValue}>{formatGHS(creditLimit)}</Text>
        </View>
      </View>

      {/* Utilization bar */}
      <View style={styles.barWrap}>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${utilization}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.barText}>{utilization.toFixed(0)}% utilized</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.creditBtn]} onPress={onIssueCredit}>
          <Text style={styles.btnText}>+ Issue Credit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.payBtn]} onPress={onRecordPayment}>
          <Text style={styles.btnText}>✓ Record Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  balance: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  limitBox: {
    alignItems: 'flex-end',
  },
  limitLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  limitValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  barWrap: { marginBottom: 16 },
  barBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  barText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  creditBtn: { backgroundColor: COLORS.danger },
  payBtn: { backgroundColor: COLORS.success },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});
