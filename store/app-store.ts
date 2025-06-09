import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentMethod, Notification } from '@/app/types';
import { 
  fetchPaymentMethods, 
  addPaymentMethod as apiAddPaymentMethod, 
  removePaymentMethod as apiRemovePaymentMethod,
  fetchNotifications,
  markNotificationAsRead as apiMarkNotificationAsRead
} from '@/services/api';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean; // For general push notifications
}

interface AppSettings {
  theme: 'light' | 'dark';
  currency: string;
  language: string;
  notifications: NotificationSettings; // Changed from boolean
  biometricLogin: boolean;
}

interface AppState {
  settings: AppSettings;
  paymentMethods: PaymentMethod[];
  notifications: Notification[];
  unreadNotifications: number;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  initializeApp: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  clearNotifications: () => void;
  refreshPaymentMethods: () => Promise<void>;
  fetchUserNotifications: (userId: string) => Promise<void>;
  togglePushNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: {
        theme: 'light',
        currency: 'GHS', // Changed default currency to GHS
        language: 'en',
        notifications: {
          email: true,
          sms: true,
          push: true, // Default state for push notifications
        },
        biometricLogin: false,
      },
      paymentMethods: [],
      notifications: [],
      unreadNotifications: 0,
      isInitialized: false,
      isLoading: false,
      error: null,
      
      initializeApp: () => {
        if (!get().isInitialized) {
          console.log('Initializing app settings...');
          set({ isInitialized: true });
        }
      },
      
      updateSettings: (newSettings) => {
        set(state => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },
      
      toggleTheme: () => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === 'light' ? 'dark' : 'light',
          },
        }));
      },

      togglePushNotifications: () => {
        set(state => ({
          settings: {
            ...state.settings,
            notifications: {
              ...state.settings.notifications,
              push: !state.settings.notifications.push, // Toggle the 'push' property
            },
          },
        }));
      },
      
      addPaymentMethod: async (method) => {
        set({ isLoading: true, error: null });
        
        try {
          const defaultUserId = "user-1"; // Placeholder
          
          // Fixed: Check if userId exists in method, if not, add the default userId
          const paymentData = method.userId 
            ? method 
            : { ...method, userId: defaultUserId };
            
          const response = await apiAddPaymentMethod(paymentData);
          
          set(state => ({
            paymentMethods: [...state.paymentMethods, response],
            isLoading: false
          }));
        } catch (error) {
          console.error('Error adding payment method:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to add payment method'
          });
        }
      },
      
      removePaymentMethod: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          await apiRemovePaymentMethod(id);
          
          set(state => ({
            paymentMethods: state.paymentMethods.filter(method => method.id !== id),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error removing payment method:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to remove payment method'
          });
        }
      },
      
      markNotificationAsRead: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          await apiMarkNotificationAsRead(id);
          
          set(state => {
            const updatedNotifications = state.notifications.map(notification => 
              notification.id === id ? { ...notification, read: true } : notification
            );
            
            return {
              notifications: updatedNotifications,
              unreadNotifications: updatedNotifications.filter(n => !n.read).length,
              isLoading: false
            };
          });
        } catch (error) {
          console.error('Error marking notification as read:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to mark notification as read'
          });
        }
      },
      
      markAllNotificationsAsRead: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const unreadIds = get().notifications
            .filter(notification => !notification.read)
            .map(notification => notification.id);
          
          for (const id of unreadIds) {
            await apiMarkNotificationAsRead(id);
          }
          
          set(state => ({
            notifications: state.notifications.map(notification => ({ ...notification, read: true })),
            unreadNotifications: 0,
            isLoading: false
          }));
        } catch (error) {
          console.error('Error marking all notifications as read:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
          });
        }
      },
      
      clearNotifications: () => {
        set({
          notifications: [],
          unreadNotifications: 0,
        });
      },
      
      refreshPaymentMethods: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const userId = "user-1"; // Placeholder
          
          const paymentMethods = await fetchPaymentMethods(userId);
          
          set({
            paymentMethods,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Error refreshing payment methods:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to refresh payment methods'
          });
        }
      },
      
      fetchUserNotifications: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          const notifications = await fetchNotifications(userId);
          
          set({
            notifications,
            unreadNotifications: notifications.filter((n: Notification) => !n.read).length,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Error fetching notifications:', error);
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch notifications'
          });
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        isInitialized: state.isInitialized,
      }),
    }
  )
);