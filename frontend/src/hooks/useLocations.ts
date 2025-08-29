import { useState, useEffect } from 'react';
import { LocationResponseDto } from '@/api/data-contracts';
import { Locations } from '@/api/Locations';
import { HttpClient } from '@/api/http-client';

const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

const locationsApi = new Locations(httpClient);

export const useLocations = () => {
  const [locations, setLocations] = useState<LocationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Nur aktive Locations laden, ohne Employee-Daten
      const response = await locationsApi.locationsControllerFindAll({
        activeOnly: true,
        includeEmployees: false,
      });
      
      setLocations(response.data);
    } catch (err) {
      console.error('Fehler beim Laden der Locations:', err);
      setError('Fehler beim Laden der Standorte');
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