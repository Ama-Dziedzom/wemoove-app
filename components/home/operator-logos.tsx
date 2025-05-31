import Image from "next/image"

// Major bus operators in Ghana
const operators = [
  {
    id: 1,
    name: "VIP Jeoun",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "STC",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "OA Travel & Tours",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Metro Mass Transit",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    name: "GPRTU",
    logo: "/placeholder.svg?height=60&width=60",
  },
]

export function OperatorLogos() {
  return (
    <div className="flex flex-wrap justify-center gap-8 py-2">
      {operators.map((operator) => (
        <div key={operator.id} className="flex flex-col items-center">
          <div className="h-16 w-16 relative mb-2">
            <Image src={operator.logo || "/placeholder.svg"} alt={operator.name} fill className="object-contain" />
          </div>
          <p className="text-sm text-gray-700 text-center">{operator.name}</p>
        </div>
      ))}
    </div>
  )
}
