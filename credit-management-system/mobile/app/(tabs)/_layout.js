// mobile/app/(tabs)/_layout.js
// Bottom tab navigation layout — minimal sleek icons

import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../src/constants/colors';

const TABS = [
  { name: 'dashboard', icon: 'home',      label: 'Home' },
  { name: 'customers', icon: 'people',    label: 'Customers' },
  { name: 'reports',   icon: 'bar-chart', label: 'Reports' },
  { name: 'settings',  icon: 'settings',  label: 'Settings' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.bgCard,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 12,
          elevation: 0,
          shadowOpacity: 0, // Very minimal look, no heavy shadows
        },
      }}
    >
      {TABS.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons 
                name={focused ? icon : `${icon}-outline`} 
                size={26} 
                color={color} 
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
