import { useState } from 'react';
import { ShiftResponseDto } from '@/api/data-contracts';
import { validateShiftTime, calculateShiftDuration } from '../utils/shiftUtils';
import { getTodayDateString } from '../../../utils/date.utils';

export interface ShiftFormData {
  name: string;
  description: string;
  type: string;
  status: string;
  priority: number;
  shiftDate: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  totalHours: number;
  minEmployees: number;
  maxEmployees: number;
  locationId: string;
  organizationId: string;
  requiredSkills: string[];
  requiredCertifications: string[];
  isOvertime: boolean;
  overtimeRate?: number;
  isHoliday: boolean;
  holidayRate?: number;
  isWeekend: boolean;
  weekendRate?: number;
  colorCode: string;
  notes: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  recurrenceEndDate?: string;
  isActive: boolean;
}

export interface ShiftFormErrors {
  name?: string;
  type?: string;
  shiftDate?: string;
  startTime?: string;
  endTime?: string;
  minEmployees?: string;
  maxEmployees?: string;
  locationId?: string;
  totalHours?: string;
}

const initialFormData: ShiftFormData = {
  name: '',
  description: '',
  type: 'morning',
  status: 'draft',
  priority: 2,
  shiftDate: getTodayDateString(),
  startTime: '08:00',
  endTime: '16:00',
  breakDuration: 30,
  totalHours: 8.0,
  minEmployees: 1,
  maxEmployees: 5,
  locationId: '',
  organizationId: '1', // Default organization
  requiredSkills: [],
  requiredCertifications: [],
  isOvertime: false,
  isHoliday: false,
  isWeekend: false,
  colorCode: '#4CAF50',
  notes: '',
  isRecurring: false,
  isActive: true,
};

export const useShiftForm = () => {
  const [formData, setFormData] = useState<ShiftFormData>(initialFormData);
  const [errors, setErrors] = useState<ShiftFormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const updateField = (field: keyof ShiftFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total hours when times change
      if (field === 'startTime' || field === 'endTime' || field === 'breakDuration') {
        const duration = calculateShiftDuration(
          field === 'startTime' ? value : updated.startTime,
          field === 'endTime' ? value : updated.endTime,
          field === 'breakDuration' ? value : updated.breakDuration
        );
        updated.totalHours = Math.round(duration * 100) / 100;
      }
      
      // Auto-set weekend flag based on date
      if (field === 'shiftDate') {
        const date = new Date(value);
        const dayOfWeek = date.getDay();
        updated.isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      }
      
      return updated;
    });
    
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

    if (!formData.type) {
      newErrors.type = 'Schichttyp ist erforderlich';
    }

    if (!formData.shiftDate) {
      newErrors.shiftDate = 'Datum ist erforderlich';
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

    // Employee count validation
    if (formData.minEmployees < 1) {
      newErrors.minEmployees = 'Mindestens 1 Mitarbeiter erforderlich';
    }

    if (formData.maxEmployees < formData.minEmployees) {
      newErrors.maxEmployees = 'Maximum muss größer als Minimum sein';
    }

    // Total hours validation
    if (formData.totalHours <= 0) {
      newErrors.totalHours = 'Arbeitszeit muss größer als 0 sein';
    }

    if (formData.totalHours > 24) {
      newErrors.totalHours = 'Arbeitszeit kann nicht mehr als 24 Stunden betragen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadShiftForEdit = (shift: ShiftResponseDto) => {
    setFormData({
      name: shift.name,
      description: shift.description || '',
      type: shift.type,
      status: shift.status,
      priority: shift.priority,
      shiftDate: shift.shiftDate,
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakDuration: shift.breakDuration,
      totalHours: shift.totalHours,
      minEmployees: shift.minEmployees,
      maxEmployees: shift.maxEmployees,
      locationId: shift.locationId,
      organizationId: shift.organizationId,
      requiredSkills: shift.requiredSkills || [],
      requiredCertifications: shift.requiredCertifications || [],
      isOvertime: shift.isOvertime,
      overtimeRate: shift.overtimeRate,
      isHoliday: shift.isHoliday,
      holidayRate: shift.holidayRate,
      isWeekend: shift.isWeekend,
      weekendRate: shift.weekendRate,
      colorCode: shift.colorCode || '#4CAF50',
      notes: shift.notes || '',
      isRecurring: shift.isRecurring,
      recurrencePattern: shift.recurrencePattern,
      recurrenceEndDate: shift.recurrenceEndDate,
      isActive: shift.isActive,
    });
    setEditingId(shift.id);
    setErrors({});
  };

  const resetForm = () => {
    setFormData(initialFormData);
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