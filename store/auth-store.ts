import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, fetchUserProfile } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerWithSocial: (provider: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,
      
      initializeAuth: () => {
        // Only run initialization logic if not already initialized
        if (!get().isInitialized) {
          console.log('Initializing auth state...');
          // Any additional initialization logic can go here
          set({ isInitialized: true });
        }
      },
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Call API to login
          const response = await loginUser(email, password);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred during login',
          });
        }
      },
      
      loginWithSocial: async (provider) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, you would integrate with social login providers
          // For now, we'll simulate a successful login
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create a placeholder user and token
          const user = {
            id: `user-${Date.now()}`,
            name: `${provider} User`,
            email: `user@${provider.toLowerCase()}.com`,
            phone: '+1 234 567 8900',
          };
          
          const token = `token-${Date.now()}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : `An error occurred during ${provider} login`,
          });
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Call API to register
          const response = await registerUser({ name, email, password });
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred during registration',
          });
        }
      },
      
      registerWithSocial: async (provider) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, you would integrate with social login providers
          // For now, we'll simulate a successful registration
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Create a placeholder user and token
          const user = {
            id: `user-${Date.now()}`,
            name: `${provider} User`,
            email: `user@${provider.toLowerCase()}.com`,
            phone: '+1 234 567 8900',
          };
          
          const token = `token-${Date.now()}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : `An error occurred during ${provider} registration`,
          });
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, you would call an API to send a password reset email
          // For now, we'll just simulate a successful request
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isLoading: false, error: null });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      },
      
      refreshUserProfile: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { user } = get();
          
          if (!user) {
            throw new Error('No user logged in');
          }
          
          // Call API to get updated user profile
          const updatedUser = await fetchUserProfile(user.id);
          
          set({ 
            user: updatedUser,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to refresh user profile',
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
    }
  )
);