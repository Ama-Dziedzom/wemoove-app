import { StyleSheet, View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SearchSummaryProps {
  origin: string
  destination: string
  date: string
}

export default function SearchSummary({ origin, destination, date }: SearchSummaryProps) {
  // Format the date if it's a valid date string
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : ""

  return (
    <View style={styles.container}>
      <View style={styles.routeContainer}>
        <Text style={styles.routeText}>{origin}</Text>
        <Ionicons name="arrow-forward" size={16} color="white" style={styles.icon} />
        <Text style={styles.routeText}>{destination}</Text>
      </View>
      <Text style={styles.dateText}>{formattedDate}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF5722",
    padding: 16,
    alignItems: "center",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  routeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginHorizontal: 8,
  },
  dateText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 4,
  },
})
