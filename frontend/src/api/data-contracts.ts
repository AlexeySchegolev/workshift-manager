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

export interface AuthResponseDto {
  /**
   * JWT access token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  access_token: string;
  /** Authenticated user information */
  user: AuthUserDto;
}

export interface AuthUserDto {
  /**
   * User email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * User first name
   * @example "John"
   */
  firstName: string;
  /**
   * User unique identifier
   * @example "uuid-123"
   */
  id: string;
  /**
   * User last name
   * @example "Doe"
   */
  lastName: string;
  /**
   * User organization (simplified)
   * @example {"id":"org-uuid-1","name":"Hospital Berlin"}
   */
  organization: {
    /** Organization ID */
    id?: string;
    /** Organization name */
    name?: string;
  };
  /**
   * User phone number
   * @example "+1234567890"
   */
  phoneNumber: string;
  /**
   * User profile picture URL
   * @example "https://example.com/profile.jpg"
   */
  profilePictureUrl: string;
  /**
   * User role in the system
   * @example "employee"
   */
  role: "super_admin" | "organization_admin" | "employee";
}

export interface CreateEmployeeAbsenceDto {
  /**
   * Type of absence
   * @example "vacation"
   */
  absenceType: "vacation" | "sick_leave" | "other";
  /**
   * Number of days for absence
   * @example 3
   */
  daysCount: number;
  /**
   * Employee UUID
   * @format uuid
   */
  employeeId: string;
  /**
   * End date of absence
   * @format date
   * @example "2025-09-17"
   */
  endDate: string;
  /**
   * Number of hours for absence
   * @example 24
   */
  hoursCount?: number;
  /**
   * Start date of absence
   * @format date
   * @example "2025-09-15"
   */
  startDate: string;
}

export interface CreateEmployeeDto {
  /**
   * Address
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * City
   * @example "München"
   */
  city?: string;
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
   * Whether the employee is active
   * @default true
   * @example true
   */
  isActive?: boolean;
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
   * Organization ID
   * @example "uuid-string"
   */
  organizationId: string;
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
   * Additional role IDs
   * @example ["uuid-string-1","uuid-string-2"]
   */
  roleIds?: string[];
  /**
   * Termination date
   * @example "2023-12-31"
   */
  terminationDate?: string;
}

export interface CreateLocationDto {
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
   * Email address
   * @maxLength 255
   * @example "berlin@workshift.de"
   */
  email?: string;
  /**
   * Whether the location is active
   * @default true
   * @example true
   */
  isActive?: boolean;
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
   * ID der Organisation
   * @example "uuid-string"
   */
  organizationId: string;
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
   * State or region
   * @maxLength 100
   * @example "Berlin"
   */
  state?: string;
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
}

export interface CreateRoleDto {
  /**
   * Created by (User ID)
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  createdBy?: string;
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
}

export interface CreateShiftDto {
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
   * Whether this shift is active
   * @default true
   * @example true
   */
  isActive: boolean;
  /**
   * Location ID where this shift takes place
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440002"
   */
  locationId: string;
  /**
   * Name of the shift
   * @maxLength 100
   * @example "Morning Shift"
   */
  name: string;
  /**
   * Organization ID this shift belongs to
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  organizationId: string;
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
}

export interface CreateShiftPlanDto {
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
   * Location ID
   * @example "uuid-string"
   */
  locationId: string;
  /**
   * Month for the shift plan (1-12)
   * @min 1
   * @max 12
   * @example 12
   */
  month: number;
  /**
   * Shift plan name
   * @maxLength 255
   * @example "December 2024 Shift Plan"
   */
  name: string;
  /**
   * Organization ID
   * @example "uuid-string"
   */
  organizationId: string;
  /**
   * End date of planning period
   * @example "2024-12-31"
   */
  planningPeriodEnd: string;
  /**
   * Start date of planning period
   * @example "2024-12-01"
   */
  planningPeriodStart: string;
  /**
   * Year for the shift plan
   * @min 2020
   * @max 2030
   * @example 2024
   */
  year: number;
}

