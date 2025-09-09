import React from 'react';
import { Box } from '@mui/material';
import { ShiftResponseDto } from '@/api/data-contracts';
import ShiftTable from './shift/ShiftTable';
import ShiftForm from './shift/ShiftForm';
import DeleteConfirmationDialog from './common/DeleteConfirmationDialog';
import { formatShiftType, formatShiftStatus } from './shift/utils/shiftUtils';
import { Schedule as ScheduleIcon, Business as BusinessIcon } from '@mui/icons-material';
import { useShiftForm } from './shift/hooks/useShiftForm';
import { useShiftActions } from './shift/hooks/useShiftActions';

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
        config={{
          title: 'Schicht löschen',
          entityName: 'die folgende Schicht',
          entityDisplayName: shiftToDelete?.name,
          showDetailedView: true,
          icon: <ScheduleIcon color="primary" />,
          warningMessage: '⚠️ Diese Aktion kann rückgängig gemacht werden (Soft Delete).',
          chips: [
            {
              label: formatShiftType(shiftToDelete?.type || ''),
              color: 'primary' as const,
              variant: 'outlined' as const,
            },
            {
              label: formatShiftStatus(shiftToDelete?.isActive || false, shiftToDelete?.isAvailable || false),
              color: 'secondary' as const,
              variant: 'outlined' as const,
            },
            {
              label: shiftToDelete?.location?.name || 'Unbekannt',
              icon: <BusinessIcon />,
              variant: 'outlined' as const,
            },
          ],
          fields: [
            { label: 'Zeit', value: `${shiftToDelete?.startTime || ''} - ${shiftToDelete?.endTime || ''}` },
            ...(shiftToDelete?.description ? [{ label: 'Beschreibung', value: shiftToDelete.description }] : []),
          ].filter(field => field.value),
        }}
        onClose={closeDeleteDialog}
        onConfirm={deleteShift}
      />
    </Box>
  );
};

export default ShiftManagement;