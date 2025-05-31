"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookingSummaryCard } from "@/components/booking-details/booking-summary-card"
import { SeatSelectionGrid } from "@/components/booking-details/seat-selection-grid"
import { PassengerForm } from "@/components/booking-details/passenger-form"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BottomNavigation } from "@/components/shared/bottom-navigation"

// Mock data for demonstration
const mockBus = {
  id: "BUS123",
  operator: "VIP Jeoun",
  route: "Accra to Kumasi",
  departureLocation: "Accra (Circle)",
  arrivalLocation: "Kumasi (Adum)",
  departureTime: "2025-06-01T08:00:00Z",
  arrivalTime: "2025-06-01T14:00:00Z",
  priceGHS: 120.0,
  rating: 4.5,
  seatsAvailable: 30,
  totalSeats: 50,
  amenities: ["AC", "Wi-Fi", "Charging Port"],
  imageUrl: "/placeholder.svg?height=200&width=300",
}

const mockSeats = Array.from({ length: 50 }, (_, i) => ({
  id: `${String.fromCharCode(65 + Math.floor(i / 10))}${(i % 10) + 1}`,
  isAvailable: Math.random() > 0.3,
  type: Math.random() > 0.8 ? "premium" : "standard",
}))

export default function BookingDetailsPage({ params }: { params: { busId: string } }) {
  const router = useRouter()
  const { busId } = params

  const [bus, setBus] = useState<any | null>(null)
  const [seats, setSeats] = useState<any[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengers, setPassengers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate API fetch
  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        // In a real app, this would be an API call
        // await fetch(`/api/buses/${busId}`)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setBus(mockBus)
        setSeats(mockSeats)
        setLoading(false)
      } catch (err) {
        setError("Failed to load bus details. Please try again later.")
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
    if (isFormValid()) {
      // In a real app, this would store the booking details in state/context
      // or pass them as query parameters
      router.push(`/payment?busId=${busId}&seats=${selectedSeats.join(",")}`)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-6 space-y-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!bus) {
    return (
      <div className="container px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bus Not Found</AlertTitle>
          <AlertDescription>The requested bus could not be found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-orange-500 text-white p-4">
        <h1 className="font-montserrat text-xl font-bold">Select Your Seats</h1>
        <p className="text-sm">
          {bus.route} - {new Date(bus.departureTime).toLocaleDateString()}
        </p>
      </div>

      <div className="container px-4 py-4">
        <BookingSummaryCard bus={bus} selectedSeats={selectedSeats} passengers={passengers} />

        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="font-montserrat text-lg font-bold text-gray-800 mb-4">Select Your Seats</h2>
          <p className="text-sm text-gray-600 mb-4">Select up to 4 seats. Premium seats have extra legroom.</p>

          <SeatSelectionGrid availableSeats={seats} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
        </div>

        {selectedSeats.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 className="font-montserrat text-lg font-bold text-gray-800 mb-4">Passenger Details</h2>

            {passengers.map((passenger, index) => (
              <PassengerForm
                key={index}
                seatId={passenger.seatId}
                index={index}
                onChange={(data) => handlePassengerChange(index, data)}
              />
            ))}
          </div>
        )}

        <div className="mt-6 sticky bottom-16 bg-white p-4 border-t border-gray-200 shadow-md">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
            disabled={!isFormValid()}
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
