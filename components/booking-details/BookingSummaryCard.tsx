"use client"
import { StyleSheet, View, Text } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface BookingSummaryCardProps {
  bus: any
  selectedSeats: string[]
  passengers: any[]
}

export default function BookingSummaryCard({ bus, selectedSeats, passengers }: BookingSummaryCardProps) {
  const { isDark } = useTheme()

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
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>Booking Summary</Text>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Bus Operator</Text>
          <Text style={[styles.value, isDark && styles.textDark]}>{bus.operator}</Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Date</Text>
          <Text style={[styles.value, isDark && styles.textDark]}>{formatDate(bus.departureTime)}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Departure</Text>
          <Text style={[styles.value, isDark && styles.textDark]}>{formatTime(bus.departureTime)}</Text>
          <Text style={[styles.subvalue, isDark && styles.subvalueDark]}>{bus.departureLocation}</Text>
        </View>
        <View style={styles.column}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Arrival</Text>
          <Text style={[styles.value, isDark && styles.textDark]}>{formatTime(bus.arrivalTime)}</Text>
          <Text style={[styles.subvalue, isDark && styles.subvalueDark]}>{bus.arrivalLocation}</Text>
        </View>
      </View>

      {selectedSeats.length > 0 && (
        <>
          <View style={styles.separator} />

          <View>
            <Text style={[styles.label, isDark && styles.labelDark]}>Selected Seats</Text>
            <View style={styles.seatsContainer}>
              {selectedSeats.map((seat) => (
                <View key={seat} style={styles.seatBadge}>
                  <Text style={styles.seatText}>{seat}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={[styles.priceLabel, isDark && styles.textDark]}>Price per seat</Text>
            <Text style={[styles.priceValue, isDark && styles.textDark]}>GHS {bus.priceGHS.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Number of seats</Text>
            <Text style={[styles.value, isDark && styles.textDark]}>{selectedSeats.length}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={[styles.totalLabel, isDark && styles.textDark]}>Total Price</Text>
            <Text style={[styles.totalValue, isDark && styles.textDark]}>GHS {calculateTotalPrice().toFixed(2)}</Text>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  textDark: {
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  labelDark: {
    color: "#aaa",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  subvalue: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  subvalueDark: {
    color: "#aaa",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 16,
  },
  seatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  seatBadge: {
    backgroundColor: "#FFF3E0",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  seatText: {
    color: "#FF5722",
    fontWeight: "600",
    fontSize: 14,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
})
