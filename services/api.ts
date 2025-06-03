import { supabase } from '@/app/lib/supabase-client';
import { Location, Bus, SeatAvailability, PaymentMethod, Notification } from '@/app/types';

// API endpoints (keeping these for reference or future use)
const BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:cvxqMt6B';
export const LOCATION_API_ENDPOINT = `${BASE_URL}/locations`;
export const BUS_API_ENDPOINT = `${BASE_URL}/buses`;
export const BOOKING_API_ENDPOINT = `${BASE_URL}/bookings`;
export const USER_API_ENDPOINT = `${BASE_URL}/users`;
export const PAYMENT_API_ENDPOINT = `${BASE_URL}/payment-methods`;
export const NOTIFICATION_API_ENDPOINT = `${BASE_URL}/notifications`;

// Mock data for locations
const getMockLocations = (): Location[] => [
  { id: '1', name: 'Accra', state: 'Greater Accra', country: 'Ghana', code: 'ACC' },
  { id: '2', name: 'Kumasi', state: 'Ashanti', country: 'Ghana', code: 'KMS' },
  { id: '3', name: 'Tamale', state: 'Northern', country: 'Ghana', code: 'TML' },
  { id: '4', name: 'Cape Coast', state: 'Central', country: 'Ghana', code: 'CPT' },
  { id: '5', name: 'Takoradi', state: 'Western', country: 'Ghana', code: 'TKD' },
];

// Mock data for buses
const getMockBuses = (from?: string, to?: string): Bus[] => {
  const mockBuses: Bus[] = [
    {
      id: '1',
      name: 'VIP Express',
      plate_number: 'GH-1234-21',
      from: 'Accra',
      to: 'Kumasi',
      departureTime: '08:00',
      arrivalTime: '12:00',
      duration: '4h',
      price: 120,
      rating: 4.5,
      amenities: ['AC', 'WiFi', 'USB Charging'],
      availableSeats: 35,
      totalSeats: 45,
      unavailableSeats: ['A1', 'B2', 'C3'],
    },
    {
      id: '2',
      name: 'STC Luxury',
      plate_number: 'GH-5678-21',
      from: 'Kumasi',
      to: 'Tamale',
      departureTime: '09:30',
      arrivalTime: '15:30',
      duration: '6h',
      price: 150,
      rating: 4.2,
      amenities: ['AC', 'Refreshments', 'Entertainment'],
      availableSeats: 40,
      totalSeats: 50,
      unavailableSeats: ['D4', 'E5'],
    },
  ];

  if (!from && !to) return mockBuses;

  return mockBuses.filter(bus => 
    (!from || bus.from.toLowerCase().includes(from.toLowerCase())) &&
    (!to || bus.to.toLowerCase().includes(to.toLowerCase()))
  );
};

// Helper function to calculate duration between two dates
function calculateDuration(departure: string, arrival: string): string {
  if (!departure || !arrival) return '';
  const dep = new Date(departure);
  const arr = new Date(arrival);
  const diffMs = arr.getTime() - dep.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Process bus data from Supabase
const processBusData = (data: any[]): Bus[] => {
  return data.map(bus => ({
    id: bus.id?.toString() || '',
    name: bus.operator || '',
    plate_number: bus.plate_number || '', // Use plate_number from database
    from: bus.departure_location || '',
    to: bus.arrival_location || '',
    departureTime: bus.departure_time ? new Date(bus.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
    arrivalTime: bus.arrival_time ? new Date(bus.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
    duration: calculateDuration(bus.departure_time, bus.arrival_time),
    price: Number(bus.price_ghs) || 0,
    rating: Number(bus.rating) || 0,
    amenities: Array.isArray(bus.amenities) ? bus.amenities : [],
    availableSeats: Number(bus.seats_available || bus.total_seats) || 50, // Default to total_seats if seats_available is null
    totalSeats: Number(bus.total_seats) || 50, // Default to 50 if not specified
    unavailableSeats: [] // Initialize empty array for unavailable seats
  }));
};

// Fetch locations from Supabase
export const fetchLocations = async (): Promise<Location[]> => {
  try {
    console.log('Fetching locations from Supabase');
    
    const { data, error } = await supabase
      .from('locations')
      .select('*');
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No locations found in Supabase, using mock data');
      return getMockLocations();
    }
    
    return data.map((location: any) => ({
      id: location.id?.toString(),
      name: location.name || '',
      state: location.state || '',
      country: location.country || '',
      code: location.code || '',
    }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    // Fallback to mock data if Supabase query fails
    return getMockLocations();
  }
};

// Fetch all buses from Supabase
export const fetchBuses = async (): Promise<Bus[]> => {
  try {
    console.log('Fetching all buses from Supabase');
    
    // Simply fetch all buses without any filtering
    const { data, error } = await supabase
      .from('buses')
      .select('*');
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No buses found in Supabase');
      return [];
    }
    
    console.log(`Found ${data.length} buses in Supabase`);
    return processBusData(data);
  } catch (error) {
    console.error('Error fetching buses:', error);
    return [];
  }
};

// Mock payment methods
const getMockPaymentMethods = (userId: string): PaymentMethod[] => [
  {
    id: '1',
    userId,
    type: 'card',
    cardNumber: '**** **** **** 4242',
    cardType: 'Visa',
    expiryDate: '12/25',
    isDefault: true
  },
  {
    id: '2',
    userId,
    type: 'mobile_money',
    provider: 'MTN',
    phoneNumber: '0244123456',
    isDefault: false
  }
];

// Mock notifications
const getMockNotifications = (userId: string): Notification[] => [
  {
    id: '1',
    userId,
    title: 'Booking Confirmed',
    message: 'Your booking to Kumasi has been confirmed.',
    timestamp: new Date().toISOString(),
    read: false,
    type: 'booking'
  },
  {
    id: '2',
    userId,
    title: 'Payment Successful',
    message: 'Your payment of ₵120 was successful.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    type: 'payment'
  }
];

// Fetch payment methods
export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return getMockPaymentMethods(userId);
    }
    
    return data.map((method: any) => ({
      id: method.id.toString(),
      userId: method.user_id,
      type: method.type,
      cardNumber: method.card_number,
      cardType: method.card_type,
      expiryDate: method.expiry_date,
      provider: method.provider,
      phoneNumber: method.phone_number,
      isDefault: method.is_default
    }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return getMockPaymentMethods(userId);
  }
};

// Add payment method
export const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: method.userId,
        type: method.type,
        card_number: method.cardNumber,
        card_type: method.cardType,
        expiry_date: method.expiryDate,
        provider: method.provider,
        phone_number: method.phoneNumber,
        is_default: method.isDefault
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id.toString(),
      userId: data.user_id,
      type: data.type,
      cardNumber: data.card_number,
      cardType: data.card_type,
      expiryDate: data.expiry_date,
      provider: data.provider,
      phoneNumber: data.phone_number,
      isDefault: data.is_default
    };
  } catch (error) {
    console.error('Error adding payment method:', error);
    // For demo purposes, return a mock with a generated ID
    return {
      id: Date.now().toString(),
      ...method
    };
  }
};

// Remove payment method
export const removePaymentMethod = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error removing payment method:', error);
    // Just log the error in demo mode
  }
};

// Fetch notifications
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return getMockNotifications(userId);
    }
    
    return data.map((notification: any) => ({
      id: notification.id.toString(),
      userId: notification.user_id,
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp,
      read: notification.read,
      type: notification.type
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return getMockNotifications(userId);
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    throw error;
  }
};

// Fetch user's bookings
export const fetchBookings = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchBookings:', error);
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    throw error;
  }
};