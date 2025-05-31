"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Booking {
  id: string
  bus: {
    operator: string
    route: string
    departureLocation: string
    arrivalLocation: string
    departureTime: string
    arrivalTime: string
  }
  selectedSeats: string[]
  passengers: { name: string; age: number }[]
  totalAmountGHS: number
  paymentStatus: string
  paymentMethod: string
  bookingDate: string
  status: string
}

interface BookingHistoryListProps {
  bookings: Booking[]
  isPastBookings?: boolean
  onCancelRequest?: (bookingId: string) => void
}

export function BookingHistoryList({ bookings, isPastBookings = false, onCancelRequest }: BookingHistoryListProps) {
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
    return format(date, "EEE, MMM d, yyyy")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-500 border-red-200">
            Cancelled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const isCancellable = (booking: Booking) => {
    // Only confirmed bookings that are in the future can be cancelled
    if (booking.status !== "confirmed") return false

    // Check if departure time is at least 24 hours in the future
    const departureTime = new Date(booking.bus.departureTime)
    const now = new Date()
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return hoursUntilDeparture >= 24
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-montserrat text-lg font-bold text-gray-800">{booking.bus.route}</h3>
                <p className="text-sm text-gray-600">{booking.bus.operator}</p>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            <div className="grid grid-cols-2 gap-y-2 mb-3">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{formatDate(booking.bus.departureTime)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{formatTime(booking.bus.departureTime)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-medium">{booking.bus.departureLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">To</p>
                  <p className="font-medium">{booking.bus.arrivalLocation}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {booking.selectedSeats.map((seat) => (
                <Badge key={seat} variant="outline" className="bg-gray-50">
                  Seat {seat}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-montserrat text-lg font-bold text-gray-800">
                  GHS {booking.totalAmountGHS.toFixed(2)}
                </p>
              </div>

              <div className="flex gap-2">
                {booking.status === "confirmed" && (
                  <Link href={`/confirmation?bookingId=${booking.id}`}>
                    <Button variant="outline" size="sm">
                      View Ticket
                    </Button>
                  </Link>
                )}

                {isCancellable(booking) && onCancelRequest && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => onCancelRequest(booking.id)}
                  >
                    Cancel
                  </Button>
                )}

                {booking.status === "cancelled" && (
                  <div className="flex items-center text-sm text-red-500">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Cancelled</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
