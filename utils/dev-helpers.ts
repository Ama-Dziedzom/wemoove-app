// @cursor-context: Development utilities for debugging and testing

import { Alert } from "react-native"

declare const __DEV__: boolean

/**
 * Development logger that only logs in development mode
 */
export const devLog = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[DEV] ${message}`, data || "")
  }
}

/**
 * Development error logger
 */
export const devError = (message: string, error?: any) => {
  if (__DEV__) {
    console.error(`[DEV ERROR] ${message}`, error || "")
  }
}

/**
 * Show development alert (only in dev mode)
 */
export const devAlert = (title: string, message: string) => {
  if (__DEV__) {
    Alert.alert(`[DEV] ${title}`, message)
  }
}

/**
 * Mock data generator for development
 */
export const generateMockBuses = (count = 5) => {
  const operators = ["VIP Jeoun", "STC", "OA Travel & Tours", "Metro Mass Transit", "GPRTU"]
  const routes = [
    { from: "Accra", to: "Kumasi" },
    { from: "Accra", to: "Cape Coast" },
    { from: "Accra", to: "Tamale" },
    { from: "Kumasi", to: "Takoradi" },
    { from: "Accra", to: "Ho" },
  ]

  return Array.from({ length: count }, (_, index) => {
    const route = routes[index % routes.length]
    return {
      id: `bus-${index + 1}`,
      operator_name: operators[index % operators.length],
      bus_number: `GH-${1000 + index}`,
      from_location: route.from,
      to_location: route.to,
      departure_time: new Date(Date.now() + (index + 1) * 3600000).toISOString(),
      arrival_time: new Date(Date.now() + (index + 1) * 3600000 + 4 * 3600000).toISOString(),
      price: 50 + index * 20,
      available_seats: 30 - index * 2,
      total_seats: 50,
      amenities: ["AC", "WiFi", "Charging Port"],
      bus_type: "standard" as const,
      created_at: new Date().toISOString(),
    }
  })
}

/**
 * Performance timer for development
 */
export class DevTimer {
  private startTime: number
  private label: string

  constructor(label: string) {
    this.label = label
    this.startTime = Date.now()
    devLog(`Timer started: ${label}`)
  }

  end() {
    const duration = Date.now() - this.startTime
    devLog(`Timer ended: ${this.label} - ${duration}ms`)
    return duration
  }
}

/**
 * Environment checker
 */
export const checkEnvironment = () => {
  const checks = {
    supabaseUrl: !!process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseKey: !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    isDev: __DEV__,
  }

  devLog("Environment Check", checks)
  return checks
}

/**
 * Network status simulator for testing
 */
export const simulateNetworkDelay = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
