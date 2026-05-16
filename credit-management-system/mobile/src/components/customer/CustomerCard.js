// src/components/customer/CustomerCard.js
// Customer list item card
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import Badge from '../common/Badge';
import { formatGHS } from '../../utils/formatCurrency';

export default function CustomerCard({ customer }) {
  const router = useRouter();

  const initials = customer.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const balanceColor =
    customer.creditAccount?.currentBalance > 0
      ? COLORS.danger
      : COLORS.success;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/customer/${customer.id}`)}
      activeOpacity={0.85}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>{customer.name}</Text>
          <Badge
            label={customer.riskScore || 'LOW'}
            preset={customer.riskScore || 'LOW'}
          />
        </View>
        <Text style={styles.phone}>{customer.phone}</Text>
        <View style={styles.row}>
          <Text style={styles.balanceLabel}>Balance: </Text>
          <Text style={[styles.balance, { color: balanceColor }]}>
            {formatGHS(customer.creditAccount?.currentBalance || 0)}
          </Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryBg || 'rgba(99,102,241,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  initials: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  info: { flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  phone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  balance: {
    fontSize: 13,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 22,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
});
