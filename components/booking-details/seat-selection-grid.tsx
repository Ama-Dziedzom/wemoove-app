"use client"
import { NavigationIcon as Steering } from "lucide-react"

interface Seat {
  id: string
  isAvailable: boolean
  type: string
}

interface SeatSelectionGridProps {
  availableSeats: Seat[]
  selectedSeats: string[]
  onSeatSelect: (seatId: string) => void
}

export function SeatSelectionGrid({ availableSeats, selectedSeats, onSeatSelect }: SeatSelectionGridProps) {
  // Group seats by row (A, B, C, etc.)
  const seatsByRow = availableSeats.reduce(
    (acc, seat) => {
      const row = seat.id.charAt(0)
      if (!acc[row]) {
        acc[row] = []
      }
      acc[row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>,
  )

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort()

  return (
    <div className="mb-4">
      <div className="flex justify-center mb-6 bg-gray-100 p-3 rounded-lg">
        <div className="flex items-center justify-center w-20 h-10 bg-gray-300 rounded-md">
          <Steering className="h-6 w-6 text-gray-600" />
        </div>
      </div>

      <div className="space-y-4">
        {sortedRows.map((row) => (
          <div key={row} className="flex justify-center gap-2">
            {seatsByRow[row].map((seat) => (
              <button
                key={seat.id}
                disabled={!seat.isAvailable}
                onClick={() => onSeatSelect(seat.id)}
                className={`
                  w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium
                  ${
                    !seat.isAvailable
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : selectedSeats.includes(seat.id)
                        ? "bg-green-500 text-white"
                        : seat.type === "premium"
                          ? "bg-orange-100 text-orange-800 border border-orange-300"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                `}
                aria-label={`Seat ${seat.id}`}
                aria-pressed={selectedSeats.includes(seat.id)}
              >
                {seat.id}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <span className="text-sm text-gray-600">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-100 border border-orange-300 rounded"></div>
          <span className="text-sm text-gray-600">Premium</span>
        </div>
      </div>
    </div>
  )
}
