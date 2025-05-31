"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PassengerFormProps {
  seatId: string
  index: number
  onChange: (data: any) => void
}

export function PassengerForm({ seatId, index, onChange }: PassengerFormProps) {
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
    <div className="p-4 border border-gray-200 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-montserrat text-base font-semibold text-gray-800">Passenger {index + 1}</h3>
        <span className="text-sm font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded">Seat {seatId}</span>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`name-${index}`}>Full Name</Label>
          <Input
            id={`name-${index}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter passenger's full name"
            className={nameError ? "border-red-300" : ""}
          />
          {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
        </div>

        <div>
          <Label htmlFor={`age-${index}`}>Age</Label>
          <Input
            id={`age-${index}`}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter passenger's age"
            type="number"
            min="1"
            max="120"
            className={ageError ? "border-red-300" : ""}
          />
          {ageError && <p className="text-xs text-red-500 mt-1">{ageError}</p>}
        </div>
      </div>
    </div>
  )
}
