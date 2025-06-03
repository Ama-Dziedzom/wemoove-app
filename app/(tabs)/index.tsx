import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  Modal,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight,
  ArrowLeftRight,
  Bus,
  RefreshCw,
  X
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useBookingStore } from '@/store/booking-store';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocations } from '@/hooks/useLocations';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BusCard from '@/components/BusCard';
import { Bus as BusType } from '@/app/types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HomeScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [passengers, setPassengers] = useState(1);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { settings } = useAppStore();
  const { 
    searchResults, 
    isLoading, 
    error,
    setSearchParams, 
    searchBuses,
    selectBus,
  } = useBookingStore();
  const { formatCurrency } = useCurrency();
  const { locations, isLoading: isLoadingLocations, refreshLocations } = useLocations();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  const handleSwapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = async () => {
    if (!from || !to) {
      return;
    }
    
    console.log('Searching buses with params:', { from, to, date: date.toISOString().split('T')[0], passengers });
    setSearchParams(from, to, date.toISOString().split('T')[0], passengers);
    await searchBuses();
    setShowSearchResults(true);
  };

  const handleSelectBus = (bus: BusType) => {
    selectBus(bus);
    router.push(`/booking/${bus.id}`);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const incrementPassengers = () => {
    if (passengers < 10) {
      setPassengers(passengers + 1);
    }
  };

  const decrementPassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Refresh locations
    await refreshLocations();
    
    // If search results are showing, refresh buses
    if (showSearchResults) {
      await searchBuses();
    }
    
    setRefreshing(false);
  }, [refreshLocations, searchBuses, showSearchResults]);

  // Fetch popular routes from API on component mount
  const [popularRoutes, setPopularRoutes] = useState([
    { from: 'New York', to: 'Boston', price: 45 },
    { from: 'Los Angeles', to: 'San Francisco', price: 55 },
    { from: 'Chicago', to: 'Detroit', price: 40 },
    { from: 'Miami', to: 'Orlando', price: 35 }
  ]);

  // Fetch featured buses on component mount
  const [featuredBuses, setFeaturedBuses] = useState<BusType[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  useEffect(() => {
    const fetchFeaturedBuses = async () => {
      setLoadingFeatured(true);
      try {
        // Use the same searchBuses function but with default params
        await setSearchParams('New York', 'Boston', new Date().toISOString().split('T')[0], 1);
        await searchBuses();
        // The results will be in searchResults
      } catch (error) {
        console.error('Error fetching featured buses:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    if (!showSearchResults) {
      fetchFeaturedBuses();
    }
  }, [showSearchResults]);

  // Handle location selection
  const handleFromChange = (text: string) => {
    setFrom(text);
  };

  const handleToChange = (text: string) => {
    setTo(text);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: themeColors.text }]}>
            Good {getTimeOfDay()}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.subtext }]}>
            Where are you going today?
          </Text>
        </View>
        
        <View style={[styles.searchCard, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
          shadowColor: themeColors.primary,
        }]}>
          <View style={styles.locationInputs}>
            <View style={styles.inputContainer}>
              <MapPin size={18} color={themeColors.primary} />
              <Input
                placeholder="From"
                value={from}
                onChangeText={handleFromChange}
                style={styles.input}
                suggestions={locations}
                isLoadingSuggestions={isLoadingLocations}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.swapButton, { backgroundColor: themeColors.primary + '20' }]} 
              onPress={handleSwapLocations}
            >
              <ArrowLeftRight size={16} color={themeColors.primary} />
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <MapPin size={18} color={themeColors.primary} />
              <Input
                placeholder="To"
                value={to}
                onChangeText={handleToChange}
                style={styles.input}
                suggestions={locations}
                isLoadingSuggestions={isLoadingLocations}
              />
            </View>
          </View>
          
          <View style={styles.datePassengerRow}>
            <TouchableOpacity 
              style={[styles.dateContainer, { borderColor: themeColors.border }]}
              onPress={openDatePicker}
            >
              <Calendar size={18} color={themeColors.primary} />
              <View style={styles.dateInputWrapper}>
                <Text style={[styles.dateText, { color: themeColors.text }]}>
                  {formatDate(date)}
                </Text>
              </View>
            </TouchableOpacity>
            
            <View style={[styles.passengersContainer, { borderColor: themeColors.border }]}>
              <Users size={18} color={themeColors.primary} />
              <View style={styles.passengerControls}>
                <TouchableOpacity 
                  style={[styles.passengerButton, { borderColor: themeColors.border }]} 
                  onPress={decrementPassengers}
                >
                  <Text style={{ color: themeColors.text }}>-</Text>
                </TouchableOpacity>
                
                <Text style={[styles.passengerCount, { color: themeColors.text }]}>
                  {passengers}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.passengerButton, { borderColor: themeColors.border }]} 
                  onPress={incrementPassengers}
                >
                  <Text style={{ color: themeColors.text }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <Button
            title="Search Buses"
            onPress={handleSearch}
            icon={<Search size={18} color="#FFFFFF" />}
            fullWidth
          />
        </View>
        
        {showSearchResults ? (
          <View style={styles.searchResults}>
            <View style={styles.searchResultsHeader}>
              <Text style={[styles.searchResultsTitle, { color: themeColors.text }]}>
                {from} to {to}
              </Text>
              <Text style={[styles.searchResultsSubtitle, { color: themeColors.subtext }]}>
                {formatDate(date)} • {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
              </Text>
            </View>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={themeColors.primary} />
                <Text style={[styles.loadingText, { color: themeColors.subtext }]}>
                  Finding the best buses for you...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: themeColors.error }]}>
                  {error}
                </Text>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={handleSearch}
                >
                  <RefreshCw size={16} color={themeColors.primary} />
                  <Text style={[styles.refreshText, { color: themeColors.primary }]}>
                    Refresh
                  </Text>
                </TouchableOpacity>
              </View>
            ) : searchResults.length > 0 ? (
              <View>
                {searchResults.slice(0, 3).map(bus => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    onPress={() => handleSelectBus(bus)}
                  />
                ))}
                {searchResults.length > 3 && (
                  <TouchableOpacity 
                    style={[styles.viewMoreButton, { borderColor: themeColors.border }]}
                    onPress={() => router.push('/buses')}
                  >
                    <Text style={[styles.viewMoreText, { color: themeColors.primary }]}>
                      View {searchResults.length - 3} more buses
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={[styles.noResultsText, { color: themeColors.text }]}>
                  No buses found for this route and date.
                </Text>
                <Button
                  title="Try Different Dates"
                  variant="outline"
                  onPress={() => setShowSearchResults(false)}
                  style={styles.tryAgainButton}
                />
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Popular Routes
              </Text>
              <TouchableOpacity onPress={() => router.push('/buses')}>
                <Text style={[styles.seeAllText, { color: themeColors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularRoutesContainer}
            >
              {popularRoutes.map((route, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.popularRouteCard, { 
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border
                  }]}
                  onPress={() => {
                    setFrom(route.from);
                    setTo(route.to);
                  }}
                >
                  <View style={styles.routeInfo}>
                    <Text style={[styles.routePrice, { color: themeColors.primary }]}>
                      {formatCurrency(route.price)}
                    </Text>
                    <Text style={[styles.routeText, { color: themeColors.text }]}>
                      {route.from} to {route.to}
                    </Text>
                  </View>
                  <ArrowRight size={16} color={themeColors.primary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Featured Buses
              </Text>
            </View>
            
            {loadingFeatured ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={themeColors.primary} />
                <Text style={[styles.loadingText, { color: themeColors.subtext }]}>
                  Loading featured buses...
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              searchResults.slice(0, 2).map(bus => (
                <BusCard
                  key={bus.id}
                  bus={bus}
                  onPress={() => {
                    setFrom(bus.from);
                    setTo(bus.to);
                    selectBus(bus);
                    router.push(`/booking/${bus.id}`);
                  }}
                />
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={[styles.noResultsText, { color: themeColors.text }]}>
                  No featured buses available at the moment.
                </Text>
              </View>
            )}
            
            <View style={[styles.promoCard, { backgroundColor: themeColors.primary }]}>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>
                  Get 15% Off
                </Text>
                <Text style={styles.promoSubtitle}>
                  On your first booking with code:
                </Text>
                <View style={styles.promoCode}>
                  <Text style={styles.promoCodeText}>
                    FIRST15
                  </Text>
                </View>
                <Button
                  title="Book Now"
                  variant="white"
                  style={styles.promoButton}
                  onPress={() => {
                    // Navigate to booking page
                    router.push('/buses');
                  }}
                />
              </View>
              <View style={styles.promoImageContainer}>
                <Bus size={80} color="#FFFFFF" style={styles.promoImage} />
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Date Picker for iOS */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={closeDatePicker}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: themeColors.text }]}>Select Date</Text>
                <TouchableOpacity onPress={closeDatePicker}>
                  <X size={24} color={themeColors.text} />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                textColor={theme === 'dark' ? "#FFFFFF" : "#000000"}
                style={{ backgroundColor: 'transparent' }}
              />
              <Button
                title="Confirm"
                onPress={closeDatePicker}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker for Android */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8, // Reduced top padding to move title up
  },
  header: {
    marginBottom: 20, // Reduced from 20 to move title up further
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4, // Reduced from 4 to move title up
  },
  subtitle: {
    fontSize: 16,
  },
  searchCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInputs: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: -6,
    marginBottom: 6,
  },
  datePassengerRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12, // Add gap between date and passenger containers
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  dateInputWrapper: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  passengersContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  passengerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  passengerButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerCount: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchResults: {
    marginTop: 8,
  },
  searchResultsHeader: {
    marginBottom: 16,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchResultsSubtitle: {
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  refreshText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 32,
  },
  noResultsText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  tryAgainButton: {
    minWidth: 150,
  },
  viewMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
  },
  popularRoutesContainer: {
    paddingBottom: 8,
  },
  popularRouteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    minWidth: 180,
  },
  routeInfo: {
    flex: 1,
  },
  routePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeText: {
    fontSize: 14,
  },
  promoCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
  },
  promoContent: {
    flex: 2,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 12,
  },
  promoCode: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  promoCodeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  promoButton: {
    alignSelf: 'flex-start',
  },
  promoImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoImage: {
    opacity: 0.9,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    marginTop: 16,
  },
});