import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CreditCard,
  Bus,
  Info
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useBookingStore } from '@/store/booking-store';
import { useCurrency } from '@/hooks/useCurrency';
import Button from '@/components/Button';
import SeatSelection from '@/components/SeatSelection';
import Input from '@/components/Input';
import { Passenger } from '@/app/types';

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [passengerDetails, setPassengerDetails] = useState<Passenger[]>([
    { id: '1', name: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { settings } = useAppStore();
  const { 
    currentBooking, 
    updateBookingDetails,
    searchResults,
    selectBus
  } = useBookingStore();
  const { formatCurrency } = useCurrency();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();
  
  // Find the bus in searchResults if not already selected
  useEffect(() => {
    if (!currentBooking.selectedBus && id && searchResults.length > 0) {
      const bus = searchResults.find(b => b.id === id);
      if (bus) {
        selectBus(bus);
      }
    }
  }, [id, searchResults, currentBooking.selectedBus, selectBus]);
  
  const selectedBus = currentBooking.selectedBus;
  const selectedSeats = currentBooking.selectedSeats || [];

  useEffect(() => {
    // Initialize passenger details based on selected seats
    if (selectedSeats.length > 0) {
      setPassengerDetails(
        selectedSeats.map((seat: string, index: number) => ({
          id: (index + 1).toString(),
          name: '',
          seatNumber: seat
        }))
      );
    }
  }, [selectedSeats]);

  const handleSeatSelection = (seatNumber: string) => {
    // Check if seat is already selected
    if (selectedSeats.includes(seatNumber)) {
      // Remove seat
      updateBookingDetails({
        selectedSeats: selectedSeats.filter((seat: string) => seat !== seatNumber)
      });
    } else {
      // Add seat if not exceeding passenger count
      if (selectedSeats.length < passengerDetails.length) {
        updateBookingDetails({
          selectedSeats: [...selectedSeats, seatNumber]
        });
      } else {
        // If adding a new seat, also add a new passenger
        updateBookingDetails({
          selectedSeats: [...selectedSeats, seatNumber]
        });
        setPassengerDetails([
          ...passengerDetails,
          { id: (passengerDetails.length + 1).toString(), name: '', seatNumber }
        ]);
      }
    }
  };

  const handleAddPassenger = () => {
    if (passengerDetails.length < 5) {
      setPassengerDetails([
        ...passengerDetails,
        { id: (passengerDetails.length + 1).toString(), name: '' }
      ]);
    } else {
      Alert.alert('Maximum Passengers', 'You can only book up to 5 passengers at once.');
    }
  };

  const handleRemovePassenger = (id: string) => {
    if (passengerDetails.length > 1) {
      const updatedPassengers = passengerDetails.filter(passenger => passenger.id !== id);
      setPassengerDetails(updatedPassengers);
      
      // Also remove any selected seats that exceed the new passenger count
      if (selectedSeats.length > updatedPassengers.length) {
        updateBookingDetails({
          selectedSeats: selectedSeats.slice(0, updatedPassengers.length)
        });
      }
    }
  };

  const updatePassengerName = (id: string, name: string) => {
    setPassengerDetails(
      passengerDetails.map(passenger => 
        passenger.id === id ? { ...passenger, name } : passenger
      )
    );
  };

  const handleContinue = () => {
    // Validate passenger details
    const emptyNames = passengerDetails.filter(passenger => !passenger.name.trim());
    if (emptyNames.length > 0) {
      Alert.alert('Missing Information', 'Please enter names for all passengers.');
      return;
    }
    
    if (selectedSeats.length !== passengerDetails.length) {
      Alert.alert('Seat Selection Required', `Please select ${passengerDetails.length} seats for all passengers.`);
      return;
    }
    
    // Update passenger details in the store
    updateBookingDetails({
      passengerDetails: passengerDetails
    });
    
    // Proceed to payment
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/booking/payment');
    }, 1000);
  };

  if (!selectedBus) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text style={[styles.loadingText, { color: themeColors.text }]}>
            Loading bus details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = selectedBus.price * passengerDetails.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            Booking Details
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={[styles.busInfoCard, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          <View style={styles.busHeader}>
            <View style={styles.busNameContainer}>
              <Text style={[styles.busName, { color: themeColors.text }]}>
                {selectedBus.name}
              </Text>
              <Text style={[styles.busPlate, { color: themeColors.subtext }]}>
                {selectedBus.plate_number}
              </Text>
            </View>
            <Bus size={24} color={themeColors.primary} />
          </View>
          
          <View style={styles.routeContainer}>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={themeColors.primary} />
              <Text style={[styles.locationText, { color: themeColors.text }]}>
                {selectedBus.from}
              </Text>
            </View>
            
            <View style={[styles.routeLine, { backgroundColor: themeColors.border }]} />
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={themeColors.primary} />
              <Text style={[styles.locationText, { color: themeColors.text }]}>
                {selectedBus.to}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Calendar size={16} color={themeColors.primary} />
              <Text style={[styles.detailText, { color: themeColors.text }]}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={16} color={themeColors.primary} />
              <Text style={[styles.detailText, { color: themeColors.text }]}>
                {selectedBus.departureTime}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Users size={16} color={themeColors.primary} />
              <Text style={[styles.detailText, { color: themeColors.text }]}>
                {passengerDetails.length} {passengerDetails.length === 1 ? 'Passenger' : 'Passengers'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Select Seats
          </Text>
          <Text style={[styles.sectionSubtitle, { color: themeColors.subtext }]}>
            {selectedSeats.length} of {passengerDetails.length} seats selected
          </Text>
        </View>
        
        <View style={[styles.seatMapContainer, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          <SeatSelection
            busId={selectedBus.id}
            unavailableSeats={selectedBus.unavailableSeats || []}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelection}
          />
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: themeColors.border }]} />
              <Text style={[styles.legendText, { color: themeColors.subtext }]}>Available</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: themeColors.primary }]} />
              <Text style={[styles.legendText, { color: themeColors.subtext }]}>Selected</Text>
            </View>
            
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: themeColors.error + '40' }]} />
              <Text style={[styles.legendText, { color: themeColors.subtext }]}>Unavailable</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Passenger Details
          </Text>
          <TouchableOpacity 
            style={[styles.addButton, { borderColor: themeColors.primary }]}
            onPress={handleAddPassenger}
          >
            <Text style={[styles.addButtonText, { color: themeColors.primary }]}>
              + Add
            </Text>
          </TouchableOpacity>
        </View>
        
        {passengerDetails.map((passenger, index) => (
          <View 
            key={passenger.id}
            style={[styles.passengerCard, { 
              backgroundColor: themeColors.card,
              borderColor: themeColors.border
            }]}
          >
            <View style={styles.passengerHeader}>
              <Text style={[styles.passengerTitle, { color: themeColors.text }]}>
                Passenger {index + 1}
              </Text>
              {passengerDetails.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleRemovePassenger(passenger.id)}
                >
                  <Text style={[styles.removeText, { color: themeColors.error }]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Input
              label="Full Name"
              placeholder="Enter passenger name"
              value={passenger.name}
              onChangeText={(text) => updatePassengerName(passenger.id, text)}
            />
            
            <View style={styles.seatAssignment}>
              <Text style={[styles.seatLabel, { color: themeColors.subtext }]}>
                Assigned Seat:
              </Text>
              <Text style={[styles.seatValue, { color: themeColors.text }]}>
                {selectedSeats[index] || 'Not assigned'}
              </Text>
            </View>
          </View>
        ))}
        
        <View style={[styles.priceSummary, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          <Text style={[styles.priceSummaryTitle, { color: themeColors.text }]}>
            Price Summary
          </Text>
          
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: themeColors.subtext }]}>
              Ticket Price ({passengerDetails.length} x {formatCurrency(selectedBus.price)})
            </Text>
            <Text style={[styles.priceValue, { color: themeColors.text }]}>
              {formatCurrency(selectedBus.price * passengerDetails.length)}
            </Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: themeColors.subtext }]}>
              Service Fee
            </Text>
            <Text style={[styles.priceValue, { color: themeColors.text }]}>
              {formatCurrency(10)}
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: themeColors.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: themeColors.primary }]}>
              {formatCurrency(totalPrice + 10)}
            </Text>
          </View>
        </View>
        
        <View style={styles.infoBox}>
          <Info size={16} color={themeColors.primary} />
          <Text style={[styles.infoText, { color: themeColors.subtext }]}>
            By proceeding with this booking, you agree to our terms and conditions.
          </Text>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { 
        backgroundColor: themeColors.card,
        borderTopColor: themeColors.border
      }]}>
        <View style={styles.footerContent}>
          <View>
            <Text style={[styles.footerPriceLabel, { color: themeColors.subtext }]}>
              Total Price
            </Text>
            <Text style={[styles.footerPrice, { color: themeColors.text }]}>
              {formatCurrency(totalPrice + 10)}
            </Text>
          </View>
          
          <Button
            title="Continue to Payment"
            onPress={handleContinue}
            icon={<CreditCard size={18} color="#FFFFFF" />}
            loading={isLoading}
            style={styles.continueButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24, // Same as back button for alignment
  },
  busInfoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  busNameContainer: {
    flex: 1,
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  busPlate: {
    fontSize: 14,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
  },
  routeLine: {
    height: 1,
    flex: 1,
    marginHorizontal: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  seatMapContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  addButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  passengerCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  passengerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  removeText: {
    fontSize: 14,
  },
  seatAssignment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  seatLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  seatValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceSummary: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  priceSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerPriceLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    minWidth: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});