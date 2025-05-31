"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useNotifications } from "../../context/NotificationContext"
import { useAuth } from "../../context/AuthContext"

export default function NotificationTester() {
  const { hasPermission, requestPermissions, sendNotification } = useNotifications()
  const { user } = useAuth()
  const [testing, setTesting] = useState(false)

  const testLocalNotification = async () => {
    if (!hasPermission) {
      Alert.alert("Permission Required", "Please enable notifications first")
      return
    }

    setTesting(true)
    try {
      await sendNotification(
        "Test Notification",
        "This is a test notification from Ghana Bus Booking app running on Expo Go!",
        { type: "test", timestamp: Date.now() },
      )
      Alert.alert("Success", "Test notification sent!")
    } catch (error) {
      console.error("Error sending test notification:", error)
      Alert.alert("Error", "Failed to send test notification")
    } finally {
      setTesting(false)
    }
  }

  const requestNotificationPermission = async () => {
    const granted = await requestPermissions()
    if (granted) {
      Alert.alert("Success", "Notification permissions granted!")
    } else {
      Alert.alert("Permission Denied", "Notification permissions were not granted")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Testing (Expo Go)</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Permission Status: {hasPermission ? "✅ Granted" : "❌ Not Granted"}</Text>
        {user && <Text style={styles.statusText}>User ID: {user.id.substring(0, 8)}...</Text>}
      </View>

      <View style={styles.buttonContainer}>
        {!hasPermission && (
          <TouchableOpacity style={styles.button} onPress={requestNotificationPermission}>
            <Text style={styles.buttonText}>Request Permission</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, (!hasPermission || testing) && styles.buttonDisabled]}
          onPress={testLocalNotification}
          disabled={!hasPermission || testing}
        >
          <Text style={styles.buttonText}>{testing ? "Sending..." : "Send Test Notification"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        This test works in Expo Go. For production apps, you'll need to build a standalone app or development build.
      </Text>
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
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
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
