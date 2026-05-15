// mobile/app/(tabs)/customers.js
// Customers list tab

import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomers } from '../../src/hooks/useCustomers';
import COLORS from '../../src/constants/colors';

function CustomerCard({ item, onPress }) {
  const balance = parseFloat(item.creditAccount?.balance || 0);
  const isOverdue = item.creditAccount?.status === 'OVERDUE';
  const isPaid = balance <= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.avatar, { backgroundColor: isOverdue ? COLORS.danger : COLORS.primary }]}>
        <Text style={styles.avatarText}>{(item.fullName || '?')[0].toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
        <View style={styles.tags}>
          <View style={[styles.statusBadge,
            { backgroundColor: isOverdue ? COLORS.dangerBg : isPaid ? COLORS.successBg : COLORS.warningBg }]}>
            <Text style={[styles.statusText,
              { color: isOverdue ? COLORS.danger : isPaid ? COLORS.success : COLORS.warning }]}>
              {isOverdue ? 'Overdue' : isPaid ? 'Paid' : 'Active'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.balanceSection}>
        <Text style={[styles.balance, { color: balance > 0 ? COLORS.danger : COLORS.success }]}>
          GH₵{balance.toFixed(2)}
        </Text>
        <Text style={styles.balanceLabel}>balance</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CustomersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isRefetching } = useCustomers({ search, page, limit: 20 });

  const customers = data?.data?.customers || [];
  const total = data?.data?.total || 0;

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>👥</Text>
      <Text style={styles.emptyTitle}>No customers yet</Text>
      <Text style={styles.emptySubtitle}>Add your first customer to start tracking credit</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Customers</Text>
          <Text style={styles.subtitle}>{total} total</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/customer/add')}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={(t) => { setSearch(t); setPage(1); }}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerCard item={item} onPress={() => router.push(`/customer/${item.id}`)} />
          )}
          ListEmptyComponent={renderEmpty}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.border }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 56 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, marginHorizontal: 20, borderRadius: 12,
    paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: COLORS.textPrimary, paddingVertical: 12, fontSize: 14 },
  clearIcon: { fontSize: 14, color: COLORS.textMuted, padding: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 14,
    padding: 14, marginVertical: 5,
    borderWidth: 1, borderColor: COLORS.border,
  },
  avatar: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  phone: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  tags: { flexDirection: 'row', marginTop: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  balanceSection: { alignItems: 'flex-end' },
  balance: { fontSize: 16, fontWeight: '800' },
  balanceLabel: { fontSize: 11, color: COLORS.textMuted },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 32 },
});
