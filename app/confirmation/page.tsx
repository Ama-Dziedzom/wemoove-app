"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Download, Share2, Home, Calendar } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BottomNavigation } from "@/components/shared/bottom-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import QRCode from "@/components/confirmation/qr-code"

// Mock data for demonstration
const mockConfirmation = {
  bookingId: "BKNG456",
  userId: "USER789",
  bus: {
    id: "BUS123",
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
  bookingDate: new Date().toISOString(),
  ticketUrl: "/placeholder.svg?height=200&width=300",
}

export default function ConfirmationPage() {
  const router = useRouter()

  const [confirmation, setConfirmation] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate API fetch
  useEffect(() => {
    const fetchConfirmation = async () => {
      try {
        // In a real app, this would be an API call to get confirmation details

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setConfirmation(mockConfirmation)
        setLoading(false)
      } catch (err) {
        setError("Failed to load confirmation details. Your booking may still be successful.")
        setLoading(false)
      }
    }

    fetchConfirmation()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="container px-4 py-6 space-y-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
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
        <Button variant="outline" className="mt-4" onClick={() => router.push("/history")}>
          Check Booking History
        </Button>
      </div>
    )
  }

  if (!confirmation) {
    return (
      <div className="container px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Confirmation Not Found</AlertTitle>
          <AlertDescription>The booking confirmation could not be found.</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-green-500 text-white p-4 text-center">
        <h1 className="font-montserrat text-xl font-bold">Booking Confirmed!</h1>
        <p className="text-sm">Your e-ticket has been generated</p>
      </div>

      <div className="container px-4 py-4">
        <Card className="border-green-200 shadow-md overflow-hidden">
          <div className="bg-green-50 p-4 border-b border-green-200 flex justify-between items-center">
            <div>
              <h2 className="font-montserrat text-lg font-bold text-gray-800">E-Ticket</h2>
              <p className="text-sm text-gray-600">Booking ID: {confirmation.bookingId}</p>
            </div>
            <Badge className="bg-green-500">Confirmed</Badge>
          </div>

          <CardContent className="p-4">
            <div className="flex justify-center mb-4">
              <QRCode value={confirmation.bookingId} size={150} />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-montserrat text-sm font-semibold text-gray-600">Route</h3>
                <p className="font-montserrat text-lg font-bold text-gray-800">{confirmation.bus.route}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-montserrat text-sm font-semibold text-gray-600">Departure</h3>
                  <p className="font-montserrat text-base font-bold text-gray-800">
                    {formatTime(confirmation.bus.departureTime)}
                  </p>
                  <p className="text-sm text-gray-600">{formatDate(confirmation.bus.departureTime)}</p>
                  <p className="text-sm text-gray-600">{confirmation.bus.departureLocation}</p>
                </div>

                <div>
                  <h3 className="font-montserrat text-sm font-semibold text-gray-600">Arrival</h3>
                  <p className="font-montserrat text-base font-bold text-gray-800">
                    {formatTime(confirmation.bus.arrivalTime)}
                  </p>
                  <p className="text-sm text-gray-600">{formatDate(confirmation.bus.arrivalTime)}</p>
                  <p className="text-sm text-gray-600">{confirmation.bus.arrivalLocation}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-montserrat text-sm font-semibold text-gray-600">Operator</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-8 w-8 bg-gray-200 rounded-full overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt={confirmation.bus.operator}
                      width={32}
                      height={32}
                    />
                  </div>
                  <p className="font-montserrat text-base font-bold text-gray-800">{confirmation.bus.operator}</p>
                </div>
              </div>

              <div>
                <h3 className="font-montserrat text-sm font-semibold text-gray-600">Passengers & Seats</h3>
                <div className="mt-1 space-y-2">
                  {confirmation.passengers.map((passenger: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <p className="text-gray-800">{passenger.name}</p>
                      <p className="font-semibold text-gray-800">Seat {confirmation.selectedSeats[index]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <h3 className="font-montserrat text-sm font-semibold text-gray-600">Payment Method</h3>
                <p className="text-gray-800">{confirmation.paymentMethod}</p>
              </div>

              <div className="flex justify-between">
                <h3 className="font-montserrat text-sm font-semibold text-gray-600">Amount Paid</h3>
                <p className="font-montserrat text-lg font-bold text-gray-800">
                  GHS {confirmation.totalAmountGHS.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-4">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="h-4 w-4" /> Save Ticket
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>

        <div className="mt-4 flex gap-4">
          <Button className="flex-1 gap-2 bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/")}>
            <Home className="h-4 w-4" /> Home
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={() => router.push("/history")}>
            <Calendar className="h-4 w-4" /> My Bookings
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
