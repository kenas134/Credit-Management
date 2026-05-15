// mobile/app/(tabs)/settings.js
// Settings tab — profile, shop info, logout

import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../src/store/auth.store';
import { useLogout } from '../../src/hooks/useAuth';
import COLORS from '../../src/constants/colors';

function SettingRow({ emoji, label, value, onPress, isSwitch, switchValue, onSwitch, danger }) {
  return (
    <TouchableOpacity
      style={[styles.row, danger && styles.rowDanger]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isSwitch}
    >
      <Text style={styles.rowEmoji}>{emoji}</Text>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitch}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor="#fff"
        />
      ) : (
        <Text style={[styles.rowArrow, danger && { color: COLORS.danger }]}>›</Text>
      )}
    </TouchableOpacity>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout({}, { onSuccess: () => router.replace('/(auth)/login') }),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Settings</Text>

      {/* Profile Card */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => router.push('/profile/index')}
        activeOpacity={0.8}
      >
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'Shop Owner'}</Text>
          <Text style={styles.profileRole}>{user?.role || 'OWNER'} · {user?.shop?.name || 'Your Shop'}</Text>
          <Text style={styles.profilePhone}>{user?.phone || ''}</Text>
        </View>
        <Text style={styles.rowArrow}>›</Text>
      </TouchableOpacity>

      <Section title="Shop">
        <SettingRow emoji="🏪" label="Shop Name" value={user?.shop?.name} onPress={() => router.push('/profile/index')} />
        <SettingRow emoji="📍" label="Location" value={user?.shop?.location || 'Not set'} onPress={() => router.push('/profile/index')} />
        <SettingRow emoji="💳" label="Default Credit Limit" value={`GH₵${user?.shop?.defaultCreditLimit || 500}`} onPress={() => router.push('/profile/index')} />
      </Section>

      <Section title="Notifications">
        <SettingRow emoji="🔔" label="Payment Reminders" isSwitch switchValue={true} onSwitch={() => {}} />
        <SettingRow emoji="⚠️" label="Overdue Alerts" isSwitch switchValue={true} onSwitch={() => {}} />
        <SettingRow emoji="📲" label="View All Notifications" onPress={() => router.push('/notification/index')} />
      </Section>

      <Section title="Data">
        <SettingRow emoji="📊" label="View Full Reports" onPress={() => router.push('/(tabs)/reports')} />
        <SettingRow emoji="🔄" label="Sync Data" onPress={() => Alert.alert('Sync', 'Data synced successfully!')} />
      </Section>

      <Section title="Account">
        <SettingRow emoji="🔑" label="Change Password" onPress={() => router.push('/profile/index')} />
        <SettingRow emoji="🚪" label="Sign Out" onPress={handleLogout} danger />
      </Section>

      <Text style={styles.version}>CreditManager v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 24 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: COLORS.primary + '40', marginBottom: 24,
  },
  profileAvatar: {
    width: 54, height: 54, borderRadius: 16,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  profileAvatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
  profileRole: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  profilePhone: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  sectionCard: { backgroundColor: COLORS.bgCard, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowDanger: { borderBottomWidth: 0 },
  rowEmoji: { fontSize: 20, marginRight: 14, width: 28, textAlign: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 15, color: COLORS.textPrimary },
  rowLabelDanger: { color: COLORS.danger },
  rowValue: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  rowArrow: { fontSize: 20, color: COLORS.textMuted },
  version: { textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginTop: 8 },
});
