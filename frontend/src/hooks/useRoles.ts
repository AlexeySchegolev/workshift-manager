import { useState, useEffect } from 'react';
import { RoleResponseDto } from '@/api/data-contracts';
import { Roles } from '@/api/Roles';
import { HttpClient } from '@/api/http-client';

const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

const rolesApi = new Roles(httpClient);

export const useRoles = (organizationId?: string) => {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (organizationId) {
        // Lade Rollen für eine spezifische Organisation
        response = await rolesApi.rolesControllerFindByOrganization(organizationId, {
          activeOnly: true,
          includeRelations: false,
        });
      } else {
        // Lade alle Rollen
        response = await rolesApi.rolesControllerFindAll({
          includeRelations: false,
        });
      }
      
      setRoles(response.data);
    } catch (err) {
      console.error('Fehler beim Laden der Rollen:', err);
      setError('Fehler beim Laden der Rollen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [organizationId]);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
  };
};