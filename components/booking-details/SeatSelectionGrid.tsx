"use client"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"

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

export default function SeatSelectionGrid({ availableSeats, selectedSeats, onSeatSelect }: SeatSelectionGridProps) {
  const { isDark } = useTheme()

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
    <View style={styles.container}>
      <View style={styles.driverSection}>
        <View style={styles.steeringWheel}>
          <Ionicons name="car" size={24} color="#666" />
        </View>
      </View>

      <View style={styles.seatsContainer}>
        {sortedRows.map((row) => (
          <View key={row} style={styles.row}>
            {seatsByRow[row].map((seat) => (
              <TouchableOpacity
                key={seat.id}
                style={[
                  styles.seat,
                  !seat.isAvailable && styles.unavailableSeat,
                  selectedSeats.includes(seat.id) && styles.selectedSeat,
                  seat.type === "premium" && styles.premiumSeat,
                ]}
                onPress={() => seat.isAvailable && onSeatSelect(seat.id)}
                disabled={!seat.isAvailable}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.seatText,
                    !seat.isAvailable && styles.unavailableSeatText,
                    selectedSeats.includes(seat.id) && styles.selectedSeatText,
                    seat.type === "premium" && styles.premiumSeatText,
                  ]}
                >
                  {seat.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.availableLegend]} />
          <Text style={[styles.legendText, isDark && styles.textDark]}>Available</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.selectedLegend]} />
          <Text style={[styles.legendText, isDark && styles.textDark]}>Selected</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.unavailableLegend]} />
          <Text style={[styles.legendText, isDark && styles.textDark]}>Unavailable</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.premiumLegend]} />
          <Text style={[styles.legendText, isDark && styles.textDark]}>Premium</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  driverSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  steeringWheel: {
    width: 60,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  seatsContainer: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  seat: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  unavailableSeat: {
    backgroundColor: "#e0e0e0",
    borderColor: "#ccc",
  },
  selectedSeat: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  premiumSeat: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FFB74D",
  },
  seatText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  unavailableSeatText: {
    color: "#999",
  },
  selectedSeatText: {
    color: "white",
  },
  premiumSeatText: {
    color: "#E65100",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 6,
  },
  availableLegend: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedLegend: {
    backgroundColor: "#4CAF50",
  },
  unavailableLegend: {
    backgroundColor: "#e0e0e0",
  },
  premiumLegend: {
    backgroundColor: "#FFF3E0",
    borderWidth: 1,
    borderColor: "#FFB74D",
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  textDark: {
    color: "#fff",
  },
})
