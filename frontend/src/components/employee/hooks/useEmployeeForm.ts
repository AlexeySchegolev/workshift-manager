import { useState } from 'react';
import { EmployeeResponseDto, LocationResponseDto, RoleResponseDto } from '@/api/data-contracts';
import { validateEmployeeForm } from '../utils/employeeUtils';

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  primaryRole: RoleResponseDto | null;
  roles: RoleResponseDto[];
  location: LocationResponseDto | null;
  hoursPerMonth: number | null;
}

export interface EmployeeFormErrors {
  firstName?: string;
  lastName?: string;
  role?: string;
  hoursPerMonth?: string;
  location?: string;
}

export const useEmployeeForm = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    primaryRole: null,
    roles: [],
    location: null,
    hoursPerMonth: null,
  });

  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      primaryRole: null,
      roles: [],
      location: null,
      hoursPerMonth: null,
    });
    setEditingId(null);
    setErrors({});
  };

  // Load employee for editing
  const loadEmployeeForEdit = (employee: EmployeeResponseDto) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      primaryRole: employee.primaryRole ?? null,
      roles: employee.roles ?? [],
      location: employee.location ?? null,
      hoursPerMonth: employee.hoursPerMonth ?? 0,
    });
    setEditingId(employee.id);
    setErrors({});
  };

  // Update form field
  const updateField = <K extends keyof EmployeeFormData>(
    field: K,
    value: EmployeeFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof EmployeeFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const validation = validateEmployeeForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  return {
    formData,
    errors,
    editingId,
    resetForm,
    loadEmployeeForEdit,
    updateField,
    validateForm,
    isEditing: !!editingId,
  };
};