import { useState } from 'react';
import { ShiftResponseDto } from '@/api/data-contracts';
import { validateShiftTime } from '../utils/shiftUtils';
import { getTodayDateString } from '@/utils/date.utils.ts';
import { useAuth } from '@/contexts/AuthContext.tsx';

export interface ShiftFormData {
  name: string;
  shortName: string;
  description: string;
  startTime: string;
  endTime: string;
  locationId: string;
  organizationId: string;
  isActive: boolean;
}

export interface ShiftFormErrors {
  name?: string;
  shortName?: string;
  startTime?: string;
  endTime?: string;
  locationId?: string;
}

export const useShiftForm = () => {
  const { organizationId } = useAuth();
  
  const getInitialFormData = (): ShiftFormData => ({
    name: '',
    shortName: '',
    description: '',
    startTime: '08:00',
    endTime: '16:00',
    locationId: '',
    organizationId: organizationId || '',
    isActive: true,
  });

  const [formData, setFormData] = useState<ShiftFormData>(getInitialFormData());
  const [errors, setErrors] = useState<ShiftFormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateField = (field: keyof ShiftFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field as keyof ShiftFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ShiftFormErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.shortName.trim()) {
      newErrors.shortName = 'Kurzname ist erforderlich';
    }


    if (!formData.startTime) {
      newErrors.startTime = 'Startzeit ist erforderlich';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Endzeit ist erforderlich';
    }

    if (!formData.locationId) {
      newErrors.locationId = 'Station ist erforderlich';
    }

    // Time validation
    if (formData.startTime && formData.endTime) {
      if (!validateShiftTime(formData.startTime, formData.endTime)) {
        newErrors.endTime = 'Endzeit muss nach der Startzeit liegen';
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadShiftForEdit = (shift: ShiftResponseDto) => {
    setFormData({
      name: shift.name,
      shortName: shift.shortName || '',
      description: shift.description || '',
      startTime: shift.startTime,
      endTime: shift.endTime,
      locationId: shift.locationId,
      organizationId: shift.organizationId,
      isActive: shift.isActive,
    });
    setEditingId(shift.id);
    setErrors({});
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
    setErrors({});
    setEditingId(null);
  };

  const isEditing = editingId !== null;

  return {
    formData,
    errors,
    editingId,
    updateField,
    validateForm,
    loadShiftForEdit,
    resetForm,
    isEditing,
  };
};