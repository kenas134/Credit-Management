// mobile/app/(tabs)/settings.js
// Settings tab — profile, shop info, change password, logout

import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Alert, Modal,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../../src/store/auth.store';
import { useLogout, useChangePassword } from '../../src/hooks/useAuth';
import { useShop, useUpdateShop } from '../../src/hooks/useShop';
import { useNotifications } from '../../src/hooks/useNotifications';
import COLORS from '../../src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Edit Shop Modal ────────────────────────────────────────────────────────
function EditShopModal({ visible, onClose, initialData }) {
  const [name, setName]       = useState(initialData?.name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [phone, setPhone]     = useState(initialData?.phone || '');
  const { mutate: updateShop, isPending } = useUpdateShop();

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Shop name is required.');
      return;
    }
    updateShop(
      { name, address, phone },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🏪 Edit Shop Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Shop Name</Text>
            <TextInput
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter shop name"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Location / Address</Text>
            <TextInput
              style={styles.modalInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Shop Phone</Text>
            <TextInput
              style={styles.modalInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter shop phone"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, isPending && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isPending}
          >
            {isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ visible, onClose }) {
  const [current, setCurrent] = useState('');
  const [next, setNext]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const { mutate: changePassword, isPending } = useChangePassword();

  const reset = () => { setCurrent(''); setNext(''); setConfirm(''); };

  const handleSubmit = () => {
    if (!current || !next || !confirm) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (next.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }
    if (next !== confirm) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    changePassword(
      { currentPassword: current, newPassword: next },
      {
        onSuccess: () => {
          Alert.alert('✅ Success', 'Password changed successfully.');
          reset();
          onClose();
        },
        onError: (err) => {
          Alert.alert('❌ Failed', err?.response?.data?.message || 'Could not change password.');
        },
      }
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🔑 Change Password</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Current Password</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry={!showPw}
              value={current}
              onChangeText={setCurrent}
              placeholder="Current password"
              placeholderTextColor={COLORS.textMuted}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>New Password</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry={!showPw}
              value={next}
              onChangeText={setNext}
              placeholder="New password"
              placeholderTextColor={COLORS.textMuted}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry={!showPw}
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.textMuted}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity onPress={() => setShowPw(p => !p)} style={styles.showPwRow}>
            <Text style={styles.showPwText}>{showPw ? '🙈 Hide' : '👁 Show'} passwords</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, isPending && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isPending}
          >
            {isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>Update Password</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Setting Row ──────────────────────────────────────────────────────────────
function SettingRow({ icon, label, value, onPress, isSwitch, switchValue, onSwitch, danger }) {
  return (
    <TouchableOpacity
      style={[styles.row, danger && styles.rowDanger]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isSwitch}
    >
      <Ionicons name={icon} size={22} color={danger ? COLORS.danger : COLORS.textSecondary} style={styles.rowIcon} />
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
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
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

// ─── Main Settings Screen ─────────────────────────────────────────────────────
export default function SettingsScreen() {
  const router  = useRouter();
  const { user } = useAuthStore();
  const { mutate: logout } = useLogout();
  const { data: shopData, isLoading: loadingShop } = useShop();
  const { data: notifData } = useNotifications();
  
  const [showChangePw, setShowChangePw] = useState(false);
  const [showEditShop, setShowEditShop] = useState(false);

  // Settings state
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const pr = await AsyncStorage.getItem('@setting_paymentReminders');
        const oa = await AsyncStorage.getItem('@setting_overdueAlerts');
        if (pr !== null) setPaymentReminders(pr === 'true');
        if (oa !== null) setOverdueAlerts(oa === 'true');
      } catch (e) { console.error('Failed to load settings', e); }
    };
    loadSettings();
  }, []);

  const togglePaymentReminders = async (value) => {
    setPaymentReminders(value);
    await AsyncStorage.setItem('@setting_paymentReminders', String(value));
  };

  const toggleOverdueAlerts = async (value) => {
    setOverdueAlerts(value);
    await AsyncStorage.setItem('@setting_overdueAlerts', String(value));
  };

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

  const shop = shopData || user?.shop;
  const notifications = Array.isArray(notifData?.data) ? notifData.data : notifData?.data?.notifications || [];
  const unreadCount = notifData?.data?.unreadCount ?? notifications.filter(n => n.status === 'UNREAD').length;

  return (
    <>
      <ChangePasswordModal visible={showChangePw} onClose={() => setShowChangePw(false)} />
      <EditShopModal visible={showEditShop} onClose={() => setShowEditShop(false)} initialData={shop} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Settings</Text>
          <TouchableOpacity onPress={() => router.push('/notification')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={26} color={COLORS.textPrimary} />
            {unreadCount > 0 && <View style={styles.notifBadge} />}
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Shop Owner'}</Text>
            <Text style={styles.profileRole}>{user?.role || 'OWNER'} · {shop?.name || 'Your Shop'}</Text>
            <Text style={styles.profilePhone}>{user?.phone || ''}</Text>
          </View>
        </View>

        <Section title="Shop Details">
          <SettingRow icon="storefront-outline" label="Shop Name" value={shop?.name} onPress={() => setShowEditShop(true)} />
          <SettingRow icon="location-outline" label="Location" value={shop?.address || 'Not set'} onPress={() => setShowEditShop(true)} />
          <SettingRow icon="card-outline" label="Default Credit Limit" value={`ETB ${shop?.defaultCreditLimit || 500}`} onPress={() => {}} />
        </Section>

        <Section title="Notifications">
          <SettingRow icon="notifications-outline" label="Payment Reminders" isSwitch switchValue={paymentReminders} onSwitch={togglePaymentReminders} />
          <SettingRow icon="alert-circle-outline" label="Overdue Alerts" isSwitch switchValue={overdueAlerts} onSwitch={toggleOverdueAlerts} />
        </Section>

        <Section title="Account">
          <SettingRow icon="key-outline" label="Change Password" onPress={() => setShowChangePw(true)} />
          <SettingRow icon="log-out-outline" label="Sign Out" onPress={handleLogout} danger />
        </Section>

        <Text style={styles.version}>CreditManager v1.1.0 · ETB Currency</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary },
  notifBtn: { position: 'relative' },
  notifBadge: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.danger, borderWidth: 2, borderColor: COLORS.bgDark },

  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 24,
  },
  profileAvatar: {
    width: 60, height: 60, borderRadius: 16,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  profileAvatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  profileRole: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  profilePhone: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginLeft: 4 },
  sectionCard: { backgroundColor: COLORS.bgCard, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowDanger: { borderBottomWidth: 0 },
  rowIcon: { marginRight: 14, width: 24, textAlign: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  rowLabelDanger: { color: COLORS.danger },
  rowValue: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  version: { textAlign: 'center', color: COLORS.textMuted, fontSize: 12, marginTop: 10 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 19, fontWeight: '800', color: COLORS.textPrimary },
  modalField: { marginBottom: 18 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  modalInput: {
    backgroundColor: COLORS.bgInput, borderRadius: 12, padding: 15,
    fontSize: 15, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border,
  },
  showPwRow: { alignItems: 'flex-end', marginBottom: 20, marginTop: -8 },
  showPwText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    padding: 16, alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
