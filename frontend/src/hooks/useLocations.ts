import { useState, useEffect } from 'react';
import { LocationResponseDto } from '@/api/data-contracts';
import { locationService } from '@/services';

export const useLocations = () => {
  const [locations, setLocations] = useState<LocationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load only active locations without employee data
      const data = await locationService.getAllLocations({
        activeOnly: true,
        includeEmployees: false,
      });

      setLocations(data);
    } catch (err) {
      setError('Error loading locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    loading,
    error,
    refetch: fetchLocations,
  };
};