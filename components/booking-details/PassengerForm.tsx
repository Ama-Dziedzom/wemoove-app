"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TextInput } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface PassengerFormProps {
  seatId: string
  index: number
  onChange: (data: any) => void
}

export default function PassengerForm({ seatId, index, onChange }: PassengerFormProps) {
  const { isDark } = useTheme()

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [nameError, setNameError] = useState("")
  const [ageError, setAgeError] = useState("")

  // Validate form and update parent component
  useEffect(() => {
    const isNameValid = name.trim().length >= 3
    const isAgeValid = age.trim() !== "" && !isNaN(Number(age)) && Number(age) > 0 && Number(age) < 120

    setNameError(isNameValid ? "" : "Name must be at least 3 characters")
    setAgeError(isAgeValid ? "" : "Please enter a valid age")

    onChange({
      name,
      age: age ? Number(age) : "",
      isValid: isNameValid && isAgeValid,
    })
  }, [name, age, onChange])

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>Passenger {index + 1}</Text>
        <View style={styles.seatBadge}>
          <Text style={styles.seatText}>Seat {seatId}</Text>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>Full Name</Text>
        <TextInput
          style={[styles.input, nameError ? styles.inputError : null, isDark && styles.inputDark]}
          value={name}
          onChangeText={setName}
          placeholder="Enter passenger's full name"
          placeholderTextColor={isDark ? "#aaa" : "#999"}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isDark && styles.labelDark]}>Age</Text>
        <TextInput
          style={[styles.input, ageError ? styles.inputError : null, isDark && styles.inputDark]}
          value={age}
          onChangeText={setAge}
          placeholder="Enter passenger's age"
          placeholderTextColor={isDark ? "#aaa" : "#999"}
          keyboardType="number-pad"
        />
        {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  containerDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  textDark: {
    color: "#fff",
  },
  seatBadge: {
    backgroundColor: "#FFF3E0",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seatText: {
    color: "#FF5722",
    fontWeight: "600",
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  labelDark: {
    color: "#ddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  inputDark: {
    borderColor: "#444",
    color: "#fff",
    backgroundColor: "#2A2A2A",
  },
  inputError: {
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
  },
})
