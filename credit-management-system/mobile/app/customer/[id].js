// mobile/app/customer/[id].js
// Customer detail screen — profile, balance, ledger, CTAs

import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCustomer } from '../../src/hooks/useCustomers';
import { useLedger } from '../../src/hooks/useCredits';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../src/constants/colors';

function InfoRow({ label, value, color }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, color && { color }]}>{value}</Text>
    </View>
  );
}

function TxItem({ item }) {
  const isCredit = item.type === 'CREDIT';
  return (
    <View style={styles.txItem}>
      <View style={[styles.txIcon, { backgroundColor: isCredit ? COLORS.dangerBg : COLORS.successBg }]}>
        <Ionicons 
          name={isCredit ? 'arrow-up-circle' : 'arrow-down-circle'} 
          size={22} 
          color={isCredit ? COLORS.danger : COLORS.success} 
        />
      </View>
      <View style={styles.txDetails}>
        <Text style={styles.txDesc}>{item.description || (isCredit ? 'Credit issued' : 'Payment received')}</Text>
        <Text style={styles.txDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: isCredit ? COLORS.danger : COLORS.success }]}>
          {isCredit ? '-' : '+'}ETB {parseFloat(item.amount).toFixed(2)}
        </Text>
        <View style={[styles.txBadge, { backgroundColor: item.status === 'PAID' ? COLORS.successBg : COLORS.warningBg }]}>
          <Text style={[styles.txBadgeText, { color: item.status === 'PAID' ? COLORS.success : COLORS.warning }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: cData, isLoading, refetch, isRefetching } = useCustomer(id);
  const { data: lData, isLoading: loadingLedger } = useLedger(id);

  const customer = cData?.data;
  const ledger = lData?.data?.account?.transactions || [];
  const account = customer?.creditAccount;
  const balance = parseFloat(account?.currentBalance || 0);
  const trustScore = parseFloat(customer?.trustScore || 0);

  if (isLoading) return <View style={styles.loading}><ActivityIndicator color={COLORS.primary} size="large" /></View>;
  if (!customer) return <View style={styles.loading}><Text style={{ color: COLORS.danger }}>Not found</Text></View>;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: account?.status === 'OVERDUE' ? COLORS.danger : COLORS.primary }]}>
          <Text style={styles.avatarText}>{customer.fullName[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.customerName}>{customer.fullName}</Text>
        <Text style={styles.customerPhone}>{customer.phone}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: COLORS.primaryBg }]}>
            <Text style={[styles.badgeText, { color: COLORS.primary }]}>{account?.status || 'ACTIVE'}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: trustScore < 4 ? COLORS.dangerBg : COLORS.successBg }]}>
            <Text style={[styles.badgeText, { color: trustScore < 4 ? COLORS.danger : COLORS.success }]}>
              {customer.riskLevel || 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <Text style={[styles.balanceAmount, { color: balance > 0 ? COLORS.danger : COLORS.success }]}>
              ETB {balance.toFixed(2)}
            </Text>
            <Text style={styles.balanceLabel}>Outstanding</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.balanceStat}>
            <Text style={styles.limitAmount}>ETB {parseFloat(account?.creditLimit || 0).toFixed(2)}</Text>
            <Text style={styles.balanceLabel}>Credit Limit</Text>
          </View>
        </View>
        <View style={styles.actionBtns}>
          <TouchableOpacity 
            style={styles.creditBtn}
            onPress={() => router.push({ pathname: '/payment/record', params: { customerId: id, type: 'CREDIT' } })}
          >
            <Ionicons name="add-circle-outline" size={18} color={COLORS.danger} />
            <Text style={styles.creditBtnText}> Issue Credit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.payBtn, balance <= 0 && styles.btnDisabled]}
            onPress={() => router.push({ pathname: '/payment/record', params: { customerId: id, type: 'PAYMENT' } })}
            disabled={balance <= 0}
          >
            <Ionicons name="cash-outline" size={18} color="#fff" />
            <Text style={styles.payBtnText}> Record Payment</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Contact Info</Text>
        <InfoRow label="Address" value={customer.address || '—'} />
        <InfoRow label="Notes" value={customer.notes || '—'} />
        <InfoRow label="Since" value={new Date(customer.createdAt).toLocaleDateString()} />
        <InfoRow label="Total Credited" value={`ETB ${parseFloat(account?.totalCredited || 0).toFixed(2)}`} color={COLORS.danger} />
        <InfoRow label="Total Paid" value={`ETB ${parseFloat(account?.totalPaid || 0).toFixed(2)}`} color={COLORS.success} />
      </View>

      <Text style={styles.ledgerTitle}>Transaction History</Text>
      {loadingLedger ? <ActivityIndicator color={COLORS.primary} /> :
        ledger.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        ) :
          ledger.map((tx) => <TxItem key={tx.id} item={tx} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  loading: { flex: 1, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 40, height: 40, backgroundColor: COLORS.bgCard, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  profileCard: { backgroundColor: COLORS.bgCard, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  avatar: { width: 68, height: 68, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 26, fontWeight: '800', color: '#fff' },
  customerName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  customerPhone: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  balanceCard: { backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  balanceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  balanceStat: { flex: 1, alignItems: 'center' },
  balanceAmount: { fontSize: 24, fontWeight: '800' },
  limitAmount: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  balanceLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  divider: { width: 1, height: 40, backgroundColor: COLORS.border },
  actionBtns: { flexDirection: 'row', gap: 10 },
  creditBtn: { flex: 1, backgroundColor: COLORS.dangerBg, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.danger + '40', flexDirection: 'row', justifyContent: 'center' },
  creditBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.danger },
  payBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  payBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  btnDisabled: { opacity: 0.4 },
  infoCard: { backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  infoCardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: 13, color: COLORS.textSecondary },
  infoValue: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  ledgerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  txItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  txIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txDetails: { flex: 1 },
  txDesc: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  txDate: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 14, fontWeight: '800' },
  txBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, marginTop: 4 },
  txBadgeText: { fontSize: 10, fontWeight: '700' },
  emptyWrap: { alignItems: 'center', padding: 32, gap: 12 },
  emptyText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
});
