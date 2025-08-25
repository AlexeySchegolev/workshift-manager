/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ConstraintViolationResponseDto {
  /**
   * Unique identifier for the constraint violation
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
}

export interface CreateEmployeeDto {
  /**
   * Hours per month the employee should work
   * @min 1
   * @max 300
   * @example 160
   */
  hoursPerMonth: number;
  /**
   * Hours per week (optional)
   * @min 1
   * @max 60
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Location ID where employee is assigned
   * @example 1
   */
  locationId?: number;
  /**
   * Employee name
   * @minLength 2
   * @maxLength 255
   * @example "Max Mustermann"
   */
  name: string;
  /**
   * Employee role
   * @example "Assistant"
   */
  role: "Specialist" | "Assistant" | "ShiftLeader";
}

export interface CreateLocationDto {
  /**
   * Street address
   * @maxLength 500
   * @example "Musterstraße 123"
   */
  address: string;
  /**
   * Location capacity (number of people)
   * @min 1
   * @max 1000
   * @example 50
   */
  capacity: number;
  /**
   * City name
   * @maxLength 100
   * @example "Berlin"
   */
  city: string;
  /**
   * Email address
   * @maxLength 255
   * @example "berlin@workshift.de"
   */
  email?: string;
  /**
   * Equipment available at this location
   * @example ["Rollstuhl","Patientenlift","Notfallausrüstung"]
   */
  equipment?: string[];
  /**
   * Whether the location is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * Manager name
   * @maxLength 255
   * @example "Max Mustermann"
   */
  manager?: string;
  /**
   * Location name
   * @minLength 2
   * @maxLength 255
   * @example "Hauptstandort Berlin"
   */
  name: string;
  /** Operating hours for each day of the week */
  operatingHours?: OperatingHoursDto;
  /**
   * Phone number
   * @maxLength 20
   * @example "+49 30 12345678"
   */
  phone?: string;
  /**
   * Postal code
   * @maxLength 10
   * @example "10115"
   */
  postalCode: string;
  /**
   * Services provided at this location
   * @example ["Pflege","Beratung","Therapie"]
   */
  services?: string[];
}

export interface CreateShiftPlanDto {
  /** User ID who created this shift plan */
  createdBy?: string;
  /**
   * Whether this shift plan is published
   * @default false
   * @example false
   */
  isPublished?: boolean;
  /**
   * Month for the shift plan (1-12)
   * @min 1
   * @max 12
   * @example 12
   */
  month: number;
  /**
   * Monthly shift plan data structure
   * @example {"01.12.2024":{"F":["employee-uuid-1","employee-uuid-2"],"S":["employee-uuid-3"],"FS":["employee-uuid-4"]},"02.12.2024":{"F":["employee-uuid-2","employee-uuid-5"],"S":["employee-uuid-1"]}}
   */
  planData?: Record<string, any>;
  /**
   * Year for the shift plan
   * @min 2020
   * @max 2030
   * @example 2024
   */
  year: number;
}

export interface CreateShiftRulesDto {
  /** User ID who created this rule set */
  createdBy?: string;
  /**
   * Description of this rule set
   * @maxLength 500
   * @example "Standard shift rules for regular operations"
   */
  description?: string;
  /**
   * Whether this rule set is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * Maximum number of consecutive same shifts
   * @min 1
   * @max 10
   * @example 3
   */
  maxConsecutiveSameShifts: number;
  /**
   * Maximum consecutive working days
   * @min 1
   * @max 14
   * @example 6
   */
  maxConsecutiveWorkingDays: number;
  /**
   * Maximum number of Saturdays an employee can work per month
   * @min 0
   * @max 5
   * @example 2
   */
  maxSaturdaysPerMonth: number;
  /**
   * Minimum number of helpers required
   * @min 0
   * @max 10
   * @example 1
   */
  minHelpers: number;
  /**
   * Minimum number of nurse managers required per shift
   * @min 0
   * @max 10
   * @example 1
   */
  minNurseManagersPerShift: number;
  /**
   * Minimum number of nurses required per shift
   * @min 1
   * @max 20
   * @example 2
   */
  minNursesPerShift: number;
  /**
   * Minimum rest hours between shifts
   * @min 8
   * @max 24
   * @example 11
   */
  minRestHoursBetweenShifts: number;
  /**
   * Weekly hours overflow tolerance in hours
   * @min 0
   * @max 20
   * @example 5
   */
  weeklyHoursOverflowTolerance: number;
}

