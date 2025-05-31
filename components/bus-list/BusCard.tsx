import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

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

interface BusCardProps {
  bus: Bus
  onSelect: () => void
}

export default function BusCard({ bus, onSelect }: BusCardProps) {
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
        return "snow-outline"
      case "wi-fi":
      case "wifi":
        return "wifi-outline"
      case "charging port":
        return "battery-charging-outline"
      default:
        return "ellipse-outline"
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: bus.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.operatorName}>{bus.operator}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.ratingText}>{bus.rating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>GHS {bus.priceGHS.toFixed(2)}</Text>
            <Text style={styles.priceSubtext}>per person</Text>
          </View>
        </View>

        <View style={styles.routeInfo}>
          <View style={styles.routeDetail}>
            <Text style={styles.routeLabel}>Departure</Text>
            <Text style={styles.routeTime}>{formatTime(bus.departureTime)}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={12} color="#666" />
              <Text style={styles.locationText}>{bus.departureLocation}</Text>
            </View>
          </View>

          <View style={styles.routeDetail}>
            <Text style={styles.routeLabel}>Arrival</Text>
            <Text style={styles.routeTime}>{formatTime(bus.arrivalTime)}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={12} color="#666" />
              <Text style={styles.locationText}>{bus.arrivalLocation}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.infoText}>Duration: {calculateDuration(bus.departureTime, bus.arrivalTime)}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{bus.seatsAvailable} seats left</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.amenitiesContainer}>
            {bus.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityBadge}>
                <Ionicons name={getAmenityIcon(amenity)} size={12} color="#666" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.selectButton} onPress={onSelect}>
            <Text style={styles.selectButtonText}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    height: 150,
    width: "100%",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  operatorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  priceSubtext: {
    fontSize: 12,
    color: "#666",
  },
  routeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  routeDetail: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  routeTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666",
  },
  selectButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectButtonText: {
    color: "white",
    fontWeight: "bold",
  },
})
