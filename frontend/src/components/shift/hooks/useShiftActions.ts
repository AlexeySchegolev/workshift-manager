import { useState } from 'react';
import { ShiftResponseDto } from '@/api/data-contracts';
import { shiftService } from '@/services/ShiftService';
import { ShiftFormData } from './useShiftForm';
import { toDateString } from '@/utils/date.utils.ts';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const useShiftActions = (
  shifts: ShiftResponseDto[],
  onShiftsChange: (shifts: ShiftResponseDto[]) => void
) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<ShiftResponseDto | null>(null);
  const [addShiftModalOpen, setAddShiftModalOpen] = useState(false);

  // Snackbar functions
  const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Delete dialog functions
  const openDeleteDialog = (shift: ShiftResponseDto) => {
    setShiftToDelete(shift);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setShiftToDelete(null);
  };

  // Modal functions
  const openAddShiftModal = () => {
    setAddShiftModalOpen(true);
  };

  const closeAddShiftModal = () => {
    setAddShiftModalOpen(false);
  };

  // CRUD operations
  const saveShift = async (formData: ShiftFormData, editingId: string | null) => {
    try {
      if (editingId) {
        // Update existing shift
        const updatedShift = await shiftService.updateShift(editingId, {
          name: formData.name,
          description: formData.description,
          type: formData.type as any,
          shiftDate: formData.shiftDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          locationId: formData.locationId,
          isActive: formData.isActive,
        });

        const updatedShifts = shifts.map(shift =>
          shift.id === editingId ? updatedShift : shift
        );
        onShiftsChange(updatedShifts);
        showSnackbar('Schicht erfolgreich aktualisiert!', 'success');
      } else {
        // Create new shift
        const newShift = await shiftService.createShift({
          organizationId: formData.organizationId,
          locationId: formData.locationId,
          name: formData.name,
          description: formData.description,
          type: formData.type as any,
          shiftDate: formData.shiftDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          isActive: formData.isActive,
        });

        onShiftsChange([...shifts, newShift]);
        showSnackbar('Schicht erfolgreich erstellt!', 'success');
      }

      closeAddShiftModal();
    } catch (error) {
      console.error('Error saving shift:', error);
      showSnackbar(
        editingId ? 'Fehler beim Aktualisieren der Schicht' : 'Fehler beim Erstellen der Schicht',
        'error'
      );
    }
  };

  const deleteShift = async () => {
    if (!shiftToDelete) return;

    try {
      await shiftService.deleteShift(shiftToDelete.id);
      
      const updatedShifts = shifts.filter(shift => shift.id !== shiftToDelete.id);
      onShiftsChange(updatedShifts);
      
      showSnackbar('Schicht erfolgreich gelöscht!', 'success');
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting shift:', error);
      showSnackbar('Fehler beim Löschen der Schicht', 'error');
    }
  };

  const duplicateShift = async (shift: ShiftResponseDto) => {
    try {
      // Create a copy with a new date (next day)
      const nextDay = new Date(shift.shiftDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const duplicatedShift = await shiftService.createShift({
        organizationId: shift.organizationId,
        locationId: shift.locationId,
        name: `${shift.name} (Kopie)`,
        description: shift.description,
        type: shift.type as any,
        shiftDate: toDateString(nextDay),
        startTime: shift.startTime,
        endTime: shift.endTime,
        isActive: true,
      });

      onShiftsChange([...shifts, duplicatedShift]);
      showSnackbar('Schicht erfolgreich dupliziert!', 'success');
    } catch (error) {
      console.error('Error duplicating shift:', error);
      showSnackbar('Fehler beim Duplizieren der Schicht', 'error');
    }
  };

  return {
    // Snackbar
    snackbar,
    closeSnackbar,
    showSnackbar,

    // Delete dialog
    deleteDialogOpen,
    shiftToDelete,
    openDeleteDialog,
    closeDeleteDialog,

    // Modal
    addShiftModalOpen,
    openAddShiftModal,
    closeAddShiftModal,

    // Actions
    saveShift,
    deleteShift,
    duplicateShift,
  };
};