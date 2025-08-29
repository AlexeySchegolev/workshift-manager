import { useState } from 'react';
import { ShiftResponseDto } from '@/api/data-contracts';
import { shiftService } from '@/services/ShiftService';
import { ShiftFormData } from './useShiftForm';

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
          status: formData.status as any,
          priority: formData.priority as any,
          shiftDate: formData.shiftDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          breakDuration: formData.breakDuration,
          totalHours: formData.totalHours,
          minEmployees: formData.minEmployees,
          maxEmployees: formData.maxEmployees,
          locationId: formData.locationId,
          requiredSkills: formData.requiredSkills,
          requiredCertifications: formData.requiredCertifications,
          isOvertime: formData.isOvertime,
          overtimeRate: formData.overtimeRate,
          isHoliday: formData.isHoliday,
          holidayRate: formData.holidayRate,
          isWeekend: formData.isWeekend,
          weekendRate: formData.weekendRate,
          colorCode: formData.colorCode,
          notes: formData.notes,
          isRecurring: formData.isRecurring,
          recurrencePattern: formData.recurrencePattern,
          recurrenceEndDate: formData.recurrenceEndDate,
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
          status: formData.status as any,
          priority: formData.priority as any,
          shiftDate: formData.shiftDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          breakDuration: formData.breakDuration,
          totalHours: formData.totalHours,
          minEmployees: formData.minEmployees,
          maxEmployees: formData.maxEmployees,
          roleRequirements: [], // Default empty, can be extended later
          requiredSkills: formData.requiredSkills,
          requiredCertifications: formData.requiredCertifications,
          isOvertime: formData.isOvertime,
          overtimeRate: formData.overtimeRate,
          isHoliday: formData.isHoliday,
          holidayRate: formData.holidayRate,
          isWeekend: formData.isWeekend,
          weekendRate: formData.weekendRate,
          colorCode: formData.colorCode,
          notes: formData.notes,
          isRecurring: formData.isRecurring,
          recurrencePattern: formData.recurrencePattern,
          recurrenceEndDate: formData.recurrenceEndDate,
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

  const restoreShift = async (shiftId: string) => {
    try {
      const restoredShift = await shiftService.restoreShift(shiftId);
      
      const updatedShifts = shifts.map(shift =>
        shift.id === shiftId ? restoredShift : shift
      );
      onShiftsChange(updatedShifts);
      
      showSnackbar('Schicht erfolgreich wiederhergestellt!', 'success');
    } catch (error) {
      console.error('Error restoring shift:', error);
      showSnackbar('Fehler beim Wiederherstellen der Schicht', 'error');
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
        status: 'draft' as any, // Always start as draft
        priority: shift.priority as any,
        shiftDate: nextDay.toISOString().split('T')[0],
        startTime: shift.startTime,
        endTime: shift.endTime,
        breakDuration: shift.breakDuration,
        totalHours: shift.totalHours,
        minEmployees: shift.minEmployees,
        maxEmployees: shift.maxEmployees,
        roleRequirements: shift.roleRequirements || [],
        requiredSkills: shift.requiredSkills || [],
        requiredCertifications: shift.requiredCertifications || [],
        isOvertime: shift.isOvertime,
        overtimeRate: shift.overtimeRate,
        isHoliday: false, // Reset holiday flag
        holidayRate: shift.holidayRate,
        isWeekend: shift.isWeekend,
        weekendRate: shift.weekendRate,
        colorCode: shift.colorCode,
        notes: shift.notes,
        isRecurring: false, // Reset recurring flag
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
    restoreShift,
    duplicateShift,
  };
};