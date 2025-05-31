import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface BookingSummaryCardProps {
  bus: any
  selectedSeats: string[]
  passengers: any[]
}

export function BookingSummaryCard({ bus, selectedSeats, passengers }: BookingSummaryCardProps) {
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

  const calculateTotalPrice = () => {
    return selectedSeats.length * bus.priceGHS
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardContent className="p-4">
        <h2 className="font-montserrat text-lg font-bold text-gray-800 mb-2">Booking Summary</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Bus Operator</p>
              <p className="font-semibold">{bus.operator}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{formatDate(bus.departureTime)}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Departure</p>
              <p className="font-semibold">{formatTime(bus.departureTime)}</p>
              <p className="text-sm text-gray-600">{bus.departureLocation}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Arrival</p>
              <p className="font-semibold">{formatTime(bus.arrivalTime)}</p>
              <p className="text-sm text-gray-600">{bus.arrivalLocation}</p>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <>
              <Separator />

              <div>
                <p className="text-sm text-gray-600">Selected Seats</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <p>Price per seat</p>
                <p>GHS {bus.priceGHS.toFixed(2)}</p>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <p>Number of seats</p>
                <p>{selectedSeats.length}</p>
              </div>

              <Separator />

              <div className="flex justify-between font-montserrat text-lg font-bold">
                <p>Total Price</p>
                <p>GHS {calculateTotalPrice().toFixed(2)}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
