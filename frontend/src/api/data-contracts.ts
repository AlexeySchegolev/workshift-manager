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

export interface AdditionalColumnDto {
  /**
   * Column header
   * @example "Overtime Hours"
   */
  header: string;
  /**
   * Column key
   * @example "overtime_hours"
   */
  key: string;
  /**
   * Column width in Excel
   * @min 5
   * @max 50
   * @example 15
   */
  width?: number;
}

export interface ConstraintViolationDto {
  /** Whether violation can be automatically resolved */
  canAutoResolve?: boolean;
  /** Category of the constraint */
  category:
    | "staffing"
    | "scheduling"
    | "worktime"
    | "skills"
    | "availability"
    | "legal"
    | "preference"
    | "business_rule"
    | "overtime"
    | "rest_period"
    | "consecutive_days"
    | "role_requirement"
    | "location"
    | "other";
  /** Additional context data */
  contextData?: object;
  /** Date key when violation occurs (DD.MM.YYYY) */
  dayKey?: string;
  /** ID of affected employee */
  employeeId?: string;
  /** Name of affected employee */
  employeeName?: string;
  /** Location ID where violation occurs */
  locationId?: string;
  /** Detailed violation message */
  message: string;
  /** Priority score for resolution order */
  priorityScore?: number;
  /** Estimated impact of violation on overall plan quality */
  qualityImpact?: number;
  /** Unique rule code identifying the constraint */
  ruleCode: string;
  /** Human-readable rule name */
  ruleName: string;
  /**
   * Severity level (1-5, where 5 is most severe)
   * @min 1
   * @max 5
   */
  severity: number;
  /** Affected shift type (F, S, FS) */
  shiftType?: string;
  /** Suggested action to resolve violation */
  suggestedAction?: string;
  /** Type of violation (hard, soft, warning, info) */
  type: "hard" | "soft" | "warning" | "info";
}

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
   * Address
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * Certifications
   * @example ["Nursing Training","First Aid"]
   */
  certifications?: string[];
  /**
   * City
   * @example "München"
   */
  city?: string;
  /**
   * Contract type
   * @example "full_time"
   */
  contractType?:
    | "full_time"
    | "part_time"
    | "contract"
    | "temporary"
    | "intern";
  /**
   * Country
   * @example "Deutschland"
   */
  country?: string;
  /**
   * Date of birth
   * @example "1985-03-15"
   */
  dateOfBirth?: string;
  /**
   * Employee email address
   * @example "anna.schneider@dialyse-praxis.de"
   */
  email: string;
  /**
   * Emergency contact name
   * @example "Maria Schneider"
   */
  emergencyContactName?: string;
  /**
   * Emergency contact phone
   * @example "+49 89 1234-002"
   */
  emergencyContactPhone?: string;
  /**
   * Employee number
   * @example "EMP001"
   */
  employeeNumber: string;
  /**
   * Employee first name
   * @example "Anna"
   */
  firstName: string;
  /**
   * Hire date
   * @example "2020-01-15"
   */
  hireDate: string;
  /**
   * Hourly rate
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Working hours per month
   * @min 1
   * @max 400
   * @example 160
   */
  hoursPerMonth: number;
  /**
   * Working hours per week
   * @min 1
   * @max 60
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Languages
   * @example ["German","English"]
   */
  languages?: string[];
  /**
   * Employee last name
   * @example "Schneider"
   */
  lastName: string;
  /**
   * Location ID
   * @example "uuid-string"
   */
  locationId?: string;
  /**
   * Notes about the employee
   * @example "Experienced employee specialized in dialysis"
   */
  notes?: string;
  /**
   * Organization ID
   * @example "uuid-string"
   */
  organizationId: string;
  /**
   * Overtime rate
   * @example 32.5
   */
  overtimeRate?: number;
  /**
   * Phone number
   * @example "+49 89 1234-001"
   */
  phoneNumber?: string;
  /**
   * Postal code
   * @example "80331"
   */
  postalCode?: string;
  /**
   * Primary role ID
   * @example "uuid-string"
   */
  primaryRoleId?: string;
  /**
   * Profile picture URL
   * @example "https://example.com/profile.jpg"
   */
  profilePictureUrl?: string;
  /**
   * Additional role IDs
   * @example ["uuid-string-1","uuid-string-2"]
   */
  roleIds?: string[];
  /**
   * Skills
   * @example ["Patient Care","Teamwork"]
   */
  skills?: string[];
  /**
   * Employee status
   * @example "active"
   */
  status?: "active" | "inactive" | "on_leave" | "terminated" | "suspended";
  /**
   * Supervisor ID
   * @example "uuid-string"
   */
  supervisorId?: string;
  /**
   * Termination date
   * @example "2023-12-31"
   */
  terminationDate?: string;
}

export interface CreateLocationDto {
  /**
   * Accessibility features available
   * @example ["Rollstuhlzugang","Aufzug","Behindertengerechte Toiletten"]
   */
  accessibilityFeatures?: string[];
  /**
   * Street address
   * @maxLength 500
   * @example "Musterstraße 123"
   */
  address: string;
  /**
   * City name
   * @maxLength 100
   * @example "Berlin"
   */
  city: string;
  /**
   * Short identifier code for location
   * @maxLength 100
   * @example "BER-01"
   */
  code?: string;
  /**
   * Country
   * @maxLength 100
   * @default "Germany"
   * @example "Germany"
   */
  country?: string;
  /**
   * Current capacity usage
   * @min 0
   * @example 35
   */
  currentCapacity?: number;
  /**
   * Description of the location
   * @maxLength 500
   * @example "Hauptstandort mit vollständiger Dialyse-Ausstattung"
   */
  description?: string;
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
   * Floor area in square meters
   * @example 250.5
   */
  floorArea?: number;
  /**
   * Whether the location is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * Latitude coordinate
   * @example 52.52
   */
  latitude?: number;
  /**
   * Longitude coordinate
   * @example 13.405
   */
  longitude?: number;
  /**
   * Manager email address
   * @maxLength 255
   * @example "max.mustermann@workshift.de"
   */
  managerEmail?: string;
  /**
   * Manager name
   * @maxLength 255
   * @example "Max Mustermann"
   */
  managerName?: string;
  /**
   * Manager phone number
   * @maxLength 20
   * @example "+49 30 12345679"
   */
  managerPhone?: string;
  /**
   * Maximum location capacity (number of people)
   * @min 1
   * @max 2000
   * @example 50
   */
  maxCapacity: number;
  /**
   * Location name
   * @minLength 2
   * @maxLength 255
   * @example "Hauptstandort Berlin"
   */
  name: string;
  /**
   * Number of beds
   * @min 0
   * @example 25
   */
  numberOfBeds?: number;
  /**
   * Number of rooms
   * @min 0
   * @example 12
   */
  numberOfRooms?: number;
  /** Operating hours for each day of the week */
  operatingHours?: OperatingHoursDto;
  /**
   * ID der Organisation
   * @example "uuid-string"
   */
  organizationId: string;
  /**
   * Number of parking spaces
   * @min 0
   * @example 30
   */
  parkingSpaces?: number;
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
   * Safety features available
   * @example ["Brandmeldeanlage","Notausgang","Erste-Hilfe-Station"]
   */
  safetyFeatures?: string[];
  /**
   * Services provided at this location
   * @example ["Pflege","Beratung","Therapie"]
   */
  services?: string[];
  /**
   * State or region
   * @maxLength 100
   * @example "Berlin"
   */
  state?: string;
  /**
   * Location status
   * @example "active"
   */
  status?: "active" | "inactive" | "maintenance" | "closed";
  /**
   * Timezone for this location
   * @maxLength 50
   * @default "Europe/Berlin"
   * @example "Europe/Berlin"
   */
  timezone?: string;
}

