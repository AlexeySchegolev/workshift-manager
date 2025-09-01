import { RoleResponseDto, EmployeeResponseDto } from '@/api/data-contracts';

/**
 * Utility-Funktionen für Employee Management
 */

// Role-spezifische Farben
export const getRoleColor = (role?: RoleResponseDto, theme?: any) => {
  if (!theme) return '#666';
  
  switch (role?.type) {
    case 'shift_leader':
      return theme.palette.primary.main;
    case 'specialist':
      return theme.palette.success.main;
    case 'assistant':
      return theme.palette.info.main;
    case 'nurse':
      return theme.palette.secondary.main;
    case 'nurse_manager':
      return theme.palette.primary.dark;
    case 'helper':
      return theme.palette.warning.main;
    case 'doctor':
      return theme.palette.error.main;
    case 'technician':
      return theme.palette.info.dark;
    case 'administrator':
      return theme.palette.grey[700];
    case 'cleaner':
      return theme.palette.grey[500];
    case 'security':
      return theme.palette.grey[800];
    default:
      return theme.palette.grey[500];
  }
};

// Generiere Avatar-Initialen
export const getInitials = (name: string | undefined | null): string => {
  if (!name) {
    return '??';
  }
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Status-spezifische Farben
export const getEmployeeStatusColor = (status: string, theme: any) => {
  switch (status) {
    case 'active':
      return theme.palette.success.main;
    case 'inactive':
      return theme.palette.grey[500];
    case 'on_leave':
      return theme.palette.warning.main;
    case 'terminated':
      return theme.palette.error.main;
    case 'suspended':
      return theme.palette.error.dark;
    default:
      return theme.palette.grey[500];
  }
};

// Status formatieren
export const formatEmployeeStatus = (status: string) => {
  switch (status) {
    case 'active':
      return 'Aktiv';
    case 'inactive':
      return 'Inaktiv';
    case 'on_leave':
      return 'Beurlaubt';
    case 'terminated':
      return 'Gekündigt';
    case 'suspended':
      return 'Suspendiert';
    default:
      return status;
  }
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

// Berechne Statistiken
export const calculateEmployeeStatistics = (employees: any[]) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalHours = employees.reduce((sum, emp) => sum + (emp.hoursPerMonth || 0), 0);
  const avgHours = totalEmployees > 0 ? totalHours / totalEmployees : 0;

  return {
    totalEmployees,
    activeEmployees,
    totalHours,
    avgHours: Math.round(avgHours * 10) / 10
  };
};