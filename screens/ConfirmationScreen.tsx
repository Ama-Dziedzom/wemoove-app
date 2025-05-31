"use client"

import { useNavigation, useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Alert, Share, Text, View } from "react-native"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { supabase } from "../lib/supabase"
import { sendBookingConfirmationNotification } from "../utils/notification-service"

export default function ConfirmationScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const { user } = useAuth()

  const { bookingId } = route.params as any

  const [booking, setBooking] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch booking details from Supabase
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("Booking ID is missing")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Fetch booking with bus details
        const { data, error: bookingError } = await supabase
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
          .eq("id", bookingId)
          .single()

        if (bookingError) throw bookingError

        setBooking(data)

        // Send confirmation notification
        if (user && data) {
          sendBookingConfirmationNotification(user.id, data.id, data.buses.route, data.buses.departure_time).catch(
            (err) => console.error("Error sending notification:", err),
          )
        }
      } catch (err: any) {
        console.error("Error fetching booking details:", err)
        setError(err.message || "Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingId, user])

  // Add a function to share the booking details
  const shareBooking = async () => {
    if (!booking) return

    try {
      const departureDate = new Date(booking.buses.departure_time).toLocaleDateString()
      const departureTime = new Date(booking.buses.departure_time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })

      const message = `I've booked a bus trip with Ghana Bus Booking!\n\nRoute: ${booking.buses.route}\nDate: ${departureDate}\nTime: ${departureTime}\nOperator: ${booking.buses.operator}\nBooking ID: ${booking.id}`

      await Share.share({
        message,
        title: "My Bus Booking",
      })
    } catch (error) {
      console.error("Error sharing booking:", error)
      Alert.alert("Error", "Failed to share booking details")
    }
  }

  return (
    <View>
      <Text>Booking Confirmation</Text>
    </View>
  );
}
