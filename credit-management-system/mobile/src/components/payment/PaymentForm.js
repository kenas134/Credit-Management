// src/components/payment/PaymentForm.js
// Reusable payment / credit issue form used in record.js
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import COLORS from '../../constants/colors';

export default function PaymentForm({
  type = 'PAYMENT',         // 'PAYMENT' | 'CREDIT'
  onTypeChange,
  amount,
  setAmount,
  description,
  setDescription,
  dueDate,
  setDueDate,
  onSubmit,
  loading,
}) {
  const isCredit = type === 'CREDIT';

  return (
    <View>
      {/* Type Toggle */}
      {onTypeChange && (
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, !isCredit && styles.toggleActive]}
            onPress={() => onTypeChange('PAYMENT')}
          >
            <Text style={[styles.toggleText, !isCredit && styles.toggleTextActive]}>
              💰 Record Payment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isCredit && styles.toggleActive]}
            onPress={() => onTypeChange('CREDIT')}
          >
            <Text style={[styles.toggleText, isCredit && styles.toggleTextActive]}>
              💳 Issue Credit
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Amount */}
      <View style={styles.amountBox}>
        <Text style={styles.currency}>GH₵</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="decimal-pad"
          style={styles.amountInput}
        />
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Weekly groceries"
          placeholderTextColor={COLORS.textMuted}
          style={styles.textInput}
          multiline
          numberOfLines={2}
        />
      </View>

      {/* Due Date (only for credits) */}
      {isCredit && setDueDate && (
        <View style={styles.field}>
          <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="2025-06-15"
            placeholderTextColor={COLORS.textMuted}
            style={styles.textInput}
            keyboardType="numbers-and-punctuation"
          />
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: isCredit ? COLORS.danger : COLORS.success }]}
        onPress={onSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitText}>
              {isCredit ? 'Issue Credit' : 'Record Payment'}
            </Text>
        }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currency: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingVertical: 16,
  },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  submitBtn: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
