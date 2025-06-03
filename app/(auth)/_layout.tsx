import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useAppStore } from '@/store/app-store';
import { useBookingStore } from '@/store/booking-store';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initializeAuth, isAuthenticated, user } = useAuthStore();
  const { initializeApp, fetchUserNotifications } = useAppStore();
  const { fetchUserBookings } = useBookingStore();
  
  useEffect(() => {
    // Initialize auth and app state
    initializeAuth();
    initializeApp();
    
    // If user is authenticated, fetch their data
    if (isAuthenticated && user) {
      fetchUserNotifications(user.id);
      fetchUserBookings(user.id);
    }
  }, [initializeAuth, initializeApp, isAuthenticated, user, fetchUserNotifications, fetchUserBookings]);
  
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="booking/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="booking/payment" options={{ presentation: 'modal' }} />
        <Stack.Screen name="booking/confirmation" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-payment-method" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}