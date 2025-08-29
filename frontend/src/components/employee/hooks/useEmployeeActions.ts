import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EmployeeResponseDto } from '@/api/data-contracts';
import { EmployeeFormData } from './useEmployeeForm';

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

  // Delete employee
  const deleteEmployee = () => {
    if (employeeToDelete) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
      onEmployeesChange(updatedEmployees);

      showSnackbar(
        `Mitarbeiter ${employeeToDelete.lastName} wurde gelöscht`,
        'success'
      );

      closeDeleteDialog();
    }
  };

  // Save employee (add or update)
  const saveEmployee = (formData: EmployeeFormData, editingId: string | null) => {
    if (typeof formData.hoursPerMonth !== 'number') return;

    let updatedEmployees: EmployeeResponseDto[];

    if (editingId) {
      // Update existing employee
      updatedEmployees = employees.map(emp =>
        emp.id === editingId
          ? {
              ...emp,
              firstName: formData.firstName,
              lastName: formData.lastName,
              fullName: `${formData.firstName} ${formData.lastName}`,
              primaryRole: formData.primaryRole ?? undefined,
              roles: formData.roles ?? [],
              hoursPerMonth: Number(formData.hoursPerMonth!.toFixed(1)),
              hoursPerWeek: Math.round(formData.hoursPerMonth! / 4.33),
              locationId: formData.location?.id,
              location: formData.location ?? undefined,
            }
          : emp
      );

      showSnackbar(
        `Mitarbeiter ${formData.firstName} ${formData.lastName} wurde aktualisiert`,
        'success'
      );
    } else {
      // Add new employee
      const newEmployee: EmployeeResponseDto = {
        contractType: "full_time",
        createdAt: "",
        email: "",
        employeeNumber: "",
        firstName: formData.firstName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        hireDate: "",
        isActive: false,
        isAvailable: false,
        languages: [],
        organizationId: "",
        skills: [],
        status: "active",
        updatedAt: "",
        yearsOfService: 0,
        id: uuidv4(),
        lastName: formData.lastName,
        primaryRole: formData.primaryRole ?? undefined,
        roles: formData.roles ?? [],
        hoursPerMonth: Number(formData.hoursPerMonth!.toFixed(1)),
        locationId: formData.location?.id,
        location: formData.location ?? undefined,
        certifications: []
      };

      updatedEmployees = [...employees, newEmployee];

      showSnackbar(
        `Mitarbeiter ${formData.firstName} ${formData.lastName} wurde hinzugefügt`,
        'success'
      );
    }

    onEmployeesChange(updatedEmployees);
    
    // Close modal if it was opened from modal
    if (addEmployeeModalOpen) {
      closeAddEmployeeModal();
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