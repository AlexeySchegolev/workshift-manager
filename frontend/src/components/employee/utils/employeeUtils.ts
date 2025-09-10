import { RoleResponseDto } from '@/api/data-contracts';

/**
 * Utility-Funktionen für Employee Management
 */

// Generiere Avatar-Initialen
export const getInitials = (name: string | undefined | null): string => {
  if (!name) {
    return '??';
  }
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};


// Validiere Formular-Daten
export const validateEmployeeForm = (data: {
  firstName: string;
  lastName: string;
  primaryRole: RoleResponseDto | null;
  roles: RoleResponseDto[];
  location: any | null;
}) => {
  const errors: {
    firstName?: string;
    lastName?: string;
    role?: string;
    primaryRole?: string;
    location?: string;
  } = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'Vorname ist erforderlich';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Nachname ist erforderlich';
  }

  if (!data.roles || data.roles.length === 0) {
    errors.role = 'Mindestens eine Rolle ist erforderlich';
  }

  if (data.roles && data.roles.length > 0 && !data.primaryRole) {
    errors.primaryRole = 'Hauptrolle ist erforderlich';
  }

  if (!data.location) {
    errors.location = 'Standort ist erforderlich';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};