import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get Supabase URL and anonymous key from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://rvwzhcgggikecextuiiu.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d3poY2dnZ2lrZWNleHR1aWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NDE4NDMsImV4cCI6MjA2MjIxNzg0M30.6OnlKZEdoc_Q_lRmNIM2yrJxAtvivTsjdhkiBxXkJ-8';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Log connection status
console.log('Supabase client initialized with URL:', supabaseUrl);