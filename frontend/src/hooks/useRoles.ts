import { useState, useEffect } from 'react';
import { RoleResponseDto } from '@/api/data-contracts';
import { roleService } from '@/services';

export const useRoles = (organizationId?: string) => {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (organizationId) {
        // Load roles for a specific organization
        data = await roleService.getRolesByOrganization(organizationId, {
          activeOnly: true,
          includeRelations: false,
        });
      } else {
        // Load all roles
        data = await roleService.getAllRoles({
          includeRelations: false,
        });
      }

      setRoles(data);
    } catch (err) {
      setError('Error loading roles');
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