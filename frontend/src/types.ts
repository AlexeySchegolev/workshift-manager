// Frontend type definitions mapped to backend data contracts
import { 
  EmployeeResponseDto, 
  ShiftPlanResponseDto,
  ConstraintViolationDto,
  LocationStatsDto 
} from './api/data-contracts';

// Map Employee to EmployeeResponseDto
export type Employee = EmployeeResponseDto & {
  hoursPerMonth?: number; // Additional frontend-specific property
};

// Monthly shift plan structure
export interface DayShiftPlan {
  [shiftName: string]: string[]; // employeeIds array
}

export interface MonthlyShiftPlan {
  [dateKey: string]: DayShiftPlan | null; // dateKey format: "dd.MM.yyyy"
}

// Constraint check mapping
export interface ConstraintCheck {
  id: string;
  status: 'warning' | 'violation' | 'success';
  message: string;
  severity?: 'low' | 'medium' | 'high';
  rule?: string;
  affectedEmployees?: string[];
}

// Constraint status type
export type ConstraintStatus = 'warning' | 'violation' | 'success';

// Employee availability interface
export interface EmployeeAvailability {
  employeeId: string;
  date: string;
  available: boolean;
  shifts: string[];
  preferences?: string[];
  constraints?: string[];
}

// Excel export related types
export interface ExcelExportOptions {
  includeStatistics?: boolean;
  includePlanning?: boolean;
  includeConstraints?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// TODO: Map these to proper backend types once available
export interface ShiftPlanningOptions {
  algorithm: 'basic' | 'advanced' | 'ai';
  constraints: string[];
  priorities: string[];
}