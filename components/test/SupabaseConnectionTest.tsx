"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { supabase } from "../../lib/supabase"

export default function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<"testing" | "connected" | "failed">("testing")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      // Test the connection by trying to get the current session
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Supabase connection error:", error)
        setConnectionStatus("failed")
        Alert.alert("Connection Failed", `Error: ${error.message}`)
      } else {
        console.log("✅ Supabase connection successful")
        setConnectionStatus("connected")
        Alert.alert("Success", "Supabase connection is working!")
      }
    } catch (error) {
      console.error("Supabase connection error:", error)
      setConnectionStatus("failed")
      Alert.alert("Connection Failed", "Unable to connect to Supabase")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Test connection on component mount
    testConnection()
  }, [])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "#4CAF50"
      case "failed":
        return "#F44336"
      default:
        return "#FF9800"
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "✅ Connected"
      case "failed":
        return "❌ Failed"
      default:
        return "🔄 Testing..."
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>

      <View style={styles.envInfo}>
        <Text style={styles.envLabel}>Supabase URL:</Text>
        <Text style={styles.envValue}>
          {process.env.EXPO_PUBLIC_SUPABASE_URL
            ? `${process.env.EXPO_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
            : "Not found"}
        </Text>

        <Text style={styles.envLabel}>Anon Key:</Text>
        <Text style={styles.envValue}>
          {process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
            ? `${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
            : "Not found"}
        </Text>
      </View>

      <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <TouchableOpacity
        style={[styles.testButton, loading && styles.testButtonDisabled]}
        onPress={testConnection}
        disabled={loading}
      >
        <Text style={styles.testButtonText}>{loading ? "Testing..." : "Test Connection"}</Text>
      </TouchableOpacity>
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
  envInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  envLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginTop: 8,
  },
  envValue: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  testButton: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
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
