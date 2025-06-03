import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bus, Booking, Passenger } from '@/types';
import { 
  fetchBuses, 
  fetchBookings, 
  createBooking as apiCreateBooking, 
  cancelBooking as apiCancelBooking 
} from '@/services/api';

interface BookingState {
  // Search state
  searchParams: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  };
  searchResults: Bus[];
  isLoading: boolean;
  error: string | null;
  
  // Current booking
  currentBooking: {
    selectedBus: Bus | null;
    from: string;
    to: string;
    date: string;
    passengers: number;
    passengerDetails: Passenger[];
    selectedSeats: string[];
    totalPrice: number;
    paymentMethod: string;
  };
  
  // User bookings
  userBookings: Booking[];
  bookings: Booking[]; // Added for compatibility with confirmation.tsx
  
  // Actions
  setSearchParams: (from: string, to: string, date: string, passengers: number) => void;
  searchBuses: () => Promise<void>;
  selectBus: (bus: Bus) => void;
  selectSeats: (seats: string[]) => void;
  setPassengerDetails: (passengers: Passenger[]) => void;
  updateBookingDetails: (details: Partial<BookingState['currentBooking']>) => void;
  setPaymentMethod: (method: string) => void;
  completeBooking: () => Promise<Booking>;
  confirmBooking: () => Promise<Booking>; // Added for compatibility with payment.tsx
  cancelBooking: (bookingId: string) => Promise<void>;
  clearCurrentBooking: () => void;
  resetCurrentBooking: () => void; // Added for compatibility with confirmation.tsx
  refreshBookings: () => Promise<void>; // Added for pull-to-refresh functionality
  fetchUserBookings: (userId: string) => Promise<void>;
}

