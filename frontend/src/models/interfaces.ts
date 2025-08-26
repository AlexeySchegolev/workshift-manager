import {RoleResponseDto} from "@/api/data-contracts.ts";

/**
 * Schicht-Interface
 */
export interface Shift {
  start: string;  // Format: "HH:MM"
  end: string;    // Format: "HH:MM"
  roles: RoleResponseDto[];  // Erlaubte Rollen für diese Schicht
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