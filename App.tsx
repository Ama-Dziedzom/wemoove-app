"use client"

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from 'react';
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { testSupabaseConnection } from "./utils/supabase-test";


// Screens
import { ActivityIndicator, View } from "react-native";
import BookingDetailsScreen from "./screens/BookingDetailsScreen";
import BusListScreen from "./screens/BusListScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import NotificationSettingsScreen from "./screens/NotificationSettingsScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SignupScreen from "./screens/SignupScreen";

// Create navigators
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const AuthStack = createStackNavigator()

// Auth navigator
function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  )
}

// Main tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Bookings") {
            iconName = focused ? "calendar" : "calendar-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          }

          // Fallback icon in case route name doesn't match any of the above
          if (!iconName) {
            iconName = "help" // Using a simpler icon name
          }

          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF5722",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

// Main app stack
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    )
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="BusList"
        component={BusListScreen}
        options={{
          title: "Available Buses",
          headerStyle: {
            backgroundColor: "#FF5722",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{
          title: "Select Seats",
          headerStyle: {
            backgroundColor: "#FF5722",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: "Payment",
          headerStyle: {
            backgroundColor: "#FF5722",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          title: "Booking Confirmed",
          headerStyle: {
            backgroundColor: "#4CAF50",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{
          title: "Notification Settings",
          headerStyle: {
            backgroundColor: "#FF5722",
          },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  // Test Supabase connection on app load
  useEffect(() => {
    testSupabaseConnection().then((isConnected) => {
      if (isConnected) {
        console.log("✅ Supabase is properly configured")
      } else {
        console.warn("⚠️ Supabase connection failed. Check your environment variables.")
      }
    })
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
