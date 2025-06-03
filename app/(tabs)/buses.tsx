import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Platform,
  ViewStyle,
  TextStyle,
  ImageStyle,
  StyleProp,
  ViewToken
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  Star as StarIcon, 
  ArrowUpDown,
  Check,
  RefreshCw,
  X,
  Star
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useBookingStore } from '@/store/booking-store';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocations } from '@/hooks/useLocations';
import BusCard from '@/components/BusCard';
import { Bus, Location } from '@/types';
import Input from '@/components/Input';

// Define style types
type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

interface BusesScreenStyles {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  buttonText: TextStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  headerActions: ViewStyle;
  iconButton: ViewStyle;
  searchContainer: ViewStyle;
  searchInput: TextStyle;
  filterSection: ViewStyle;
  filterTitle: TextStyle;
  routeInputs: ViewStyle;
  routeInput: ViewStyle;
  priceRangeContainer: ViewStyle;
  priceRangeText: TextStyle;
  ratingContainer: ViewStyle;
  ratingButton: ViewStyle;
  amenitiesContainer: ViewStyle;
  amenityButton: ViewStyle;
  amenityText: TextStyle;
  filterActions: ViewStyle;
  filterActionButton: ViewStyle;
  filterActionText: TextStyle;
  sortOptions: ViewStyle;
  sortOption: ViewStyle;
  sortOptionText: TextStyle;
  busListContainer: ViewStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
  resetButton: ViewStyle;
  resetText: TextStyle;
  retryButtonText: TextStyle;
}

interface FilterState {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  amenities: string[];
}

