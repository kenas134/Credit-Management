// mobile/app/(tabs)/reports.js
// Reports tab — outstanding, aging, KPIs, payment trends

import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, RefreshControl, TouchableOpacity,
} from 'react-native';
import { useOutstanding, useAging, useKPIs } from '../../src/hooks/useReports';
import COLORS from '../../src/constants/colors';

function AgingRow({ label, count, amount, color }) {
  return (
    <View style={styles.agingRow}>
      <View style={[styles.agingDot, { backgroundColor: color }]} />
      <Text style={styles.agingLabel}>{label}</Text>
      <View style={styles.agingRight}>
        <Text style={[styles.agingAmount, { color }]}>GH₵{parseFloat(amount || 0).toFixed(2)}</Text>
        <Text style={styles.agingCount}>{count} customers</Text>
      </View>
    </View>
  );
}

function StatCard({ title, value, subtitle, color }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
}

export default function ReportsScreen() {
  const { data: outstanding, isLoading: loadingOutstanding, refetch: refetchOutstanding, isRefetching } = useOutstanding();
  const { data: aging, isLoading: loadingAging } = useAging();
  const { data: kpis, isLoading: loadingKPIs } = useKPIs();

  const isLoading = loadingOutstanding || loadingAging || loadingKPIs;

  const agingData = aging?.data || {};
  const kpiData = kpis?.data || {};
  const outstandingList = outstanding?.data || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetchOutstanding} tintColor={COLORS.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <Text style={styles.subtitle}>Business overview</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* KPI Stats */}
          <Text style={styles.sectionTitle}>📊 Key Metrics</Text>
          <View style={styles.statsGrid}>
            <StatCard title="Collection Rate" value={`${kpiData.collectionRate || 0}%`}
              color={COLORS.success} subtitle="This month" />
            <StatCard title="Avg. Risk Score" value={kpiData.avgRiskScore || '—'}
              color={COLORS.warning} subtitle="Portfolio wide" />
            <StatCard title="Total Customers" value={kpiData.totalCustomers || 0}
              color={COLORS.primary} subtitle="Active" />
            <StatCard title="Write-offs" value={`GH₵${parseFloat(kpiData.writtenOff || 0).toFixed(0)}`}
              color={COLORS.danger} subtitle="Total" />
          </View>

          {/* Aging Analysis */}
          <Text style={styles.sectionTitle}>⏳ Aging Analysis</Text>
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
          <Text style={styles.sectionTitle}>💰 Outstanding Balances</Text>
          {outstandingList.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>🎉 No outstanding balances!</Text>
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
                    GH₵{parseFloat(c.creditAccount?.balance || 0).toFixed(2)}
                  </Text>
                  <View style={[styles.riskBadge, {
                    backgroundColor: (c.riskScore || 0) > 7 ? COLORS.dangerBg
                      : (c.riskScore || 0) > 4 ? COLORS.warningBg : COLORS.successBg
                  }]}>
                    <Text style={[styles.riskText, {
                      color: (c.riskScore || 0) > 7 ? COLORS.danger
                        : (c.riskScore || 0) > 4 ? COLORS.warning : COLORS.success
                    }]}>
                      Risk: {parseFloat(c.riskScore || 0).toFixed(1)}
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
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14, marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.bgCard,
    borderRadius: 14, padding: 16, borderTopWidth: 3,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statTitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statSubtitle: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  agingCard: { backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  agingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  agingDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  agingLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  agingRight: { alignItems: 'flex-end' },
  agingAmount: { fontSize: 14, fontWeight: '700' },
  agingCount: { fontSize: 11, color: COLORS.textMuted },
  outstandingRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  outstandingAvatar: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  outstandingAvatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  outstandingInfo: { flex: 1 },
  outstandingName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  outstandingPhone: { fontSize: 12, color: COLORS.textSecondary },
  outstandingRight: { alignItems: 'flex-end' },
  outstandingBalance: { fontSize: 15, fontWeight: '800', color: COLORS.danger },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4 },
  riskText: { fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
});
