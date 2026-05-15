// src/components/common/Button.js
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import COLORS from '../../constants/colors';

const VARIANTS = {
  primary: {
    bg: COLORS.primary,
    text: '#fff',
    border: COLORS.primary,
  },
  secondary: {
    bg: 'transparent',
    text: COLORS.primary,
    border: COLORS.primary,
  },
  danger: {
    bg: COLORS.danger,
    text: '#fff',
    border: COLORS.danger,
  },
  ghost: {
    bg: 'transparent',
    text: COLORS.textSecondary,
    border: 'transparent',
  },
};

const SIZES = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
  md: { paddingVertical: 13, paddingHorizontal: 24, fontSize: 15 },
  lg: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: v.text, fontSize: s.fontSize }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
