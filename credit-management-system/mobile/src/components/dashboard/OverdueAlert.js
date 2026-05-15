// src/components/dashboard/OverdueAlert.js
// Alert banner + list for overdue accounts on the dashboard
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import { formatGHS } from '../../utils/formatCurrency';

function OverdueRow({ item }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/customer/${item.customerId}`)}
      activeOpacity={0.8}
    >
      <View style={styles.dot} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>{item.customerName}</Text>
        <Text style={styles.rowDays}>{item.daysOverdue}d overdue</Text>
      </View>
      <Text style={styles.rowBalance}>{formatGHS(item.balance)}</Text>
    </TouchableOpacity>
  );
}

export default function OverdueAlert({ items = [] }) {
  if (!items.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⚠️</Text>
        <Text style={styles.headerText}>
          {items.length} Overdue Account{items.length > 1 ? 's' : ''}
        </Text>
      </View>
      <FlatList
        data={items.slice(0, 5)}
        keyExtractor={item => String(item.customerId)}
        renderItem={({ item }) => <OverdueRow item={item} />}
        scrollEnabled={false}
      />
      {items.length > 5 && (
        <Text style={styles.more}>+{items.length - 5} more</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    padding: 14,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerIcon: { fontSize: 16, marginRight: 6 },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239,68,68,0.12)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
    marginRight: 10,
  },
  rowInfo: { flex: 1 },
  rowName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  rowDays: {
    fontSize: 11,
    color: COLORS.danger,
  },
  rowBalance: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
  },
  more: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
