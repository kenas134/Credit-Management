// mobile/app/(tabs)/reports.js
// Reports tab — outstanding, aging, KPIs

import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useOutstanding, useAging, useKPIs } from '../../src/hooks/useReports';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../src/constants/colors';

const ETB = (val) => `ETB ${parseFloat(val || 0).toFixed(2)}`;

function AgingRow({ label, count, amount, color }) {
  return (
    <View style={styles.agingRow}>
      <View style={[styles.agingDot, { backgroundColor: color }]} />
      <Text style={styles.agingLabel}>{label}</Text>
      <View style={styles.agingRight}>
        <Text style={[styles.agingAmount, { color }]}>{ETB(amount)}</Text>
        <Text style={styles.agingCount}>{count} customers</Text>
      </View>
    </View>
  );
}

function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <View style={styles.statHeader}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
}

export default function ReportsScreen() {
  const { data: outstanding, isLoading: loadingOutstanding, refetch, isRefetching } = useOutstanding();
  const { data: aging, isLoading: loadingAging } = useAging();
  const { data: kpis, isLoading: loadingKPIs } = useKPIs();

  const isLoading = loadingOutstanding || loadingAging || loadingKPIs;

  const agingData = aging?.data || {};
  const kpiData   = kpis?.data  || {};

  // Backend returns { customers: [...], totalOutstanding: N }
  const outstandingData    = outstanding?.data || {};
  const outstandingList    = Array.isArray(outstandingData?.customers)
    ? outstandingData.customers
    : Array.isArray(outstandingData)
      ? outstandingData
      : [];
  const totalOutstanding   = outstandingData?.totalOutstanding || 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <Text style={styles.subtitle}>Full business performance</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* KPI Stats */}
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              title="Collection Rate" value={`${kpiData.collectionRate || 0}%`}
              color={COLORS.success} subtitle="This month" icon="trending-up" 
            />
            <StatCard 
              title="Avg. Risk" value={kpiData.avgRiskScore || '—'}
              color={COLORS.warning} subtitle="Portfolio" icon="shield-checkmark" 
            />
            <StatCard 
              title="Customers" value={kpiData.totalCustomers || 0}
              color={COLORS.primary} subtitle="Active" icon="people" 
            />
            <StatCard 
              title="Write-offs" value={ETB(kpiData.writtenOff || 0)}
              color={COLORS.danger} subtitle="Total" icon="trash-outline" 
            />
          </View>

          {/* Total outstanding banner */}
          <View style={styles.totalBanner}>
            <View>
              <Text style={styles.totalLabel}>Total Portfolio Balance</Text>
              <Text style={styles.totalValue}>{ETB(totalOutstanding)}</Text>
            </View>
            <View style={styles.totalIconWrap}>
              <Ionicons name="wallet" size={32} color={COLORS.danger} />
            </View>
          </View>

          {/* Aging Analysis */}
          <Text style={styles.sectionTitle}>Aging Analysis</Text>
          <View style={styles.agingCard}>
            <AgingRow label="Current (0–30 days)" count={agingData.current?.count || 0}
              amount={agingData.current?.total} color={COLORS.success} />
            <AgingRow label="30–60 days" count={agingData.days30?.count || 0}
              amount={agingData.days30?.total} color={COLORS.warning} />
            <AgingRow label="60–90 days" count={agingData.days60?.count || 0}
              amount={agingData.days60?.total} color={COLORS.warningDark} />
            <AgingRow label="90+ days (Critical)" count={agingData.days90?.count || 0}
              amount={agingData.days90?.total} color={COLORS.danger} />
          </View>

          {/* Outstanding Balances */}
          <Text style={styles.sectionTitle}>Top Outstanding</Text>
          {outstandingList.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="checkmark-done-circle-outline" size={56} color={COLORS.success} />
              <Text style={styles.emptyText}>No outstanding balances!</Text>
            </View>
          ) : (
            outstandingList.map((c) => (
              <View key={c.id} style={styles.outstandingRow}>
                <View style={styles.outstandingAvatar}>
                  <Text style={styles.outstandingAvatarText}>{(c.fullName || '?')[0]}</Text>
                </View>
                <View style={styles.outstandingInfo}>
                  <Text style={styles.outstandingName}>{c.fullName}</Text>
                  <Text style={styles.outstandingPhone}>{c.phone}</Text>
                </View>
                <View style={styles.outstandingRight}>
                  <Text style={styles.outstandingBalance}>
                    {ETB(c.creditAccount?.currentBalance || c.creditAccount?.balance || 0)}
                  </Text>
                  <View style={[styles.riskBadge, {
                    backgroundColor: (c.trustScore || 0) < 4 ? COLORS.dangerBg
                      : (c.trustScore || 0) < 7 ? COLORS.warningBg : COLORS.successBg,
                  }]}>
                    <Text style={[styles.riskText, {
                      color: (c.trustScore || 0) < 4 ? COLORS.danger
                        : (c.trustScore || 0) < 7 ? COLORS.warning : COLORS.success,
                    }]}>
                      {c.riskLevel || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  header: { marginBottom: 28 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14, marginTop: 8, marginLeft: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.bgCard,
    borderRadius: 16, padding: 16, borderTopWidth: 3,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800' },
  statTitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8 },
  statSubtitle: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  totalBanner: {
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 20,
    marginBottom: 28, borderWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  totalLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', textTransform: 'uppercase' },
  totalValue: { fontSize: 24, fontWeight: '800', color: COLORS.danger, marginTop: 4 },
  totalIconWrap: { width: 52, height: 52, borderRadius: 14, backgroundColor: COLORS.dangerBg, justifyContent: 'center', alignItems: 'center' },
  agingCard: { backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 18, marginBottom: 28, borderWidth: 1, borderColor: COLORS.border },
  agingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  agingDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  agingLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  agingRight: { alignItems: 'flex-end' },
  agingAmount: { fontSize: 15, fontWeight: '700' },
  agingCount: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  outstandingRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  outstandingAvatar: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  outstandingAvatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  outstandingInfo: { flex: 1 },
  outstandingName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  outstandingPhone: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  outstandingRight: { alignItems: 'flex-end' },
  outstandingBalance: { fontSize: 15, fontWeight: '800', color: COLORS.danger },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 6 },
  riskText: { fontSize: 11, fontWeight: '700' },
  emptyWrap: { alignItems: 'center', padding: 40, gap: 16 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, fontWeight: '500' },
});
