// mobile/app/(auth)/login.js
// Login screen

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useLogin } from '../../src/hooks/useAuth';
import COLORS from '../../src/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { phone: '', password: '' } });

  const onSubmit = (data) => {
    login(data, {
      onSuccess: () => router.replace('/(tabs)/dashboard'),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💳</Text>
          </View>
          <Text style={styles.title}>CreditManager</Text>
          <Text style={styles.subtitle}>Sign in to your shop account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <Controller
              control={control}
              name="phone"
              rules={{ required: 'Phone number is required' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder="+233 XX XXX XXXX"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <Controller
                control={control}
                name="password"
                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={!showPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, isPending && styles.loginBtnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Register Shop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 20, elevation: 8,
  },
  logoIcon: { fontSize: 36 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginTop: 6 },
  form: {
    backgroundColor: COLORS.bgCard, borderRadius: 20,
    padding: 24, borderWidth: 1, borderColor: COLORS.border,
  },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.bgInput, borderRadius: 12, padding: 14,
    fontSize: 15, color: COLORS.textPrimary,
    borderWidth: 1, borderColor: COLORS.border,
  },
  inputError: { borderColor: COLORS.danger },
  passwordWrapper: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: 14, top: 14 },
  eyeIcon: { fontSize: 18 },
  errorText: { fontSize: 12, color: COLORS.danger, marginTop: 4 },
  loginBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 8,
    shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { fontSize: 14, color: COLORS.textSecondary },
  registerLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