export interface EmployeeResponseDto {
  /**
   * Date when the employee was created
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  createdAt: string;
  /**
   * Hours per month the employee should work
   * @min 1
   * @max 300
   * @example 160
   */
  hoursPerMonth: number;
  /**
   * Hours per week (optional)
   * @min 1
   * @max 60
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Unique identifier for the employee
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /** Location where the employee is assigned */
  location?: LocationResponseDto;
  /**
   * Location ID where employee is assigned
   * @example 1
   */
  locationId?: number;
  /**
   * Employee name
   * @minLength 2
   * @maxLength 255
   * @example "Max Mustermann"
   */
  name: string;
  /**
   * Employee role
   * @example "Assistant"
   */
  role: "Specialist" | "Assistant" | "ShiftLeader";
  /** Shift assignments for this employee */
  shiftAssignments: ShiftAssignmentResponseDto[];
  /**
   * Date when the employee was last updated
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  updatedAt: string;
}

export interface GenerateShiftPlanDto {
  /** User ID who is generating this shift plan */
  createdBy?: string;
  /**
   * Specific employee IDs to include in planning (if not provided, all active employees will be used)
   * @example ["employee-uuid-1","employee-uuid-2","employee-uuid-3"]
   */
  employeeIds?: string[];
  /** Location ID to generate plan for (if not provided, all locations will be considered) */
  locationId?: number;
  /**
   * Month for the shift plan (1-12)
   * @min 1
   * @max 12
   * @example 12
   */
  month: number;
  /** Shift rules ID to use for planning (if not provided, default active rules will be used) */
  shiftRulesId?: string;
  /**
   * Whether to use relaxed rules during planning
   * @default false
   * @example false
   */
  useRelaxedRules?: boolean;
  /**
   * Year for the shift plan
   * @min 2020
   * @max 2030
   * @example 2024
   */
  year: number;
}

export interface LocationResponseDto {
  /**
   * Location address
   * @maxLength 500
   * @example "Musterstraße 123"
   */
  address: string;
  /**
   * Location capacity (number of people)
   * @min 1
   * @example 50
   */
  capacity: number;
  /**
   * City where the location is situated
   * @maxLength 100
   * @example "Berlin"
   */
  city: string;
  /**
   * Date when the location was created
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  createdAt: string;
  /**
   * Email address
   * @maxLength 255
   * @example "berlin@company.com"
   */
  email?: string;
  /** Employees assigned to this location */
  employees: EmployeeResponseDto[];
  /**
   * Equipment available at this location
   * @example ["Wheelchair","Hospital Bed","Medical Monitor"]
   */
  equipment: string[];
  /**
   * Unique identifier for the location
   * @example 1
   */
  id: number;
  /**
   * Whether the location is currently active
   * @default true
   * @example true
   */
  isActive: boolean;
  /**
   * Manager name
   * @maxLength 255
   * @example "Anna Schmidt"
   */
  manager?: string;
  /**
   * Location name
   * @maxLength 255
   * @example "Berlin Office"
   */
  name: string;
  /**
   * Operating hours for each day of the week
   * @example {"monday":[{"start":"09:00","end":"17:00"}],"tuesday":[{"start":"09:00","end":"17:00"}],"wednesday":[{"start":"09:00","end":"17:00"}],"thursday":[{"start":"09:00","end":"17:00"}],"friday":[{"start":"09:00","end":"17:00"}],"saturday":[],"sunday":[]}
   */
  operatingHours: Record<string, any>;
  /**
   * Phone number
   * @maxLength 20
   * @example "+49 30 12345678"
   */
  phone?: string;
  /**
   * Postal code
   * @maxLength 10
   * @example "10115"
   */
  postalCode: string;
  /**
   * Services provided at this location
   * @example ["Nursing","Physical Therapy","Medical Consultation"]
   */
  services: string[];
  /**
   * Date when the location was last updated
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  updatedAt: string;
}

export interface OperatingHoursDto {
  /**
   * Friday operating hours
   * @default []
   */
  friday?: TimeSlotDto[];
  /**
   * Monday operating hours
   * @default []
   */
  monday?: TimeSlotDto[];
  /**
   * Saturday operating hours
   * @default []
   */
  saturday?: TimeSlotDto[];
  /**
   * Sunday operating hours
   * @default []
   */
  sunday?: TimeSlotDto[];
  /**
   * Thursday operating hours
   * @default []
   */
  thursday?: TimeSlotDto[];
  /**
   * Tuesday operating hours
   * @default []
   */
  tuesday?: TimeSlotDto[];
  /**
   * Wednesday operating hours
   * @default []
   */
  wednesday?: TimeSlotDto[];
}

