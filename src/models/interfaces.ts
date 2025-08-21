/**
 * Mitarbeiter-Interface
 */
export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  hoursPerMonth: number; // Monatliche Sollstunden
  hoursPerWeek?: number; // Optional: Wöchentliche Sollstunden (wird nicht mehr angezeigt)
  clinic?: 'Elmshorn' | 'Uetersen'; // Zugehörigkeit zur Praxis
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