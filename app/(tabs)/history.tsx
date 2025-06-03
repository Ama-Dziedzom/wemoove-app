import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Calendar, 
  Clock, 
  Filter,
  Check
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useBookingStore } from '@/store/booking-store';
import BookingCard from '@/components/BookingCard';

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { settings } = useAppStore();
  const { bookings, cancelBooking, isLoading, refreshBookings } = useBookingStore();
  
  const theme = settings.theme;
  const themeColors = colors[theme];
  
  const router = useRouter();

  const handleViewBooking = (bookingId: string) => {
    router.push(`/booking/${bookingId}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? You will receive a refund according to our refund policy.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
              Alert.alert('Success', 'Your booking has been cancelled successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          },
        },
      ]
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // Refresh bookings
    if (refreshBookings) {
      await refreshBookings();
    }
    
    setRefreshing(false);
  }, [refreshBookings]);

  const filterBookings = () => {
    switch (activeFilter) {
      case 'upcoming':
        return bookings.filter(booking => booking.status === 'upcoming');
      case 'completed':
        return bookings.filter(booking => booking.status === 'completed');
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const filteredBookings = filterBookings();
  const filterOptions = [
    { id: 'all', label: 'All Bookings' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          My Bookings
        </Text>
        
        <TouchableOpacity 
          style={[styles.filterButton, { 
            backgroundColor: themeColors.card,
            borderColor: themeColors.border
          }]}
          onPress={() => setShowFilterOptions(!showFilterOptions)}
        >
          <Filter size={16} color={themeColors.text} />
          <Text style={[styles.filterButtonText, { color: themeColors.text }]}>
            {filterOptions.find(option => option.id === activeFilter)?.label || 'Filter'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showFilterOptions && (
        <View style={[styles.filterPanel, { 
          backgroundColor: themeColors.card,
          borderColor: themeColors.border
        }]}>
          {filterOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.filterOption}
              onPress={() => {
                setActiveFilter(option.id);
                setShowFilterOptions(false);
              }}
            >
              <Text style={[
                styles.filterOptionText,
                { color: activeFilter === option.id ? themeColors.primary : themeColors.text }
              ]}>
                {option.label}
              </Text>
              
              {activeFilter === option.id && (
                <Check size={20} color={themeColors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() => handleViewBooking(item.id)}
            onCancel={() => handleCancelBooking(item.id)}
            isLoading={isLoading}
          />
        )}
        contentContainerStyle={styles.bookingsContainer}
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
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              No bookings found
            </Text>
            <Text style={[styles.emptySubtitle, { color: themeColors.subtext }]}>
              {activeFilter === 'all' 
                ? "You haven't made any bookings yet." 
                : `You don't have any ${activeFilter} bookings.`}
            </Text>
            {activeFilter !== 'all' && (
              <TouchableOpacity
                style={[styles.viewAllButton, { borderColor: themeColors.border }]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[styles.viewAllButtonText, { color: themeColors.primary }]}>
                  View All Bookings
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  filterPanel: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  filterOptionText: {
    fontSize: 16,
  },
  bookingsContainer: {
    padding: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});