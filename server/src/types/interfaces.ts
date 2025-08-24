/**
 * Gemeinsame TypeScript-Interfaces für Frontend und Backend
 * Basiert auf den bestehenden Frontend-Interfaces
 */

/**
 * Mitarbeiter-Interface
 */
export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  hoursPerMonth: number;
  hoursPerWeek?: number;
  clinic?: 'Elmshorn' | 'Uetersen';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mitarbeiterrollen
 */
export type EmployeeRole = 'Pfleger' | 'Pflegehelfer' | 'Schichtleiter';

/**
 * Schicht-Interface
 */
export interface Shift {
  start: string;  // Format: "HH:MM"
  end: string;    // Format: "HH:MM"
  roles: EmployeeRole[];  // Erlaubte Rollen für diese Schicht
}

/**
 * Schichtdefinitionen
 */
export interface ShiftDefinitions {
  longDays: {
    [key: string]: Shift;  // "F", "S00", "S0", "S1", "S"
  };
  shortDays: {
    [key: string]: Shift;  // "F", "FS"
  };
}

/**
 * Täglicher Schichtplan
 */
export interface DayShiftPlan {
  [shiftName: string]: string[];  // Schichtname -> Array von Mitarbeiter-IDs
}

/**
 * Monatlicher Schichtplan
 */
export interface MonthlyShiftPlan {
  [dateKey: string]: DayShiftPlan | null;  // Format: "DD.MM.YYYY"
}

/**
 * Schichtplan-Datenbank-Entität
 */
export interface ShiftPlanEntity {
  id: string;
  year: number;
  month: number;
  planData: string; // JSON-serialized MonthlyShiftPlan
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Einzelne Schichtzuweisung
 */
export interface ShiftAssignment {
  id: string;
  shiftPlanId: string;
  employeeId: string;
  date: string; // Format: "DD.MM.YYYY"
  shiftType: string; // "F", "S", "FS", etc.
  hours: number;
  createdAt: Date;
}

/**
 * Mitarbeiterverfügbarkeit während der Schichtplanung
 */
export interface EmployeeAvailability {
  [employeeId: string]: {
    weeklyHoursAssigned: number;
    totalHoursAssigned: number;
    shiftsAssigned: string[];  // Array von Datumsschlüsseln
    lastShiftType: string | null;
    saturdaysWorked: number;
  };
}

/**
 * Status einer Regelüberprüfung
 */
export type ConstraintStatus = 'ok' | 'warning' | 'violation' | 'info';

/**
 * Ergebnis einer Regelüberprüfung
 */
export interface ConstraintCheck {
  status: ConstraintStatus;
  message: string;
}

/**
 * Constraint-Verletzung für Datenbank
 */
export interface ConstraintViolation {
  id: string;
  shiftPlanId: string;
  type: 'hard' | 'soft';
  rule: string;
  message: string;
  employeeId?: string;
  date?: string;
  createdAt: Date;
}

/**
 * Konfigurierbare Schichtregeln
 */
export interface ShiftRules {
  id?: string;
  minNursesPerShift: number;
  minNurseManagersPerShift: number;
  minHelpers: number;
  maxSaturdaysPerMonth: number;
  maxConsecutiveSameShifts: number;
  weeklyHoursOverflowTolerance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Standort-Interface
 */
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone?: string;
  email?: string;
  manager?: string;
  capacity: number;
  operatingHours: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  specialties: string[];
  equipment: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Zeitslot für Öffnungszeiten
 */
export interface TimeSlot {
  start: string; // Format: "HH:MM"
  end: string;   // Format: "HH:MM"
}

/**
 * Standort-Statistiken
 */
export interface LocationStats {
  totalPatients: number;
  averageUtilization: number;
  employeeCount: number;
  monthlyRevenue?: number;
  patientSatisfaction?: number;
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginierung
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Schichtplan-Generierung Request
 */
export interface GenerateShiftPlanRequest {
  year: number;
  month: number;
  employeeIds?: string[];
  useRelaxedRules?: boolean;
}

/**
 * Schichtplan-Generierung Response
 */
export interface GenerateShiftPlanResponse {
  shiftPlan: MonthlyShiftPlan;
  employeeAvailability: EmployeeAvailability;
  violations: {
    hard: ConstraintViolation[];
    soft: ConstraintViolation[];
  };
  statistics: PlanningStatistics;
}

/**
 * Planungsstatistiken
 */
export interface PlanningStatistics {
  completeDays: number;
  incompleteDays: number;
  completionRate: number;
  averageWorkload: number;
  workloadDistribution: {
    employeeId: string;
    name: string;
    assignedHours: number;
    targetHours: number;
    percentage: number;
  }[];
  saturdayDistribution: {
    employeeId: string;
    name: string;
    count: number;
  }[];
}

/**
 * Validierungsanfrage
 */
export interface ValidateShiftPlanRequest {
  shiftPlan: MonthlyShiftPlan;
  employeeIds: string[];
  year: number;
  month: number;
}

/**
 * Validierungsantwort
 */
export interface ValidateShiftPlanResponse {
  isValid: boolean;
  violations: {
    hard: ConstraintViolation[];
    soft: ConstraintViolation[];
  };
  suggestions?: string[];
}