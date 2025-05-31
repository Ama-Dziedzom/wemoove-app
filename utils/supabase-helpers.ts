import { supabase } from "../lib/supabase"

/**
 * Fetches popular routes from the buses table
 * @param limit Number of routes to fetch
 * @returns Array of popular routes
 */
export async function fetchPopularRoutes(limit = 4) {
  try {
    const { data, error } = await supabase
      .from("buses")
      .select("route, departure_location, arrival_location, price_ghs, image_url")
      .order("rating", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching popular routes:", error)
      return []
    }

    // Group by route and take the lowest price for each route
    const routeMap = new Map()
    data.forEach((bus) => {
      const routeKey = `${bus.departure_location}-${bus.arrival_location}`
      if (!routeMap.has(routeKey) || bus.price_ghs < routeMap.get(routeKey).price_ghs) {
        routeMap.set(routeKey, {
          from: bus.departure_location,
          to: bus.arrival_location,
          price: `GHS ${bus.price_ghs}`,
          image: bus.image_url,
          route: bus.route,
        })
      }
    })

    return Array.from(routeMap.values())
  } catch (err) {
    console.error("Error in fetchPopularRoutes:", err)
    return []
  }
}

/**
 * Fetches bus operators from the buses table
 * @param limit Number of operators to fetch
 * @returns Array of unique operators
 */
export async function fetchBusOperators(limit = 5) {
  try {
    const { data, error } = await supabase.from("buses").select("operator, image_url").limit(50) // Fetch more to ensure we get unique operators

    if (error) {
      console.error("Error fetching bus operators:", error)
      return []
    }

    // Get unique operators
    const uniqueOperators = Array.from(
      new Map(
        data.map((item) => [
          item.operator,
          {
            name: item.operator,
            logo: item.image_url,
          },
        ]),
      ).values(),
    )

    return uniqueOperators.slice(0, limit)
  } catch (err) {
    console.error("Error in fetchBusOperators:", err)
    return []
  }
}

/**
 * Updates the user profile
 * @param userId User ID
 * @param profileData Profile data to update
 * @returns Success status and message
 */
export async function updateUserProfile(userId: string, profileData: any) {
  try {
    const { error } = await supabase.from("profiles").update(profileData).eq("id", userId)

    if (error) {
      console.error("Error updating profile:", error)
      return { success: false, message: error.message }
    }

    return { success: true, message: "Profile updated successfully" }
  } catch (err: any) {
    console.error("Error in updateUserProfile:", err)
    return { success: false, message: err.message || "An error occurred" }
  }
}

/**
 * Fetches user bookings with bus details
 * @param userId User ID
 * @returns Array of bookings with bus details
 */
export async function fetchUserBookings(userId: string) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        buses:bus_id (
          operator,
          route,
          departure_location,
          arrival_location,
          departure_time,
          arrival_time
        )
      `)
      .eq("user_id", userId)
      .order("booking_date", { ascending: false })

    if (error) {
      console.error("Error fetching bookings:", error)
      return []
    }

    return data || []
  } catch (err) {
    console.error("Error in fetchUserBookings:", err)
    return []
  }
}
