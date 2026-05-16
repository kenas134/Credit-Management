// mobile/app/payment/record.js
// Record payment or issue credit modal screen

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useBulkPayment } from '../../src/hooks/usePayments';
import { useCreateCredit } from '../../src/hooks/useCredits';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../src/constants/colors';

export default function RecordPaymentScreen() {
  const router = useRouter();
  const { customerId, type: initialType } = useLocalSearchParams();
  const [type, setType] = useState(initialType || 'PAYMENT');

  const { mutate: bulkPayment, isPending: payPending } = useBulkPayment();
  const { mutate: createCredit, isPending: creditPending } = useCreateCredit();
  const isPending = payPending || creditPending;

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { amount: '', description: '', dueDate: '' },
  });

  const onSubmit = (data) => {
    if (type === 'PAYMENT') {
      bulkPayment(
        { 
          customerId, 
          amount: parseFloat(data.amount), 
          notes: data.description,
          method: 'CASH' // Default method
        },
        { onSuccess: () => router.back() }
      );
    } else {
      createCredit(
        {
          customerId,
          amount: parseFloat(data.amount),
          description: data.description,
          dueDate: data.dueDate || undefined,
        },
        { onSuccess: () => router.back() }
      );
    }
  };

  const isCredit = type === 'CREDIT';

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{isCredit ? 'Issue Credit' : 'Record Payment'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {/* Type toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, !isCredit && styles.toggleActive]}
            onPress={() => setType('PAYMENT')}
          >
            <Text style={[styles.toggleText, !isCredit && styles.toggleTextActive]}>📥 Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isCredit && styles.toggleActiveCredit]}
            onPress={() => setType('CREDIT')}
          >
            <Text style={[styles.toggleText, isCredit && styles.toggleTextActive]}>📤 Credit</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <View style={styles.field}>
          <Text style={styles.label}>Amount (ETB) *</Text>
          <Controller
            control={control} name="amount"
            rules={{ required: 'Amount is required', min: { value: 0.01, message: 'Must be > 0' } }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.amountInput, errors.amount && styles.inputError]}
                placeholder="0.00"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="decimal-pad"
                value={value} 
                onChangeText={onChange}
              />
            )}
          />
          {errors.amount && <Text style={styles.errText}>{errors.amount.message}</Text>}
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <Controller
            control={control} name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder={isCredit ? 'e.g. Groceries (rice, sugar, oil)' : 'e.g. Cash payment'}
                placeholderTextColor={COLORS.textMuted}
                value={value} 
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Due Date (only for credit) */}
        {isCredit && (
          <View style={styles.field}>
            <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
            <Controller
              control={control} name="dueDate"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="2025-12-31"
                  placeholderTextColor={COLORS.textMuted}
                  value={value} 
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitBtn, isCredit && styles.submitBtnCredit, isPending && styles.disabled]}
          onPress={handleSubmit(onSubmit)} 
          disabled={isPending}
        >
          {isPending ? <ActivityIndicator color="#fff" /> :
            <Text style={styles.submitText}>{isCredit ? 'Issue Credit' : 'Record Payment'}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    padding: 20, paddingTop: 56, borderBottomWidth: 1, borderBottomColor: COLORS.border 
  },
  closeBtn: { 
    width: 40, height: 40, backgroundColor: COLORS.bgCard, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border 
  },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  form: { padding: 20, paddingBottom: 60 },
  toggle: { 
    flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: 14, 
    padding: 4, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border 
  },
  toggleBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  toggleActive: { backgroundColor: COLORS.success },
  toggleActiveCredit: { backgroundColor: COLORS.danger },
  toggleText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  toggleTextActive: { color: '#fff', fontWeight: '700' },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  amountInput: { 
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 18, fontSize: 28, 
    fontWeight: '800', color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border, textAlign: 'center' 
  },
  input: { 
    backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 14, fontSize: 15, 
    color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border 
  },
  inputError: { borderColor: COLORS.danger },
  errText: { fontSize: 12, color: COLORS.danger, marginTop: 4 },
  submitBtn: { backgroundColor: COLORS.success, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  submitBtnCredit: { backgroundColor: COLORS.danger },
  disabled: { opacity: 0.7 },
  submitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
