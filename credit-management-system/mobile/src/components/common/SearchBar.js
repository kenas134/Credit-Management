// src/components/common/SearchBar.js
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="never"
      />
      {value?.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          style={styles.clearBtn}
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  icon: { fontSize: 15, marginRight: 8 },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 11,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },
  clearText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
