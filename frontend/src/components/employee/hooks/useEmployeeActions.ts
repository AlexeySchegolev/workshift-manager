import { useState } from 'react';
import { EmployeeResponseDto, CreateEmployeeDto, UpdateEmployeeDto } from '@/api/data-contracts';
import { EmployeeFormData } from './useEmployeeForm';
import { EmployeeService } from '@/services';
import { getTodayDateString } from '@/utils/date.utils.ts';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { useToast } from '@/contexts/ToastContext';
import { extractErrorMessage, getErrorDisplayDuration } from '@/utils/errorUtils';

export const useEmployeeActions = (
  employees: EmployeeResponseDto[],
  onEmployeesChange: (employees: EmployeeResponseDto[]) => void
) => {
  const { organizationId } = useAuth();
  const { showSuccess, showError } = useToast();

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeResponseDto | null>(null);

  // Add employee modal state
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);

  // Open delete dialog
  const openDeleteDialog = (employee: EmployeeResponseDto) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  // Open add employee modal
  const openAddEmployeeModal = () => {
    setAddEmployeeModalOpen(true);
  };

  // Close add employee modal
  const closeAddEmployeeModal = () => {
    setAddEmployeeModalOpen(false);
  };

  // Delete employee - now with API call
  const deleteEmployee = async () => {
    if (employeeToDelete) {
      try {
        const employeeService = new EmployeeService();
        
        // Delete from database via API
        await employeeService.deleteEmployee(employeeToDelete.id);
        
        // Update local state
        const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
        onEmployeesChange(updatedEmployees);

        showSuccess(`Mitarbeiter ${employeeToDelete.lastName} wurde gelöscht`);

        closeDeleteDialog();
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        const duration = getErrorDisplayDuration(error);
        showError(errorMessage, duration);
      }
    }
  };

  // Save employee (add or update) - now with API calls
  const saveEmployee = async (formData: EmployeeFormData, editingId: string | null) => {
    try {
      const employeeService = new EmployeeService();

      if (editingId) {
        // Update existing employee via API
        const updateData: UpdateEmployeeDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          locationId: formData.location?.id,
          primaryRoleId: formData.primaryRole?.id
        };

        const updatedEmployee = await employeeService.updateEmployee(editingId, updateData);
        
        // Update local state with the response from API
        const updatedEmployees = employees.map(emp =>
          emp.id === editingId ? updatedEmployee : emp
        );
        onEmployeesChange(updatedEmployees);

        showSuccess(`Mitarbeiter ${formData.firstName} ${formData.lastName} wurde aktualisiert`);
      } else {
        // Create new employee - validate organizationId is available
        if (!organizationId) {
          showError('Mitarbeiter kann nicht erstellt werden: Keine Organisation verfügbar');
          return;
        }
        
        // Create new employee via API
        const createData: CreateEmployeeDto = {
          organizationId: organizationId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@dialyse-praxis.de`,
          hireDate: getTodayDateString(), // Today's date in YYYY-MM-DD format
          locationId: formData.location?.id,
          primaryRoleId: formData.primaryRole?.id
        };

        const newEmployee = await employeeService.createEmployee(createData);
        
        // Add new employee to local state
        const updatedEmployees = [...employees, newEmployee];
        onEmployeesChange(updatedEmployees);

        showSuccess(`Mitarbeiter ${formData.firstName} ${formData.lastName} wurde hinzugefügt`);
      }

      // Close modal if it was opened from modal
      if (addEmployeeModalOpen) {
        closeAddEmployeeModal();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      const duration = getErrorDisplayDuration(error);
      showError(errorMessage, duration);
    }
  };

  return {
    // Delete dialog
    deleteDialogOpen,
    employeeToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    deleteEmployee,
    
    // Add employee modal
    addEmployeeModalOpen,
    openAddEmployeeModal,
    closeAddEmployeeModal,
    
    // Actions
    saveEmployee,
  };
};