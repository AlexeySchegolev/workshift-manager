/**
 * Mitarbeiter-Interface
 */
export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  hoursPerMonth: number; // Monatliche Sollstunden
  hoursPerWeek?: number; // Optional: Wöchentliche Sollstunden (wird nicht mehr angezeigt)
  location?: string; // Zugehörigkeit zum Standort
}

/**
 * Mitarbeiterrollen (Legacy - wird durch RoleDefinition ersetzt)
 */
export type EmployeeRole = 'Specialist' | 'Assistant' | 'ShiftLeader';

/**
 * Erweiterte Rollendefinition
 */
export interface RoleDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string; // Hex-Farbe für UI
  priority: number; // Niedrigere Zahl = höhere Priorität
  permissions: RolePermission[];
  requirements: RoleRequirement[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Rollen-Berechtigungen
 */
export interface RolePermission {
  id: string;
  name: string;
  description: string;
  category: 'shift_planning' | 'management' | 'administration' | 'reporting';
}

/**
 * Rollen-Anforderungen
 */
export interface RoleRequirement {
  id: string;
  type: 'certification' | 'experience' | 'training' | 'other';
  name: string;
  description: string;
  required: boolean;
}

/**
 * Standard-Rollen-Definitionen
 */
export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'shiftleader',
    name: 'ShiftLeader',
    displayName: 'Schichtleiter/in',
    description: 'Verantwortlich für die Leitung einer Schicht und Koordination des Teams',
    color: '#1976d2',
    priority: 1,
    permissions: [],
    requirements: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'specialist',
    name: 'Specialist',
    displayName: 'Fachkraft',
    description: 'Qualifizierte Fachkraft mit abgeschlossener Ausbildung',
    color: '#388e3c',
    priority: 2,
    permissions: [],
    requirements: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'assistant',
    name: 'Assistant',
    displayName: 'Hilfskraft',
    description: 'Unterstützende Hilfskraft',
    color: '#f57c00',
    priority: 3,
    permissions: [],
    requirements: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

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
 * Konfigurierbare Schichtregeln
 */
export interface ShiftRules {
  minNursesPerShift: number;
  minNurseManagersPerShift: number;
  minHelpers: number;
  maxSaturdaysPerMonth: number;
  maxConsecutiveSameShifts: number;
  weeklyHoursOverflowTolerance: number;
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
  capacity: number; // Maximale Kapazität (Arbeitsplätze/Kunden)
  operatingHours: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  services: string[]; // Angebotene Services/Dienstleistungen
  equipment: string[]; // Verfügbare Ausstattung/Geräte
  isActive: boolean;
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
  totalClients: number;
  averageUtilization: number; // Auslastung in Prozent
  employeeCount: number;
  monthlyRevenue?: number;
  clientSatisfaction?: number; // 1-5 Sterne
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
 * Constraint-Verletzung
 */
export interface ConstraintViolation {
  id: string;
  rule: string;
  message: string;
  employeeId?: string;
  date?: string;
  severity?: number;
  isResolved?: boolean;
  createdAt: Date;
}