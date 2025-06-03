import React from 'react';
import { Tabs } from 'expo-router';
import { 
  Home, 
  Bus, 
  ClipboardList, 
  User
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';

export default function TabsLayout() {
  const { settings } = useAppStore();
  const theme = settings.theme;
  const themeColors = colors[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.inactive,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: themeColors.card,
        },
        headerTintColor: themeColors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
          headerTitle: 'wemoove',
        }}
      />
      <Tabs.Screen
        name="buses"
        options={{
          title: 'Buses',
          tabBarIcon: ({ color, size }) => (
            <Bus size={size} color={color} />
          ),
          headerTitle: 'Find Buses',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
          headerTitle: 'My Bookings',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}