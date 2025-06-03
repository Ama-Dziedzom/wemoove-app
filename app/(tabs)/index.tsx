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
  RefreshControl,
  SafeAreaView as SafeAreaViewRN
} from 'react-native';
// Using SafeAreaView from react-native for better compatibility
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
  X,
  TrendingUp
} from 'lucide-react-native';
import { supabase } from '@/app/lib/supabase-client';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import { useBookingStore } from '@/store/booking-store';
import { useCurrency } from '@/hooks/useCurrency';
import { useLocations } from '@/hooks/useLocations';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BusCard from '@/components/BusCard';
import { Bus as BusType, User } from '@/app/types';
import DateTimePicker from '@react-native-community/datetimepicker';

// Styles will be defined at the bottom of the file

// Define the theme colors
const lightTheme = {
  primary: colors.light.primary,
  secondary: colors.light.secondary,
  background: colors.light.background,
  backgroundSecondary: colors.light.backgroundSecondary,
  card: colors.light.card,
  text: colors.light.text,
  subtext: colors.light.subtext,
  border: colors.light.border,
  inactive: colors.light.inactive,
  success: colors.light.success,
  error: colors.light.error,
  warning: colors.light.warning,
  info: colors.light.info,
  white: colors.light.white
};

const darkTheme = {
  primary: colors.dark.primary,
  secondary: colors.dark.secondary,
  background: colors.dark.background,
  backgroundSecondary: colors.dark.backgroundSecondary,
  card: colors.dark.card,
  text: colors.dark.text,
  subtext: colors.dark.subtext,
  border: colors.dark.border,
  inactive: colors.dark.inactive,
  success: colors.dark.success,
  error: colors.dark.error,
  warning: colors.dark.warning,
  info: colors.dark.info,
  white: colors.dark.white
};

