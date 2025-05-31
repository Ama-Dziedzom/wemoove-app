"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { BusCardList } from "@/components/bus-list/bus-card-list"
import { FilterSortControls } from "@/components/bus-list/filter-sort-controls"
import { SearchSummary } from "@/components/bus-list/search-summary"
import { BottomNavigation } from "@/components/shared/bottom-navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for demonstration
const mockBuses = [
  {
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
  },
  {
    id: "BUS124",
    operator: "STC",
    route: "Accra to Kumasi",
    departureLocation: "Accra (Tudu)",
    arrivalLocation: "Kumasi (Adum)",
    departureTime: "2025-06-01T09:30:00Z",
    arrivalTime: "2025-06-01T15:30:00Z",
    priceGHS: 100.0,
    rating: 4.2,
    seatsAvailable: 15,
    totalSeats: 45,
    amenities: ["AC", "Refreshments"],
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "BUS125",
    operator: "OA Travel & Tours",
    route: "Accra to Kumasi",
    departureLocation: "Accra (Lapaz)",
    arrivalLocation: "Kumasi (Adum)",
    departureTime: "2025-06-01T10:00:00Z",
    arrivalTime: "2025-06-01T16:00:00Z",
    priceGHS: 90.0,
    rating: 3.8,
    seatsAvailable: 25,
    totalSeats: 40,
    amenities: ["AC"],
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]

export default function BusListPage() {
  const searchParams = useSearchParams()
  const origin = searchParams.get("origin") || ""
  const destination = searchParams.get("destination") || ""
  const date = searchParams.get("date") || ""

  const [buses, setBuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate API fetch
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        // In a real app, this would be an API call
        // await fetch(`/api/buses?origin=${origin}&destination=${destination}&date=${date}`)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setBuses(mockBuses)
        setLoading(false)
      } catch (err) {
        setError("Failed to load buses. Please try again later.")
        setLoading(false)
      }
    }

    fetchBuses()
  }, [origin, destination, date])

  const [sortBy, setSortBy] = useState("departureTime")
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500,
    amenities: [] as string[],
    operators: [] as string[],
  })

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    // In a real app, this would re-sort the buses array
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    // In a real app, this would filter the buses array
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-orange-500 text-white p-4">
        <SearchSummary origin={origin} destination={destination} date={date} />
      </div>

      <div className="container px-4 py-4">
        <FilterSortControls
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          filters={filters}
        />

        {loading ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : buses.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="font-montserrat text-xl font-semibold text-gray-700">No buses found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your search criteria or date</p>
          </div>
        ) : (
          <BusCardList buses={buses} />
        )}
      </div>

      <BottomNavigation />
    </main>
  )
}
