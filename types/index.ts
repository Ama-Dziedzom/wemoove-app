// @cursor-context: Main type definitions for the Ghana Bus Booking app

export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Bus {
  id: string
  operator_name: string
  bus_number: string
  from_location: string
  to_location: string
  departure_time: string
  arrival_time: string
  price: number
  available_seats: number
  total_seats: number
  amenities: string[]
  bus_type: "standard" | "vip" | "luxury"
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  bus_id: string
  seat_numbers: string[]
  passenger_details: PassengerDetail[]
  total_amount: number
  booking_status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  booking_reference: string
  created_at: string
  updated_at: string
}

export interface PassengerDetail {
  name: string
  phone: string
  seat_number: string
}

export interface PushToken {
  id: string
  user_id: string
  token: string
  device_type: "ios" | "android"
  created_at: string
}

export interface NotificationPreferences {
  user_id: string
  booking_updates: boolean
  payment_reminders: boolean
  promotions: boolean
  travel_tips: boolean
  updated_at: string
}

export interface PopularRoute {
  id: string
  from: string
  to: string
  price: string
  duration?: string
  image?: string
}

export interface BusOperator {
  id: string
  name: string
  logo?: string
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined
  Main: undefined
  BusList: {
    origin: string
    destination: string
    date: string
  }
  BookingDetails: {
    busId: string
  }
  Payment: {
    bookingData: any
  }
  Confirmation: {
    bookingId: string
  }
  NotificationSettings: undefined
}

export type TabParamList = {
  Home: undefined
  Bookings: undefined
  Profile: undefined
  Settings: undefined
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

// Notification types
export interface NotificationData {
  type: "booking_confirmation" | "booking_reminder" | "booking_cancellation" | "promotional" | "test"
  bookingId?: string
  route?: string
  departureTime?: string
  [key: string]: any
}

// Theme types
export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  error: string
  success: string
  warning: string
}