export interface ShiftAssignmentResponseDto {
  /**
   * Unique identifier for the shift assignment
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
}

export interface ShiftPlanResponseDto {
  /** Shift assignments for this plan */
  assignments: ShiftAssignmentResponseDto[];
  /**
   * Date when the shift plan was created
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  createdAt: string;
  /**
   * User ID who created this shift plan
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  createdBy?: string;
  /**
   * Unique identifier for the shift plan
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Whether the shift plan is published
   * @default false
   * @example false
   */
  isPublished: boolean;
  /**
   * Month for the shift plan (1-12)
   * @min 1
   * @max 12
   * @example 12
   */
  month: number;
  /**
   * Shift plan data organized by date and shift
   * @example {"01.12.2024":{"Morning":["employee-id-1","employee-id-2"],"Evening":["employee-id-3","employee-id-4"]},"02.12.2024":{"Morning":["employee-id-2","employee-id-3"],"Evening":["employee-id-1","employee-id-4"]}}
   */
  planData?: Record<string, any>;
  /**
   * Date when the shift plan was last updated
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  updatedAt: string;
  /** Constraint violations for this plan */
  violations: ConstraintViolationResponseDto[];
  /**
   * Year for the shift plan
   * @min 2020
   * @max 2030
   * @example 2024
   */
  year: number;
}

export interface ShiftRulesResponseDto {
  /**
   * Date when the shift rules were created
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  createdAt: string;
  /**
   * User ID who created this rule set
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  createdBy?: string;
  /**
   * Description of this rule set
   * @maxLength 500
   * @example "Standard shift rules for regular operations"
   */
  description?: string;
  /**
   * Unique identifier for the shift rules
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Whether this rule set is active
   * @default true
   * @example true
   */
  isActive: boolean;
  /**
   * Maximum number of consecutive same shifts
   * @min 1
   * @max 10
   * @default 3
   * @example 3
   */
  maxConsecutiveSameShifts: number;
  /**
   * Maximum consecutive working days
   * @min 1
   * @max 14
   * @default 6
   * @example 6
   */
  maxConsecutiveWorkingDays: number;
  /**
   * Maximum number of Saturdays an employee can work per month
   * @min 0
   * @max 5
   * @default 2
   * @example 2
   */
  maxSaturdaysPerMonth: number;
  /**
   * Minimum number of helpers required
   * @min 0
   * @max 10
   * @default 1
   * @example 1
   */
  minHelpers: number;
  /**
   * Minimum number of nurse managers required per shift
   * @min 0
   * @max 10
   * @default 1
   * @example 1
   */
  minNurseManagersPerShift: number;
  /**
   * Minimum number of nurses required per shift
   * @min 1
   * @max 20
   * @default 2
   * @example 2
   */
  minNursesPerShift: number;
  /**
   * Minimum rest hours between shifts
   * @min 8
   * @max 24
   * @default 11
   * @example 11
   */
  minRestHoursBetweenShifts: number;
  /**
   * Date when the shift rules were last updated
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  updatedAt: string;
  /**
   * Weekly hours overflow tolerance in hours
   * @min 0
   * @max 20
   * @default 5
   * @example 5
   */
  weeklyHoursOverflowTolerance: number;
}

export interface TimeSlotDto {
  /**
   * End time in HH:MM format
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "17:00"
   */
  end: string;
  /**
   * Start time in HH:MM format
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "09:00"
   */
  start: string;
}

export interface UpdateEmployeeDto {
  /**
   * Hours per month the employee should work
   * @min 1
   * @max 300
   * @example 160
   */
  hoursPerMonth?: number;
  /**
   * Hours per week (optional)
   * @min 1
   * @max 60
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Location ID where employee is assigned
   * @example 1
   */
  locationId?: number;
  /**
   * Employee name
   * @minLength 2
   * @maxLength 255
   * @example "Max Mustermann"
   */
  name?: string;
  /**
   * Employee role
   * @example "Assistant"
   */
  role?: "Specialist" | "Assistant" | "ShiftLeader";
}

