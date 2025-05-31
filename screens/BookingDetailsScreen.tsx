"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"
import BookingSummaryCard from "../components/booking-details/BookingSummaryCard"
import SeatSelectionGrid from "../components/booking-details/SeatSelectionGrid"
import PassengerForm from "../components/booking-details/PassengerForm"

export default function BookingDetailsScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const { user } = useAuth()

  const { busId } = route.params as any

  const [bus, setBus] = useState<any | null>(null)
  const [seats, setSeats] = useState<any[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengers, setPassengers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch bus details and seats from Supabase
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true)

        // Fetch bus details
        const { data: busData, error: busError } = await supabase.from("buses").select("*").eq("id", busId).single()

        if (busError) throw busError

        // Fetch seats for this bus
        const { data: seatsData, error: seatsError } = await supabase
          .from("seats")
          .select("*")
          .eq("bus_id", busId)
          .order("seat_id", { ascending: true })

        if (seatsError) throw seatsError

        setBus(busData)
        setSeats(seatsData || [])
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching bus details:", err)
        setError(err.message || "Failed to load bus details. Please try again later.")
        setLoading(false)
      }
    }

    fetchBusDetails()
  }, [busId])

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId)
      } else {
        if (prev.length < 4) {
          // Limit to 4 seats per booking
          return [...prev, seatId]
        }
        return prev
      }
    })
  }

  const handlePassengerChange = (index: number, data: any) => {
    setPassengers((prev) => {
      const newPassengers = [...prev]
      newPassengers[index] = { ...newPassengers[index], ...data }
      return newPassengers
    })
  }

  // Update passengers array when seats change
  useEffect(() => {
    setPassengers(
      selectedSeats.map((seat, index) => ({
        id: index,
        seatId: seat,
        name: "",
        age: "",
        isValid: false,
      })),
    )
  }, [selectedSeats])

  const isFormValid = () => {
    return selectedSeats.length > 0 && passengers.length === selectedSeats.length && passengers.every((p) => p.isValid)
  }

  const handleProceedToPayment = () => {
    if (!user) {
      Alert.alert("Authentication Required", "Please log in to continue with your booking.")
      return
    }

    if (isFormValid()) {
      navigation.navigate("Payment", {
        busId,
        selectedSeats,
        passengers,
      })
    } else {
      Alert.alert("Incomplete Information", "Please complete all passenger details before proceeding.")
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
        <Text style={styles.loadingText}>Loading bus details...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={24} color="#f44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true)
            setError(null)
            // Retry fetching bus details
            setTimeout(() => {
              // This will trigger the useEffect again
              navigation.setParams({ busId: busId })
            }, 500)
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!bus) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={24} color="#f44336" />
        <Text style={styles.errorText}>Bus not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        <BookingSummaryCard bus={bus} selectedSeats={selectedSeats} passengers={passengers} />

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Select Your Seats</Text>
          <Text style={[styles.sectionSubtitle, isDark && styles.textDark]}>
            Select up to 4 seats. Premium seats have extra legroom.
          </Text>

          <SeatSelectionGrid availableSeats={seats} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
        </View>

        {selectedSeats.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Passenger Details</Text>

            {passengers.map((passenger, index) => (
              <PassengerForm
                key={index}
                seatId={passenger.seatId}
                index={index}
                onChange={(data) => handlePassengerChange(index, data)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.proceedButton, !isFormValid() && styles.proceedButtonDisabled]}
          onPress={handleProceedToPayment}
          disabled={!isFormValid()}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
    padding: 16,
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
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  bottomBar: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  proceedButton: {
    backgroundColor: "#FF5722",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  proceedButtonDisabled: {
    backgroundColor: "#ffccbc",
  },
  proceedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
