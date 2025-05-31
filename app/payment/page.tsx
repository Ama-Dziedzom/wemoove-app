"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PaymentOptions } from "@/components/payment/payment-options"
import { MobileMoneyForm } from "@/components/payment/mobile-money-form"
import { CardPaymentForm } from "@/components/payment/card-payment-form"
import { PaymentSummary } from "@/components/payment/payment-summary"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BottomNavigation } from "@/components/shared/bottom-navigation"

// Mock data for demonstration
const mockBookingDetails = {
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
    priceGHS: 120.0,
  },
  selectedSeats: ["A1", "A2"],
  passengers: [
    { name: "Ama Dankwa", age: 22 },
    { name: "Kwesi Boateng", age: 25 },
  ],
  totalAmountGHS: 240.0,
  paymentStatus: "Pending",
  bookingDate: new Date().toISOString(),
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const busId = searchParams.get("busId")
  const seatsParam = searchParams.get("seats")
  const seats = seatsParam ? seatsParam.split(",") : []

  const [bookingDetails, setBookingDetails] = useState<any | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Simulate API fetch
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // In a real app, this would be an API call to get booking details
        // based on the busId and seats from the query params

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Use mock data with the actual seats from query params
        setBookingDetails({
          ...mockBookingDetails,
          selectedSeats: seats,
          totalAmountGHS: seats.length * 120.0,
        })
        setLoading(false)
      } catch (err) {
        setError("Failed to load booking details. Please try again.")
        setLoading(false)
      }
    }

    if (busId && seats.length > 0) {
      fetchBookingDetails()
    } else {
      setError("Invalid booking information. Please start over.")
      setLoading(false)
    }
  }, [busId, seats])

  const handlePaymentSelect = (method: string) => {
    setSelectedPaymentMethod(method)
  }

  const handleMobileMoneySubmit = async (details: any) => {
    setProcessing(true)
    try {
      // In a real app, this would be an API call to process payment
      // await fetch('/api/payments', { method: 'POST', body: JSON.stringify({ ...details, bookingId }) })

      // Simulate network delay and payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful payment
      router.push("/confirmation")
    } catch (err) {
      setError("Payment processing failed. Please try again.")
      setProcessing(false)
    }
  }

  const handleCardPaymentSubmit = async (details: any) => {
    setProcessing(true)
    try {
      // In a real app, this would be an API call to process card payment

      // Simulate network delay and payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful payment
      router.push("/confirmation")
    } catch (err) {
      setError("Card payment processing failed. Please try again.")
      setProcessing(false)
    }
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
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="container px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Booking Not Found</AlertTitle>
          <AlertDescription>The booking details could not be found.</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/")}>
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-orange-500 text-white p-4">
        <h1 className="font-montserrat text-xl font-bold">Payment</h1>
        <p className="text-sm">Complete your booking by making a payment</p>
      </div>

      <div className="container px-4 py-4">
        <PaymentSummary bookingDetails={bookingDetails} />

        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="font-montserrat text-lg font-bold text-gray-800 mb-4">Select Payment Method</h2>

          <PaymentOptions
            amount={bookingDetails.totalAmountGHS}
            onPaymentSelect={handlePaymentSelect}
            selectedMethod={selectedPaymentMethod}
          />
        </div>

        {selectedPaymentMethod === "mobile-money" && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <MobileMoneyForm onSubmit={handleMobileMoneySubmit} processing={processing} />
          </div>
        )}

        {selectedPaymentMethod === "card" && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <CardPaymentForm onSubmit={handleCardPaymentSubmit} processing={processing} />
          </div>
        )}

        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => router.back()} disabled={processing}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Booking Details
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