// Helper function to get time of day
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default function HomeScreen() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date());
  const [passengers, setPassengers] = useState(1);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { settings } = useAppStore();
  const { user } = useAuthStore();
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

  // State for popular routes
  const [popularRoutes, setPopularRoutes] = useState<Array<{
    departure_location: string;
    arrival_location: string;
    booking_count: number;
    avg_price: number;
  }>>([]);
  const [loadingPopularRoutes, setLoadingPopularRoutes] = useState(true);

  // Fetch popular routes from Supabase
  const fetchPopularRoutes = useCallback(async () => {
    try {
      setLoadingPopularRoutes(true);
      const { data, error } = await supabase
        .from('popular_routes')
        .select('*')
        .order('booking_count', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching popular routes:', error);
        return;
      }

      setPopularRoutes(data || []);
    } catch (error) {
      console.error('Error in fetchPopularRoutes:', error);
    } finally {
      setLoadingPopularRoutes(false);
    }
  }, []);

  // Fetch popular routes on component mount
  useEffect(() => {
    fetchPopularRoutes();
  }, [fetchPopularRoutes]);

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
    <SafeAreaViewRN style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView
        style={{
          padding: 16,
          paddingTop: 8, // Reduced top padding to move title up
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeColors.primary]}
            tintColor={themeColors.primary}
          />
        }
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 24,
            fontWeight: 'bold',
            color: themeColors.text,
            marginBottom: 4
          }}>
            Good {getTimeOfDay()}{user ? `, ${(user as any).user_metadata?.name || user.email?.split('@')[0]}` : ''}!
          </Text>
          <Text style={{ 
            fontSize: 16,
            color: themeColors.subtext 
          }}>
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
    <View>
      <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: 12 }]}>
        Or check out these popular routes
      </Text>
      {loadingFeatured ? (
        <ActivityIndicator size="large" color={themeColors.primary} />
      ) : featuredBuses.length > 0 ? (
        featuredBuses.map(bus => (
          <BusCard
            key={`featured-${bus.id}`}
            bus={bus}
            onPress={() => handleSelectBus(bus)}
          />
        ))
      ) : (
        <Text style={{ color: themeColors.subtext, textAlign: 'center' }}>
          No featured routes available at the moment.
        </Text>
      )}
    </View>
  )}
        
        {/* Popular Routes Section */}
        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Popular Routes</Text>
            <TouchableOpacity onPress={fetchPopularRoutes} disabled={loadingPopularRoutes}>
              <Text style={[styles.seeAllText, { color: themeColors.primary }]}>
                {loadingPopularRoutes ? 'Loading...' : 'See All'}
              </Text>
            </TouchableOpacity>
          </View>

          {loadingPopularRoutes ? (
            <View style={{ flexDirection: 'row', paddingVertical: 8 }}>
              {[1, 2, 3].map((i) => (
                <View 
                  key={i} 
                  style={{ 
                    backgroundColor: themeColors.card, 
                    borderColor: themeColors.border, 
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 16,
                    marginRight: 12,
                    minWidth: 200,
                    opacity: 0.7 
                  }}
                >
                  <View style={{ width: 120, height: 20, backgroundColor: themeColors.border, borderRadius: 8, marginBottom: 8 }} />
                  <View style={{ width: 80, height: 16, backgroundColor: themeColors.border, borderRadius: 4 }} />
                </View>
              ))}
            </View>
          ) : popularRoutes.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ paddingVertical: 4 }}
            >
              {popularRoutes.map((route, index) => (
                <TouchableOpacity 
                  key={`${route.departure_location}-${route.arrival_location}-${index}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderRadius: 12,
                    marginRight: 12,
                    minWidth: 200,
                    backgroundColor: themeColors.card,
                    borderWidth: 1,
                    borderColor: themeColors.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  onPress={() => {
                    setFrom(route.departure_location);
                    setTo(route.arrival_location);
                    setSearchParams(route.departure_location, route.arrival_location, date.toISOString().split('T')[0], passengers);
                    searchBuses();
                    setShowSearchResults(true);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{
                        fontWeight: '600',
                        color: themeColors.text,
                        fontSize: 16,
                      }}>
                        {route.departure_location.split(' ').map(word => word[0]).join('').toUpperCase()}
                      </Text>
                      <View style={{ marginHorizontal: 8 }}>
                        <ArrowRight size={16} color={themeColors.primary} />
                      </View>
                      <Text style={{
                        fontWeight: '600',
                        color: themeColors.text,
                        fontSize: 16,
                      }}>
                        {route.arrival_location.split(' ').map(word => word[0]).join('').toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                      <Text style={{
                        color: themeColors.primary,
                        fontSize: 18,
                        fontWeight: '700',
                      }}>
                        {formatCurrency(route.avg_price || 0)}
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: themeColors.primary + '20',
                  }}>
                    <ArrowRight size={20} color={themeColors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={{ paddingVertical: 16 }}>
              <Text style={{
                textAlign: 'center',
                color: themeColors.text,
                fontSize: 14,
              }}>
                No popular routes available
              </Text>
            </View>
          )}
        </View>
        
        {/* Featured Buses Section */}
        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
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
          </View>
          
          {/* Promo Card Section */}
          <View style={{ marginTop: 24, marginBottom: 16 }}>
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
          </View>

        {/* Date Pickers */}
        {Platform.OS === 'ios' && showDatePicker && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showDatePicker}
            onRequestClose={closeDatePicker}
          >
            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
              <View style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                backgroundColor: themeColors.card,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: themeColors.text,
                  }}>Select Date</Text>
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
                  style={{ marginTop: 16 }}
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
        </ScrollView>
      </SafeAreaViewRN>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  loadingIndicator: {
    marginVertical: 16,
  },
  routeFrom: {
    fontWeight: '600',
    marginRight: 4,
  },
  routeTo: {
    fontWeight: '600',
    marginLeft: 4,
  },
  routeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bookingCount: {
    fontSize: 12,
    marginRight: 8,
  },
  noResults: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
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