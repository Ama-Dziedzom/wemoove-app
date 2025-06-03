import { router } from 'expo-router';

// Define all your routes with their parameters
type AppRoutes = {
  'admin/add-bus': undefined;
  'admin/[id]': { id: string };
  // Add other routes as needed
};

type RouteName = keyof AppRoutes;

// Helper type to extract route parameters
type RouteParams<T extends RouteName> = T extends keyof AppRoutes ? AppRoutes[T] : never;

/**
 * Type-safe navigation function
 * @example
 * navigate('admin/add-bus');
 * navigate('admin/[id]', { id: '123' });
 */
export function navigate<T extends RouteName>(
  route: T,
  params?: RouteParams<T>
) {
  // Create path with parameters
  let path = route as string;
  
  // Replace route parameters if they exist
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`[${key}]`, String(value));
    });
  }
  
  // Use the router to navigate
  router.push(path as any);
}

// Export a hook for use in components
export function useNavigation() {
  return {
    navigate,
    goBack: router.back,
    canGoBack: () => true, // This is a simplified version
  };
}
