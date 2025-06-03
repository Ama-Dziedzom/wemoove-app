import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Bus Booking",
  slug: "bus-booking",
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rvwzhcgggikecextuiiu.supabase.co',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d3poY2dnZ2lrZWNleHR1aWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDE4NDMsImV4cCI6MjA2MjIxNzg0M30.6OnlKZEdoc_Q_lRmNIM2yrJxAtvivTsjdhkiBxXkJ-8',
  },
});