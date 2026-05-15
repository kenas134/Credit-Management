// src/components/customer/LedgerItem.js
// Single transaction row in the ledger list
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import Badge from '../common/Badge';
import { formatGHS } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

export default function LedgerItem({ transaction }) {
  const isCredit = transaction.type === 'CREDIT';
  const amountColor = isCredit ? COLORS.danger : COLORS.success;
  const amountPrefix = isCredit ? '+' : '-';

  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{isCredit ? '💳' : '💰'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.desc} numberOfLines={1}>
          {transaction.description || (isCredit ? 'Credit Issued' : 'Payment Received')}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}{formatGHS(transaction.amount)}
        </Text>
        <Badge
          label={transaction.type}
          preset={transaction.type}
          style={styles.badge}
        />
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 18 },
  info: { flex: 1 },
  desc: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  date: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  right: { alignItems: 'flex-end' },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  badge: { marginTop: 2 },
});
