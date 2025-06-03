import { type NavigatorScreenParams } from '@react-navigation/native';
import { type RouteProp } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      // Your existing routes
      '(tabs)': NavigatorScreenParams<{
        home: undefined;
        admin: undefined;
        profile: undefined;
      }>;
      'admin/add-bus': undefined;
      'admin/[id]': { id: string };
      // Add other routes as needed
    }
  }
}

// This ensures type checking for route params
export type RootStackParamList = ReactNavigation.RootParamList;

// This helps with type checking route params in your components
export type RouteParams<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
