export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      buses: {
        Row: {
          id: string
          operator: string
          route: string
          departure_location: string
          arrival_location: string
          departure_time: string
          arrival_time: string
          price_ghs: number
          rating: number
          seats_available: number
          total_seats: number
          amenities: string[]
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          operator: string
          route: string
          departure_location: string
          arrival_location: string
          departure_time: string
          arrival_time: string
          price_ghs: number
          rating: number
          seats_available: number
          total_seats: number
          amenities: string[]
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          operator?: string
          route?: string
          departure_location?: string
          arrival_location?: string
          departure_time?: string
          arrival_time?: string
          price_ghs?: number
          rating?: number
          seats_available?: number
          total_seats?: number
          amenities?: string[]
          image_url?: string
          created_at?: string
        }
      }
      seats: {
        Row: {
          id: string
          bus_id: string
          seat_id: string
          is_available: boolean
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          bus_id: string
          seat_id: string
          is_available: boolean
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          bus_id?: string
          seat_id?: string
          is_available?: boolean
          type?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          bus_id: string
          selected_seats: string[]
          total_amount_ghs: number
          payment_status: string
          payment_method: string
          booking_date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bus_id: string
          selected_seats: string[]
          total_amount_ghs: number
          payment_status: string
          payment_method: string
          booking_date: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bus_id?: string
          selected_seats?: string[]
          total_amount_ghs?: number
          payment_status?: string
          payment_method?: string
          booking_date?: string
          status?: string
          created_at?: string
        }
      }
      passengers: {
        Row: {
          id: string
          booking_id: string
          name: string
          age: number
          seat_id: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          name: string
          age: number
          seat_id: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          name?: string
          age?: number
          seat_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          wallet_balance_ghs: number
          created_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          wallet_balance_ghs?: number
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          wallet_balance_ghs?: number
          created_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: string
          network: string | null
          brand: string | null
          last4_digits: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          network?: string | null
          brand?: string | null
          last4_digits: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          network?: string | null
          brand?: string | null
          last4_digits?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
