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

// Status-spezifische Farben basierend auf isActive und isAvailable
export const getEmployeeStatusColor = (isActive: boolean, isAvailable: boolean, theme: any) => {
  if (!isActive) {
    return theme.palette.error.main;
  }
  if (isActive && isAvailable) {
    return theme.palette.success.main;
  }
  if (isActive && !isAvailable) {
    return theme.palette.warning.main;
  }
  return theme.palette.grey[500];
};

// Status formatieren basierend auf isActive und isAvailable
export const formatEmployeeStatus = (isActive: boolean, isAvailable: boolean) => {
  if (!isActive) {
    return 'Inaktiv';
  }
  if (isActive && isAvailable) {
    return 'Verfügbar';
  }
  if (isActive && !isAvailable) {
    return 'Nicht verfügbar';
  }
  return 'Unbekannt';
};

// Vertragsart-spezifische Farben
export const getContractTypeColor = (contractType: string, theme: any) => {
  switch (contractType) {
    case 'full_time':
      return theme.palette.primary.main;
    case 'part_time':
      return theme.palette.info.main;
    case 'contract':
      return theme.palette.warning.main;
    case 'temporary':
      return theme.palette.secondary.main;
    case 'intern':
      return theme.palette.success.main;
    default:
      return theme.palette.grey[500];
  }
};

// Vertragsart formatieren
export const formatContractType = (contractType: string) => {
  switch (contractType) {
    case 'full_time':
      return 'Vollzeit';
    case 'part_time':
      return 'Teilzeit';
    case 'contract':
      return 'Vertrag';
    case 'temporary':
      return 'Befristet';
    case 'intern':
      return 'Praktikant';
    default:
      return contractType;
  }
};

// Validiere Formular-Daten
export const validateEmployeeForm = (data: {
  firstName: string;
  lastName: string;
  primaryRole: RoleResponseDto | null;
  hoursPerMonth: number | null;
  location: any | null;
}) => {
  const errors: {
    firstName?: string;
    lastName?: string;
    role?: string;
    hoursPerMonth?: string;
    location?: string;
  } = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'Vorname ist erforderlich';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Nachname ist erforderlich';
  }

  if (!data.primaryRole) {
    errors.role = 'Rolle ist erforderlich';
  }

  if (data.hoursPerMonth === null) {
    errors.hoursPerMonth = 'Monatsstunden sind erforderlich';
  } else {
    if (data.hoursPerMonth <= 0) {
      errors.hoursPerMonth = 'Monatsstunden müssen größer als 0 sein';
    } else if (data.hoursPerMonth > 180) {
      errors.hoursPerMonth = 'Monatsstunden sollten nicht mehr als 180 sein';
    }
  }

  if (!data.location) {
    errors.location = 'Standort ist erforderlich';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};