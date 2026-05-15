// src/components/dashboard/RecentTransactions.js
// Recent activity feed on the dashboard
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import { formatGHS } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

function TxRow({ item }) {
  const router = useRouter();
  const isCredit = item.type === 'CREDIT';

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/customer/${item.customerId}`)}
      activeOpacity={0.8}
    >
      <View style={[styles.typeIcon, { backgroundColor: isCredit ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)' }]}>
        <Text style={styles.typeEmoji}>{isCredit ? '💳' : '💰'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.customerName}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={[styles.amount, { color: isCredit ? COLORS.danger : COLORS.success }]}>
        {isCredit ? '+' : '-'}{formatGHS(item.amount)}
      </Text>
    </TouchableOpacity>
  );
}

export default function RecentTransactions({ transactions = [], onSeeAll }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        )}
      </View>

      {transactions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <TxRow item={item} />}
          scrollEnabled={false}
        />
      )}
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
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeEmoji: { fontSize: 17 },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