export interface CreateOrganizationDto {
  /**
   * Organization description
   * @example "Leading dialysis center in Berlin with modern equipment"
   */
  description?: string;
  /**
   * Enabled features
   * @example ["shift-planning","reporting"]
   */
  features?: string[];
  /**
   * Headquarters address
   * @example "Alexanderplatz 1"
   */
  headquartersAddress?: string;
  /**
   * Headquarters city
   * @example "Berlin"
   */
  headquartersCity?: string;
  /**
   * Headquarters country
   * @example "Germany"
   */
  headquartersCountry?: string;
  /**
   * Headquarters postal code
   * @example "10178"
   */
  headquartersPostalCode?: string;
  /**
   * Organization is active
   * @example true
   */
  isActive?: boolean;
  /**
   * Legal organization name
   * @example "Dialyse Zentrum Berlin GmbH"
   */
  legalName?: string;
  /**
   * Logo URL
   * @example "https://example.com/logo.png"
   */
  logoUrl?: string;
  /**
   * Maximum number of employees
   * @example 50
   */
  maxEmployees?: number;
  /**
   * Maximum number of locations
   * @example 5
   */
  maxLocations?: number;
  /**
   * Organization name
   * @example "Dialyse Zentrum Berlin"
   */
  name: string;
  /**
   * Primary email address
   * @example "info@dialyse-berlin.de"
   */
  primaryEmail?: string;
  /**
   * Primary phone number
   * @example "+49 30 1234-0"
   */
  primaryPhone?: string;
  /**
   * Registration number
   * @example "HRB 12345"
   */
  registrationNumber?: string;
  /**
   * Organization settings
   * @example {"timezone":"Europe/Berlin","currency":"EUR"}
   */
  settings?: object;
  /**
   * Organization status
   * @example "trial"
   */
  status?: "active" | "inactive" | "suspended" | "trial";
  /**
   * Subscription plan
   * @example "basic"
   */
  subscriptionPlan?: string;
  /**
   * Tax ID
   * @example "DE123456789"
   */
  taxId?: string;
  /**
   * Organization type
   * @example "medical_center"
   */
  type?:
    | "hospital"
    | "clinic"
    | "nursing_home"
    | "medical_center"
    | "pharmacy"
    | "other";
  /**
   * Organization website
   * @example "https://www.dialyse-berlin.de"
   */
  website?: string;
}

export interface CreateRoleDto {
  /**
   * Can work on holidays
   * @example false
   */
  canWorkHolidays?: boolean;
  /**
   * Can work night shifts
   * @example true
   */
  canWorkNights?: boolean;
  /**
   * Can work weekend shifts
   * @example true
   */
  canWorkWeekends?: boolean;
  /**
   * Color code for UI display (Hex)
   * @example "#1976d2"
   */
  colorCode?: string;
  /**
   * Created by (User ID)
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  createdBy?: string;
  /**
   * Role description
   * @example "Qualified specialist for performing dialysis treatments"
   */
  description?: string;
  /**
   * Hourly rate in Euro
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Role is active
   * @example true
   */
  isActive?: boolean;
  /**
   * Maximum consecutive working days
   * @example 5
   */
  maxConsecutiveDays?: number;
  /**
   * Maximum monthly working hours
   * @example 160
   */
  maxMonthlyHours?: number;
  /**
   * Maximum weekly working hours
   * @example 40
   */
  maxWeeklyHours?: number;
  /**
   * Minimum professional experience in months
   * @example 12
   */
  minExperienceMonths?: number;
  /**
   * Minimum rest time between shifts in hours
   * @example 11
   */
  minRestHours?: number;
  /**
   * Role name
   * @example "Dialysis Specialist"
   */
  name: string;
  /**
   * Organization ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  organizationId: string;
  /**
   * Overtime rate in Euro
   * @example 31.88
   */
  overtimeRate?: number;
  /**
   * Permissions
   * @example ["view_patient_data","manage_dialysis_machines"]
   */
  permissions?: string[];
  /**
   * Priority level of the role (1-10, higher = more important)
   * @example 5
   */
  priorityLevel?: number;
  /**
   * Required certifications
   * @example ["Basic Dialysis Course","Hygiene Training"]
   */
  requiredCertifications?: string[];
  /**
   * Required skills
   * @example ["Patient Care","Machine Operation"]
   */
  requiredSkills?: string[];
  /**
   * Role status
   * @example "active"
   */
  status?: "active" | "inactive" | "deprecated";
  /**
   * Role type
   * @example "specialist"
   */
  type:
    | "specialist"
    | "assistant"
    | "shift_leader"
    | "nurse"
    | "nurse_manager"
    | "helper"
    | "doctor"
    | "technician"
    | "administrator"
    | "cleaner"
    | "security"
    | "other";
}