export interface UpdateLocationDto {
  /**
   * Street address
   * @maxLength 500
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * Location capacity (number of people)
   * @min 1
   * @max 1000
   * @example 50
   */
  capacity?: number;
  /**
   * City name
   * @maxLength 100
   * @example "Berlin"
   */
  city?: string;
  /**
   * Email address
   * @maxLength 255
   * @example "berlin@workshift.de"
   */
  email?: string;
  /**
   * Equipment available at this location
   * @example ["Rollstuhl","Patientenlift","Notfallausrüstung"]
   */
  equipment?: string[];
  /**
   * Whether the location is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * Manager name
   * @maxLength 255
   * @example "Max Mustermann"
   */
  manager?: string;
  /**
   * Location name
   * @minLength 2
   * @maxLength 255
   * @example "Hauptstandort Berlin"
   */
  name?: string;
  /** Operating hours for each day of the week */
  operatingHours?: OperatingHoursDto;
  /**
   * Phone number
   * @maxLength 20
   * @example "+49 30 12345678"
   */
  phone?: string;
  /**
   * Postal code
   * @maxLength 10
   * @example "10115"
   */
  postalCode?: string;
  /**
   * Services provided at this location
   * @example ["Pflege","Beratung","Therapie"]
   */
  services?: string[];
}

export interface UpdateShiftPlanDto {
  /** User ID who created this shift plan */
  createdBy?: string;
  /**
   * Whether this shift plan is published
   * @default false
   * @example false
   */
  isPublished?: boolean;
  /**
   * Month for the shift plan (1-12)
   * @min 1
   * @max 12
   * @example 12
   */
  month?: number;
  /**
   * Monthly shift plan data structure
   * @example {"01.12.2024":{"F":["employee-uuid-1","employee-uuid-2"],"S":["employee-uuid-3"],"FS":["employee-uuid-4"]},"02.12.2024":{"F":["employee-uuid-2","employee-uuid-5"],"S":["employee-uuid-1"]}}
   */
  planData?: Record<string, any>;
  /**
   * Year for the shift plan
   * @min 2020
   * @max 2030
   * @example 2024
   */
  year?: number;
}

export interface UpdateShiftRulesDto {
  /** User ID who created this rule set */
  createdBy?: string;
  /**
   * Description of this rule set
   * @maxLength 500
   * @example "Standard shift rules for regular operations"
   */
  description?: string;
  /**
   * Whether this rule set is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * Maximum number of consecutive same shifts
   * @min 1
   * @max 10
   * @example 3
   */
  maxConsecutiveSameShifts?: number;
  /**
   * Maximum consecutive working days
   * @min 1
   * @max 14
   * @example 6
   */
  maxConsecutiveWorkingDays?: number;
  /**
   * Maximum number of Saturdays an employee can work per month
   * @min 0
   * @max 5
   * @example 2
   */
  maxSaturdaysPerMonth?: number;
  /**
   * Minimum number of helpers required
   * @min 0
   * @max 10
   * @example 1
   */
  minHelpers?: number;
  /**
   * Minimum number of nurse managers required per shift
   * @min 0
   * @max 10
   * @example 1
   */
  minNurseManagersPerShift?: number;
  /**
   * Minimum number of nurses required per shift
   * @min 1
   * @max 20
   * @example 2
   */
  minNursesPerShift?: number;
  /**
   * Minimum rest hours between shifts
   * @min 8
   * @max 24
   * @example 11
   */
  minRestHoursBetweenShifts?: number;
  /**
   * Weekly hours overflow tolerance in hours
   * @min 0
   * @max 20
   * @example 5
   */
  weeklyHoursOverflowTolerance?: number;
}

export interface ValidateShiftPlanDto {
  /** Employee IDs involved in the plan */
  employeeIds: string[];
  /**
   * Month for validation (1-12)
   * @example 12
   */
  month: number;
  /** Monthly shift plan data to validate */
  planData: Record<string, any>;
  /** Shift rules ID to validate against (if not provided, default active rules will be used) */
  shiftRulesId?: string;
  /**
   * Year for validation
   * @example 2024
   */
  year: number;
}