// Default values for current booking to prevent undefined errors
const defaultCurrentBooking = {
  selectedBus: null,
  from: '',
  to: '',
  date: '',
  passengers: 1,
  passengerDetails: [],
  selectedSeats: [],
  totalPrice: 0,
  paymentMethod: 'card' // Default payment method
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Search state
      searchParams: {
        from: '',
        to: '',
        date: '',
        passengers: 1,
      },
      searchResults: [],
      isLoading: false,
      error: null,
      
      // Current booking - initialize with default values
      currentBooking: { ...defaultCurrentBooking },
      
      // User bookings
      userBookings: [],
      bookings: [], // Added for compatibility with confirmation.tsx
      
      // Actions
      setSearchParams: (from, to, date, passengers) => {
        set({
          searchParams: {
            from,
            to,
            date,
            passengers,
          },
          error: null,
        });
      },
      
      searchBuses: async () => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('Fetching all available buses');
          
          // Fetch all buses from API without filtering
          const buses = await fetchBuses();
          
          console.log(`API returned ${buses.length} buses`);
          
          set({ 
            searchResults: buses,
            isLoading: false,
            error: buses.length === 0 ? "No buses available at the moment. Please check back later." : null
          });
        } catch (error) {
          console.error('Error fetching buses:', error);
          
          // Handle error properly with type checking
          let errorMessage = "Could not connect to server. Please try again later.";
          if (error instanceof Error) {
            errorMessage = `${errorMessage} (${error.message})`;
          }
          
          set({ 
            searchResults: [],
            isLoading: false, 
            error: errorMessage
          });
        }
      },
      
      selectBus: (bus) => {
        const { searchParams } = get();
        
        set({ 
          currentBooking: {
            ...get().currentBooking,
            selectedBus: bus,
            from: searchParams.from || bus.from,
            to: searchParams.to || bus.to,
            date: searchParams.date,
            passengers: searchParams.passengers,
            selectedSeats: [],
            totalPrice: bus.price * searchParams.passengers
          },
          error: null
        });
      },
      
      selectSeats: (seats) => {
        const { currentBooking } = get();
        
        if (!currentBooking.selectedBus) return;
        
        set({
          currentBooking: {
            ...currentBooking,
            selectedSeats: seats,
            totalPrice: currentBooking.selectedBus.price * seats.length
          },
          error: null
        });
      },
      
      setPassengerDetails: (passengers) => {
        set(state => ({
          currentBooking: {
            ...state.currentBooking,
            passengerDetails: passengers
          },
          error: null
        }));
      },
      
      updateBookingDetails: (details) => {
        set(state => ({
          currentBooking: {
            ...state.currentBooking,
            ...details
          },
          error: null
        }));
      },
      
      setPaymentMethod: (method) => {
        set(state => ({
          currentBooking: {
            ...state.currentBooking,
            paymentMethod: method
          },
          error: null
        }));
      },
      
      completeBooking: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { currentBooking } = get();
          
          if (!currentBooking.selectedBus) {
            throw new Error("No bus selected");
          }
          
          if (currentBooking.selectedSeats.length === 0) {
            throw new Error("No seats selected");
          }
          
          // Prepare booking data for API
          const bookingData = {
            busId: currentBooking.selectedBus.id,
            busName: currentBooking.selectedBus.name,
            plate_number: currentBooking.selectedBus.plate_number,
            from: currentBooking.from,
            to: currentBooking.to,
            departureDate: currentBooking.date,
            departureTime: currentBooking.selectedBus.departureTime,
            arrivalTime: currentBooking.selectedBus.arrivalTime,
            seatNumbers: currentBooking.selectedSeats,
            passengers: currentBooking.passengerDetails,
            totalAmount: currentBooking.totalPrice,
            paymentMethod: currentBooking.paymentMethod || 'card',
            userId: "user-1" // In a real app, get this from auth store
          };
          
          // Call API to create booking
          const newBooking = await apiCreateBooking(bookingData);
          
          // Add to user bookings
          set(state => ({
            userBookings: [newBooking, ...state.userBookings],
            bookings: [newBooking, ...state.userBookings], // Update bookings as well
            isLoading: false,
            error: null
          }));
          
          return newBooking;
        } catch (error) {
          // Handle error properly with type checking
          let errorMessage = "Failed to complete booking";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ 
            isLoading: false, 
            error: errorMessage
          });
          throw error;
        }
      },
      
      // Added for compatibility with payment.tsx
      confirmBooking: async () => {
        return get().completeBooking();
      },
      
      cancelBooking: async (bookingId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Call API to cancel booking
          await apiCancelBooking(bookingId);
          
          // Update booking status to cancelled
          set(state => {
            const updatedBookings = state.userBookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: 'cancelled' as const } 
                : booking
            );
            
            return {
              userBookings: updatedBookings,
              bookings: updatedBookings,
              isLoading: false,
              error: null
            };
          });
        } catch (error) {
          // Handle error properly with type checking
          let errorMessage = "Failed to cancel booking";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ 
            isLoading: false, 
            error: errorMessage
          });
          throw error;
        }
      },
      
      clearCurrentBooking: () => {
        set({
          currentBooking: { ...defaultCurrentBooking },
          error: null
        });
      },
      
      // Added for compatibility with confirmation.tsx
      resetCurrentBooking: () => {
        set({
          currentBooking: { ...defaultCurrentBooking },
          error: null
        });
      },
      
      refreshBookings: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, you would get the userId from the auth store
          const userId = "user-1"; // Placeholder
          
          // Call API to fetch bookings
          const bookings = await fetchBookings(userId);
          
          set({ 
            userBookings: bookings,
            bookings: bookings,
            isLoading: false,
            error: null
          });
        } catch (error) {
          // Handle error properly with type checking
          let errorMessage = "Failed to refresh bookings";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ 
            isLoading: false, 
            error: errorMessage
          });
        }
      },
      
      fetchUserBookings: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Call API to fetch bookings
          const bookings = await fetchBookings(userId);
          
          set({ 
            userBookings: bookings,
            bookings: bookings,
            isLoading: false,
            error: null
          });
        } catch (error) {
          // Handle error properly with type checking
          let errorMessage = "Failed to fetch bookings";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ 
            isLoading: false, 
            error: errorMessage
          });
        }
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // We don't need to persist search results or current booking
        // Only persist user bookings for offline access
        userBookings: state.userBookings,
        bookings: state.bookings,
      }),
    }
  )
);