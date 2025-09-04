import React from 'react';
import { Box } from '@mui/material';
import { EmployeeResponseDto } from '@/api/data-contracts';
import {useEmployeeForm} from "@/components/employee/hooks/useEmployeeForm.ts";
import {useEmployeeActions} from "@/components/employee/hooks/useEmployeeActions.ts";
import EmployeeTable from "@/components/employee/EmployeeTable.tsx";
import EmployeeForm from "@/components/employee/EmployeeForm.tsx";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { Person as PersonIcon, Work as WorkIcon, LocationOn as LocationIcon, Email as EmailIcon } from '@mui/icons-material';

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
        config={{
          title: 'Mitarbeiter löschen',
          entityName: 'den folgenden Mitarbeiter',
          entityDisplayName: employeeToDelete?.fullName || `${employeeToDelete?.firstName} ${employeeToDelete?.lastName}`,
          showDetailedView: true,
          icon: <PersonIcon color="primary" />,
          chips: [
            {
              label: employeeToDelete?.contractType === 'full_time' ? 'Vollzeit' : 'Teilzeit',
              color: 'primary' as const,
              variant: 'outlined' as const,
            },
            {
              label: employeeToDelete?.isActive ? 'Aktiv' : 'Inaktiv',
              color: employeeToDelete?.isActive ? 'success' : 'default',
              variant: 'outlined' as const,
            },
            ...(employeeToDelete?.primaryRole ? [{
              label: employeeToDelete.primaryRole.displayName || employeeToDelete.primaryRole.name,
              icon: <WorkIcon />,
              variant: 'outlined' as const,
            }] : []),
            ...(employeeToDelete?.location ? [{
              label: employeeToDelete.location.name,
              icon: <LocationIcon />,
              variant: 'outlined' as const,
            }] : []),
          ],
          fields: [
            { label: 'E-Mail', value: employeeToDelete?.email || '' },
            ...(employeeToDelete?.phoneNumber ? [{ label: 'Telefon', value: employeeToDelete.phoneNumber }] : []),
            ...(employeeToDelete?.address ? [{ label: 'Adresse', value: `${employeeToDelete.address}${employeeToDelete.city ? `, ${employeeToDelete.city}` : ''}${employeeToDelete.postalCode ? ` ${employeeToDelete.postalCode}` : ''}` }] : []),
            ...(employeeToDelete?.hireDate ? [{ label: 'Einstellungsdatum', value: new Date(employeeToDelete.hireDate).toLocaleDateString('de-DE') }] : []),
            ...(employeeToDelete?.yearsOfService ? [{ label: 'Dienstjahre', value: `${employeeToDelete.yearsOfService} Jahre` }] : []),
          ].filter(field => field.value),
        }}
        onClose={closeDeleteDialog}
        onConfirm={deleteEmployee}
      />
    </Box>
  );
};

export default EmployeeManagement;