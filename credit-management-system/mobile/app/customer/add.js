// mobile/app/customer/add.js
// Add new customer modal screen

import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useCreateCustomer } from '../../src/hooks/useCustomers';
import COLORS from '../../src/constants/colors';

export default function AddCustomerScreen() {
  const router = useRouter();
  const { mutate: createCustomer, isPending } = useCreateCustomer();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '', phone: '', email: '', address: '',
      creditLimit: '500', notes: '',
    },
  });

  const onSubmit = (data) => {
    const payload = { ...data, creditLimit: parseFloat(data.creditLimit) || 500 };
    createCustomer(payload, {
      onSuccess: (res) => {
        const customerId = res?.data?.customer?.id;
        if (customerId) router.replace(`/customer/${customerId}`);
        else router.back();
      },
    });
  };

  const Field = ({ name, label, placeholder, rules, keyboardType, multiline }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}{rules?.required ? ' *' : ''}</Text>
      <Controller
        control={control} name={name} rules={rules}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors[name] && styles.inputError, multiline && styles.multilineInput]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            keyboardType={keyboardType || 'default'}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            value={value} onChangeText={onChange}
          />
        )}
      />
      {errors[name] && <Text style={styles.errText}>{errors[name].message}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Customer</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Field name="fullName" label="Full Name" placeholder="Kofi Mensah"
          rules={{ required: 'Full name is required', minLength: { value: 2, message: 'Min 2 chars' } }} />
        <Field name="phone" label="Phone Number" placeholder="+233501234567"
          keyboardType="phone-pad" rules={{ required: 'Phone is required' }} />
        <Field name="email" label="Email Address" placeholder="kofi@gmail.com" keyboardType="email-address" />
        <Field name="address" label="Address" placeholder="Accra, Ghana" />
        <Field name="creditLimit" label="Credit Limit (GH₵)" placeholder="500"
          keyboardType="numeric"
          rules={{ required: 'Credit limit is required', min: { value: 1, message: 'Must be > 0' } }} />
        <Field name="notes" label="Notes" placeholder="Any special notes about this customer..."
          multiline />

        <TouchableOpacity
          style={[styles.submitBtn, isPending && styles.disabled]}
          onPress={handleSubmit(onSubmit)} disabled={isPending}
        >
          {isPending ? <ActivityIndicator color="#fff" /> :
            <Text style={styles.submitText}>Add Customer</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  closeBtn: { width: 36, height: 36, backgroundColor: COLORS.bgCard, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  closeIcon: { fontSize: 16, color: COLORS.textPrimary },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  form: { padding: 20, paddingBottom: 60 },
  field: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 7 },
  input: { backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
  multilineInput: { height: 90, textAlignVertical: 'top' },
  inputError: { borderColor: COLORS.danger },
  errText: { fontSize: 12, color: COLORS.danger, marginTop: 4 },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8, shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  disabled: { opacity: 0.7 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
