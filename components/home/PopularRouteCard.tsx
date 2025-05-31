import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface PopularRouteCardProps {
  from: string
  to: string
  price: string
  duration: string
  image: string
  onPress: () => void
}

export default function PopularRouteCard({ from, to, price, duration, image, onPress }: PopularRouteCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageBackground source={{ uri: image }} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay}>
          <Text style={styles.routeText}>
            {from} to {to}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.details}>
        <View>
          <Text style={styles.durationText}>{duration}</Text>
          <Text style={styles.priceText}>From {price}</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#FF5722" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    height: 100,
    justifyContent: "center",
  },
  imageStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  routeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  durationText: {
    fontSize: 12,
    color: "#666",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
})
