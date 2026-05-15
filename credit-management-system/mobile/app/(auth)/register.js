// mobile/app/(auth)/register.js
// Register shop screen

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useRegister } from '../../src/hooks/useAuth';
import COLORS from '../../src/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: { name: '', phone: '', shopName: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  const onSubmit = (data) => {
    const { confirmPassword, ...payload } = data;
    register(payload, {
      onSuccess: () => router.replace('/(tabs)/dashboard'),
    });
  };

  const Field = ({ name, label, rules, placeholder, keyboardType, secureTextEntry }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors[name] && styles.inputError]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            keyboardType={keyboardType || 'default'}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors[name] && <Text style={styles.errorText}>{errors[name].message}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🏪</Text>
          </View>
          <Text style={styles.title}>Register Your Shop</Text>
          <Text style={styles.subtitle}>Get started with digital credit tracking</Text>
        </View>

        <View style={styles.form}>
          <Field name="name" label="Your Full Name" placeholder="Kwame Asante"
            rules={{ required: 'Full name is required', minLength: { value: 2, message: 'Minimum 2 characters' } }} />
          <Field name="shopName" label="Shop Name" placeholder="Asante Mini-Market"
            rules={{ required: 'Shop name is required' }} />
          <Field name="phone" label="Phone Number" placeholder="+233501234567"
            keyboardType="phone-pad"
            rules={{ required: 'Phone is required' }} />
          <Field name="password" label="Password" placeholder="Min. 8 characters"
            secureTextEntry={!showPassword}
            rules={{ required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } }} />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Please confirm password',
                validate: (val) => val === password || 'Passwords do not match',
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  placeholder="Re-enter password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.registerBtn, isPending && styles.disabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Create Account</Text>}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  backBtn: { position: 'absolute', left: 0, top: -20 },
  backIcon: { fontSize: 24, color: COLORS.textPrimary },
  logoContainer: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  logoIcon: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  form: { backgroundColor: COLORS.bgCard, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.bgInput, borderRadius: 12, padding: 14,
    fontSize: 15, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border,
  },
  inputError: { borderColor: COLORS.danger },
  errorText: { fontSize: 12, color: COLORS.danger, marginTop: 4 },
  registerBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 8,
  },
  disabled: { opacity: 0.7 },
  registerBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: COLORS.textSecondary },
  loginLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
