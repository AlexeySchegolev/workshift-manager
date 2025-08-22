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
  capacity: number; // Maximale Anzahl Patienten
  operatingHours: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  specialties: string[]; // Spezialisierungen (z.B. "Hämodialyse", "Peritonealdialyse")
  equipment: string[]; // Verfügbare Geräte
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
  totalPatients: number;
  averageUtilization: number; // Auslastung in Prozent
  employeeCount: number;
  monthlyRevenue?: number;
  patientSatisfaction?: number; // 1-5 Sterne
}