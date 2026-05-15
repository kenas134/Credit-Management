// mobile/app/report/index.js
// Full detailed report screen (standalone, navigable from dashboard)

import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useOutstanding, useAging, useKPIs, usePaymentTrend } from '../../src/hooks/useReports';
import { formatGHS } from '../../src/utils/formatCurrency';
import COLORS from '../../src/constants/colors';

function TrendBar({ month, amount, maxAmount }) {
  const pct = maxAmount > 0 ? (amount / maxAmount) : 0;
  return (
    <View style={styles.trendItem}>
      <Text style={styles.trendAmount}>{formatGHS(amount, false)}</Text>
      <View style={styles.trendBarBg}>
        <View style={[styles.trendBarFill, { height: `${Math.round(pct * 100)}%` }]} />
      </View>
      <Text style={styles.trendMonth}>{month}</Text>
    </View>
  );
}

export default function ReportDetailScreen() {
  const router = useRouter();
  const { data: outstanding, isLoading: lo, refetch, isRefetching } = useOutstanding();
  const { data: aging, isLoading: la } = useAging();
  const { data: kpis, isLoading: lk } = useKPIs();
  const { data: trend, isLoading: lt } = usePaymentTrend();

  const isLoading = lo || la || lk || lt;
  const kpiData = kpis?.data || {};
  const agingData = aging?.data || {};
  const trendData = trend?.data || [];
  const outstandingList = outstanding?.data || [];
  const maxTrend = Math.max(...trendData.map((t) => t.amount || 0), 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Full Reports</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 60 }} size="large" />
      ) : (
        <>
          {/* KPI Summary */}
          <Text style={styles.section}>📊 Key Performance Indicators</Text>
          <View style={styles.kpiGrid}>
            {[
              { label: 'Total Outstanding', value: formatGHS(kpiData.totalOutstanding), color: COLORS.danger },
              { label: 'Collection Rate', value: `${kpiData.collectionRate || 0}%`, color: COLORS.success },
              { label: 'Overdue Count', value: kpiData.overdueCount || 0, color: COLORS.warning },
              { label: 'Active Customers', value: kpiData.totalCustomers || 0, color: COLORS.primary },
              { label: 'Avg Risk Score', value: parseFloat(kpiData.avgRiskScore || 0).toFixed(1), color: COLORS.warning },
              { label: 'Written Off', value: formatGHS(kpiData.writtenOff), color: COLORS.textMuted },
            ].map(({ label, value, color }) => (
              <View key={label} style={styles.kpiCard}>
                <Text style={[styles.kpiValue, { color }]}>{value}</Text>
                <Text style={styles.kpiLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Payment Trend Chart */}
          {trendData.length > 0 && (
            <>
              <Text style={styles.section}>📈 Monthly Collections (Last 6 Months)</Text>
              <View style={styles.trendChart}>
                {trendData.map((item) => (
                  <TrendBar
                    key={item.month}
                    month={item.month}
                    amount={item.amount}
                    maxAmount={maxTrend}
                  />
                ))}
              </View>
            </>
          )}

          {/* Aging Buckets */}
          <Text style={styles.section}>⏳ Debt Aging Analysis</Text>
          <View style={styles.agingCard}>
            {[
              { label: 'Current (0–30 days)', data: agingData.current, color: COLORS.success },
              { label: '31–60 days', data: agingData.days30, color: COLORS.warning },
              { label: '61–90 days', data: agingData.days60, color: COLORS.warningDark },
              { label: '90+ days (Critical)', data: agingData.days90, color: COLORS.danger },
            ].map(({ label, data, color }) => {
              const count = data?.count || 0;
              const total = data?.total || 0;
              return (
                <View key={label} style={styles.agingRow}>
                  <View style={[styles.agingDot, { backgroundColor: color }]} />
                  <View style={styles.agingInfo}>
                    <Text style={styles.agingLabel}>{label}</Text>
                    <Text style={styles.agingCount}>{count} customer{count !== 1 ? 's' : ''}</Text>
                  </View>
                  <Text style={[styles.agingAmount, { color }]}>{formatGHS(total)}</Text>
                </View>
              );
            })}
          </View>

          {/* Outstanding Customers */}
          <Text style={styles.section}>💰 All Outstanding Balances</Text>
          {outstandingList.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={styles.emptyText}>No outstanding balances!</Text>
            </View>
          ) : (
            outstandingList.map((c) => {
              const balance = parseFloat(c.creditAccount?.balance || 0);
              const risk = parseFloat(c.riskScore || 0);
              return (
                <TouchableOpacity
                  key={c.id}
                  style={styles.customerRow}
                  onPress={() => router.push(`/customer/${c.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.avatar, { backgroundColor: risk > 7 ? COLORS.danger : COLORS.primary }]}>
                    <Text style={styles.avatarText}>{(c.fullName || '?')[0]}</Text>
                  </View>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{c.fullName}</Text>
                    <Text style={styles.customerPhone}>{c.phone}</Text>
                  </View>
                  <View style={styles.customerRight}>
                    <Text style={styles.balance}>{formatGHS(balance)}</Text>
                    <View style={[styles.riskBadge, {
                      backgroundColor: risk > 7 ? COLORS.dangerBg : risk > 4 ? COLORS.warningBg : COLORS.successBg,
                    }]}>
                      <Text style={[styles.riskText, {
                        color: risk > 7 ? COLORS.danger : risk > 4 ? COLORS.warning : COLORS.success,
                      }]}>
                        Risk {risk.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 20, paddingTop: 56, paddingBottom: 80 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, backgroundColor: COLORS.bgCard, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  backIcon: { fontSize: 18, color: COLORS.textPrimary },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  section: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14, marginTop: 8 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  kpiCard: { flex: 1, minWidth: '30%', backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  kpiValue: { fontSize: 18, fontWeight: '800' },
  kpiLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
  trendChart: { flexDirection: 'row', height: 120, alignItems: 'flex-end', backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  trendItem: { flex: 1, alignItems: 'center' },
  trendAmount: { fontSize: 9, color: COLORS.textMuted, marginBottom: 4 },
  trendBarBg: { flex: 1, width: 22, backgroundColor: COLORS.border, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  trendBarFill: { backgroundColor: COLORS.primary, borderRadius: 6, minHeight: 4 },
  trendMonth: { fontSize: 10, color: COLORS.textSecondary, marginTop: 6 },
  agingCard: { backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  agingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  agingDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  agingInfo: { flex: 1 },
  agingLabel: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },
  agingCount: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  agingAmount: { fontSize: 14, fontWeight: '800' },
  customerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  avatar: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  customerPhone: { fontSize: 12, color: COLORS.textSecondary },
  customerRight: { alignItems: 'flex-end' },
  balance: { fontSize: 15, fontWeight: '800', color: COLORS.danger },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4 },
  riskText: { fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
});
