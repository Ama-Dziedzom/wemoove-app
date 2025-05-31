import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoTrueClient } from '@supabase/gotrue-js';
import { PostgrestClient } from '@supabase/postgrest-js';
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import NotificationTester from "../components/notifications/NotificationTester";
import NotificationTest from "../components/test/NotificationTest";
import SupabaseConnectionTest from "../components/test/SupabaseConnectionTest";

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium">Welcome to the App!</Text>
        <Text variant="bodyLarge" style={styles.paragraph}>
          This is the home screen of your application. You can add any content you want here.
        </Text>
        <NotificationTester />
        {/* Supabase Connection Test - Remove this in production */}
        <SupabaseConnectionTest />
        {/* Notification Test - Remove this in production */}
        <NotificationTest />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    marginTop: 20,
    textAlign: "center",
  },
})

// Your Supabase config
const supabaseUrl = 'EXPO_PUBLIC_SUPABASE_URL=https://rvwzhcgggikecextuiiu.supabase.co' // Replace with your Supabase URL
const supabaseAnonKey = 'EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d3poY2dnZ2lrZWNleHR1aWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDE4NDMsImV4cCI6MjA2MjIxNzg0M30.6OnlKZEdoc_Q_lRmNIM2yrJxAtvivTsjdhkiBxXkJ-8'; // Replace with your Supabase Anon Key

// Auth client setup
export const auth = new GoTrueClient({
  url: `${supabaseUrl}/auth/v1`,
  autoRefreshToken: true,
  persistSession: true,
  storageKey: 'supabase.auth.token',
  storage: AsyncStorage,
  fetch: fetch, // Use native fetch API for networking
});

// DB client setup (for querying data)
export const db = new PostgrestClient(`${supabaseUrl}/rest/v1`, {
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
  fetch: fetch, // Use native fetch API
});

// You might also need a way to access the combined client if you use functions
// that require both auth and db, but often you can use auth and db separately.
// If you need the combined client for specific cases (like invoking functions),
// you might need a different approach or a polyfill for ws if you do use Realtime.

export default HomeScreen
