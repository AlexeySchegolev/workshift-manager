import { useState } from 'react';
import { ShiftResponseDto } from '@/api/data-contracts';
import { shiftService } from '@/services/ShiftService';
import { ShiftFormData } from './useShiftForm';
import { toDateString } from '@/utils/date.utils.ts';
import { useToast } from '@/contexts/ToastContext';
import { extractErrorMessage, getErrorDisplayDuration } from '@/utils/errorUtils';
export const useShiftActions = (
  shifts: ShiftResponseDto[],
  onShiftsChange: (shifts: ShiftResponseDto[]) => void
) => {
  const { showSuccess, showError } = useToast();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<ShiftResponseDto | null>(null);
  const [addShiftModalOpen, setAddShiftModalOpen] = useState(false);

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
          startTime: formData.startTime,
          endTime: formData.endTime,
          locationId: formData.locationId,
          isActive: formData.isActive,
        });

        const updatedShifts = shifts.map(shift =>
          shift.id === editingId ? updatedShift : shift
        );
        onShiftsChange(updatedShifts);
        showSuccess('Schicht erfolgreich aktualisiert!');
      } else {
        // Create new shift
        const newShift = await shiftService.createShift({
          organizationId: formData.organizationId,
          locationId: formData.locationId,
          name: formData.name,
          description: formData.description,
          type: formData.type as any,
          startTime: formData.startTime,
          endTime: formData.endTime,
          isActive: formData.isActive,
        });

        onShiftsChange([...shifts, newShift]);
        showSuccess('Schicht erfolgreich erstellt!');
      }

      closeAddShiftModal();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      const duration = getErrorDisplayDuration(error);
      showError(errorMessage, duration);
    }
  };

  const deleteShift = async () => {
    if (!shiftToDelete) return;

    try {
      await shiftService.deleteShift(shiftToDelete.id);
      
      const updatedShifts = shifts.filter(shift => shift.id !== shiftToDelete.id);
      onShiftsChange(updatedShifts);
      
      showSuccess('Schicht erfolgreich gelöscht!');
      closeDeleteDialog();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      const duration = getErrorDisplayDuration(error);
      showError(errorMessage, duration);
    }
  };

  const duplicateShift = async (shift: ShiftResponseDto) => {
    try {
      const duplicatedShift = await shiftService.createShift({
        organizationId: shift.organizationId,
        locationId: shift.locationId,
        name: `${shift.name} (Kopie)`,
        description: shift.description,
        type: shift.type as any,
        startTime: shift.startTime,
        endTime: shift.endTime,
        isActive: true,
      });

      onShiftsChange([...shifts, duplicatedShift]);
      showSuccess('Schicht erfolgreich dupliziert!');
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      const duration = getErrorDisplayDuration(error);
      showError(errorMessage, duration);
    }
  };

  return {
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