import { ShiftPlanDetailResponseDto, ShiftPlanResponseDto } from '../../api/data-contracts';

/**
 * Reduziertes Mitarbeiter-Interface für Schichtplan-Berechnungen
 */
export interface ReducedEmployee {
  id: string;
  name: string;
  role: string;
  roleId?: string; // ID der Rolle für präzise Zuordnung
  location: string;
  monthlyWorkHours?: number;
}

/**
 * Interface für Mitarbeiter-Status an einem Tag
 */
export interface EmployeeDayStatus {
  employee: ReducedEmployee;
  assignedShift: string;
  shiftId: string;
  shiftName: string; // Vollständiger Name der Schicht für Tooltip
  absenceType: string; // 'vacation', 'sick_leave', 'other'
  absenceReason: string;
  isEmpty: boolean; // true wenn keine Schicht und keine Abwesenheit
}

/**
 * Interface für Rollen-Belegung in einer Schicht
 */
export interface RoleOccupancy {
  roleId?: string; // Optional für Rückwärtskompatibilität
  roleName: string;
  required: number;
  assigned: number;
  assignedEmployees: string[];
  minRequired?: number; // Mindestanzahl für diese Rolle
  maxAllowed?: number;  // Maximalanzahl für diese Rolle
  priority?: number;    // Priorität der Rolle (1-5)
}

/**
 * Interface für Schicht-Belegung an einem Tag
 */
export interface ShiftOccupancy {
  shiftId: string;
  shiftName: string;
  shortName: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
  assignedCount: number;
  assignedEmployees: string[]; // Employee names
  roleOccupancy: RoleOccupancy[]; // Belegung nach Rollen
  isUnderStaffed: boolean;
  isCorrectlyStaffed: boolean;
}

/**
 * Interface für einen Tag im Schichtplan
 */
export interface ShiftPlanDay {
  date: Date;
  dayKey: string; // Format: DD.MM.YYYY
  dayNumber: number;
  isWeekend: boolean;
  isToday: boolean;
  employees: EmployeeDayStatus[]; // Alle Mitarbeiter für diesen Tag
  shiftOccupancy: ShiftOccupancy[]; // Schicht-Belegung für diesen Tag
}

/**
 * Interface für die berechnete Schiftplan-Datenstruktur
 */
export interface CalculatedShiftPlan {
  shiftPlan: ShiftPlanResponseDto | null;
  shiftPlanDetails: ShiftPlanDetailResponseDto[];
  employees: (ReducedEmployee & { calculatedMonthlyHours: number })[];
  days: ShiftPlanDay[]; // Array von Tagen mit allen Mitarbeitern
  availableShifts: any[]; // Alle verfügbaren Schichten für diese Location
  shiftWeekdays: any[]; // Schicht-Wochentag Zuordnungen
  year: number;
  month: number;
  locationId: string;
  locationName: string | null;
  isLoading: boolean;
  hasData: boolean;
}