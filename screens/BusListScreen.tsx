"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { supabase } from "../lib/supabase"
import BusCard from "../components/bus-list/BusCard"
import SearchSummary from "../components/bus-list/SearchSummary"
import FilterSortControls from "../components/bus-list/FilterSortControls"

export default function BusListScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { isDark } = useTheme()

  const { origin, destination, date } = route.params as any

  const [buses, setBuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sortBy, setSortBy] = useState("departure_time")
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500,
    amenities: [] as string[],
    operators: [] as string[],
  })

  const [refreshing, setRefreshing] = useState(false)

  const refreshBuses = async () => {
    setRefreshing(true)
    setError(null)

    try {
      // Format date for query
      const formattedDate = new Date(date).toISOString().split("T")[0]

      // Build query
      let query = supabase
        .from("buses")
        .select("*")
        .eq("departure_location", origin)
        .eq("arrival_location", destination)
        .gte("departure_time", `${formattedDate}T00:00:00`)
        .lte("departure_time", `${formattedDate}T23:59:59`)

      // Apply filters
      if (filters.operators.length > 0) {
        query = query.in("operator", filters.operators)
      }

      if (filters.minPrice > 0 || filters.maxPrice < 500) {
        query = query.gte("price_ghs", filters.minPrice).lte("price_ghs", filters.maxPrice)
      }

      // Apply sorting
      switch (sortBy) {
        case "price":
          query = query.order("price_ghs", { ascending: true })
          break
        case "priceDesc":
          query = query.order("price_ghs", { ascending: false })
          break
        case "rating":
          query = query.order("rating", { ascending: false })
          break
        case "departure_time":
        default:
          query = query.order("departure_time", { ascending: true })
          break
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw supabaseError
      }

      // Filter by amenities if needed (since we can't filter array fields directly in the query)
      let filteredData = data
      if (filters.amenities.length > 0) {
        filteredData = data.filter((bus) => filters.amenities.every((amenity) => bus.amenities.includes(amenity)))
      }

      setBuses(filteredData || [])
    } catch (err: any) {
      console.error("Error refreshing buses:", err)
      setError(err.message || "Failed to refresh buses. Please try again.")
    } finally {
      setRefreshing(false)
    }
  }

  // Fetch buses from Supabase
  useEffect(() => {
    refreshBuses()
  }, [origin, destination, date, sortBy, filters])

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No buses found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your search criteria or date</Text>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={["bottom"]}>
      <SearchSummary origin={origin} destination={destination} date={date} />

      <View style={styles.content}>
        <FilterSortControls
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          filters={filters}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF5722" />
            <Text style={styles.loadingText}>Loading buses...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#f44336" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setLoading(true)
                setError(null)
                // Retry fetching buses
                setTimeout(() => {
                  // This will trigger the useEffect again
                  setSortBy(sortBy === "departure_time" ? "departure_time_alt" : "departure_time")
                }, 500)
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={buses}
            renderItem={({ item }) => (
              <BusCard bus={item} onSelect={() => navigation.navigate("BookingDetails", { busId: item.id })} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
            refreshing={refreshing}
            onRefresh={refreshBuses}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FF5722",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
})