export interface CreateShiftDto {
  /**
   * Break duration in minutes
   * @min 0
   * @default 30
   * @example 30
   */
  breakDuration: number;
  /**
   * Color code for UI display (hex format)
   * @pattern ^#[0-9A-F]{6}$
   * @example "#FF5722"
   */
  colorCode?: string;
  /**
   * User ID who is creating this shift
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440005"
   */
  createdBy?: string;
  /**
   * Description of the shift
   * @maxLength 500
   * @example "Regular morning shift covering basic operations"
   */
  description?: string;
  /**
   * End time of the shift
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "16:00"
   */
  endTime: string;
  /**
   * Holiday rate multiplier
   * @min 1
   * @example 2
   */
  holidayRate?: number;
  /**
   * Whether this shift is active
   * @default true
   * @example true
   */
  isActive: boolean;
  /**
   * Whether this shift is on a holiday
   * @default false
   * @example false
   */
  isHoliday: boolean;
  /**
   * Whether this shift counts as overtime
   * @default false
   * @example false
   */
  isOvertime: boolean;
  /**
   * Whether this is a recurring shift
   * @default false
   * @example false
   */
  isRecurring: boolean;
  /**
   * Whether this shift is on a weekend
   * @default false
   * @example false
   */
  isWeekend: boolean;
  /**
   * Location ID where this shift takes place
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440002"
   */
  locationId: string;
  /**
   * Maximum number of employees allowed
   * @min 1
   * @default 10
   * @example 5
   */
  maxEmployees: number;
  /**
   * Minimum number of employees required
   * @min 1
   * @default 1
   * @example 2
   */
  minEmployees: number;
  /**
   * Name of the shift
   * @maxLength 100
   * @example "Morning Shift"
   */
  name: string;
  /**
   * Additional notes for this shift
   * @example "Special requirements: Extra attention to patient in room 204"
   */
  notes?: string;
  /**
   * Organization ID this shift belongs to
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  organizationId: string;
  /**
   * Overtime rate multiplier
   * @min 1
   * @example 1.5
   */
  overtimeRate?: number;
  /**
   * Priority level of the shift
   * @default 2
   * @example 2
   */
  priority: 1 | 2 | 3 | 4 | 5;
  /**
   * End date for recurrence
   * @format date
   * @example "2024-12-31"
   */
  recurrenceEndDate?: string;
  /**
   * Recurrence pattern (e.g., weekly, monthly)
   * @example "weekly"
   */
  recurrencePattern?: string;
  /**
   * Required certifications for this shift
   * @default []
   * @example ["Nursing License","BLS Certification"]
   */
  requiredCertifications: string[];
  /**
   * Required skills for this shift
   * @default []
   * @example ["CPR","First Aid","Patient Care"]
   */
  requiredSkills: string[];
  /**
   * Role requirements for this shift
   * @default []
   * @example [{"roleId":"550e8400-e29b-41d4-a716-446655440004","requiredCount":2,"minCount":1,"maxCount":3,"priority":3}]
   */
  roleRequirements: ShiftRoleRequirementDto[];
  /**
   * Date when the shift takes place
   * @format date
   * @example "2024-01-15"
   */
  shiftDate: string;
  /**
   * Shift plan ID this shift belongs to (optional)
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440003"
   */
  shiftPlanId?: string;
  /**
   * Start time of the shift
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "08:00"
   */
  startTime: string;
  /**
   * Current status of the shift
   * @default "draft"
   * @example "draft"
   */
  status: "draft" | "published" | "active" | "completed" | "cancelled";
  /**
   * Total hours for this shift
   * @min 0
   * @example 8
   */
  totalHours: number;
  /**
   * Type of the shift
   * @example "morning"
   */
  type:
    | "morning"
    | "afternoon"
    | "evening"
    | "night"
    | "full_day"
    | "split"
    | "on_call"
    | "overtime";
  /**
   * Weekend rate multiplier
   * @min 1
   * @example 1.25
   */
  weekendRate?: number;
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

export interface CreateUserDto {
  /**
   * User email address
   * @example "john.smith@example.com"
   */
  email: string;
  /**
   * Email address verified
   * @example false
   */
  emailVerified?: boolean;
  /**
   * User first name
   * @example "John"
   */
  firstName: string;
  /**
   * User last name
   * @example "Smith"
   */
  lastName: string;
  /**
   * Organization IDs to assign the user to
   * @example ["uuid-org-1","uuid-org-2"]
   */
  organizationIds?: string[];
  /**
   * User password (minimum 8 characters)
   * @example "SecurePassword123!"
   */
  password: string;
  /**
   * User permissions
   * @example ["read:shifts","write:shifts"]
   */
  permissions?: string[];
  /**
   * Phone number
   * @example "+1 555 123-4567"
   */
  phoneNumber?: string;
  /**
   * User preferences
   * @example {"theme":"light","language":"en"}
   */
  preferences?: object;
  /**
   * Profile picture URL
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * User role
   * @example "employee"
   */
  role?:
    | "super_admin"
    | "organization_admin"
    | "manager"
    | "planner"
    | "employee"
    | "viewer";
  /**
   * User status
   * @example "pending"
   */
  status?: "active" | "inactive" | "suspended" | "pending";
  /**
   * Two-factor authentication enabled
   * @example false
   */
  twoFactorEnabled?: boolean;
}

export interface DateRangeDto {
  /**
   * End date for export
   * @format date-time
   * @example "2024-12-31T23:59:59Z"
   */
  end: string;
  /**
   * Start date for export
   * @format date-time
   * @example "2024-12-01T00:00:00Z"
   */
  start: string;
}

export interface EmployeeAvailabilityResponseDto {
  /**
   * Reason for absence
   * @example "vacation"
   */
  absenceReason?:
    | "vacation"
    | "sick_leave"
    | "personal_leave"
    | "maternity_leave"
    | "paternity_leave"
    | "bereavement"
    | "jury_duty"
    | "military_duty"
    | "training"
    | "conference"
    | "unpaid_leave"
    | "sabbatical"
    | "medical_appointment"
    | "family_emergency"
    | "religious_observance"
    | "other";
  /**
   * Affects payroll
   * @example false
   */
  affectsPayroll: boolean;
  /**
   * Approval date
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  approvedAt?: string;
  /**
   * Approved by (User ID)
   * @example "user-uuid"
   */
  approvedBy?: string;
  /**
   * Attached documents (URLs or IDs)
   * @example []
   */
  attachedDocuments: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  createdAt: string;
  /**
   * Created by (User ID)
   * @example "user-uuid"
   */
  createdBy?: string;
  /**
   * Date range as text
   * @example "15.01.2024 - 20.01.2024"
   */
  dateRange: string;
  /**
   * Deletion timestamp (Soft Delete)
   * @format date-time
   * @example "2023-12-31T23:59:59Z"
   */
  deletedAt?: string;
  /**
   * Display name for reason
   * @example "Available"
   */
  displayReason: string;
  /**
   * Documentation provided
   * @example false
   */
  documentationProvided: boolean;
  /**
   * Documentation required
   * @example false
   */
  documentationRequired: boolean;
  /**
   * Duration in days
   * @example 5
   */
  duration: number;
  /**
   * Employee ID
   * @example "uuid-string"
   */
  employeeId: string;
  /**
   * End date of availability period
   * @format date
   * @example "2024-01-20"
   */
  endDate?: string;
  /**
   * End time for partial day availability (HH:MM)
   * @example "17:00"
   */
  endTime?: string;
  /**
   * Excluded locations
   * @example ["location-uuid-3"]
   */
  excludedLocations: string[];
  /**
   * Excluded shift types
   * @example ["N"]
   */
  excludedShiftTypes: string[];
  /**
   * Unique ID of availability record
   * @example "uuid-string"
   */
  id: string;
  /**
   * Internal notes (only visible to managers)
   * @example "Internal remarks"
   */
  internalNotes?: string;
  /**
   * Is absence
   * @example false
   */
  isAbsence: boolean;
  /**
   * Is active
   * @example true
   */
  isActive: boolean;
  /**
   * All-day availability
   * @example true
   */
  isAllDay: boolean;
  /**
   * Is currently active
   * @example true
   */
  isCurrentlyActive: boolean;
  /**
   * Emergency
   * @example false
   */
  isEmergency: boolean;
  /**
   * Is expired
   * @example false
   */
  isExpired: boolean;
  /**
   * Waiting for approval
   * @example false
   */
  isPending: boolean;
  /**
   * Recurring availability
   * @example false
   */
  isRecurring: boolean;
  /**
   * Maximum hours per day
   * @example 8
   */
  maxHoursPerDay?: number;
  /**
   * Maximum hours per week
   * @example 40
   */
  maxHoursPerWeek?: number;
  /**
   * Needs approval
   * @example false
   */
  needsApproval: boolean;
  /**
   * Notes
   * @example "Additional information"
   */
  notes?: string;
  /**
   * Notification sent
   * @example false
   */
  notificationSent: boolean;
  /**
   * Preferred locations
   * @example ["location-uuid-1","location-uuid-2"]
   */
  preferredLocations: string[];
  /**
   * Preferred shift types
   * @example ["F","S"]
   */
  preferredShiftTypes: string[];
  /**
   * Priority level (1-5, higher = more important)
   * @example 1
   */
  priorityLevel: number;
  /**
   * Detailed reason description
   * @example "Doctor appointment in the morning"
   */
  reasonDescription?: string;
  /**
   * Recurrence days (0=Sunday, 1=Monday, etc.)
   * @example [1,2,3,4,5]
   */
  recurrenceDays: number[];
  /**
   * End date of recurrence
   * @format date
   * @example "2024-12-31"
   */
  recurrenceEndDate?: string;
  /**
   * Recurrence interval (e.g. every 2 weeks)
   * @example 1
   */
  recurrenceInterval: number;
  /**
   * Recurrence pattern
   * @example "none"
   */
  recurrencePattern: "none" | "daily" | "weekly" | "monthly" | "yearly";
  /**
   * Rejection date
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  rejectedAt?: string;
  /**
   * Rejected by (User ID)
   * @example "user-uuid"
   */
  rejectedBy?: string;
  /**
   * Rejection reason
   * @example "Staffing already sufficient"
   */
  rejectionReason?: string;
  /**
   * Reminder sent
   * @example false
   */
  reminderSent: boolean;
  /**
   * Requires approval
   * @example false
   */
  requiresApproval: boolean;
  /**
   * Start date of availability period
   * @format date
   * @example "2024-01-15"
   */
  startDate: string;
  /**
   * Start time for partial day availability (HH:MM)
   * @example "09:00"
   */
  startTime?: string;
  /**
   * Availability status
   * @example "active"
   */
  status: "active" | "pending" | "approved" | "rejected" | "expired";
  /**
   * Submission date
   * @format date-time
   * @example "2024-01-15T09:00:00Z"
   */
  submittedAt?: string;
  /**
   * Time range as text
   * @example "09:00 - 17:00"
   */
  timeRange: string;
  /**
   * Availability type
   * @example "available"
   */
  type: "available" | "unavailable" | "preferred" | "limited";
  /**
   * Last update date
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  updatedAt: string;
  /**
   * Updated by (User ID)
   * @example "user-uuid"
   */
  updatedBy?: string;
  /** Weekly availability times */
  weeklyAvailability?: Record<string, any>;
}

export interface EmployeeResponseDto {
  /**
   * Address
   * @example "Musterstraße 123"
   */
  address?: string;
  /** Employee availability information */
  availabilities?: EmployeeAvailabilityResponseDto[];
  /**
   * Certifications
   * @example ["Nursing Training","First Aid"]
   */
  certifications: string[];
  /**
   * City
   * @example "München"
   */
  city?: string;
  /**
   * Contract type
   * @example "full_time"
   */
  contractType: "full_time" | "part_time" | "contract" | "temporary" | "intern";
  /**
   * Country
   * @example "Deutschland"
   */
  country?: string;
  /**
   * Creation date
   * @format date-time
   * @example "2020-01-15T10:00:00Z"
   */
  createdAt: string;
  /**
   * ID of the user who created the entry
   * @example "uuid-string"
   */
  createdBy?: string;
  /**
   * Date of birth
   * @format date-time
   * @example "1985-03-15"
   */
  dateOfBirth?: string;
  /**
   * Deletion timestamp (Soft Delete)
   * @format date-time
   * @example "2023-12-31T23:59:59Z"
   */
  deletedAt?: string;
  /**
   * Display name for UI (alias for fullName)
   * @example "Anna Schneider"
   */
  displayName?: string;
  /**
   * Employee email address
   * @example "anna.schneider@dialyse-praxis.de"
   */
  email: string;
  /**
   * Emergency contact name
   * @example "Maria Schneider"
   */
  emergencyContactName?: string;
  /**
   * Emergency contact phone
   * @example "+49 89 1234-002"
   */
  emergencyContactPhone?: string;
  /**
   * Employee number
   * @example "EMP001"
   */
  employeeNumber: string;
  /**
   * Employee first name
   * @example "Anna"
   */
  firstName: string;
  /**
   * Full name of the employee
   * @example "Anna Schneider"
   */
  fullName: string;
  /**
   * Hire date
   * @format date-time
   * @example "2020-01-15"
   */
  hireDate: string;
  /**
   * Hourly rate
   * @example 28.5
   */
  hourlyRate?: number;
  /**
   * Working hours per month
   * @example 160
   */
  hoursPerMonth: number;
  /**
   * Working hours per week
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Unique ID of the employee
   * @example "uuid-string"
   */
  id: string;
  /**
   * Is the employee active
   * @example true
   */
  isActive: boolean;
  /**
   * Is the employee available
   * @example true
   */
  isAvailable: boolean;
  /**
   * Languages
   * @example ["German","English"]
   */
  languages: string[];
  /**
   * Employee last name
   * @example "Schneider"
   */
  lastName: string;
  /** Location information */
  location?: LocationResponseDto;
  /**
   * Location ID
   * @example "uuid-string"
   */
  locationId?: string;
  /**
   * Notes
   * @example "Experienced employee specialized in dialysis"
   */
  notes?: string;
  /**
   * Organization ID
   * @example "uuid-string"
   */
  organizationId: string;
  /**
   * Overtime rate
   * @example 35.6
   */
  overtimeRate?: number;
  /**
   * Phone number
   * @example "+49 89 1234-001"
   */
  phoneNumber?: string;
  /**
   * Postal code
   * @example "80331"
   */
  postalCode?: string;
  /** Primary role information */
  primaryRole?: RoleResponseDto;
  /**
   * Primary role ID
   * @example "uuid-string"
   */
  primaryRoleId?: string;
  /**
   * Profile picture URL
   * @example "https://example.com/profile.jpg"
   */
  profilePictureUrl?: string;
  /** All roles of the employee */
  roles?: RoleResponseDto[];
  /**
   * Skills
   * @example ["Patient Care","Teamwork"]
   */
  skills: string[];
  /**
   * Employee status
   * @example "active"
   */
  status: "active" | "inactive" | "on_leave" | "terminated" | "suspended";
  /** Subordinate employees */
  subordinates?: EmployeeResponseDto[];
  /** Supervisor information */
  supervisor?: EmployeeResponseDto;
  /**
   * Supervisor ID
   * @example "uuid-string"
   */
  supervisorId?: string;
  /**
   * Termination date
   * @format date-time
   * @example "2023-12-31"
   */
  terminationDate?: string;
  /**
   * Last update date
   * @format date-time
   * @example "2023-06-15T14:30:00Z"
   */
  updatedAt: string;
  /**
   * ID of the user who last updated the entry
   * @example "uuid-string"
   */
  updatedBy?: string;
  /**
   * Years of service
   * @example 3
   */
  yearsOfService: number;
}

export interface ExcelExportMetadataDto {
  /** Export options used */
  exportOptions: ExcelExportOptionsDto;
  /**
   * Total number of planning days
   * @example 31
   */
  totalDays: number;
  /**
   * Total number of employees in export
   * @example 25
   */
  totalEmployees: number;
  /**
   * Total number of shifts in export
   * @example 456
   */
  totalShifts: number;
}

export interface ExcelExportOptionsDto {
  /**
   * Additional columns for export
   * @example [{"key":"overtime","header":"Overtime Hours","width":12},{"key":"vacation_days","header":"Vacation Days","width":15}]
   */
  additionalColumns?: AdditionalColumnDto[];
  /**
   * Company logo URL for export
   * @example "https://example.com/logo.png"
   */
  companyLogo?: string;
  /**
   * Custom title for export
   * @example "Shift Plan December 2024 - Berlin Location"
   */
  customTitle?: string;
  /** Date range for export (overrides default monthly range) */
  dateRange?: DateRangeDto;
  /**
   * Include constraint violations in export
   * @default false
   * @example true
   */
  includeConstraintViolations?: boolean;
  /**
   * Include detailed employee information
   * @default false
   * @example true
   */
  includeEmployeeDetails?: boolean;
  /**
   * Include statistics in export
   * @default false
   * @example true
   */
  includeStatistics?: boolean;
  /**
   * Additional metadata for export
   * @example {"department":"Nursing","location":"Berlin"}
   */
  metadata?: Record<string, any>;
}

export interface ExcelExportRequestDto {
  /** Export options and customizations */
  options?: ExcelExportOptionsDto;
  /**
   * ID of shift plan to export
   * @example "uuid-string"
   */
  shiftPlanId: string;
}

export interface ExcelExportResultDto {
  /**
   * Filename of generated Excel file
   * @example "shift-plan-2024-12-20241227-1830.xlsx"
   */
  filename: string;
  /**
   * Generation timestamp
   * @format date-time
   * @example "2024-12-27T18:30:45Z"
   */
  generatedAt: string;
  /** Metadata about the export */
  metadata: ExcelExportMetadataDto;
  /**
   * MIME type of file
   * @example "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
   */
  mimeType: string;
  /**
   * File size in bytes
   * @example 45120
   */
  size: number;
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
   * Accessibility features available
   * @example ["Rollstuhlzugang","Aufzug","Behindertengerechte Toiletten"]
   */
  accessibilityFeatures: string[];
  /**
   * Location address
   * @maxLength 500
   * @example "Musterstraße 123"
   */
  address: string;
  /**
   * City where the location is situated
   * @maxLength 100
   * @example "Berlin"
   */
  city: string;
  /**
   * Short identifier code for location
   * @example "BER-01"
   */
  code?: string;
  /**
   * Country
   * @example "Germany"
   */
  country: string;
  /**
   * Date when the location was created
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  createdAt: string;
  /**
   * ID of user who created this location
   * @example "uuid-string"
   */
  createdBy?: string;
  /**
   * Current capacity (number of people currently)
   * @min 0
   * @example 25
   */
  currentCapacity: number;
  /**
   * Deletion timestamp (soft delete)
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  deletedAt?: string;
  /**
   * Description of the location
   * @example "Hauptstandort mit vollständiger Dialyse-Ausstattung"
   */
  description?: string;
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
   * Floor area in square meters
   * @example 250.5
   */
  floorArea?: number;
  /**
   * Unique identifier for the location
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Whether the location is currently active
   * @default true
   * @example true
   */
  isActive: boolean;
  /**
   * Latitude coordinate
   * @example 52.52
   */
  latitude?: number;
  /**
   * Longitude coordinate
   * @example 13.405
   */
  longitude?: number;
  /**
   * Manager email address
   * @example "anna.schmidt@workshift.de"
   */
  managerEmail?: string;
  /**
   * Manager name
   * @example "Anna Schmidt"
   */
  managerName?: string;
  /**
   * Manager phone number
   * @example "+49 30 12345679"
   */
  managerPhone?: string;
  /**
   * Maximum capacity (number of people)
   * @min 1
   * @example 50
   */
  maxCapacity: number;
  /**
   * Location name
   * @maxLength 255
   * @example "Berlin Office"
   */
  name: string;
  /**
   * Number of beds
   * @example 25
   */
  numberOfBeds?: number;
  /**
   * Number of rooms
   * @example 12
   */
  numberOfRooms?: number;
  /**
   * Operating hours for each day of the week
   * @example {"monday":[{"start":"09:00","end":"17:00"}],"tuesday":[{"start":"09:00","end":"17:00"}],"wednesday":[{"start":"09:00","end":"17:00"}],"thursday":[{"start":"09:00","end":"17:00"}],"friday":[{"start":"09:00","end":"17:00"}],"saturday":[],"sunday":[]}
   */
  operatingHours: Record<string, any>;
  /**
   * Organization ID
   * @example "uuid-string"
   */
  organizationId: string;
  /**
   * Number of parking spaces
   * @example 30
   */
  parkingSpaces?: number;
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
   * Safety features available
   * @example ["Brandmeldeanlage","Notausgang","Erste-Hilfe-Station"]
   */
  safetyFeatures: string[];
  /**
   * Services provided at this location
   * @example ["Nursing","Physical Therapy","Medical Consultation"]
   */
  services: string[];
  /**
   * State or region
   * @example "Berlin"
   */
  state?: string;
  /** Location statistics and metrics */
  stats?: LocationStatsDto;
  /**
   * Location status
   * @example "active"
   */
  status: "active" | "inactive" | "maintenance" | "closed";
  /**
   * Timezone for this location
   * @example "Europe/Berlin"
   */
  timezone: string;
  /**
   * Date when the location was last updated
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  updatedAt: string;
  /**
   * ID of user who last updated this location
   * @example "uuid-string"
   */
  updatedBy?: string;
}

export interface LocationStatsDto {
  /**
   * Number of active shifts at this location
   * @min 0
   * @example 12
   */
  activeShifts: number;
  /**
   * Average staffing percentage across all shifts
   * @min 0
   * @example 92.3
   */
  averageStaffing: number;
  /**
   * Average utilization percentage of the location
   * @min 0
   * @max 100
   * @example 85.5
   */
  averageUtilization: number;
  /**
   * Client satisfaction rating (1-5 stars)
   * @min 1
   * @max 5
   * @example 4.2
   */
  clientSatisfaction?: number;
  /**
   * Number of employees assigned to this location
   * @min 0
   * @example 8
   */
  employeeCount: number;
  /**
   * Monthly revenue generated at this location
   * @min 0
   * @example 15000
   */
  monthlyRevenue?: number;
  /**
   * Current occupancy rate as percentage of max capacity
   * @min 0
   * @max 100
   * @example 78.5
   */
  occupancyRate: number;
  /**
   * Total number of clients at this location
   * @min 0
   * @example 25
   */
  totalClients: number;
}

export type MonthlyShiftPlanDto = object;

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

export interface OrganizationResponseDto {
  /**
   * Created at
   * @format date-time
   * @example "2024-01-01T12:00:00Z"
   */
  createdAt?: string;
  /**
   * Deleted at
   * @format date-time
   * @example null
   */
  deletedAt?: string;
  /**
   * Description
   * @example "Leading dialysis center in Berlin"
   */
  description?: string;
  /**
   * Enabled features
   * @example ["shift-planning","reporting"]
   */
  features: string[];
  /**
   * Headquarters address
   * @example "Alexanderplatz 1"
   */
  headquartersAddress?: string;
  /**
   * Headquarters city
   * @example "Berlin"
   */
  headquartersCity?: string;
  /**
   * Headquarters country
   * @example "Germany"
   */
  headquartersCountry?: string;
  /**
   * Headquarters postal code
   * @example "10178"
   */
  headquartersPostalCode?: string;
  /**
   * Unique organization ID
   * @example "uuid-string"
   */
  id: string;
  /**
   * Is active
   * @example true
   */
  isActive: boolean;
  /**
   * Legal organization name
   * @example "Dialyse Zentrum Berlin GmbH"
   */
  legalName?: string;
  /**
   * Logo URL
   * @example "https://example.com/logo.png"
   */
  logoUrl?: string;
  /**
   * Maximum number of employees
   * @example 50
   */
  maxEmployees: number;
  /**
   * Maximum number of locations
   * @example 5
   */
  maxLocations: number;
  /**
   * Organization name
   * @example "Dialyse Zentrum Berlin"
   */
  name: string;
  /**
   * Primary email address
   * @example "info@dialyse-berlin.de"
   */
  primaryEmail?: string;
  /**
   * Primary phone number
   * @example "+49 30 1234-0"
   */
  primaryPhone?: string;
  /**
   * Registration number
   * @example "HRB 12345"
   */
  registrationNumber?: string;
  /**
   * Settings
   * @example {"timezone":"Europe/Berlin"}
   */
  settings: object;
  /**
   * Organization status
   * @example "active"
   */
  status: "active" | "inactive" | "suspended" | "trial";
  /**
   * Subscription expiration date
   * @format date-time
   * @example "2025-01-01T00:00:00Z"
   */
  subscriptionExpiresAt?: string;
  /**
   * Subscription plan
   * @example "basic"
   */
  subscriptionPlan: string;
  /**
   * Tax ID
   * @example "DE123456789"
   */
  taxId?: string;
  /**
   * Organization type
   * @example "medical_center"
   */
  type:
    | "hospital"
    | "clinic"
    | "nursing_home"
    | "medical_center"
    | "pharmacy"
    | "other";
  /**
   * Updated at
   * @format date-time
   * @example "2024-02-01T12:00:00Z"
   */
  updatedAt?: string;
  /**
   * Website
   * @example "https://www.dialyse-berlin.de"
   */
  website?: string;
}

export interface RoleResponseDto {
  /**
   * Can work on holidays
   * @example false
   */
  canWorkHolidays: boolean;
  /**
   * Can work night shifts
   * @example true
   */
  canWorkNights: boolean;
  /**
   * Can work weekend shifts
   * @example true
   */
  canWorkWeekends: boolean;
  /**
   * Color code for UI display (Hex)
   * @example "#1976d2"
   */
  colorCode?: string;
  /**
   * Created at
   * @format date-time
   * @example "2024-01-01T12:00:00Z"
   */
  createdAt: string;
  /**
   * Created by (User ID)
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  createdBy?: string;
  /**
   * Deleted at
   * @format date-time
   * @example null
   */
  deletedAt?: string;
  /**
   * Role description
   * @example "Qualified specialist for performing dialysis treatments"
   */
  description?: string;
  /**
   * Display name of the role (computed)
   * @example "Dialysis Specialist (specialist)"
   */
  displayName: string;
  /**
   * Hourly rate in Euro
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Unique role ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Role is active
   * @example true
   */
  isActive: boolean;
  /**
   * Role is available (computed)
   * @example true
   */
  isAvailable: boolean;
  /**
   * Maximum consecutive working days
   * @example 6
   */
  maxConsecutiveDays: number;
  /**
   * Maximum monthly working hours
   * @example 160
   */
  maxMonthlyHours: number;
  /**
   * Maximum weekly working hours
   * @example 40
   */
  maxWeeklyHours: number;
  /**
   * Minimum professional experience in months
   * @example 12
   */
  minExperienceMonths: number;
  /**
   * Minimum rest time between shifts in hours
   * @example 11
   */
  minRestHours: number;
  /**
   * Role name
   * @example "Dialysis Specialist"
   */
  name: string;
  /**
   * Organization ID
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  organizationId: string;
  /**
   * Overtime rate in Euro
   * @example 31.88
   */
  overtimeRate?: number;
  /**
   * Permissions
   * @example ["view_patient_data","manage_dialysis_machines"]
   */
  permissions: string[];
  /**
   * Priority level of the role (1-10, higher = more important)
   * @example 1
   */
  priorityLevel: number;
  /**
   * Required certifications
   * @example ["Basic Dialysis Course","Hygiene Training"]
   */
  requiredCertifications: string[];
  /**
   * Required skills
   * @example ["Patient Care","Machine Operation"]
   */
  requiredSkills: string[];
  /**
   * Role status
   * @example "active"
   */
  status: "active" | "inactive" | "deprecated";
  /**
   * Role type
   * @example "specialist"
   */
  type:
    | "specialist"
    | "assistant"
    | "shift_leader"
    | "nurse"
    | "nurse_manager"
    | "helper"
    | "doctor"
    | "technician"
    | "administrator"
    | "cleaner"
    | "security"
    | "other";
  /**
   * Updated at
   * @format date-time
   * @example "2024-02-01T12:00:00Z"
   */
  updatedAt: string;
  /**
   * Updated by (User ID)
   * @example "123e4567-e89b-12d3-a456-426614174003"
   */
  updatedBy?: string;
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
  planData?: MonthlyShiftPlanDto[];
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

export interface ShiftResponseDto {
  /**
   * Break duration in minutes
   * @min 0
   * @example 30
   */
  breakDuration: number;
  /**
   * Color code for UI display (hex format)
   * @pattern ^#[0-9A-F]{6}$
   * @example "#FF5722"
   */
  colorCode?: string;
  /**
   * Date when the shift was created
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  createdAt: string;
  /**
   * User ID who created this shift
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440005"
   */
  createdBy?: string;
  /**
   * Current number of assigned employees
   * @min 0
   * @example 3
   */
  currentEmployees: number;
  /**
   * Date when the shift was deleted (soft delete)
   * @format date-time
   * @example "2024-01-20T09:15:00Z"
   */
  deletedAt?: string;
  /**
   * Description of the shift
   * @maxLength 500
   * @example "Regular morning shift covering basic operations"
   */
  description?: string;
  /**
   * Duration of the shift in hours
   * @min 0
   * @example 8
   */
  duration: number;
  /**
   * Effective working hours (excluding breaks)
   * @min 0
   * @example 7.5
   */
  effectiveHours: number;
  /**
   * End time of the shift
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "16:00"
   */
  endTime: string;
  /**
   * Holiday rate multiplier
   * @example 2
   */
  holidayRate?: number;
  /**
   * Unique identifier for the shift
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Whether this shift is active
   * @example true
   */
  isActive: boolean;
  /**
   * Whether the shift is available for assignment
   * @example true
   */
  isAvailable: boolean;
  /**
   * Whether the shift is fully staffed
   * @example true
   */
  isFullyStaffed: boolean;
  /**
   * Whether this shift is on a holiday
   * @example false
   */
  isHoliday: boolean;
  /**
   * Whether the shift is over-staffed
   * @example false
   */
  isOverStaffed: boolean;
  /**
   * Whether this shift counts as overtime
   * @example false
   */
  isOvertime: boolean;
  /**
   * Whether this is a recurring shift
   * @example false
   */
  isRecurring: boolean;
  /**
   * Whether this shift is on a weekend
   * @example false
   */
  isWeekend: boolean;
  /** Location where this shift takes place */
  location?: LocationResponseDto;
  /**
   * Location ID where this shift takes place
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440002"
   */
  locationId: string;
  /**
   * Maximum number of employees allowed
   * @min 1
   * @example 5
   */
  maxEmployees: number;
  /**
   * Minimum number of employees required
   * @min 1
   * @example 2
   */
  minEmployees: number;
  /**
   * Name of the shift
   * @maxLength 100
   * @example "Morning Shift"
   */
  name: string;
  /**
   * Additional notes for this shift
   * @example "Special requirements: Extra attention to patient in room 204"
   */
  notes?: string;
  /** Organization this shift belongs to */
  organization?: OrganizationResponseDto;
  /**
   * Organization ID this shift belongs to
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  organizationId: string;
  /**
   * Overtime rate multiplier
   * @example 1.5
   */
  overtimeRate?: number;
  /**
   * Priority level of the shift
   * @example 2
   */
  priority: 1 | 2 | 3 | 4 | 5;
  /**
   * End date for recurrence
   * @format date
   * @example "2024-12-31"
   */
  recurrenceEndDate?: string;
  /**
   * Recurrence pattern (e.g., weekly, monthly)
   * @example "weekly"
   */
  recurrencePattern?: string;
  /**
   * Required certifications for this shift
   * @example ["Nursing License","BLS Certification"]
   */
  requiredCertifications: string[];
  /** Required roles for this shift */
  requiredRoles?: RoleResponseDto[];
  /**
   * Required skills for this shift
   * @example ["CPR","First Aid","Patient Care"]
   */
  requiredSkills: string[];
  /**
   * Role requirements for this shift
   * @example [{"roleId":"550e8400-e29b-41d4-a716-446655440004","requiredCount":2,"minCount":1,"maxCount":3,"priority":3}]
   */
  roleRequirements: ShiftRoleRequirementDto[];
  /**
   * Date when the shift takes place
   * @format date
   * @example "2024-01-15"
   */
  shiftDate: string;
  /**
   * Shift plan ID this shift belongs to (optional)
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440003"
   */
  shiftPlanId?: string;
  /**
   * Staffing percentage (current/minimum * 100)
   * @min 0
   * @example 150
   */
  staffingPercentage: number;
  /**
   * Start time of the shift
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "08:00"
   */
  startTime: string;
  /**
   * Current status of the shift
   * @example "published"
   */
  status: "draft" | "published" | "active" | "completed" | "cancelled";
  /**
   * Total hours for this shift
   * @min 0
   * @example 8
   */
  totalHours: number;
  /**
   * Type of the shift
   * @example "morning"
   */
  type:
    | "morning"
    | "afternoon"
    | "evening"
    | "night"
    | "full_day"
    | "split"
    | "on_call"
    | "overtime";
  /**
   * Date when the shift was last updated
   * @format date-time
   * @example "2024-01-15T14:45:00Z"
   */
  updatedAt: string;
  /**
   * User ID who last updated this shift
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440006"
   */
  updatedBy?: string;
  /**
   * Weekend rate multiplier
   * @example 1.25
   */
  weekendRate?: number;
}

export interface ShiftRoleRequirementDto {
  /**
   * Maximum number of employees with this role
   * @min 0
   * @example 3
   */
  maxCount: number;
  /**
   * Minimum number of employees with this role
   * @min 0
   * @example 1
   */
  minCount: number;
  /**
   * Priority level for this role requirement (1 = lowest, 5 = highest)
   * @min 1
   * @max 5
   * @example 3
   */
  priority: number;
  /**
   * Required number of employees with this role
   * @min 0
   * @example 2
   */
  requiredCount: number;
  /**
   * Role ID for this requirement
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  roleId: string;
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
   * Address
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * Certifications
   * @example ["Nursing Training","First Aid"]
   */
  certifications?: string[];
  /**
   * City
   * @example "München"
   */
  city?: string;
  /**
   * Contract type
   * @example "full_time"
   */
  contractType?:
    | "full_time"
    | "part_time"
    | "contract"
    | "temporary"
    | "intern";
  /**
   * Country
   * @example "Deutschland"
   */
  country?: string;
  /**
   * Date of birth
   * @example "1985-03-15"
   */
  dateOfBirth?: string;
  /**
   * Employee email address
   * @example "anna.schneider@dialyse-praxis.de"
   */
  email?: string;
  /**
   * Emergency contact name
   * @example "Maria Schneider"
   */
  emergencyContactName?: string;
  /**
   * Emergency contact phone
   * @example "+49 89 1234-002"
   */
  emergencyContactPhone?: string;
  /**
   * Employee number
   * @example "EMP001"
   */
  employeeNumber?: string;
  /**
   * Employee first name
   * @example "Anna"
   */
  firstName?: string;
  /**
   * Hire date
   * @example "2020-01-15"
   */
  hireDate?: string;
  /**
   * Hourly rate
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Working hours per month
   * @min 1
   * @max 400
   * @example 160
   */
  hoursPerMonth?: number;
  /**
   * Working hours per week
   * @min 1
   * @max 60
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Is the employee active
   * @example true
   */
  isActive?: boolean;
  /**
   * Languages
   * @example ["German","English"]
   */
  languages?: string[];
  /**
   * Employee last name
   * @example "Schneider"
   */
  lastName?: string;
  /**
   * Location ID
   * @example "uuid-string"
   */
  locationId?: string;
  /**
   * Notes about the employee
   * @example "Experienced employee specialized in dialysis"
   */
  notes?: string;
  /**
   * Organization ID
   * @example "uuid-string"
   */
  organizationId?: string;
  /**
   * Overtime rate
   * @example 32.5
   */
  overtimeRate?: number;
  /**
   * Phone number
   * @example "+49 89 1234-001"
   */
  phoneNumber?: string;
  /**
   * Postal code
   * @example "80331"
   */
  postalCode?: string;
  /**
   * Primary role ID
   * @example "uuid-string"
   */
  primaryRoleId?: string;
  /**
   * Profile picture URL
   * @example "https://example.com/profile.jpg"
   */
  profilePictureUrl?: string;
  /**
   * Additional role IDs
   * @example ["uuid-string-1","uuid-string-2"]
   */
  roleIds?: string[];
  /**
   * Skills
   * @example ["Patient Care","Teamwork"]
   */
  skills?: string[];
  /**
   * Employee status
   * @example "active"
   */
  status?: "active" | "inactive" | "on_leave" | "terminated" | "suspended";
  /**
   * Supervisor ID
   * @example "uuid-string"
   */
  supervisorId?: string;
  /**
   * Termination date
   * @example "2023-12-31"
   */
  terminationDate?: string;
}

export interface UpdateLocationDto {
  /**
   * Accessibility features available
   * @example ["Rollstuhlzugang","Aufzug","Behindertengerechte Toiletten"]
   */
  accessibilityFeatures?: string[];
  /**
   * Street address
   * @maxLength 500
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * City name
   * @maxLength 100
   * @example "Berlin"
   */
  city?: string;
  /**
   * Short identifier code for location
   * @maxLength 100
   * @example "BER-01"
   */
  code?: string;
  /**
   * Country
   * @maxLength 100
   * @default "Germany"
   * @example "Germany"
   */
  country?: string;
  /**
   * Current capacity usage
   * @min 0
   * @example 35
   */
  currentCapacity?: number;
  /**
   * Description of the location
   * @maxLength 500
   * @example "Hauptstandort mit vollständiger Dialyse-Ausstattung"
   */
  description?: string;
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
   * Floor area in square meters
   * @example 250.5
   */
  floorArea?: number;
  /**
   * Whether the location is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * Latitude coordinate
   * @example 52.52
   */
  latitude?: number;
  /**
   * Longitude coordinate
   * @example 13.405
   */
  longitude?: number;
  /**
   * Manager email address
   * @maxLength 255
   * @example "max.mustermann@workshift.de"
   */
  managerEmail?: string;
  /**
   * Manager name
   * @maxLength 255
   * @example "Max Mustermann"
   */
  managerName?: string;
  /**
   * Manager phone number
   * @maxLength 20
   * @example "+49 30 12345679"
   */
  managerPhone?: string;
  /**
   * Maximum location capacity (number of people)
   * @min 1
   * @max 2000
   * @example 50
   */
  maxCapacity?: number;
  /**
   * Location name
   * @minLength 2
   * @maxLength 255
   * @example "Hauptstandort Berlin"
   */
  name?: string;
  /**
   * Number of beds
   * @min 0
   * @example 25
   */
  numberOfBeds?: number;
  /**
   * Number of rooms
   * @min 0
   * @example 12
   */
  numberOfRooms?: number;
  /** Operating hours for each day of the week */
  operatingHours?: OperatingHoursDto;
  /**
   * ID der Organisation
   * @example "uuid-string"
   */
  organizationId?: string;
  /**
   * Number of parking spaces
   * @min 0
   * @example 30
   */
  parkingSpaces?: number;
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
   * Safety features available
   * @example ["Brandmeldeanlage","Notausgang","Erste-Hilfe-Station"]
   */
  safetyFeatures?: string[];
  /**
   * Services provided at this location
   * @example ["Pflege","Beratung","Therapie"]
   */
  services?: string[];
  /**
   * State or region
   * @maxLength 100
   * @example "Berlin"
   */
  state?: string;
  /**
   * Location status
   * @example "active"
   */
  status?: "active" | "inactive" | "maintenance" | "closed";
  /**
   * Timezone for this location
   * @maxLength 50
   * @default "Europe/Berlin"
   * @example "Europe/Berlin"
   */
  timezone?: string;
}

export interface UpdateOrganizationDto {
  /**
   * Organization description
   * @example "Leading dialysis center in Berlin"
   */
  description?: string;
  /**
   * Enabled features
   * @example ["shift-planning","reporting"]
   */
  features?: string[];
  /**
   * Headquarters address
   * @example "Alexanderplatz 1"
   */
  headquartersAddress?: string;
  /**
   * Headquarters city
   * @example "Berlin"
   */
  headquartersCity?: string;
  /**
   * Headquarters country
   * @example "Germany"
   */
  headquartersCountry?: string;
  /**
   * Headquarters postal code
   * @example "10178"
   */
  headquartersPostalCode?: string;
  /**
   * Organization is active
   * @example true
   */
  isActive?: boolean;
  /**
   * Legal organization name
   * @example "Dialyse Zentrum Berlin GmbH"
   */
  legalName?: string;
  /**
   * Logo URL
   * @example "https://example.com/logo.png"
   */
  logoUrl?: string;
  /**
   * Maximum number of employees
   * @example 200
   */
  maxEmployees?: number;
  /**
   * Maximum number of locations
   * @example 20
   */
  maxLocations?: number;
  /**
   * Organization name
   * @example "Dialyse Zentrum Berlin"
   */
  name?: string;
  /**
   * Primary email address
   * @example "info@dialyse-berlin.de"
   */
  primaryEmail?: string;
  /**
   * Primary phone number
   * @example "+49 30 1234-0"
   */
  primaryPhone?: string;
  /**
   * Registration number
   * @example "HRB 12345"
   */
  registrationNumber?: string;
  /**
   * Organization settings
   * @example {"timezone":"Europe/Berlin"}
   */
  settings?: object;
  /**
   * Organization status
   * @example "active"
   */
  status?: "active" | "inactive" | "suspended" | "trial";
  /**
   * Subscription plan
   * @example "pro"
   */
  subscriptionPlan?: string;
  /**
   * Tax ID
   * @example "DE123456789"
   */
  taxId?: string;
  /**
   * Organization type
   * @example "medical_center"
   */
  type?:
    | "hospital"
    | "clinic"
    | "nursing_home"
    | "medical_center"
    | "pharmacy"
    | "other";
  /**
   * Organization website
   * @example "https://www.dialyse-berlin.de"
   */
  website?: string;
}

export interface UpdateRoleDto {
  /**
   * Can work on holidays
   * @example false
   */
  canWorkHolidays?: boolean;
  /**
   * Can work night shifts
   * @example true
   */
  canWorkNights?: boolean;
  /**
   * Can work weekend shifts
   * @example true
   */
  canWorkWeekends?: boolean;
  /**
   * Color code for UI display (Hex)
   * @example "#1976d2"
   */
  colorCode?: string;
  /**
   * Created by (User ID)
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  createdBy?: string;
  /**
   * Role description
   * @example "Qualified specialist for performing dialysis treatments"
   */
  description?: string;
  /**
   * Hourly rate in Euro
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Role is active
   * @example true
   */
  isActive?: boolean;
  /**
   * Maximum consecutive working days
   * @example 5
   */
  maxConsecutiveDays?: number;
  /**
   * Maximum monthly working hours
   * @example 160
   */
  maxMonthlyHours?: number;
  /**
   * Maximum weekly working hours
   * @example 40
   */
  maxWeeklyHours?: number;
  /**
   * Minimum professional experience in months
   * @example 12
   */
  minExperienceMonths?: number;
  /**
   * Minimum rest time between shifts in hours
   * @example 11
   */
  minRestHours?: number;
  /**
   * Role name
   * @example "Dialysis Specialist"
   */
  name?: string;
  /**
   * Organization ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  organizationId?: string;
  /**
   * Overtime rate in Euro
   * @example 31.88
   */
  overtimeRate?: number;
  /**
   * Permissions
   * @example ["view_patient_data","manage_dialysis_machines"]
   */
  permissions?: string[];
  /**
   * Priority level of the role (1-10, higher = more important)
   * @example 5
   */
  priorityLevel?: number;
  /**
   * Required certifications
   * @example ["Basic Dialysis Course","Hygiene Training"]
   */
  requiredCertifications?: string[];
  /**
   * Required skills
   * @example ["Patient Care","Machine Operation"]
   */
  requiredSkills?: string[];
  /**
   * Role status
   * @example "active"
   */
  status?: "active" | "inactive" | "deprecated";
  /**
   * Role type
   * @example "specialist"
   */
  type?:
    | "specialist"
    | "assistant"
    | "shift_leader"
    | "nurse"
    | "nurse_manager"
    | "helper"
    | "doctor"
    | "technician"
    | "administrator"
    | "cleaner"
    | "security"
    | "other";
  /**
   * Updated by (User ID)
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  updatedBy?: string;
}

export interface UpdateShiftDto {
  /**
   * Break duration in minutes
   * @min 0
   * @default 30
   * @example 30
   */
  breakDuration?: number;
  /**
   * Color code for UI display (hex format)
   * @pattern ^#[0-9A-F]{6}$
   * @example "#FF5722"
   */
  colorCode?: string;
  /**
   * User ID who is creating this shift
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440005"
   */
  createdBy?: string;
  /**
   * Description of the shift
   * @maxLength 500
   * @example "Regular morning shift covering basic operations"
   */
  description?: string;
  /**
   * End time of the shift
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "16:00"
   */
  endTime?: string;
  /**
   * Holiday rate multiplier
   * @min 1
   * @example 2
   */
  holidayRate?: number;
  /**
   * Whether this shift is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * Whether this shift is on a holiday
   * @default false
   * @example false
   */
  isHoliday?: boolean;
  /**
   * Whether this shift counts as overtime
   * @default false
   * @example false
   */
  isOvertime?: boolean;
  /**
   * Whether this is a recurring shift
   * @default false
   * @example false
   */
  isRecurring?: boolean;
  /**
   * Whether this shift is on a weekend
   * @default false
   * @example false
   */
  isWeekend?: boolean;
  /**
   * Location ID where this shift takes place
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440002"
   */
  locationId?: string;
  /**
   * Maximum number of employees allowed
   * @min 1
   * @default 10
   * @example 5
   */
  maxEmployees?: number;
  /**
   * Minimum number of employees required
   * @min 1
   * @default 1
   * @example 2
   */
  minEmployees?: number;
  /**
   * Name of the shift
   * @maxLength 100
   * @example "Morning Shift"
   */
  name?: string;
  /**
   * Additional notes for this shift
   * @example "Special requirements: Extra attention to patient in room 204"
   */
  notes?: string;
  /**
   * Organization ID this shift belongs to
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  organizationId?: string;
  /**
   * Overtime rate multiplier
   * @min 1
   * @example 1.5
   */
  overtimeRate?: number;
  /**
   * Priority level of the shift
   * @default 2
   * @example 2
   */
  priority?: 1 | 2 | 3 | 4 | 5;
  /**
   * End date for recurrence
   * @format date
   * @example "2024-12-31"
   */
  recurrenceEndDate?: string;
  /**
   * Recurrence pattern (e.g., weekly, monthly)
   * @example "weekly"
   */
  recurrencePattern?: string;
  /**
   * Required certifications for this shift
   * @default []
   * @example ["Nursing License","BLS Certification"]
   */
  requiredCertifications?: string[];
  /**
   * Required skills for this shift
   * @default []
   * @example ["CPR","First Aid","Patient Care"]
   */
  requiredSkills?: string[];
  /**
   * Role requirements for this shift
   * @default []
   * @example [{"roleId":"550e8400-e29b-41d4-a716-446655440004","requiredCount":2,"minCount":1,"maxCount":3,"priority":3}]
   */
  roleRequirements?: ShiftRoleRequirementDto[];
  /**
   * Date when the shift takes place
   * @format date
   * @example "2024-01-15"
   */
  shiftDate?: string;
  /**
   * Shift plan ID this shift belongs to (optional)
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440003"
   */
  shiftPlanId?: string;
  /**
   * Start time of the shift
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "08:00"
   */
  startTime?: string;
  /**
   * Current status of the shift
   * @default "draft"
   * @example "draft"
   */
  status?: "draft" | "published" | "active" | "completed" | "cancelled";
  /**
   * Total hours for this shift
   * @min 0
   * @example 8
   */
  totalHours?: number;
  /**
   * Type of the shift
   * @example "morning"
   */
  type?:
    | "morning"
    | "afternoon"
    | "evening"
    | "night"
    | "full_day"
    | "split"
    | "on_call"
    | "overtime";
  /**
   * User ID who is updating this shift
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440006"
   */
  updatedBy?: string;
  /**
   * Weekend rate multiplier
   * @min 1
   * @example 1.25
   */
  weekendRate?: number;
}

export interface UpdateShiftPlanDto {
  /**
   * Approval status
   * @example "pending"
   */
  approvalStatus?: "pending" | "approved" | "rejected" | "needs_revision";
  /**
   * Number of constraint violations
   * @min 0
   * @example 2
   */
  constraintViolations?: number;
  /**
   * Coverage percentage
   * @min 0
   * @max 100
   * @example 95.5
   */
  coveragePercentage?: number;
  /**
   * ID of user who created this shift plan
   * @example "uuid-string"
   */
  createdBy?: string;
  /**
   * Shift plan description
   * @maxLength 500
   * @example "Christmas period shift plan with increased staffing requirements"
   */
  description?: string;
  /**
   * Time taken to generate this shift plan in milliseconds
   * @example 15000
   */
  generationTimeMs?: number;
  /**
   * Whether this shift plan is published
   * @default false
   * @example false
   */
  isPublished?: boolean;
  /**
   * Metadata for the shift plan
   * @example {"generatedBy":"system","version":"1.0"}
   */
  metadata?: Record<string, any>;
  /**
   * Month for the shift plan (1-12)
   * @min 1
   * @max 12
   * @example 12
   */
  month?: number;
  /**
   * Shift plan name
   * @maxLength 255
   * @example "December 2024 Shift Plan"
   */
  name?: string;
  /**
   * Optimization level used for this shift plan
   * @example "standard"
   */
  optimizationLevel?: string;
  /**
   * Organization ID
   * @example "uuid-string"
   */
  organizationId?: string;
  /**
   * Monthly shift plan data structure
   * @example {"01.12.2024":{"F":["employee-uuid-1","employee-uuid-2"],"S":["employee-uuid-3"],"FS":["employee-uuid-4"]},"02.12.2024":{"F":["employee-uuid-2","employee-uuid-5"],"S":["employee-uuid-1"]}}
   */
  planData?: Record<string, any>;
  /**
   * Planning algorithm used for this shift plan
   * @example "enhanced_backtracking"
   */
  planningAlgorithm?: string;
  /**
   * Number of planning attempts made
   * @example 3
   */
  planningAttempts?: number;
  /**
   * End date of planning period
   * @example "2024-12-31"
   */
  planningPeriodEnd?: string;
  /**
   * Start date of planning period
   * @example "2024-12-01"
   */
  planningPeriodStart?: string;
  /**
   * Status of the shift plan
   * @example "draft"
   */
  status?:
    | "draft"
    | "in_review"
    | "approved"
    | "published"
    | "active"
    | "completed"
    | "cancelled";
  /**
   * Total number of employees in the plan
   * @min 0
   * @example 25
   */
  totalEmployees?: number;
  /**
   * Total hours in the shift plan
   * @example 1200.5
   */
  totalHours?: number;
  /**
   * Total number of shifts in the plan
   * @min 0
   * @example 150
   */
  totalShifts?: number;
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

export interface UpdateUserDto {
  /**
   * User email address
   * @example "john.smith@example.com"
   */
  email?: string;
  /**
   * Email address verified
   * @example true
   */
  emailVerified?: boolean;
  /**
   * User first name
   * @example "John"
   */
  firstName?: string;
  /**
   * User last name
   * @example "Smith"
   */
  lastName?: string;
  /**
   * Organization IDs to assign the user to
   * @example ["uuid-org-1","uuid-org-2"]
   */
  organizationIds?: string[];
  /**
   * New user password (minimum 8 characters)
   * @example "NewSecurePassword123!"
   */
  password?: string;
  /**
   * User permissions
   * @example ["read:shifts","write:shifts","manage:users"]
   */
  permissions?: string[];
  /**
   * Phone number
   * @example "+1 555 123-4567"
   */
  phoneNumber?: string;
  /**
   * User preferences
   * @example {"theme":"dark","language":"en"}
   */
  preferences?: object;
  /**
   * Profile picture URL
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * User role
   * @example "employee"
   */
  role?:
    | "super_admin"
    | "organization_admin"
    | "manager"
    | "planner"
    | "employee"
    | "viewer";
  /**
   * User status
   * @example "active"
   */
  status?: "active" | "inactive" | "suspended" | "pending";
  /**
   * Two-factor authentication enabled
   * @example false
   */
  twoFactorEnabled?: boolean;
}

export interface UserResponseDto {
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-15T08:00:00Z"
   */
  createdAt?: string;
  /**
   * Deletion date (if deleted)
   * @format date-time
   * @example null
   */
  deletedAt?: string;
  /**
   * User email address
   * @example "john.smith@example.com"
   */
  email: string;
  /**
   * Email address verified
   * @example true
   */
  emailVerified: boolean;
  /**
   * User first name
   * @example "John"
   */
  firstName: string;
  /**
   * User full name
   * @example "John Smith"
   */
  fullName: string;
  /**
   * Unique user ID
   * @example "uuid-string"
   */
  id: string;
  /**
   * Is user active
   * @example true
   */
  isActive: boolean;
  /**
   * Last login timestamp
   * @format date-time
   * @example "2023-12-01T10:30:00Z"
   */
  lastLoginAt?: string;
  /**
   * User last name
   * @example "Smith"
   */
  lastName: string;
  /**
   * User organization IDs list
   * @example ["uuid-org-1","uuid-org-2"]
   */
  organizationIds: string[];
  /**
   * User permissions
   * @example ["read:shifts","write:shifts"]
   */
  permissions: string[];
  /**
   * Phone number
   * @example "+1 555 123-4567"
   */
  phoneNumber?: string;
  /**
   * User preferences
   * @example {"theme":"dark","language":"en"}
   */
  preferences: object;
  /**
   * Profile picture URL
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * User role
   * @example "employee"
   */
  role:
    | "super_admin"
    | "organization_admin"
    | "manager"
    | "planner"
    | "employee"
    | "viewer";
  /**
   * User status
   * @example "active"
   */
  status: "active" | "inactive" | "suspended" | "pending";
  /**
   * Two-factor authentication enabled
   * @example false
   */
  twoFactorEnabled: boolean;
  /**
   * Last update date
   * @format date-time
   * @example "2023-12-01T14:30:00Z"
   */
  updatedAt?: string;
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
