// src/components/dashboard/KPIGrid.js
// 2x2 grid of KPI stat cards for the dashboard
import { View, StyleSheet } from 'react-native';
import StatCard from '../common/StatCard';
import { formatGHS } from '../../utils/formatCurrency';
import COLORS from '../../constants/colors';

export default function KPIGrid({ data }) {
  if (!data) return null;

  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <StatCard
          emoji="💰"
          label="Total Outstanding"
          value={formatGHS(data.totalOutstanding || 0)}
          color={COLORS.danger}
          style={styles.card}
        />
        <StatCard
          emoji="👥"
          label="Active Customers"
          value={data.totalCustomers ?? 0}
          style={styles.card}
        />
      </View>
      <View style={styles.row}>
        <StatCard
          emoji="📥"
          label="Collected Today"
          value={formatGHS(data.todayCollected || 0)}
          color={COLORS.success}
          style={styles.card}
        />
        <StatCard
          emoji="⚠️"
          label="Overdue Accounts"
          value={data.overdueCount ?? 0}
          color={data.overdueCount > 0 ? COLORS.warning : COLORS.textSecondary}
          style={styles.card}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { marginBottom: 20 },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  card: { flex: 1 },
});
