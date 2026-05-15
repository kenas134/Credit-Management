// src/components/report/OutstandingList.js
// Outstanding balances list for the reports screen
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import Badge from '../common/Badge';
import { formatGHS } from '../../utils/formatCurrency';

function OutstandingRow({ item }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/customer/${item.customerId}`)}
      activeOpacity={0.8}
    >
      <View style={styles.initials}>
        <Text style={styles.initText}>
          {item.customerName?.charAt(0)?.toUpperCase() || '?'}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.customerName}</Text>
        <Text style={styles.daysText}>
          {item.daysOverdue > 0 ? `${item.daysOverdue}d overdue` : 'Current'}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.balance}>{formatGHS(item.balance)}</Text>
        <Badge label={item.riskScore || 'LOW'} preset={item.riskScore || 'LOW'} />
      </View>
    </TouchableOpacity>
  );
}

export default function OutstandingList({ items = [] }) {
  if (!items.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>🎉 All balances are clear!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outstanding Balances</Text>
      <FlatList
        data={items}
        keyExtractor={item => String(item.customerId)}
        renderItem={({ item }) => <OutstandingRow item={item} />}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 30,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  initials: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryBg || 'rgba(99,102,241,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  initText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  daysText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  right: { alignItems: 'flex-end' },
  balance: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: 4,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
