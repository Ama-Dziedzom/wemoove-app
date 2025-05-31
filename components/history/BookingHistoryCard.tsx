"use client"

import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"

interface BookingHistoryCardProps {
  booking: any
  isPastBooking?: boolean
  onCancelRequest?: (bookingId: string) => void
}

export default function BookingHistoryCard({
  booking,
  isPastBooking = false,
  onCancelRequest,
}: BookingHistoryCardProps) {
  const navigation = useNavigation()
  const { isDark } = useTheme()

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <View style={styles.confirmedBadge}>
            <Text style={styles.confirmedBadgeText}>Confirmed</Text>
          </View>
        )
      case "cancelled":
        return (
          <View style={styles.cancelledBadge}>
            <Text style={styles.cancelledBadgeText}>Cancelled</Text>
          </View>
        )
      case "completed":
        return (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>Completed</Text>
          </View>
        )
      default:
        return (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>{status}</Text>
          </View>
        )
    }
  }

  const isCancellable = (booking: any) => {
    // Only confirmed bookings that are in the future can be cancelled
    if (booking.status !== "confirmed") return false

    // Check if departure time is at least 24 hours in the future
    const departureTime = new Date(booking.buses.departure_time)
    const now = new Date()
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return hoursUntilDeparture >= 24
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.route, isDark && styles.textDark]}>{booking.buses.route}</Text>
          <Text style={styles.operator}>{booking.buses.operator}</Text>
        </View>
        {getStatusBadge(booking.status)}
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
          </View>
          <View>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>
              {formatDate(booking.buses.departure_time)}
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="time-outline" size={16} color="#666" />
          </View>
          <View>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>
              {formatTime(booking.buses.departure_time)}
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="location-outline" size={16} color="#666" />
          </View>
          <View>
            <Text style={styles.infoLabel}>From</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>{booking.buses.departure_location}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="location-outline" size={16} color="#666" />
          </View>
          <View>
            <Text style={styles.infoLabel}>To</Text>
            <Text style={[styles.infoValue, isDark && styles.textDark]}>{booking.buses.arrival_location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.seatsContainer}>
        {booking.selected_seats.map((seat: string) => (
          <View key={seat} style={styles.seatBadge}>
            <Text style={styles.seatText}>Seat {seat}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Amount Paid</Text>
          <Text style={[styles.price, isDark && styles.textDark]}>GHS {booking.total_amount_ghs.toFixed(2)}</Text>
        </View>

        <View style={styles.actions}>
          {booking.status === "confirmed" && (
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate("Confirmation", { bookingId: booking.id })}
            >
              <Text style={styles.viewButtonText}>View Ticket</Text>
            </TouchableOpacity>
          )}

          {isCancellable(booking) && onCancelRequest && (
            <TouchableOpacity style={styles.cancelButton} onPress={() => onCancelRequest(booking.id)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {booking.status === "cancelled" && (
            <View style={styles.cancelledIndicator}>
              <Ionicons name="alert-triangle-outline" size={16} color="#f44336" />
              <Text style={styles.cancelledText}>Cancelled</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  route: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  textDark: {
    color: "#fff",
  },
  operator: {
    fontSize: 14,
    color: "#666",
  },
  confirmedBadge: {
    backgroundColor: "#4CAF50",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  confirmedBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  cancelledBadge: {
    backgroundColor: "transparent",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  cancelledBadgeText: {
    color: "#f44336",
    fontSize: 12,
    fontWeight: "bold",
  },
  completedBadge: {
    backgroundColor: "transparent",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9e9e9e",
  },
  completedBadgeText: {
    color: "#9e9e9e",
    fontSize: 12,
    fontWeight: "bold",
  },
  defaultBadge: {
    backgroundColor: "transparent",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  defaultBadgeText: {
    color: "#2196F3",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    width: "50%",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  seatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  seatBadge: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  seatText: {
    fontSize: 12,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  viewButtonText: {
    fontSize: 12,
    color: "#333",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#f44336",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 12,
    color: "#f44336",
  },
  cancelledIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelledText: {
    fontSize: 12,
    color: "#f44336",
    marginLeft: 4,
  },
})
