"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookingHistoryList } from "@/components/history/booking-history-list"
import { CancellationConfirmationModal } from "@/components/history/cancellation-confirmation-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BottomNavigation } from "@/components/shared/bottom-navigation"

// Mock data for demonstration
const mockBookings = [
  {
    id: "BKNG456",
    bus: {
      operator: "VIP Jeoun",
      route: "Accra to Kumasi",
      departureLocation: "Accra (Circle)",
      arrivalLocation: "Kumasi (Adum)",
      departureTime: "2025-06-01T08:00:00Z",
      arrivalTime: "2025-06-01T14:00:00Z",
    },
    selectedSeats: ["A1", "A2"],
    passengers: [
      { name: "Ama Dankwa", age: 22 },
      { name: "Kwesi Boateng", age: 25 },
    ],
    totalAmountGHS: 240.0,
    paymentStatus: "Paid",
    paymentMethod: "MTN Mobile Money",
    bookingDate: "2025-05-20T10:30:00Z",
    status: "confirmed",
  },
  {
    id: "BKNG457",
    bus: {
      operator: "STC",
      route: "Accra to Tamale",
      departureLocation: "Accra (Tudu)",
      arrivalLocation: "Tamale Station",
      departureTime: "2025-06-15T06:00:00Z",
      arrivalTime: "2025-06-15T18:00:00Z",
    },
    selectedSeats: ["B3"],
    passengers: [{ name: "Ama Dankwa", age: 22 }],
    totalAmountGHS: 180.0,
    paymentStatus: "Paid",
    paymentMethod: "Vodafone Cash",
    bookingDate: "2025-05-18T14:15:00Z",
    status: "confirmed",
  },
  {
    id: "BKNG458",
    bus: {
      operator: "OA Travel & Tours",
      route: "Accra to Cape Coast",
      departureLocation: "Accra (Lapaz)",
      arrivalLocation: "Cape Coast Station",
      departureTime: "2025-05-10T10:00:00Z",
      arrivalTime: "2025-05-10T13:30:00Z",
    },
    selectedSeats: ["C5"],
    passengers: [{ name: "Ama Dankwa", age: 22 }],
    totalAmountGHS: 80.0,
    paymentStatus: "Paid",
    paymentMethod: "MTN Mobile Money",
    bookingDate: "2025-05-01T09:45:00Z",
    status: "completed",
  },
]

export default function HistoryPage() {
  const router = useRouter()

  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [cancellationBookingId, setCancellationBookingId] = useState<string | null>(null)
  const [cancellationLoading, setCancellationLoading] = useState(false)

  // Simulate API fetch
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real app, this would be an API call
        // await fetch('/api/bookings/history')

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setBookings(mockBookings)
        setLoading(false)
      } catch (err) {
        setError("Failed to load booking history. Please try again later.")
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancellationRequest = (bookingId: string) => {
    setCancellationBookingId(bookingId)
  }

  const handleCancellationConfirm = async (bookingId: string) => {
    setCancellationLoading(true)
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PUT' })

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update local state to reflect cancellation
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)),
      )

      setCancellationBookingId(null)
      setCancellationLoading(false)
    } catch (err) {
      setError("Failed to cancel booking. Please try again later.")
      setCancellationLoading(false)
    }
  }

  const handleCancellationCancel = () => {
    setCancellationBookingId(null)
  }

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "confirmed" && new Date(booking.bus.departureTime) > new Date(),
  )

  const pastBookings = bookings.filter(
    (booking) =>
      booking.status === "completed" ||
      booking.status === "cancelled" ||
      new Date(booking.bus.departureTime) <= new Date(),
  )

  if (loading) {
    return (
      <div className="container px-4 py-6 space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
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

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-orange-500 text-white p-4">
        <h1 className="font-montserrat text-xl font-bold">My Bookings</h1>
        <p className="text-sm">View and manage your bookings</p>
      </div>

      <div className="container px-4 py-4">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-montserrat text-lg font-semibold text-gray-700">No upcoming bookings</h3>
                <p className="text-gray-600 mt-2">Book a bus to see your upcoming trips here</p>
              </div>
            ) : (
              <BookingHistoryList bookings={upcomingBookings} onCancelRequest={handleCancellationRequest} />
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            {pastBookings.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-montserrat text-lg font-semibold text-gray-700">No past bookings</h3>
                <p className="text-gray-600 mt-2">Your completed trips will appear here</p>
              </div>
            ) : (
              <BookingHistoryList bookings={pastBookings} isPastBookings={true} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {cancellationBookingId && (
        <CancellationConfirmationModal
          bookingId={cancellationBookingId}
          onConfirm={handleCancellationConfirm}
          onCancel={handleCancellationCancel}
          loading={cancellationLoading}
        />
      )}

      <BottomNavigation />
    </main>
  )
}
