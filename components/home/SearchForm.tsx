"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../context/ThemeContext"

// Popular cities in Ghana for the dropdown
const ghanaianCities = [
  "Accra",
  "Kumasi",
  "Tamale",
  "Cape Coast",
  "Takoradi",
  "Sunyani",
  "Koforidua",
  "Ho",
  "Wa",
  "Bolgatanga",
]

interface SearchFormProps {
  onSearchSubmit: (origin: string, destination: string, date: Date) => void
}

export default function SearchForm({ onSearchSubmit }: SearchFormProps) {
  const { isDark } = useTheme()

  // Get tomorrow's date for default value
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState(tomorrow)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date
    setShowDatePicker(Platform.OS === "ios")
    setDate(currentDate)
  }

  const handleSubmit = () => {
    if (origin && destination && date) {
      onSearchSubmit(origin, destination, date)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>From</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={origin} onValueChange={(itemValue) => setOrigin(itemValue)} style={styles.picker}>
            <Picker.Item label="Select origin" value="" />
            {ghanaianCities.map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>To</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={destination}
            onValueChange={(itemValue) => setDestination(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select destination" value="" />
            {ghanaianCities.map((city) => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Travel Date</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <Ionicons name="calendar-outline" size={20} color="#666" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (!origin || !destination) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!origin || !destination}
      >
        <Text style={styles.submitButtonText}>Search Buses</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#FF5722",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ffccbc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
