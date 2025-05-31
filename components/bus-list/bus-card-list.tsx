import Link from "next/link"
import Image from "next/image"
import { Clock, MapPin, Star, Users, Wifi, BatteryCharging, Snowflake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Bus {
  id: string
  operator: string
  route: string
  departureLocation: string
  arrivalLocation: string
  departureTime: string
  arrivalTime: string
  priceGHS: number
  rating: number
  seatsAvailable: number
  totalSeats: number
  amenities: string[]
  imageUrl: string
}

interface BusCardListProps {
  buses: Bus[]
}

export function BusCardList({ buses }: BusCardListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const calculateDuration = (departureTime: string, arrivalTime: string) => {
    const departure = new Date(departureTime)
    const arrival = new Date(arrivalTime)
    const durationMs = arrival.getTime() - departure.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes > 0 ? `${minutes}m` : ""}`
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "ac":
      case "air conditioning":
        return <Snowflake className="h-4 w-4" />
      case "wi-fi":
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "charging port":
        return <BatteryCharging className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4 mt-4">
      {buses.map((bus) => (
        <Card key={bus.id} className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 h-40 md:h-auto relative">
              <Image src={bus.imageUrl || "/placeholder.svg"} alt={bus.operator} fill className="object-cover" />
            </div>

            <CardContent className="p-4 md:w-2/3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-montserrat text-lg font-bold text-gray-800">{bus.operator}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{bus.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-montserrat text-xl font-bold text-gray-800">GHS {bus.priceGHS.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">per person</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-semibold">{formatTime(bus.departureTime)}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{bus.departureLocation}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-semibold">{formatTime(bus.arrivalTime)}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{bus.arrivalLocation}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>Duration: {calculateDuration(bus.departureTime, bus.arrivalTime)}</span>

                <span className="mx-2">•</span>

                <Users className="h-4 w-4 mr-1" />
                <span>{bus.seatsAvailable} seats left</span>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="flex gap-2">
                  {bus.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </Badge>
                  ))}
                </div>

                <Link href={`/booking-details/${bus.id}`}>
                  <Button className="bg-orange-500 hover:bg-orange-600">Select</Button>
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
