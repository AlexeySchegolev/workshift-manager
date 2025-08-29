import React from 'react';
import { Box } from '@mui/material';
import { EmployeeResponseDto } from '@/api/data-contracts';
import {
  EmployeeStatistics,
  EmployeeTable,
  EmployeeForm,
  DeleteConfirmationDialog,
  EmployeeSnackbar,
  useEmployeeForm,
  useEmployeeActions,
} from './employee';

interface EmployeeManagementProps {
  employees: EmployeeResponseDto[];
  onEmployeesChange: (employees: EmployeeResponseDto[]) => void;
}

/**
 * Modern Employee Management in Dashboard Style
 * Refactored into smaller, manageable components
 */
const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees,
  onEmployeesChange,
}) => {
  // Custom hooks for form and actions
  const {
    formData,
    errors,
    editingId,
    resetForm,
    loadEmployeeForEdit,
    updateField,
    validateForm,
    isEditing,
  } = useEmployeeForm();

  const {
    snackbar,
    closeSnackbar,
    deleteDialogOpen,
    employeeToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    deleteEmployee,
    addEmployeeModalOpen,
    openAddEmployeeModal,
    closeAddEmployeeModal,
    saveEmployee,
  } = useEmployeeActions(employees, onEmployeesChange);

  // Handle edit employee
  const handleEditEmployee = (employee: EmployeeResponseDto) => {
    loadEmployeeForEdit(employee);
    openAddEmployeeModal();
  };

  // Handle save employee
  const handleSaveEmployee = async () => {
    if (!validateForm()) return;
    
    await saveEmployee(formData, editingId);
    resetForm();
  };

  // Handle add employee modal close
  const handleCloseAddEmployeeModal = () => {
    closeAddEmployeeModal();
    resetForm();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

      {/* Employee Table */}
      <EmployeeTable
        employees={employees}
        editingId={editingId}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={openDeleteDialog}
        onAddEmployee={openAddEmployeeModal}
      />

      {/* Employee Form Modal */}
      <EmployeeForm
        open={addEmployeeModalOpen}
        onClose={handleCloseAddEmployeeModal}
        onSave={handleSaveEmployee}
        formData={formData}
        errors={errors}
        onUpdateField={updateField}
        isEditing={isEditing}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        employee={employeeToDelete}
        onClose={closeDeleteDialog}
        onConfirm={deleteEmployee}
      />

      {/* Snackbar for notifications */}
      <EmployeeSnackbar
        snackbar={snackbar}
        onClose={closeSnackbar}
      />
    </Box>
  );
};

export default EmployeeManagement;