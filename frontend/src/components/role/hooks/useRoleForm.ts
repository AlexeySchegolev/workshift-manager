import { useState } from 'react';
import { RoleResponseDto } from '@/api/data-contracts';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentTimestamp } from '@/utils/date.utils';

interface RoleFormErrors {
  name?: string;
}

export const useRoleForm = () => {
  const { organizationId } = useAuth();
  
  const [formData, setFormData] = useState<RoleResponseDto>({
    id: '',
    organizationId: organizationId || '',
    name: '',
    displayName: '',
    isActive: true,
    isAvailable: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
  });

  const [errors, setErrors] = useState<RoleFormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      organizationId: organizationId || '',
      name: '',
      displayName: '',
      isActive: true,
      isAvailable: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    });
    setErrors({});
    setEditingId(null);
  };

  // Load role for editing
  const loadRoleForEdit = (role: RoleResponseDto) => {
    setFormData(role);
    setEditingId(role.id);
    setErrors({});
  };

  // Update field
  const updateField = (field: keyof RoleResponseDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field as keyof RoleFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: RoleFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rollenname ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if editing
  const isEditing = editingId !== null;

  return {
    formData,
    errors,
    editingId,
    resetForm,
    loadRoleForEdit,
    updateField,
    validateForm,
    isEditing,
  };
};