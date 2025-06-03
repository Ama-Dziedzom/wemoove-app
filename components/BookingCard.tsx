import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useCurrency } from '@/hooks/useCurrency';
import { Booking } from '@/types';
import Button from './Button';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onPress, 
  onCancel,
  isLoading = false
}) => {
  const { settings } = useAppStore();
  const { formatCurrency } = useCurrency();
  const theme = settings.theme;
  const themeColors = colors[theme];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return themeColors.success;
      case 'completed':
        return themeColors.info;
      case 'cancelled':
        return themeColors.error;
      default:
        return themeColors.text;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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

  const canCancel = booking.status === 'upcoming' && booking.refundable;

  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: themeColors.card,
        borderColor: themeColors.border
      }]}
      onPress={onPress}
      disabled={isLoading}
    >
      <View style={styles.header}>
        <Text style={[styles.busName, { color: themeColors.text }]}>
          {booking.busName}
        </Text>
        
        <View style={[
          styles.statusBadge, 
          { backgroundColor: `${getStatusColor(booking.status)}20` }
        ]}>
          <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
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
          {formatDate(booking.departureDate)}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Clock size={16} color={themeColors.primary} />
        <Text style={[styles.infoText, { color: themeColors.text }]}>
          {booking.departureTime} - {booking.arrivalTime}
          {booking.bus?.duration && ` (${formatDuration(booking.bus.duration)})`}
        </Text>
      </View>
      
      <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
        <View>
          <Text style={[styles.priceText, { color: themeColors.primary }]}>
            {formatCurrency(booking.totalAmount)}
          </Text>
          <Text style={[styles.seatsText, { color: themeColors.subtext }]}>
            {booking.seatNumbers.length} {booking.seatNumbers.length === 1 ? 'seat' : 'seats'}
          </Text>
        </View>
        
        {canCancel && onCancel ? (
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            loading={isLoading}
            style={styles.cancelButton}
          />
        ) : (
          <ChevronRight size={20} color={themeColors.subtext} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  busName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seatsText: {
    fontSize: 12,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default BookingCard;