export interface CreateUserDto {
  /**
   * User email address
   * @example "john.smith@example.com"
   */
  email: string;
  /**
   * User first name
   * @example "John"
   */
  firstName: string;
  /**
   * Whether the user is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * User last name
   * @example "Smith"
   */
  lastName: string;
  /**
   * Organization ID to assign the user to
   * @example "uuid-org-1"
   */
  organizationId: string;
  /**
   * User password (minimum 8 characters)
   * @example "SecurePassword123!"
   */
  password: string;
  /**
   * Phone number
   * @example "+1 555 123-4567"
   */
  phoneNumber?: string;
  /**
   * Profile picture URL
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * User role
   * @example "employee"
   */
  role?: "super_admin" | "organization_admin" | "employee";
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

export interface EmployeeAbsenceResponseDto {
  /** Type of absence */
  absenceType: "vacation" | "sick_leave" | "other";
  /**
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * UUID of creator
   * @format uuid
   */
  createdBy?: string;
  /** Number of days for absence */
  daysCount: number;
  /**
   * Deletion timestamp
   * @format date-time
   */
  deletedAt?: string;
  /** Duration in days (calculated) */
  duration: number;
  /** Employee information */
  employee?: {
    /** @format email */
    email?: string;
    firstName?: string;
    /** @format uuid */
    id?: string;
    lastName?: string;
    primaryRole?: {
      displayName?: string;
      /** @format uuid */
      id?: string;
      name?: string;
    };
  };
  /**
   * Employee UUID
   * @format uuid
   */
  employeeId: string;
  /**
   * End date of absence
   * @format date-time
   */
  endDate: string;
  /** Number of hours for absence */
  hoursCount?: number;
  /**
   * Absence UUID
   * @format uuid
   */
  id: string;
  /** Whether absence is currently active */
  isActive: boolean;
  /**
   * Start date of absence
   * @format date-time
   */
  startDate: string;
  /**
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
  /**
   * UUID of last updater
   * @format uuid
   */
  updatedBy?: string;
}

export interface EmployeeResponseDto {
  /**
   * Address
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * City
   * @example "München"
   */
  city?: string;
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
   * Organization ID
   * @example "uuid-string"
   */
  organizationId: string;
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
  /** All roles of the employee */
  roles?: RoleResponseDto[];
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
}

export interface ExcelExportMetadataDto {
  /** Export options used */
  exportOptions: ExcelExportOptionsDto;
  /**
   * Total number of planning days
   * @example 31
   */
  totalDays: number;
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

export interface LocationResponseDto {
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
   * Deletion timestamp (soft delete)
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  deletedAt?: string;
  /**
   * Email address
   * @maxLength 255
   * @example "berlin@company.com"
   */
  email?: string;
  /** Employees assigned to this location */
  employees: EmployeeResponseDto[];
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
   * Organization ID
   * @example "uuid-string"
   */
  organizationId: string;
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
   * State or region
   * @example "Berlin"
   */
  state?: string;
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

export interface LoginDto {
  /**
   * User email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * User password (minimum 8 characters)
   * @example "password123"
   */
  password: string;
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
   * Updated at
   * @format date-time
   * @example "2024-02-01T12:00:00Z"
   */
  updatedAt?: string;
}

export interface RegisterDto {
  /**
   * User email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * User first name
   * @example "John"
   */
  firstName: string;
  /**
   * User last name
   * @example "Doe"
   */
  lastName: string;
  /**
   * Organization name to be created for the user
   * @example "Dialyse Zentrum Berlin"
   */
  organizationName: string;
  /**
   * User password (minimum 8 characters, must contain uppercase, lowercase, number, and special character)
   * @example "Password123!"
   */
  password: string;
  /**
   * User phone number
   * @example "+1234567890"
   */
  phoneNumber?: string;
  /**
   * User role in the system
   * @example "employee"
   */
  role?: "super_admin" | "organization_admin" | "employee";
}

export interface RegisterResponseDto {
  /**
   * Success message
   * @example "User registered successfully"
   */
  message: string;
  /** Created user information */
  user: AuthUserDto;
}

export interface RoleResponseDto {
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
   * Display name of the role (computed)
   * @example "Dialysis Specialist (specialist)"
   */
  displayName: string;
  /**
   * Unique role ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Role is available (computed)
   * @example true
   */
  isAvailable: boolean;
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

export interface ShiftPlanResponseDto {
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
   * Shift plan description
   * @example "Christmas period shift plan with increased staffing requirements"
   */
  description?: string;
  /**
   * Unique identifier for the shift plan
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string;
  /**
   * Location ID
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  locationId: string;
  /**
   * Month for the shift plan (1-12)
   * @min 1
   * @max 12
   * @example 12
   */
  month: number;
  /**
   * Shift plan name
   * @example "December 2024 Shift Plan"
   */
  name: string;
  /**
   * Organization ID
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  organizationId: string;
  /**
   * End date of planning period
   * @format date-time
   * @example "2024-12-31"
   */
  planningPeriodEnd: string;
  /**
   * Start date of planning period
   * @format date-time
   * @example "2024-12-01"
   */
  planningPeriodStart: string;
  /**
   * Date when the shift plan was last updated
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  updatedAt: string;
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
   * End time of the shift
   * @pattern ^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$
   * @example "16:00"
   */
  endTime: string;
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
  /** Location where this shift takes place */
  location?: LocationResponseDto;
  /**
   * Location ID where this shift takes place
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440002"
   */
  locationId: string;
  /**
   * Name of the shift
   * @maxLength 100
   * @example "Morning Shift"
   */
  name: string;
  /** Organization this shift belongs to */
  organization?: OrganizationResponseDto;
  /**
   * Organization ID this shift belongs to
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  organizationId: string;
  /** Required roles for this shift */
  requiredRoles?: RoleResponseDto[];
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

export type UpdateEmployeeAbsenceDto = object;

export interface UpdateEmployeeDto {
  /**
   * Address
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * City
   * @example "München"
   */
  city?: string;
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
   * Is the employee active
   * @default true
   * @example true
   */
  isActive?: boolean;
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
   * Organization ID
   * @example "uuid-string"
   */
  organizationId?: string;
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
   * Additional role IDs
   * @example ["uuid-string-1","uuid-string-2"]
   */
  roleIds?: string[];
  /**
   * Termination date
   * @example "2023-12-31"
   */
  terminationDate?: string;
}

export interface UpdateLocationDto {
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
   * Email address
   * @maxLength 255
   * @example "berlin@workshift.de"
   */
  email?: string;
  /**
   * Whether the location is active
   * @default true
   * @example true
   */
  isActive?: boolean;
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
   * ID der Organisation
   * @example "uuid-string"
   */
  organizationId?: string;
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
   * State or region
   * @maxLength 100
   * @example "Berlin"
   */
  state?: string;
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
}

export interface UpdateRoleDto {
  /**
   * Created by (User ID)
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  createdBy?: string;
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
   * Updated by (User ID)
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  updatedBy?: string;
}

export interface UpdateShiftDto {
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
   * Whether this shift is active
   * @default true
   * @example true
   */
  isActive?: boolean;
  /**
   * Location ID where this shift takes place
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440002"
   */
  locationId?: string;
  /**
   * Name of the shift
   * @maxLength 100
   * @example "Morning Shift"
   */
  name?: string;
  /**
   * Organization ID this shift belongs to
   * @format uuid
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  organizationId?: string;
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
}

export interface UpdateShiftPlanDto {
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
   * Location ID
   * @example "uuid-string"
   */
  locationId?: string;
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
   * Organization ID
   * @example "uuid-string"
   */
  organizationId?: string;
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
   * Year for the shift plan
   * @min 2020
   * @max 2030
   * @example 2024
   */
  year?: number;
}

export interface UpdateUserDto {
  /**
   * User email address
   * @example "john.smith@example.com"
   */
  email?: string;
  /**
   * User first name
   * @example "John"
   */
  firstName?: string;
  /**
   * Whether the user is active
   * @example true
   */
  isActive?: boolean;
  /**
   * User last name
   * @example "Smith"
   */
  lastName?: string;
  /**
   * Organization ID to assign the user to
   * @example "uuid-org-1"
   */
  organizationId?: string;
  /**
   * New user password (minimum 8 characters)
   * @example "NewSecurePassword123!"
   */
  password?: string;
  /**
   * Phone number
   * @example "+1 555 123-4567"
   */
  phoneNumber?: string;
  /**
   * Profile picture URL
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * User role
   * @example "employee"
   */
  role?: "super_admin" | "organization_admin" | "employee";
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
   * Organization ID
   * @example "uuid-org-1"
   */
  organizationId: string;
  /**
   * Phone number
   * @example "+1 555 123-4567"
   */
  phoneNumber?: string;
  /**
   * Profile picture URL
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * User role
   * @example "employee"
   */
  role: "super_admin" | "organization_admin" | "employee";
  /**
   * Last update date
   * @format date-time
   * @example "2023-12-01T14:30:00Z"
   */
  updatedAt?: string;
}
