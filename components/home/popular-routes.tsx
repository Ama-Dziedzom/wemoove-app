import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Popular routes in Ghana
const popularRoutes = [
  {
    id: 1,
    from: "Accra",
    to: "Kumasi",
    price: "GHS 120",
    duration: "6 hours",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    from: "Accra",
    to: "Cape Coast",
    price: "GHS 80",
    duration: "3.5 hours",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 3,
    from: "Accra",
    to: "Tamale",
    price: "GHS 180",
    duration: "12 hours",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 4,
    from: "Kumasi",
    to: "Takoradi",
    price: "GHS 100",
    duration: "5 hours",
    image: "/placeholder.svg?height=100&width=200",
  },
]

export function PopularRoutes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {popularRoutes.map((route) => (
        <Link
          key={route.id}
          href={`/bus-list?origin=${encodeURIComponent(route.from)}&destination=${encodeURIComponent(route.to)}`}
        >
          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="h-24 bg-gray-200 relative">
              <img
                src={route.image || "/placeholder.svg"}
                alt={`${route.from} to ${route.to}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center p-4">
                <h3 className="font-montserrat text-lg font-bold text-white">
                  {route.from} to {route.to}
                </h3>
              </div>
            </div>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{route.duration}</p>
                <p className="font-semibold text-gray-800">From {route.price}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-orange-500" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
