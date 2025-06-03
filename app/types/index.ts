export interface Location {
    id: string;
    name: string;
    state: string;
    country: string;
    code: string;
  }
  
  export interface Bus {
    id: string;
    name: string;
    plate_number: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    rating: number;
    amenities: string[];
    availableSeats: number;
    totalSeats: number;
    unavailableSeats: string[];
  }
  
  export interface SeatAvailability {
    id: string;
    busId: string;
    seatNumber: string;
    isAvailable: boolean;
    price?: number;
    category?: string;
  }
  
  export interface Booking {
    id: string;
    userId: string;
    busId: string;
    from: string;
    to: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
    seatNumbers: string[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'failed';
    createdAt: string;
    passengers: Passenger[];
  }
  
  export interface Passenger {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    idType?: string;
    idNumber?: string;
    seatNumber?: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    user_metadata?: {
      [key: string]: any;
    };
  }
  
  export interface PaymentMethod {
    id: string;
    userId?: string;  // Made optional with '?'
    type: 'card' | 'mobile_money' | 'bank';
    name?: string;
    cardNumber?: string;
    cardType?: string;
    expiryDate?: string;
    provider?: string;
    phoneNumber?: string;
    isDefault: boolean;
  }
  
  export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: 'booking' | 'payment' | 'promo' | 'system';
  }