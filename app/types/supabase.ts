export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      buses: {
        Row: {
          id: string
          bus_name: string
          bus_number: string
          capacity: number
          route_start: string
          route_end: string
          departure_time: string
          arrival_time: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          bus_name: string
          bus_number: string
          capacity: number
          route_start: string
          route_end: string
          departure_time: string
          arrival_time: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          bus_name?: string
          bus_number?: string
          capacity?: number
          route_start?: string
          route_end?: string
          departure_time?: string
          arrival_time?: string
          created_at?: string
          updated_at?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
