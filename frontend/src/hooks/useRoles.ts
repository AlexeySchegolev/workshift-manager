import { useState, useEffect } from 'react';
import { RoleService } from '@/services/RoleService';
import { RoleResponseDto } from '@/api/data-contracts';
import { useToast } from '@/contexts/ToastContext';

export interface UseRolesReturn {
  roles: RoleResponseDto[];
  loading: boolean;
  error: string | null;
  refreshRoles: () => Promise<void>;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const roleService = new RoleService();

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const rolesData = await roleService.getAllRoles();
      setRoles(rolesData);
    } catch (err) {
      const errorMessage = 'Fehler beim Laden der Rollen';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshRoles = async () => {
    await loadRoles();
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    refreshRoles,
  };
};