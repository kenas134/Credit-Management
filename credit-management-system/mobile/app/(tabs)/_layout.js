// mobile/app/(tabs)/_layout.js
// Bottom tab navigation layout

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../src/constants/colors';

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Dashboard" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👥" label="Customers" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📈" label="Reports" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bgCard,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: { alignItems: 'center', paddingHorizontal: 12 },
  tabItemFocused: {},
  emoji: { fontSize: 22 },
  tabLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  tabLabelFocused: { color: COLORS.primary, fontWeight: '700' },
});
