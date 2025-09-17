import { useState, useEffect, useCallback } from 'react';
import { shiftRoleService } from '@/services/ShiftRoleService';
import { ShiftRoleResponseDto, CreateShiftRoleDto, UpdateShiftRoleDto } from '@/api/data-contracts';
import { useToast } from '@/contexts/ToastContext';

export interface UseShiftRolesReturn {
  shiftRoles: ShiftRoleResponseDto[];
  loading: boolean;
  error: string | null;
  addShiftRole: (data: CreateShiftRoleDto) => Promise<void>;
  updateShiftRole: (id: string, data: UpdateShiftRoleDto) => Promise<void>;
  deleteShiftRole: (id: string) => Promise<void>;
  loadShiftRoles: (shiftId: string) => Promise<void>;
  refreshShiftRoles: () => Promise<void>;
}

export const useShiftRoles = (shiftId?: string): UseShiftRolesReturn => {
  const [shiftRoles, setShiftRoles] = useState<ShiftRoleResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadShiftRoles = useCallback(async (targetShiftId: string) => {
    if (!targetShiftId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const roles = await shiftRoleService.getByShiftId(targetShiftId, true);
      setShiftRoles(roles);
    } catch (err) {
      const errorMessage = 'Fehler beim Laden der Schichtrollen';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const refreshShiftRoles = useCallback(async () => {
    if (shiftId) {
      await loadShiftRoles(shiftId);
    }
  }, [shiftId, loadShiftRoles]);

  const addShiftRole = useCallback(async (data: CreateShiftRoleDto) => {
    try {
      setLoading(true);
      const newShiftRole = await shiftRoleService.create(data);
      setShiftRoles(prev => [...prev, newShiftRole]);
      showToast('Schichtrolle erfolgreich hinzugefügt', 'success');
    } catch (err) {
      const errorMessage = 'Fehler beim Hinzufügen der Schichtrolle';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const updateShiftRole = useCallback(async (id: string, data: UpdateShiftRoleDto) => {
    try {
      setLoading(true);
      const updatedShiftRole = await shiftRoleService.update(id, data);
      setShiftRoles(prev => 
        prev.map(role => role.id === id ? updatedShiftRole : role)
      );
      showToast('Schichtrolle erfolgreich aktualisiert', 'success');
    } catch (err) {
      const errorMessage = 'Fehler beim Aktualisieren der Schichtrolle';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const deleteShiftRole = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await shiftRoleService.delete(id);
      setShiftRoles(prev => prev.filter(role => role.id !== id));
      showToast('Schichtrolle erfolgreich gelöscht', 'success');
    } catch (err) {
      const errorMessage = 'Fehler beim Löschen der Schichtrolle';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Load shift roles when shiftId changes
  useEffect(() => {
    if (shiftId) {
      loadShiftRoles(shiftId);
    } else {
      setShiftRoles([]);
    }
  }, [shiftId, loadShiftRoles]);

  return {
    shiftRoles,
    loading,
    error,
    addShiftRole,
    updateShiftRole,
    deleteShiftRole,
    loadShiftRoles,
    refreshShiftRoles,
  };
};