import { useState } from 'react';
import { LocationResponseDto } from '@/api/data-contracts';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentTimestamp } from '@/utils/date.utils';

interface LocationFormErrors {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
}

export const useLocationForm = () => {
  const { organizationId } = useAuth();
  
  const [formData, setFormData] = useState<LocationResponseDto>({
    id: '',
    organizationId: organizationId || '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Germany',
    phone: '',
    email: '',
    timezone: 'Europe/Berlin',
    operatingHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    isActive: true,
    createdAt: getCurrentTimestamp(),
    updatedAt: getCurrentTimestamp(),
    employees: [],
  });

  const [errors, setErrors] = useState<LocationFormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      organizationId: organizationId || '',
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Germany',
      phone: '',
      email: '',
      timezone: 'Europe/Berlin',
      operatingHours: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      employees: [],
    });
    setErrors({});
    setEditingId(null);
  };

  // Load location for editing
  const loadLocationForEdit = (location: LocationResponseDto) => {
    setFormData(location);
    setEditingId(location.id);
    setErrors({});
  };

  // Update field
  const updateField = (field: keyof LocationResponseDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field as keyof LocationFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: LocationFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Adresse ist erforderlich';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Stadt ist erforderlich';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'PLZ ist erforderlich';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ungültige E-Mail-Adresse';
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
    loadLocationForEdit,
    updateField,
    validateForm,
    isEditing,
  };
};