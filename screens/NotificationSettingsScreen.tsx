"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { useNotifications } from "../context/NotificationContext"
import { supabase } from "../lib/supabase"

interface NotificationPreferences {
  booking_updates: boolean
  payment_reminders: boolean
  promotions: boolean
  travel_tips: boolean
}

export default function NotificationSettingsScreen() {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { hasPermission, requestPermissions, sendNotification } = useNotifications()

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    booking_updates: true,
    payment_reminders: true,
    promotions: false,
    travel_tips: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch notification preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("notification_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error
          throw error
        }

        if (data) {
          setPreferences({
            booking_updates: data.booking_updates,
            payment_reminders: data.payment_reminders,
            promotions: data.promotions,
            travel_tips: data.travel_tips,
          })
        } else {
          // If no preferences exist, create default ones
          await savePreferences({
            booking_updates: true,
            payment_reminders: true,
            promotions: false,
            travel_tips: true,
          })
        }
      } catch (error) {
        console.error("Error fetching notification preferences:", error)
        Alert.alert("Error", "Failed to load notification preferences")
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [user])

  // Save notification preferences
  const savePreferences = async (newPreferences: NotificationPreferences) => {
    if (!user) return

    try {
      setSaving(true)
      const { error } = await supabase.from("notification_preferences").upsert({
        user_id: user.id,
        ...newPreferences,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      setPreferences(newPreferences)
      Alert.alert("Success", "Notification preferences saved successfully")
    } catch (error) {
      console.error("Error saving notification preferences:", error)
      Alert.alert("Error", "Failed to save notification preferences")
    } finally {
      setSaving(false)
    }
  }

  // Handle toggle change
  const handleToggle = (key: keyof NotificationPreferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    }
    setPreferences(newPreferences)
    savePreferences(newPreferences)
  }

  // Handle permission request
  const handlePermissionRequest = async () => {
    const granted = await requestPermissions()
    if (!granted) {
      Alert.alert(
        "Permission Required",
        "To receive notifications, you need to grant permission in your device settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      )
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        {/* Permission Status */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Notification Permission</Text>
          <View style={styles.permissionContainer}>
            <View style={styles.permissionStatus}>
              <Ionicons
                name={hasPermission ? "checkmark-circle" : "alert-circle"}
                size={24}
                color={hasPermission ? "#4CAF50" : "#F44336"}
              />
              <Text style={[styles.permissionText, isDark && styles.textDark]}>
                {hasPermission ? "Notifications are enabled" : "Notifications are disabled"}
              </Text>
            </View>
            {!hasPermission && (
              <TouchableOpacity style={styles.permissionButton} onPress={handlePermissionRequest}>
                <Text style={styles.permissionButtonText}>Enable</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Notification Types */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Notification Types</Text>
          <Text style={[styles.sectionDescription, isDark && styles.textDark]}>
            Choose which notifications you want to receive
          </Text>

          <View style={styles.preferenceItem}>
            <View>
              <Text style={[styles.preferenceTitle, isDark && styles.textDark]}>Booking Updates</Text>
              <Text style={styles.preferenceDescription}>Receive notifications about changes to your bookings</Text>
            </View>
            <Switch
              value={preferences.booking_updates}
              onValueChange={() => handleToggle("booking_updates")}
              trackColor={{ false: "#767577", true: "#FF8A65" }}
              thumbColor={preferences.booking_updates ? "#FF5722" : "#f4f3f4"}
              disabled={saving || !hasPermission}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.preferenceItem}>
            <View>
              <Text style={[styles.preferenceTitle, isDark && styles.textDark]}>Payment Reminders</Text>
              <Text style={styles.preferenceDescription}>Get reminders about upcoming payments</Text>
            </View>
            <Switch
              value={preferences.payment_reminders}
              onValueChange={() => handleToggle("payment_reminders")}
              trackColor={{ false: "#767577", true: "#FF8A65" }}
              thumbColor={preferences.payment_reminders ? "#FF5722" : "#f4f3f4"}
              disabled={saving || !hasPermission}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.preferenceItem}>
            <View>
              <Text style={[styles.preferenceTitle, isDark && styles.textDark]}>Promotions & Deals</Text>
              <Text style={styles.preferenceDescription}>Stay informed about special offers and discounts</Text>
            </View>
            <Switch
              value={preferences.promotions}
              onValueChange={() => handleToggle("promotions")}
              trackColor={{ false: "#767577", true: "#FF8A65" }}
              thumbColor={preferences.promotions ? "#FF5722" : "#f4f3f4"}
              disabled={saving || !hasPermission}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.preferenceItem}>
            <View>
              <Text style={[styles.preferenceTitle, isDark && styles.textDark]}>Travel Tips</Text>
              <Text style={styles.preferenceDescription}>Receive helpful travel tips and information</Text>
            </View>
            <Switch
              value={preferences.travel_tips}
              onValueChange={() => handleToggle("travel_tips")}
              trackColor={{ false: "#767577", true: "#FF8A65" }}
              thumbColor={preferences.travel_tips ? "#FF5722" : "#f4f3f4"}
              disabled={saving || !hasPermission}
            />
          </View>
        </View>

        {/* Test Notification */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Test Notifications</Text>
          <Text style={[styles.sectionDescription, isDark && styles.textDark]}>
            Send a test notification to verify your settings
          </Text>
          <TouchableOpacity
            style={[styles.testButton, (!hasPermission || saving) && styles.testButtonDisabled]}
            onPress={() => {
              if (hasPermission) {
                sendNotification("Test Notification", "This is a test notification from Ghana Bus Booking", {
                  type: "test",
                })
              }
            }}
            disabled={!hasPermission || saving}
          >
            <Text style={styles.testButtonText}>Send Test Notification</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionDark: {
    backgroundColor: "#1E1E1E",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  textDark: {
    color: "#fff",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  permissionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  permissionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  permissionButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
  testButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  testButtonDisabled: {
    backgroundColor: "#ffccbc",
  },
  testButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})
