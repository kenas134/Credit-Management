// mobile/app/(tabs)/customers.js
// Customers list tab — listing, search, quick add

import { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomers } from '../../src/hooks/useCustomers';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../src/constants/colors';

function CustomerCard({ item, onPress }) {
  const balance = parseFloat(item.creditAccount?.currentBalance || 0);
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
          ETB {balance.toFixed(2)}
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
      <View style={styles.emptyIconWrap}>
        <Ionicons name="people-outline" size={64} color={COLORS.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No customers yet</Text>
      <Text style={styles.emptySubtitle}>Add your first customer to start tracking credit and payments.</Text>
      <TouchableOpacity style={styles.emptyAddBtn} onPress={() => router.push('/customer/add')}>
        <Text style={styles.emptyAddBtnText}>Add First Customer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Customers</Text>
          <Text style={styles.subtitle}>{total} total records</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/customer/add')}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name or phone..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={(t) => { setSearch(t); setPage(1); }}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
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
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 56, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  addBtn: { 
    backgroundColor: COLORS.primary, width: 44, height: 44, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 8
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, marginHorizontal: 20, borderRadius: 16,
    paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: COLORS.textPrimary, paddingVertical: 14, fontSize: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 18,
    padding: 14, marginVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  avatar: { width: 48, height: 48, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  phone: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  tags: { flexDirection: 'row', marginTop: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  balanceSection: { alignItems: 'flex-end' },
  balance: { fontSize: 16, fontWeight: '800' },
  balanceLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIconWrap: { width: 100, height: 100, borderRadius: 30, backgroundColor: COLORS.bgCard, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20 },
  emptyAddBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, marginTop: 24 },
  emptyAddBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
