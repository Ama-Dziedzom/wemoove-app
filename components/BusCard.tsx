import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, Clock, Wifi, Power, AirVent, Armchair, Toilet } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useCurrency } from '@/hooks/useCurrency';
import { Bus } from '@/types';

interface BusCardProps {
  bus: Bus;
  onPress: () => void;
}

const BusCard: React.FC<BusCardProps> = ({ bus, onPress }) => {
  const { settings } = useAppStore();
  const { formatCurrency } = useCurrency();
  const theme = settings.theme;
  const themeColors = colors[theme];
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Determine which amenities to show based on state
  const visibleAmenities = showAllAmenities 
    ? bus.amenities || [] 
    : (bus.amenities || []).slice(0, 2);
  const hiddenAmenitiesCount = (bus.amenities?.length || 0) - 2;

  // Format duration to display in a more readable format
  const formatDuration = (duration: string) => {
    if (!duration) return '';
    
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

  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi':
        return <Wifi size={14} color={themeColors.primary} />;
      case 'Power Outlets':
      case 'USB Charging':
        return <Power size={14} color={themeColors.primary} />;
      case 'Air Conditioning':
      case 'AC':
        return <AirVent size={14} color={themeColors.primary} />;
      case 'Reclining Seats':
        return <Armchair size={14} color={themeColors.primary} />;
      case 'Restroom':
      case 'Toilet':
        return <Toilet size={14} color={themeColors.primary} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: themeColors.card,
        borderColor: themeColors.border
      }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.busName, { color: themeColors.text }]}>
            {bus.name}
          </Text>
          <Text style={[styles.busCompany, { color: themeColors.subtext }]}>
            Plate: {bus.plate_number}
          </Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={themeColors.warning} fill={themeColors.warning} />
          <Text style={[styles.ratingText, { color: themeColors.text }]}>
            {bus.rating.toFixed(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.timeContainer}>
        <View style={styles.timeColumn}>
          <Text style={[styles.timeLabel, { color: themeColors.subtext }]}>
            Departure
          </Text>
          <Text style={[styles.timeValue, { color: themeColors.text }]}>
            {bus.departureTime}
          </Text>
        </View>
        
        <View style={styles.durationContainer}>
          <View style={[styles.durationLine, { backgroundColor: themeColors.border }]} />
          <View style={styles.durationTextContainer}>
            <Clock size={12} color={themeColors.subtext} />
            <Text style={[styles.durationText, { color: themeColors.subtext }]}>
              {formatDuration(bus.duration)}
            </Text>
          </View>
        </View>
        
        <View style={styles.timeColumn}>
          <Text style={[styles.timeLabel, { color: themeColors.subtext }]}>
            Arrival
          </Text>
          <Text style={[styles.timeValue, { color: themeColors.text }]}>
            {bus.arrivalTime}
          </Text>
        </View>
      </View>
      
      <View style={styles.amenitiesContainer}>
        {visibleAmenities.map((amenity, index) => (
          <View key={index} style={styles.amenityItem}>
            {renderAmenityIcon(amenity)}
            <Text style={[styles.amenityText, { color: themeColors.subtext }]}>
              {amenity}
            </Text>
          </View>
        ))}
        {!showAllAmenities && hiddenAmenitiesCount > 0 && (
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => setShowAllAmenities(true)}
          >
            <Text style={[styles.moreButtonText, { color: themeColors.primary }]}>
              +{hiddenAmenitiesCount} more
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
        <View>
          <Text style={[styles.seatsText, { color: themeColors.subtext }]}>
            {bus.availableSeats} seats available
          </Text>
        </View>
        
        <View>
          <Text style={[styles.priceText, { color: themeColors.primary }]}>
            {formatCurrency(bus.price)}
          </Text>
          <Text style={[styles.perPersonText, { color: themeColors.subtext }]}>
            per person
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  busName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  busCompany: {
    fontSize: 15,
    opacity: 0.8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeColumn: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  durationContainer: {
    flex: 2,
    alignItems: 'center',
    position: 'relative',
  },
  durationLine: {
    height: 1,
    width: '100%',
  },
  durationTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    position: 'absolute',
    top: -10,
  },
  durationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    alignItems: 'center',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amenityText: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  moreButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  seatsText: {
    fontSize: 14,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  perPersonText: {
    fontSize: 12,
    textAlign: 'right',
  },
});

export default BusCard;