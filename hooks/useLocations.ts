import { useState, useEffect, useCallback } from 'react';
import { fetchLocations } from '@/services/api';
import { Location } from '@/app/types';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (err) {
      console.error('Error loading locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setIsLoading(false);
    }
  };

  // Add refreshLocations function that was missing
  const refreshLocations = useCallback(async () => {
    return loadLocations();
  }, []);

  useEffect(() => {
    loadLocations();
  }, []);

  return { locations, isLoading, error, refreshLocations };
}