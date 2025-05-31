"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"
import BookingHistoryCard from "../components/history/BookingHistoryCard"
import CancellationModal from "../components/history/CancellationModal"

export default function HistoryScreen() {
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const { user } = useAuth()

  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [cancellationBookingId, setCancellationBookingId] = useState<string | null>(null)
  const [cancellationLoading, setCancellationLoading] = useState(false)

  // Fetch bookings from Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Fetch bookings with bus details
        const { data, error: bookingsError } = await supabase
          .from("bookings")
          .select(`
            *,
            buses:bus_id (
              operator,
              route,
              departure_location,
              arrival_location,
              departure_time,
              arrival_time
            )
          `)
          .eq("user_id", user.id)
          .order("booking_date", { ascending: false })

        if (bookingsError) throw bookingsError

        setBookings(data || [])
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching bookings:", err)
        setError(err.message || "Failed to load booking history. Please try again later.")
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const handleCancellationRequest = (bookingId: string) => {
    setCancellationBookingId(bookingId)
  }

  const handleCancellationConfirm = async (bookingId: string) => {
    setCancellationLoading(true)
    try {
      // Update booking status in Supabase
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId)

      if (error) throw error

      // Update local state to reflect cancellation
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)),
      )

      setCancellationBookingId(null)
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to cancel booking. Please try again later.")
    } finally {
      setCancellationLoading(false)
    }
  }

  const handleCancellationCancel = () => {
    setCancellationBookingId(null)
  }

  const filterBookings = () => {
    const now = new Date()

    if (activeTab === "upcoming") {
      return bookings.filter(
        (booking) => booking.status === "confirmed" && new Date(booking.buses.departure_time) > now,
      )
    } else {
      return bookings.filter(
        (booking) =>
          booking.status === "completed" ||
          booking.status === "cancelled" ||
          new Date(booking.buses.departure_time) <= now,
      )
    }
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{activeTab === "upcoming" ? "No upcoming bookings" : "No past bookings"}</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "upcoming"
          ? "Book a bus to see your upcoming trips here"
          : "Your completed trips will appear here"}
      </Text>
      {activeTab === "upcoming" && (
        <TouchableOpacity style={styles.bookButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.bookButtonText}>Book a Trip</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.notAuthContainer}>
          <Ionicons name="log-in-outline" size={48} color="#FF5722" />
          <Text style={styles.notAuthTitle}>Login Required</Text>
          <Text style={styles.notAuthSubtitle}>Please login to view your bookings</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>View and manage your bookings</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text style={[styles.tabText, activeTab === "past" && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5722" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true)
              setError(null)
              // This will trigger the useEffect again
              setTimeout(() => setLoading(false), 500)
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filterBookings()}
          renderItem={({ item }) => (
            <BookingHistoryCard
              booking={item}
              isPastBooking={activeTab === "past"}
              onCancelRequest={handleCancellationRequest}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      {cancellationBookingId && (
        <CancellationModal
          bookingId={cancellationBookingId}
          onConfirm={handleCancellationConfirm}
          onCancel={handleCancellationCancel}
          loading={cancellationLoading}
        />
      )}
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
  header: {
    backgroundColor: "#FF5722",
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: -8,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF5722",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FF5722",
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FF5722",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notAuthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
