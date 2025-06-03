import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useBookingStore } from '@/store/booking-store';
import { useCurrency } from '@/hooks/useCurrency';
import Button from '@/components/Button';

export default function ConfirmationScreen() {
  const { settings } = useAppStore();
  const { bookings, resetCurrentBooking } = useBookingStore();
  const { formatCurrency } = useCurrency();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  // Get the most recent booking
  const booking = bookings[0];

  // Format duration to display in a more readable format
  const formatDuration = (duration: string) => {
    // If already in HH:MM:SS format, convert to a more readable format
    if (/^\d{2}:\d{2}:\d{2}$/.test(duration)) {
      const [hours, minutes, seconds] = duration.split(':').map(Number);
      
      if (hours > 0) {
        if (minutes > 0) {
          if (seconds > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
          }
          return `${hours}h ${minutes}m`;
        }
        return `${hours}h`;
      } else if (minutes > 0) {
        if (seconds > 0) {
          return `${minutes}m ${seconds}s`;
        }
        return `${minutes}m`;
      } else {
        return `${seconds}s`;
      }
    }
    
    // If not in HH:MM:SS format, return as is
    return duration;
  };

  const handleViewBooking = () => {
    router.push(`/booking/${booking.id}`);
  };

  const handleGoHome = () => {
    resetCurrentBooking();
    router.replace('/');
  };

  if (!booking) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themeColors.text }]}>
            No booking information found. Please go back and start a new booking.
          </Text>
          <Button
            title="Go to Home"
            onPress={() => router.replace('/')}
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.successContainer}>
          <CheckCircle size={80} color={themeColors.success} />
          <Text style={[styles.successTitle, { color: themeColors.text }]}>
            Booking Confirmed!
          </Text>
          <Text style={[styles.successMessage, { color: themeColors.subtext }]}>
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </Text>
        </View>
        
        <View style={[styles.bookingCard, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          <View style={styles.bookingHeader}>
            <Text style={[styles.bookingId, { color: themeColors.text }]}>
              Booking ID: {booking.id}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: `${themeColors.success}20` }]}>
              <Text style={[styles.statusText, { color: themeColors.success }]}>
                Confirmed
              </Text>
            </View>
          </View>
          
          <View style={styles.busInfo}>
            <Text style={[styles.busName, { color: themeColors.text }]}>
              {booking.busName}
            </Text>
            <Text style={[styles.busCompany, { color: themeColors.subtext }]}>
              Plate: {booking.plate_number}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color={themeColors.primary} />
            <Text style={[styles.infoText, { color: themeColors.text }]}>
              {booking.from} to {booking.to}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Calendar size={16} color={themeColors.primary} />
            <Text style={[styles.infoText, { color: themeColors.text }]}>
              {new Date(booking.departureDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={16} color={themeColors.primary} />
            <Text style={[styles.infoText, { color: themeColors.text }]}>
              {booking.departureTime} - {booking.arrivalTime} 
              {booking.bus?.duration && ` (${formatDuration(booking.bus.duration)})`}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Users size={16} color={themeColors.primary} />
            <Text style={[styles.infoText, { color: themeColors.text }]}>
              {booking.passengers.length} {booking.passengers.length === 1 ? 'passenger' : 'passengers'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <CreditCard size={16} color={themeColors.primary} />
            <Text style={[styles.infoText, { color: themeColors.text }]}>
              Paid with {booking.paymentMethod}
            </Text>
          </View>
          
          <View style={[styles.seatsContainer, { borderColor: themeColors.border }]}>
            <Text style={[styles.seatsLabel, { color: themeColors.text }]}>
              Seat Numbers
            </Text>
            <View style={styles.seatsList}>
              {booking.seatNumbers.map((seat: string, index: number) => (
                <View 
                  key={seat} 
                  style={[styles.seatBadge, { backgroundColor: themeColors.primary }]}
                >
                  <Text style={styles.seatText}>{seat}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={[styles.totalContainer, { borderTopColor: themeColors.border }]}>
            <Text style={[styles.totalLabel, { color: themeColors.text }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: themeColors.primary }]}>
              {formatCurrency(booking.totalAmount)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.qrContainer, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          <Text style={[styles.qrTitle, { color: themeColors.text }]}>
            Boarding Pass
          </Text>
          <Text style={[styles.qrSubtitle, { color: themeColors.subtext }]}>
            Show this QR code to the driver when boarding
          </Text>
          <Image 
            source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + booking.id }} 
            style={styles.qrCode}
          />
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { 
        backgroundColor: themeColors.card,
        borderTopColor: themeColors.border
      }]}>
        <Button
          title="View Booking"
          variant="outline"
          onPress={handleViewBooking}
          style={styles.footerButton}
        />
        <Button
          title="Back to Home"
          onPress={handleGoHome}
          style={styles.footerButton}
        />
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
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    minWidth: 120,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
  },
  bookingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  busInfo: {
    marginBottom: 16,
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  busCompany: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
  seatsContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  seatsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  seatsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seatBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  seatText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});