export default function BusesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
    amenities: []
  });
  const [sortBy, setSortBy] = useState('price_low');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { settings } = useAppStore();
  const { 
    searchResults, 
    isLoading, 
    error, 
    searchBuses, 
    selectBus,
    setSearchParams
  } = useBookingStore();
  const { formatCurrency } = useCurrency();
  const { locations, isLoading: isLoadingLocations, refreshLocations } = useLocations();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  // Set default search parameters and fetch buses when component mounts
  useEffect(() => {
    console.log('BusesScreen mounted, initializing search...');
    
    // Set default locations if not already set
    const today = new Date().toISOString().split('T')[0];
    const defaultFrom = 'Accra';
    const defaultTo = 'Kumasi';
    
    console.log('Setting default search params:', { 
      from: defaultFrom, 
      to: defaultTo, 
      date: today 
    });
    
    // Update local state
    setFromLocation(defaultFrom);
    setToLocation(defaultTo);
    
    // Update search params in the store and fetch buses
    setSearchParams(defaultFrom, defaultTo, today, 1);
    searchBuses();
  }, []);

  // Handle bus selection
  const handleSelectBus = (bus: Bus) => {
    // Select the bus in the store and navigate to booking page
    selectBus(bus);
    router.push(`/booking/${bus.id}`);
  };

  // Render bus item for FlatList
  const renderBusItem = ({ item }: { item: Bus }) => (
    <View style={{ marginHorizontal: 8, marginBottom: 16, width: 'auto' }}>
      <BusCard 
        bus={item} 
        onPress={() => handleSelectBus(item)}
      />
    </View>
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    searchBuses().finally(() => setRefreshing(false));
  }, [searchBuses]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFromLocation('');
    setToLocation('');
    setFilters({
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      amenities: [],
    });
  };

  const handleSearch = async () => {
    if (fromLocation && toLocation) {
      const today = new Date().toISOString().split('T')[0];
      console.log('Setting search params:', { fromLocation, toLocation, today });
      
      try {
        // Update search params in the store
        setSearchParams(fromLocation, toLocation, today, 1);
        
        // Show loading state by calling searchBuses which will handle the loading state
        await searchBuses();
        
        console.log('Bus search completed successfully');
      } catch (error) {
        console.error('Error in handleSearch:', error);
        // The error will be handled by the searchBuses function
      }
    } else {
      // Show error in the UI if locations are not selected
      useBookingStore.setState({ 
        error: 'Please select both departure and arrival locations',
        isLoading: false
      });
    }
  };

  const toggleFilter = (filter: string) => {
    if (filters.amenities.includes(filter)) {
      setFilters({
        ...filters,
        amenities: filters.amenities.filter(f => f !== filter)
      });
    } else {
      setFilters({
        ...filters,
        amenities: [...filters.amenities, filter]
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Refresh locations
    await refreshLocations();
    
    // Refresh buses
    await searchBuses();
    
    setRefreshing(false);
  }, [refreshLocations, searchBuses]);

  const applyFilters = (buses: Bus[]) => {
    return buses.filter(bus => {
      // Price filter
      if (bus.price < filters.minPrice || bus.price > filters.maxPrice) {
        return false;
      }
      
      // Rating filter
      if (bus.rating < filters.minRating) {
        return false;
      }
      
      // Amenities filter
      if (filters.amenities.length > 0) {
        for (const amenity of filters.amenities) {
          if (!bus.amenities || !bus.amenities.includes(amenity)) {
            return false;
          }
        }
      }
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (bus.name && bus.name.toLowerCase().includes(query)) ||
          (bus.plate_number && bus.plate_number.toLowerCase().includes(query)) ||
          (bus.from && bus.from.toLowerCase().includes(query)) ||
          (bus.to && bus.to.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  };

  const sortBuses = (buses: Bus[]) => {
    switch (sortBy) {
      case 'price_low':
        return [...buses].sort((a, b) => a.price - b.price);
      case 'price_high':
        return [...buses].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...buses].sort((a, b) => b.rating - a.rating);
      case 'departure':
        return [...buses].sort((a, b) => {
          // Convert departure times to comparable values (assuming format like "08:00 AM")
          const timeA = convertTimeToMinutes(a.departureTime);
          const timeB = convertTimeToMinutes(b.departureTime);
          return timeA - timeB;
        });
      default:
        return buses;
    }
  };

  // Helper function to convert time strings to minutes for comparison
  const convertTimeToMinutes = (timeStr: string) => {
    // Parse time string like "08:00 AM" or "02:30 PM"
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format for easier comparison
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  const renderFilterSection = () => {
    if (!showFilters) return null;
    
    return (
      <View style={[styles.filterSection, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.filterTitle, { color: themeColors.text }]}>Route</Text>
        <View style={styles.routeInputs}>
          <Input
            placeholder="From"
            value={fromLocation}
            onChangeText={setFromLocation}
            suggestions={locations}
            isLoadingSuggestions={isLoadingLocations}
            style={styles.routeInput}
          />
          <Input
            placeholder="To"
            value={toLocation}
            onChangeText={setToLocation}
            suggestions={locations}
            isLoadingSuggestions={isLoadingLocations}
            style={styles.routeInput}
          />
        </View>
        
        <Text style={[styles.filterTitle, { color: themeColors.text }]}>Price Range</Text>
        <View style={styles.priceRangeContainer}>
          <Text style={[styles.priceRangeText, { color: themeColors.text }]}>
            {formatCurrency(filters.minPrice)} - {formatCurrency(filters.maxPrice)}
          </Text>
        </View>
        
        <Text style={[styles.filterTitle, { color: themeColors.text }]}>Minimum Rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map(rating => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                filters.minRating >= rating && { backgroundColor: themeColors.primary }
              ]}
              onPress={() => setFilters({ ...filters, minRating: rating })}
            >
              <Star 
                size={16} 
                color={filters.minRating >= rating ? themeColors.text : themeColors.primary} 
                fill={filters.minRating >= rating ? themeColors.text : 'none'} 
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={[styles.filterTitle, { color: themeColors.text }]}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {['WiFi', 'AC', 'USB Charging', 'Toilet', 'Entertainment', 'Snacks'].map(amenity => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.amenityButton,
                filters.amenities.includes(amenity) && { 
                  backgroundColor: themeColors.primary,
                  borderColor: themeColors.primary
                }
              ]}
              onPress={() => toggleFilter(amenity)}
            >
              <Text 
                style={[
                  styles.amenityText, 
                  { color: filters.amenities.includes(amenity) ? themeColors.white : themeColors.text }
                ]}
              >
                {amenity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.filterActions}>
          <TouchableOpacity 
            style={[styles.filterActionButton, { borderColor: themeColors.border }]}
            onPress={() => {
              setFilters({
                minPrice: 0,
                maxPrice: 100,
                minRating: 0,
                amenities: []
              });
              setFromLocation('');
              setToLocation('');
            }}
          >
            <Text style={[styles.filterActionText, { color: themeColors.text }]}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterActionButton, { backgroundColor: themeColors.primary }]}
            onPress={() => {
              handleSearch();
              setShowFilters(false);
            }}
          >
            <Text style={[styles.filterActionText, { color: themeColors.white }]}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSortOptions = () => {
    if (!showSortOptions) return null;
    
    const options = [
      { id: 'price_low', label: 'Price: Low to High' },
      { id: 'price_high', label: 'Price: High to Low' },
      { id: 'rating', label: 'Rating' },
      { id: 'departure', label: 'Departure Time' }
    ];
    
    return (
      <View style={[styles.sortOptions, { backgroundColor: themeColors.card }]}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.sortOption,
              sortBy === option.id && { backgroundColor: themeColors.backgroundSecondary }
            ]}
            onPress={() => {
              setSortBy(option.id);
              setShowSortOptions(false);
            }}
          >
            <Text style={[styles.sortOptionText, { color: themeColors.text }]}>
              {option.label}
            </Text>
            {sortBy === option.id && (
              <StarIcon size={16} color="#FFD700" fill="#FFD700" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const filteredBuses = applyFilters(searchResults);
  const sortedBuses = sortBuses(filteredBuses);

  console.log('Buses to display:', searchResults.length);
  console.log('Filtered buses:', filteredBuses.length);
  console.log('Sorted buses:', sortedBuses.length);

  // Show loading indicator
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>
          Finding available buses...
        </Text>
      </View>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.error || '#ff3b30' }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
          onPress={handleSearch}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Search, Sort, and Filter Row */}
      <View style={styles.searchRow}>
        {/* Search Input */}
        <View style={[styles.searchContainer, { backgroundColor: themeColors.card }]}>
          <SearchIcon size={20} color={themeColors.text} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Search buses..."
            placeholderTextColor={themeColors.subtext || '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Filter and Sort Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: showSortOptions ? themeColors.primary + '20' : themeColors.card }]}
            onPress={() => {
              setShowSortOptions(!showSortOptions);
              if (showFilters) setShowFilters(false);
            }}
          >
            <ArrowUpDown size={20} color={showSortOptions ? themeColors.primary : themeColors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { 
              backgroundColor: showFilters ? themeColors.primary + '20' : themeColors.card,
              marginLeft: 8
            }]}
            onPress={() => {
              setShowFilters(!showFilters);
              if (showSortOptions) setShowSortOptions(false);
            }}
          >
            <FilterIcon size={20} color={showFilters ? themeColors.primary : themeColors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={[styles.loadingContainer, { flex: 1 }]}>
            <ActivityIndicator size="large" color={themeColors.primary} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>
              Finding available buses...
            </Text>
          </View>
        ) : error ? (
          <View style={[styles.errorContainer, { flex: 1 }]}>
            <Text style={[styles.errorText, { color: themeColors.error || 'red' }]}>
              {error}
            </Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
              onPress={handleSearch}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredBuses}
            keyExtractor={(item) => item.id}
            renderItem={renderBusItem}
            contentContainerStyle={styles.busListContainer}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[themeColors.primary]}
                tintColor={themeColors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: themeColors.text }]}>
                  No buses found
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 16,
  },
  
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    backgroundColor: '#007AFF',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  
  // Search, Sort, and Filter Row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    padding: 8,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Bus list styles
  busListContainer: {
    paddingHorizontal: 8,
    paddingBottom: 20,
    flexGrow: 1,
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Filter section styles
  filterSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  routeInputs: {
    marginBottom: 16,
  },
  routeInput: {
    marginBottom: 12,
  },
  priceRangeContainer: {
    marginBottom: 16,
  },
  priceRangeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  ratingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  amenityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  amenityText: {
    fontSize: 14,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  filterActionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortOptions: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  sortOptionText: {
    flex: 1,
    fontSize: 16,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
  resetText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});