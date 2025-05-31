"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import * as Notifications from "expo-notifications"

export default function NotificationTest() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const requestPermissions = async () => {
    setLoading(true)
    try {
      const { status } = await Notifications.requestPermissionsAsync()
      const granted = status === "granted"
      setHasPermission(granted)

      if (granted) {
        Alert.alert("Success", "Notification permissions granted!")
      } else {
        Alert.alert("Permission Denied", "Notification permissions were not granted")
      }
    } catch (error) {
      console.error("Error requesting permissions:", error)
      Alert.alert("Error", "Failed to request notification permissions")
    } finally {
      setLoading(false)
    }
  }

  const sendTestNotification = async () => {
    if (!hasPermission) {
      Alert.alert("Permission Required", "Please grant notification permissions first")
      return
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification 🚌",
          body: "This is a test notification from Ghana Bus Booking!",
          data: { type: "test" },
        },
        trigger: null, // Show immediately
      })
      Alert.alert("Success", "Test notification sent!")
    } catch (error) {
      console.error("Error sending notification:", error)
      Alert.alert("Error", "Failed to send test notification")
    }
  }

  const getPermissionStatus = () => {
    if (hasPermission === null) return "❓ Unknown"
    return hasPermission ? "✅ Granted" : "❌ Denied"
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Test</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Permission Status: {getPermissionStatus()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={requestPermissions}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Requesting..." : "Request Permissions"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (!hasPermission || loading) && styles.buttonDisabled]}
          onPress={sendTestNotification}
          disabled={!hasPermission || loading}
        >
          <Text style={styles.buttonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>Test notifications work in Expo Go on real devices</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  statusContainer: {
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ffccbc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
})
