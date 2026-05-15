// mobile/app/customer/add.js
// Add new customer screen

import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useCreateCustomer } from '../../src/hooks/useCustomers';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../src/constants/colors';

// ─── Field OUTSIDE component to prevent remount on each render ───────────────
function Field({ name, label, placeholder, rules, keyboardType, multiline, control, errors }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{rules?.required ? ' *' : ''}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors[name] && styles.inputError,
              multiline && styles.multilineInput,
            ]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            keyboardType={keyboardType || 'default'}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            autoCorrect={false}
            autoCapitalize="words"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors[name] && <Text style={styles.errText}>{errors[name].message}</Text>}
    </View>
  );
}

export default function AddCustomerScreen() {
  const router = useRouter();
  const { mutate: createCustomer, isPending } = useCreateCustomer();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '', nickname: '', phone: '', address: '',
      creditLimit: '500', notes: '',
    },
  });

  const onSubmit = (data) => {
    // Standardize data: remove empty strings, parse numbers
    const payload = {
      fullName: data.fullName.trim(),
      nickname: data.nickname?.trim() || undefined,
      phone: data.phone.trim(),
      address: data.address?.trim() || undefined,
      creditLimit: parseFloat(data.creditLimit) || 500,
      notes: data.notes?.trim() || undefined,
    };

    createCustomer(payload, {
      onSuccess: (res) => {
        // Our API returns { success: true, data: { id, ... } }
        const customerId = res?.data?.id;
        if (customerId) {
          router.replace(`/customer/${customerId}`);
        } else {
          router.back();
        }
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>New Customer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Field
          name="fullName" label="Full Name" placeholder="e.g. Abebe Bikila"
          control={control} errors={errors}
          rules={{ required: 'Full name is required', minLength: { value: 2, message: 'Min 2 characters' } }}
        />
        <Field
          name="nickname" label="Nickname / Business Name" placeholder="e.g. Kiosk Owner"
          control={control} errors={errors}
        />
        <Field
          name="phone" label="Phone Number" placeholder="+251 9xx xxx xxx"
          keyboardType="phone-pad" control={control} errors={errors}
          rules={{ required: 'Phone is required' }}
        />
        <Field
          name="address" label="Location / Address" placeholder="Addis Ababa, Ethiopia"
          control={control} errors={errors}
        />
        <Field
          name="creditLimit" label="Initial Credit Limit (ETB)" placeholder="500"
          keyboardType="numeric" control={control} errors={errors}
          rules={{ required: 'Credit limit is required' }}
        />
        <Field
          name="notes" label="Additional Notes"
          placeholder="Any extra details..."
          multiline control={control} errors={errors}
        />

        <TouchableOpacity
          style={[styles.submitBtn, isPending && styles.disabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitText}>Save Customer</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  closeBtn: {
    width: 40, height: 40, backgroundColor: COLORS.bgDark,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  form: { padding: 20, paddingBottom: 60 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 7 },
  input: {
    backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 14,
    fontSize: 15, color: COLORS.textPrimary,
    borderWidth: 1, borderColor: COLORS.border,
  },
  multilineInput: { height: 90, textAlignVertical: 'top' },
  inputError: { borderColor: COLORS.danger },
  errText: { fontSize: 12, color: COLORS.danger, marginTop: 4 },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 8,
    elevation: 6, shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 12,
  },
  disabled: { opacity: 0.7 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
