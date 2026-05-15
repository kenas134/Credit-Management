// src/components/common/Badge.js
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const PRESETS = {
  // Risk levels
  LOW: { bg: 'rgba(16,185,129,0.15)', text: COLORS.success },
  MEDIUM: { bg: 'rgba(245,158,11,0.15)', text: COLORS.warning },
  HIGH: { bg: 'rgba(239,68,68,0.15)', text: COLORS.danger },
  CRITICAL: { bg: 'rgba(239,68,68,0.25)', text: COLORS.danger },
  // Transaction types
  CREDIT: { bg: 'rgba(239,68,68,0.12)', text: COLORS.danger },
  PAYMENT: { bg: 'rgba(16,185,129,0.12)', text: COLORS.success },
  ADJUSTMENT: { bg: 'rgba(245,158,11,0.12)', text: COLORS.warning },
  // Customer status
  ACTIVE: { bg: 'rgba(16,185,129,0.15)', text: COLORS.success },
  SUSPENDED: { bg: 'rgba(239,68,68,0.15)', text: COLORS.danger },
  BLOCKED: { bg: 'rgba(100,100,100,0.15)', text: COLORS.textSecondary },
};

export default function Badge({ label, preset, color, bgColor, style }) {
  const resolved = preset ? PRESETS[preset] || PRESETS.MEDIUM : null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor || resolved?.bg || 'rgba(99,102,241,0.12)',
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: color || resolved?.text || COLORS.primary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
