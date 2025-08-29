import { useState } from 'react';
import { EmployeeResponseDto, CreateEmployeeDto, UpdateEmployeeDto } from '@/api/data-contracts';
import { EmployeeFormData } from './useEmployeeForm';
import { EmployeeService } from '@/services';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export const useEmployeeActions = (
  employees: EmployeeResponseDto[],
  onEmployeesChange: (employees: EmployeeResponseDto[]) => void
) => {
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
    if (typeof formData.hoursPerMonth !== 'number') return;

    try {
      const employeeService = new EmployeeService();

      if (editingId) {
        // Update existing employee via API
        const updateData: UpdateEmployeeDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          hoursPerMonth: Number(formData.hoursPerMonth!.toFixed(1)),
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
        // Create new employee via API
        const createData: CreateEmployeeDto = {
          organizationId: "ae2dd453-4c7d-4a13-bc1f-435f3f1c44ae", // TODO: Get from context/config
          employeeNumber: `EMP${Date.now()}`, // Generate unique employee number
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@dialyse-praxis.de`,
          hireDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
          hoursPerMonth: Number(formData.hoursPerMonth!.toFixed(1)),
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