import { supabase } from "../lib/supabase"

/**
 * Tests the Supabase connection by making a simple query
 * @returns A promise that resolves to a boolean indicating if the connection was successful
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    // Try to fetch a single row from the public schema
    const { data, error } = await supabase.from("buses").select("id").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error.message)
      return false
    }

    console.log("Supabase connection successful!")
    return true
  } catch (err) {
    console.error("Supabase connection test error:", err)
    return false
  }
}
