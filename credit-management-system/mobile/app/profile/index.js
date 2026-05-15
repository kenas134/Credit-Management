// mobile/app/profile/index.js
// Profile / account settings screen

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import useAuthStore from '../../src/store/auth.store';
import { useChangePassword } from '../../src/hooks/useAuth';
import COLORS from '../../src/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { mutate: changePassword, isPending } = useChangePassword();
  const [showPwForm, setShowPwForm] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const newPw = watch('newPassword');

  const onChangePw = (data) => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Password changed successfully');
          reset();
          setShowPwForm(false);
        },
      }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role} at {user?.shop?.name}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{user?.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>{user?.role}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shop Name</Text>
          <Text style={styles.infoValue}>{user?.shop?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shop Location</Text>
          <Text style={styles.infoValue}>{user?.shop?.location || '—'}</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Default Credit Limit</Text>
          <Text style={styles.infoValue}>GH₵{user?.shop?.defaultCreditLimit || 500}</Text>
        </View>
      </View>

      {/* Change Password */}
      <TouchableOpacity style={styles.pwToggle} onPress={() => setShowPwForm(!showPwForm)}>
        <Text style={styles.pwToggleText}>🔑 {showPwForm ? 'Hide' : 'Change'} Password</Text>
        <Text style={styles.pwToggleArrow}>{showPwForm ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {showPwForm && (
        <View style={styles.card}>
          {[
            { name: 'currentPassword', label: 'Current Password', rules: { required: 'Required' } },
            { name: 'newPassword', label: 'New Password', rules: { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } } },
            { name: 'confirmPassword', label: 'Confirm New Password', rules: { required: 'Required', validate: (v) => v === newPw || 'Passwords do not match' } },
          ].map(({ name, label, rules }) => (
            <View key={name} style={styles.field}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <Controller
                control={control} name={name} rules={rules}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors[name] && styles.inputError]}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry
                    value={value} onChangeText={onChange}
                  />
                )}
              />
              {errors[name] && <Text style={styles.errText}>{errors[name].message}</Text>}
            </View>
          ))}
          <TouchableOpacity
            style={[styles.submitBtn, isPending && styles.disabled]}
            onPress={handleSubmit(onChangePw)} disabled={isPending}
          >
            {isPending ? <ActivityIndicator color="#fff" /> :
              <Text style={styles.submitText}>Update Password</Text>}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content: { padding: 20, paddingTop: 56, paddingBottom: 80 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  backBtn: { width: 40, height: 40, backgroundColor: COLORS.bgCard, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  backIcon: { fontSize: 18, color: COLORS.textPrimary },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 84, height: 84, borderRadius: 26, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 14, shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  avatarText: { fontSize: 34, fontWeight: '800', color: '#fff' },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  role: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  card: { backgroundColor: COLORS.bgCard, borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  cardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: 13, color: COLORS.textSecondary },
  infoValue: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, maxWidth: '60%', textAlign: 'right' },
  pwToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  pwToggleText: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  pwToggleArrow: { fontSize: 14, color: COLORS.textMuted },
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 7 },
  input: { backgroundColor: COLORS.bgInput, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  inputError: { borderColor: COLORS.danger },
  errText: { fontSize: 12, color: COLORS.danger, marginTop: 4 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 4 },
  disabled: { opacity: 0.7 },
  submitText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
