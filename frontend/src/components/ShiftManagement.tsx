import React from 'react';
import { Box } from '@mui/material';
import { ShiftResponseDto } from '@/api/data-contracts';
import {
  ShiftTable,
  ShiftForm,
  DeleteConfirmationDialog,
  ShiftSnackbar,
  useShiftForm,
  useShiftActions,
} from './shift';

interface ShiftManagementProps {
  shifts: ShiftResponseDto[];
  onShiftsChange: (shifts: ShiftResponseDto[]) => void;
}

/**
 * Modern Shift Management in Dashboard Style
 * Refactored into smaller, manageable components
 */
const ShiftManagement: React.FC<ShiftManagementProps> = ({
  shifts,
  onShiftsChange,
}) => {
  // Custom hooks for form and actions
  const {
    formData,
    errors,
    editingId,
    resetForm,
    loadShiftForEdit,
    updateField,
    validateForm,
    isEditing,
  } = useShiftForm();

  const {
    snackbar,
    closeSnackbar,
    deleteDialogOpen,
    shiftToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    deleteShift,
    addShiftModalOpen,
    openAddShiftModal,
    closeAddShiftModal,
    saveShift,
  } = useShiftActions(shifts, onShiftsChange);

  // Handle edit shift
  const handleEditShift = (shift: ShiftResponseDto) => {
    loadShiftForEdit(shift);
    openAddShiftModal();
  };

  // Handle save shift
  const handleSaveShift = () => {
    if (!validateForm()) return;
    
    saveShift(formData, editingId);
    resetForm();
  };

  // Handle add shift modal close
  const handleCloseAddShiftModal = () => {
    closeAddShiftModal();
    resetForm();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

      {/* Shift Table */}
      <ShiftTable
        shifts={shifts}
        editingId={editingId}
        onEditShift={handleEditShift}
        onDeleteShift={openDeleteDialog}
        onAddShift={openAddShiftModal}
      />

      {/* Shift Form Modal */}
      <ShiftForm
        open={addShiftModalOpen}
        onClose={handleCloseAddShiftModal}
        onSave={handleSaveShift}
        formData={formData}
        errors={errors}
        onUpdateField={updateField}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        shift={shiftToDelete}
        onClose={closeDeleteDialog}
        onConfirm={deleteShift}
      />

      {/* Snackbar for notifications */}
      <ShiftSnackbar
        snackbar={snackbar}
        onClose={closeSnackbar}
      />
    </Box>
  );
};

export default ShiftManagement;