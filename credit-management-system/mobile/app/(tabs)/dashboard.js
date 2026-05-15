// mobile/app/(tabs)/dashboard.js
// Dashboard tab — KPIs, recent transactions, overdue alerts

import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDashboard } from '../../src/hooks/useReports';
import useAuthStore from '../../src/store/auth.store';
import COLORS from '../../src/constants/colors';

function KPICard({ label, value, emoji, color, onPress }) {
  return (
    <TouchableOpacity style={[styles.kpiCard, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.kpiEmoji}>{emoji}</Text>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function SectionHeader({ title, onSeeAll }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function TransactionRow({ item }) {
  const isCredit = item.type === 'CREDIT';
  return (
    <View style={styles.txRow}>
      <View style={[styles.txIcon, { backgroundColor: isCredit ? COLORS.dangerBg : COLORS.successBg }]}>
        <Text>{isCredit ? '📤' : '📥'}</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txName}>{item.customer?.fullName || 'Unknown'}</Text>
        <Text style={styles.txDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={[styles.txAmount, { color: isCredit ? COLORS.danger : COLORS.success }]}>
        {isCredit ? '-' : '+'}GH₵{parseFloat(item.amount).toFixed(2)}
      </Text>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, isLoading, refetch, isRefetching } = useDashboard();

  const kpis = data?.data;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.shopName}>{user?.shop?.name || 'Your Shop'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/notification/index')} style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* KPIs */}
      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.kpiGrid}>
            <KPICard label="Total Owed" value={`GH₵${parseFloat(kpis?.totalOutstanding || 0).toFixed(2)}`}
              emoji="💰" color={COLORS.danger} onPress={() => router.push('/report/index')} />
            <KPICard label="Active Credits" value={kpis?.activeCredits || 0}
              emoji="📋" color={COLORS.primary} onPress={() => router.push('/(tabs)/customers')} />
            <KPICard label="Overdue" value={kpis?.overdueCount || 0}
              emoji="⚠️" color={COLORS.warning} onPress={() => router.push('/report/index')} />
            <KPICard label="Paid Today" value={`GH₵${parseFloat(kpis?.paidToday || 0).toFixed(2)}`}
              emoji="✅" color={COLORS.success} />
          </View>

          {/* Overdue Alerts */}
          {kpis?.overdueCustomers?.length > 0 && (
            <>
              <SectionHeader title="🚨 Overdue Customers" onSeeAll={() => router.push('/report/index')} />
              {kpis.overdueCustomers.slice(0, 3).map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.overdueCard}
                  onPress={() => router.push(`/customer/${c.id}`)}
                >
                  <View style={styles.overdueAvatar}>
                    <Text style={styles.overdueAvatarText}>{c.fullName[0]}</Text>
                  </View>
                  <View style={styles.overdueInfo}>
                    <Text style={styles.overdueName}>{c.fullName}</Text>
                    <Text style={styles.overduePhone}>{c.phone}</Text>
                  </View>
                  <Text style={styles.overdueAmount}>GH₵{parseFloat(c.creditAccount?.balance || 0).toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Recent Transactions */}
          <SectionHeader title="Recent Transactions" onSeeAll={() => router.push('/(tabs)/customers')} />
          {kpis?.recentTransactions?.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            kpis?.recentTransactions?.slice(0, 8).map((tx) => <TransactionRow key={tx.id} item={tx} />)
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 14, color: COLORS.textSecondary },
  shopName: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginTop: 2 },
  notifBtn: { width: 44, height: 44, backgroundColor: COLORS.bgCard, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  notifIcon: { fontSize: 20 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  kpiCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.bgCard,
    borderRadius: 16, padding: 16, borderLeftWidth: 3,
    borderWidth: 1, borderColor: COLORS.border,
  },
  kpiEmoji: { fontSize: 24, marginBottom: 8 },
  kpiValue: { fontSize: 20, fontWeight: '800' },
  kpiLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  overdueCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.dangerBg, borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.dangerBorder,
  },
  overdueAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.danger, justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  overdueAvatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  overdueInfo: { flex: 1 },
  overdueName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  overduePhone: { fontSize: 12, color: COLORS.textSecondary },
  overdueAmount: { fontSize: 15, fontWeight: '800', color: COLORS.danger },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  txIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  txDate: { fontSize: 12, color: COLORS.textMuted },
  txAmount: { fontSize: 14, fontWeight: '800' },
  empty: { alignItems: 'center', padding: 32 },
  emptyText: { color: COLORS.textMuted, fontSize: 14 },
});
