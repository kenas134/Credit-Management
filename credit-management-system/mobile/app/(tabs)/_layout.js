// mobile/app/(tabs)/_layout.js
// Bottom tab navigation layout

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import COLORS from '../../src/constants/colors';

const TABS = [
  { name: 'dashboard', emoji: '🏠', label: 'Home' },
  { name: 'customers', emoji: '👥', label: 'Customers' },
  { name: 'reports',   emoji: '📈', label: 'Reports' },
  { name: 'settings',  emoji: '⚙️',  label: 'Settings' },
];

// Must be defined OUTSIDE — same rule as Field in register.js
function TabIcon({ emoji, focused }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.pill, focused && styles.pillActive]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {TABS.map(({ name, emoji, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji={emoji} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bgCard,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 24 : 6,
    paddingHorizontal: 0,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabBarItem: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pill: {
    width: 48,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: COLORS.primaryBg,
  },
  emoji: {
    fontSize: 19,
    lineHeight: 22,
  },
  label: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    letterSpacing: 0.1,
    marginTop: 1,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
