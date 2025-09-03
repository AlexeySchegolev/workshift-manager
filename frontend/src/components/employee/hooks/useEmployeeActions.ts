import { useState } from 'react';
import { EmployeeResponseDto, CreateEmployeeDto, UpdateEmployeeDto } from '@/api/data-contracts';
import { EmployeeFormData } from './useEmployeeForm';
import { EmployeeService } from '@/services';
import { getTodayDateString } from '@/utils/date.utils.ts';
import { useAuth } from '@/contexts/AuthContext.tsx';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export const useEmployeeActions = (
  employees: EmployeeResponseDto[],
  onEmployeesChange: (employees: EmployeeResponseDto[]) => void
) => {
  const { organizationId } = useAuth();
  // Snackbar state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeResponseDto | null>(null);

  // Add employee modal state
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);

  // Show snackbar message
  const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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

        showSnackbar(
          `Mitarbeiter ${employeeToDelete.lastName} wurde gelöscht`,
          'success'
        );

        closeDeleteDialog();
      } catch (error) {
        console.error('Error deleting employee:', error);
        showSnackbar(
          `Fehler beim Löschen des Mitarbeiters: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
          'error'
        );
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

        showSnackbar(
          `Mitarbeiter ${formData.firstName} ${formData.lastName} wurde aktualisiert`,
          'success'
        );
      } else {
        // Create new employee - validate organizationId is available
        if (!organizationId) {
          showSnackbar('Mitarbeiter kann nicht erstellt werden: Keine Organisation verfügbar', 'error');
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

        showSnackbar(
          `Mitarbeiter ${formData.firstName} ${formData.lastName} wurde hinzugefügt`,
          'success'
        );
      }

      // Close modal if it was opened from modal
      if (addEmployeeModalOpen) {
        closeAddEmployeeModal();
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      showSnackbar(
        `Fehler beim Speichern des Mitarbeiters: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        'error'
      );
    }
  };

  return {
    // Snackbar
    snackbar,
    closeSnackbar,
    showSnackbar,
    
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