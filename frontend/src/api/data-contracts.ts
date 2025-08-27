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
   * Spalten-Überschrift
   * @example "Überstunden"
   */
  header: string;
  /**
   * Spalten-Schlüssel
   * @example "overtime_hours"
   */
  key: string;
  /**
   * Spaltenbreite in Excel
   * @min 5
   * @max 50
   * @example 15
   */
  width?: number;
}

export interface AdvancedPlanningOptionsDto {
  /**
   * Planning algorithm to use
   * @example "enhanced_backtracking"
   */
  algorithm: "enhanced_backtracking" | "constraint_satisfaction" | "mixed";
  /**
   * Whether to allow overtime assignments
   * @example false
   */
  allowOvertime: boolean;
  /**
   * Whether to automatically retry with relaxed constraints on failure
   * @default true
   */
  autoRetryWithRelaxedConstraints?: boolean;
  /**
   * Maximum consecutive working days allowed
   * @min 1
   * @max 14
   * @example 5
   */
  consecutiveDaysLimit: number;
  /** Constraint weights for different types of rules */
  constraintWeights?: ConstraintWeightsDto;
  /** Custom planning parameters as key-value pairs */
  customParameters?: object;
  /**
   * Strategy for sorting employees during planning
   * @example "workload_balancing"
   */
  employeeSortingStrategy:
    | "role_priority"
    | "workload_balancing"
    | "rotation_based";
  /**
   * Whether to enable detailed logging during planning
   * @default false
   */
  enableDetailedLogging?: boolean;
  /** Employee IDs to exclude from planning */
  excludedEmployeeIds?: string[];
  /** Location IDs to include in planning */
  includedLocationIds?: string[];
  /**
   * Maximum number of planning attempts
   * @min 1
   * @max 10
   * @example 3
   */
  maxPlanningAttempts: number;
  /**
   * Level of optimization to apply
   * @example "standard"
   */
  optimizationLevel: "basic" | "standard" | "advanced";
  /**
   * Timeout for planning operation in milliseconds
   * @min 10000
   * @max 600000
   * @default 300000
   */
  planningTimeoutMs?: number;
  /**
   * Whether to validate constraints before starting planning
   * @default true
   */
  preValidateConstraints?: boolean;
  /** Employee IDs to prioritize in planning */
  prioritizedEmployeeIds?: string[];
  /**
   * Mode for distributing Saturday shifts
   * @example "fair"
   */
  saturdayDistributionMode: "fair" | "strict" | "flexible";
  /**
   * Whether to apply strict constraint checking
   * @example true
   */
  strictMode: boolean;
  /**
   * Flexibility percentage for weekly hours (0.0 to 1.0)
   * @min 0
   * @max 1
   * @example 0.15
   */
  weeklyHoursFlexibility: number;
}

export interface BulkValidationRequestDto {
  /** Whether to generate recommendations */
  generateRecommendations?: boolean;
  /** Whether to include detailed violation context */
  includeDetailedContext?: boolean;
  /** Maximum violations to return per plan */
  maxViolationsPerPlan?: number;
  /** Minimum severity level to include (1-5) */
  minimumSeverityLevel?: number;
  /** Validation rules to apply (empty means all) */
  ruleCodesToApply?: string[];
  /** Shift plan IDs to validate */
  shiftPlanIds: string[];
}

export interface ConstraintValidationResultDto {
  /** Whether plan can be published despite violations */
  canPublishWithViolations?: boolean;
  /** Confidence level of validation results (0-100) */
  confidenceLevel?: number;
  /** Critical issues that prevent plan execution */
  criticalIssues?: string[];
  /** Hard constraint violations (must be fixed) */
  hardViolations: ConstraintViolationDto[];
  /** Informational messages */
  informationalMessages?: ConstraintViolationDto[];
  /** Whether the overall validation passed */
  isValid: boolean;
  /** Additional validation metadata */
  metadata?: object;
  /** Overall validation score (0-100) */
  overallScore: number;
  /** Recommendations for improvement */
  recommendations: ValidationRecommendationDto[];
  /** Validation rules version used */
  rulesVersion?: string;
  /** Soft constraint violations (should be fixed) */
  softViolations: ConstraintViolationDto[];
  /** Validation statistics */
  statistics: ValidationStatisticsDto;
  /** Validation summary for quick overview */
  summary?: string;
  /** Validation duration in milliseconds */
  validationDurationMs: number;
  /** Timestamp when validation was performed */
  validationTimestamp: string;
  /** Warnings (minor issues) */
  warnings: ConstraintViolationDto[];
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

export interface ConstraintViolationsSummaryDto {
  /**
   * Average severity score
   * @example 2.4
   */
  averageSeverity?: number;
  /**
   * Employees with violations count
   * @example 3
   */
  employeesWithViolations: number;
  /**
   * Number of hard constraint violations
   * @example 0
   */
  hardViolations: number;
  /** Most common violation type */
  mostCommonViolationType: string;
  /**
   * Number of soft constraint violations
   * @example 3
   */
  softViolations: number;
  /**
   * Total number of violations
   * @example 5
   */
  totalViolations: number;
  /** Violations by category */
  violationsByCategory: object;
  /**
   * Number of warnings
   * @example 2
   */
  warnings: number;
}

export interface ConstraintWeightsDto {
  /**
   * Weight for consecutive days constraints
   * @min 0
   * @max 5
   * @default 2
   */
  consecutiveDays?: number;
  /**
   * Weight for overtime constraints
   * @min 0
   * @max 5
   * @default 1.2
   */
  overtime?: number;
  /**
   * Weight for preference satisfaction
   * @min 0
   * @max 5
   * @default 0.8
   */
  preferenceSatisfaction?: number;
  /**
   * Weight for role requirements constraints
   * @min 0
   * @max 5
   * @default 3
   */
  roleRequirements?: number;
  /**
   * Weight for Saturday distribution constraints
   * @min 0
   * @max 5
   * @default 1.5
   */
  saturdayDistribution?: number;
  /**
   * Weight for workload balance constraints
   * @min 0
   * @max 5
   * @default 1
   */
  workloadBalance?: number;
}

export interface CreateEmployeeDto {
  /**
   * Adresse
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * Zertifizierungen
   * @example ["Krankenpflege-Ausbildung","Erste Hilfe"]
   */
  certifications?: string[];
  /**
   * Stadt
   * @example "München"
   */
  city?: string;
  /**
   * Vertragstyp
   * @example "full_time"
   */
  contractType?:
    | "full_time"
    | "part_time"
    | "contract"
    | "temporary"
    | "intern";
  /**
   * Land
   * @example "Deutschland"
   */
  country?: string;
  /**
   * Geburtsdatum
   * @example "1985-03-15"
   */
  dateOfBirth?: string;
  /**
   * E-Mail-Adresse des Mitarbeiters
   * @example "anna.schneider@dialyse-praxis.de"
   */
  email: string;
  /**
   * Name des Notfallkontakts
   * @example "Maria Schneider"
   */
  emergencyContactName?: string;
  /**
   * Telefonnummer des Notfallkontakts
   * @example "+49 89 1234-002"
   */
  emergencyContactPhone?: string;
  /**
   * Mitarbeiternummer
   * @example "EMP001"
   */
  employeeNumber: string;
  /**
   * Vorname des Mitarbeiters
   * @example "Anna"
   */
  firstName: string;
  /**
   * Einstellungsdatum
   * @example "2020-01-15"
   */
  hireDate: string;
  /**
   * Stundenlohn
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Arbeitsstunden pro Monat
   * @min 1
   * @max 400
   * @example 160
   */
  hoursPerMonth: number;
  /**
   * Arbeitsstunden pro Woche
   * @min 1
   * @max 60
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Sprachen
   * @example ["Deutsch","Englisch"]
   */
  languages?: string[];
  /**
   * Nachname des Mitarbeiters
   * @example "Schneider"
   */
  lastName: string;
  /**
   * ID des Standorts
   * @example "uuid-string"
   */
  locationId?: string;
  /**
   * Notizen zum Mitarbeiter
   * @example "Erfahrener Mitarbeiter mit Spezialisierung auf Dialyse"
   */
  notes?: string;
  /**
   * ID der Organisation
   * @example "uuid-string"
   */
  organizationId: string;
  /**
   * Überstundenlohn
   * @example 32.5
   */
  overtimeRate?: number;
  /**
   * Telefonnummer
   * @example "+49 89 1234-001"
   */
  phoneNumber?: string;
  /**
   * Postleitzahl
   * @example "80331"
   */
  postalCode?: string;
  /**
   * ID der Hauptrolle
   * @example "uuid-string"
   */
  primaryRoleId?: string;
  /**
   * URL des Profilbilds
   * @example "https://example.com/profile.jpg"
   */
  profilePictureUrl?: string;
  /**
   * Fähigkeiten
   * @example ["Patientenbetreuung","Teamarbeit"]
   */
  skills?: string[];
  /**
   * Status des Mitarbeiters
   * @example "active"
   */
  status?: "active" | "inactive" | "on_leave" | "terminated" | "suspended";
  /**
   * ID des Vorgesetzten
   * @example "uuid-string"
   */
  supervisorId?: string;
  /**
   * Kündigungsdatum
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
   * Beschreibung der Organisation
   * @example "Führendes Dialysezentrum in Berlin mit modernen Geräten"
   */
  description?: string;
  /**
   * Aktivierte Features
   * @example ["shift-planning","reporting"]
   */
  features?: string[];
  /**
   * Hauptsitz-Adresse
   * @example "Alexanderplatz 1"
   */
  headquartersAddress?: string;
  /**
   * Hauptsitz-Stadt
   * @example "Berlin"
   */
  headquartersCity?: string;
  /**
   * Hauptsitz-Land
   * @example "Deutschland"
   */
  headquartersCountry?: string;
  /**
   * Hauptsitz-Postleitzahl
   * @example "10178"
   */
  headquartersPostalCode?: string;
  /**
   * Organisation ist aktiv
   * @example true
   */
  isActive?: boolean;
  /**
   * Rechtlicher Name der Organisation
   * @example "Dialyse Zentrum Berlin GmbH"
   */
  legalName?: string;
  /**
   * URL zum Logo
   * @example "https://example.com/logo.png"
   */
  logoUrl?: string;
  /**
   * Maximale Anzahl Mitarbeiter
   * @example 50
   */
  maxEmployees?: number;
  /**
   * Maximale Anzahl Standorte
   * @example 5
   */
  maxLocations?: number;
  /**
   * Name der Organisation
   * @example "Dialyse Zentrum Berlin"
   */
  name: string;
  /**
   * Haupt-E-Mail-Adresse
   * @example "info@dialyse-berlin.de"
   */
  primaryEmail?: string;
  /**
   * Haupttelefonnummer
   * @example "+49 30 1234-0"
   */
  primaryPhone?: string;
  /**
   * Registrierungsnummer
   * @example "HRB 12345"
   */
  registrationNumber?: string;
  /**
   * Organisationseinstellungen
   * @example {"timezone":"Europe/Berlin","currency":"EUR"}
   */
  settings?: object;
  /**
   * Status der Organisation
   * @example "trial"
   */
  status?: "active" | "inactive" | "suspended" | "trial";
  /**
   * Abonnement-Plan
   * @example "basic"
   */
  subscriptionPlan?: string;
  /**
   * Steuernummer
   * @example "DE123456789"
   */
  taxId?: string;
  /**
   * Typ der Organisation
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
   * Website der Organisation
   * @example "https://www.dialyse-berlin.de"
   */
  website?: string;
}

export interface CreateRoleDto {
  /**
   * Kann an Feiertagen arbeiten
   * @example false
   */
  canWorkHolidays?: boolean;
  /**
   * Kann Nachtschichten arbeiten
   * @example true
   */
  canWorkNights?: boolean;
  /**
   * Kann Wochenendschichten arbeiten
   * @example true
   */
  canWorkWeekends?: boolean;
  /**
   * Farbcode für UI-Anzeige (Hex)
   * @example "#1976d2"
   */
  colorCode?: string;
  /**
   * Erstellt von (Benutzer-ID)
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  createdBy?: string;
  /**
   * Beschreibung der Rolle
   * @example "Qualifizierte Fachkraft für die Durchführung von Dialysebehandlungen"
   */
  description?: string;
  /**
   * Stundensatz in Euro
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Rolle ist aktiv
   * @example true
   */
  isActive?: boolean;
  /**
   * Maximale aufeinanderfolgende Arbeitstage
   * @example 5
   */
  maxConsecutiveDays?: number;
  /**
   * Maximale monatliche Arbeitszeit
   * @example 160
   */
  maxMonthlyHours?: number;
  /**
   * Maximale wöchentliche Arbeitszeit
   * @example 40
   */
  maxWeeklyHours?: number;
  /**
   * Mindest-Berufserfahrung in Monaten
   * @example 12
   */
  minExperienceMonths?: number;
  /**
   * Mindest-Ruhezeit zwischen Schichten in Stunden
   * @example 11
   */
  minRestHours?: number;
  /**
   * Name der Rolle
   * @example "Fachkraft Dialyse"
   */
  name: string;
  /**
   * ID der Organisation
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  organizationId: string;
  /**
   * Überstundensatz in Euro
   * @example 31.88
   */
  overtimeRate?: number;
  /**
   * Berechtigungen
   * @example ["view_patient_data","manage_dialysis_machines"]
   */
  permissions?: string[];
  /**
   * Prioritätslevel der Rolle (1-10, höher = wichtiger)
   * @example 5
   */
  priorityLevel?: number;
  /**
   * Erforderliche Zertifizierungen
   * @example ["Dialyse-Grundkurs","Hygiene-Schulung"]
   */
  requiredCertifications?: string[];
  /**
   * Erforderliche Fähigkeiten
   * @example ["Patientenbetreuung","Maschinenbedienung"]
   */
  requiredSkills?: string[];
  /**
   * Status der Rolle
   * @example "active"
   */
  status?: "active" | "inactive" | "deprecated";
  /**
   * Typ der Rolle
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

export interface CreateShiftPlanDto {
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
   * Beschreibung des Schichtplans
   * @maxLength 500
   * @example "Weihnachtszeit Schichtplan mit erhöhtem Personalbedarf"
   */
  description?: string;
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
  month: number;
  /**
   * Name des Schichtplans
   * @maxLength 255
   * @example "Dezember 2024 Schichtplan"
   */
  name: string;
  /**
   * ID der Organisation
   * @example "uuid-string"
   */
  organizationId: string;
  /**
   * Monthly shift plan data structure
   * @example {"01.12.2024":{"F":["employee-uuid-1","employee-uuid-2"],"S":["employee-uuid-3"],"FS":["employee-uuid-4"]},"02.12.2024":{"F":["employee-uuid-2","employee-uuid-5"],"S":["employee-uuid-1"]}}
   */
  planData?: Record<string, any>;
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

export interface CreateUserDto {
  /**
   * E-Mail-Adresse des Benutzers
   * @example "max.mustermann@example.com"
   */
  email: string;
  /**
   * E-Mail-Adresse wurde verifiziert
   * @example false
   */
  emailVerified?: boolean;
  /**
   * Vorname des Benutzers
   * @example "Max"
   */
  firstName: string;
  /**
   * Nachname des Benutzers
   * @example "Mustermann"
   */
  lastName: string;
  /**
   * IDs der Organisationen, denen der Benutzer zugewiesen werden soll
   * @example ["uuid-org-1","uuid-org-2"]
   */
  organizationIds?: string[];
  /**
   * Passwort des Benutzers (mindestens 8 Zeichen)
   * @example "SecurePassword123!"
   */
  password: string;
  /**
   * Benutzerberechtigungen
   * @example ["read:shifts","write:shifts"]
   */
  permissions?: string[];
  /**
   * Telefonnummer
   * @example "+49 89 1234-567"
   */
  phoneNumber?: string;
  /**
   * Benutzereinstellungen
   * @example {"theme":"light","language":"de"}
   */
  preferences?: object;
  /**
   * URL zum Profilbild
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * Rolle des Benutzers
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
   * Status des Benutzers
   * @example "pending"
   */
  status?: "active" | "inactive" | "suspended" | "pending";
  /**
   * Zwei-Faktor-Authentifizierung aktiviert
   * @example false
   */
  twoFactorEnabled?: boolean;
}

export interface DateRangeDto {
  /**
   * Enddatum für den Export
   * @format date-time
   * @example "2024-12-31T23:59:59Z"
   */
  end: string;
  /**
   * Startdatum für den Export
   * @format date-time
   * @example "2024-12-01T00:00:00Z"
   */
  start: string;
}

export type DayShiftPlanDto = object;

export interface EmployeeAvailabilityResponseDto {
  /**
   * Grund für Abwesenheit
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
   * Betrifft Lohnabrechnung
   * @example false
   */
  affectsPayroll: boolean;
  /**
   * Genehmigungsdatum
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  approvedAt?: string;
  /**
   * Genehmigt von (Benutzer-ID)
   * @example "user-uuid"
   */
  approvedBy?: string;
  /**
   * Angehängte Dokumente (URLs oder IDs)
   * @example []
   */
  attachedDocuments: string[];
  /**
   * Erstellungsdatum
   * @format date-time
   * @example "2024-01-01T00:00:00Z"
   */
  createdAt: string;
  /**
   * Erstellt von (Benutzer-ID)
   * @example "user-uuid"
   */
  createdBy?: string;
  /**
   * Datumsbereich als Text
   * @example "15.01.2024 - 20.01.2024"
   */
  dateRange: string;
  /**
   * Löschzeitpunkt (Soft Delete)
   * @format date-time
   * @example "2023-12-31T23:59:59Z"
   */
  deletedAt?: string;
  /**
   * Anzeigename für Grund
   * @example "Verfügbar"
   */
  displayReason: string;
  /**
   * Dokumentation bereitgestellt
   * @example false
   */
  documentationProvided: boolean;
  /**
   * Dokumentation erforderlich
   * @example false
   */
  documentationRequired: boolean;
  /**
   * Dauer in Tagen
   * @example 5
   */
  duration: number;
  /**
   * ID des Mitarbeiters
   * @example "uuid-string"
   */
  employeeId: string;
  /**
   * Enddatum des Verfügbarkeitszeitraums
   * @format date
   * @example "2024-01-20"
   */
  endDate?: string;
  /**
   * Endzeit für teilweise Tagesverfügbarkeit (HH:MM)
   * @example "17:00"
   */
  endTime?: string;
  /**
   * Ausgeschlossene Standorte
   * @example ["location-uuid-3"]
   */
  excludedLocations: string[];
  /**
   * Ausgeschlossene Schichtarten
   * @example ["N"]
   */
  excludedShiftTypes: string[];
  /**
   * Eindeutige ID des Verfügbarkeitsdatensatzes
   * @example "uuid-string"
   */
  id: string;
  /**
   * Interne Notizen (nur für Manager sichtbar)
   * @example "Interne Bemerkungen"
   */
  internalNotes?: string;
  /**
   * Ist Abwesenheit
   * @example false
   */
  isAbsence: boolean;
  /**
   * Ist aktiv
   * @example true
   */
  isActive: boolean;
  /**
   * Ganztägige Verfügbarkeit
   * @example true
   */
  isAllDay: boolean;
  /**
   * Ist momentan aktiv
   * @example true
   */
  isCurrentlyActive: boolean;
  /**
   * Notfall
   * @example false
   */
  isEmergency: boolean;
  /**
   * Ist abgelaufen
   * @example false
   */
  isExpired: boolean;
  /**
   * Wartet auf Genehmigung
   * @example false
   */
  isPending: boolean;
  /**
   * Wiederkehrende Verfügbarkeit
   * @example false
   */
  isRecurring: boolean;
  /**
   * Maximale Stunden pro Tag
   * @example 8
   */
  maxHoursPerDay?: number;
  /**
   * Maximale Stunden pro Woche
   * @example 40
   */
  maxHoursPerWeek?: number;
  /**
   * Benötigt Genehmigung
   * @example false
   */
  needsApproval: boolean;
  /**
   * Notizen
   * @example "Zusätzliche Informationen"
   */
  notes?: string;
  /**
   * Benachrichtigung gesendet
   * @example false
   */
  notificationSent: boolean;
  /**
   * Bevorzugte Standorte
   * @example ["location-uuid-1","location-uuid-2"]
   */
  preferredLocations: string[];
  /**
   * Bevorzugte Schichtarten
   * @example ["F","S"]
   */
  preferredShiftTypes: string[];
  /**
   * Prioritätsstufe (1-5, höher = wichtiger)
   * @example 1
   */
  priorityLevel: number;
  /**
   * Detaillierte Begründung
   * @example "Arzttermin am Vormittag"
   */
  reasonDescription?: string;
  /**
   * Wiederholungstage (0=Sonntag, 1=Montag, usw.)
   * @example [1,2,3,4,5]
   */
  recurrenceDays: number[];
  /**
   * Enddatum der Wiederholung
   * @format date
   * @example "2024-12-31"
   */
  recurrenceEndDate?: string;
  /**
   * Wiederholungsintervall (z.B. alle 2 Wochen)
   * @example 1
   */
  recurrenceInterval: number;
  /**
   * Wiederholungsmuster
   * @example "none"
   */
  recurrencePattern: "none" | "daily" | "weekly" | "monthly" | "yearly";
  /**
   * Ablehnungsdatum
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  rejectedAt?: string;
  /**
   * Abgelehnt von (Benutzer-ID)
   * @example "user-uuid"
   */
  rejectedBy?: string;
  /**
   * Ablehnungsgrund
   * @example "Personalbesetzung bereits ausreichend"
   */
  rejectionReason?: string;
  /**
   * Erinnerung gesendet
   * @example false
   */
  reminderSent: boolean;
  /**
   * Benötigt Genehmigung
   * @example false
   */
  requiresApproval: boolean;
  /**
   * Startdatum des Verfügbarkeitszeitraums
   * @format date
   * @example "2024-01-15"
   */
  startDate: string;
  /**
   * Startzeit für teilweise Tagesverfügbarkeit (HH:MM)
   * @example "09:00"
   */
  startTime?: string;
  /**
   * Status der Verfügbarkeit
   * @example "active"
   */
  status: "active" | "pending" | "approved" | "rejected" | "expired";
  /**
   * Einreichungsdatum
   * @format date-time
   * @example "2024-01-15T09:00:00Z"
   */
  submittedAt?: string;
  /**
   * Zeitbereich als Text
   * @example "09:00 - 17:00"
   */
  timeRange: string;
  /**
   * Art der Verfügbarkeit
   * @example "available"
   */
  type: "available" | "unavailable" | "preferred" | "limited";
  /**
   * Letztes Änderungsdatum
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  updatedAt: string;
  /**
   * Geändert von (Benutzer-ID)
   * @example "user-uuid"
   */
  updatedBy?: string;
  /** Wöchentliche Verfügbarkeitszeiten */
  weeklyAvailability?: Record<string, any>;
}

export interface EmployeeResponseDto {
  /**
   * Adresse
   * @example "Musterstraße 123"
   */
  address?: string;
  /** Verfügbarkeitsangaben des Mitarbeiters */
  availabilities?: EmployeeAvailabilityResponseDto[];
  /**
   * Zertifizierungen
   * @example ["Krankenpflege-Ausbildung","Erste Hilfe"]
   */
  certifications: string[];
  /**
   * Stadt
   * @example "München"
   */
  city?: string;
  /**
   * Vertragstyp
   * @example "full_time"
   */
  contractType: "full_time" | "part_time" | "contract" | "temporary" | "intern";
  /**
   * Land
   * @example "Deutschland"
   */
  country?: string;
  /**
   * Erstellungsdatum
   * @format date-time
   * @example "2020-01-15T10:00:00Z"
   */
  createdAt: string;
  /**
   * ID des Benutzers der den Eintrag erstellt hat
   * @example "uuid-string"
   */
  createdBy?: string;
  /**
   * Geburtsdatum
   * @format date-time
   * @example "1985-03-15"
   */
  dateOfBirth?: string;
  /**
   * Löschzeitpunkt (Soft Delete)
   * @format date-time
   * @example "2023-12-31T23:59:59Z"
   */
  deletedAt?: string;
  /**
   * Anzeigename für UI (alias for fullName)
   * @example "Anna Schneider"
   */
  displayName?: string;
  /**
   * E-Mail-Adresse des Mitarbeiters
   * @example "anna.schneider@dialyse-praxis.de"
   */
  email: string;
  /**
   * Name des Notfallkontakts
   * @example "Maria Schneider"
   */
  emergencyContactName?: string;
  /**
   * Telefonnummer des Notfallkontakts
   * @example "+49 89 1234-002"
   */
  emergencyContactPhone?: string;
  /**
   * Mitarbeiternummer
   * @example "EMP001"
   */
  employeeNumber: string;
  /**
   * Vorname des Mitarbeiters
   * @example "Anna"
   */
  firstName: string;
  /**
   * Vollständiger Name des Mitarbeiters
   * @example "Anna Schneider"
   */
  fullName: string;
  /**
   * Einstellungsdatum
   * @format date-time
   * @example "2020-01-15"
   */
  hireDate: string;
  /**
   * Stundenlohn
   * @example 28.5
   */
  hourlyRate?: number;
  /**
   * Arbeitsstunden pro Monat
   * @example 160
   */
  hoursPerMonth: number;
  /**
   * Arbeitsstunden pro Woche
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Eindeutige ID des Mitarbeiters
   * @example "uuid-string"
   */
  id: string;
  /**
   * Ist der Mitarbeiter aktiv
   * @example true
   */
  isActive: boolean;
  /**
   * Ist der Mitarbeiter verfügbar
   * @example true
   */
  isAvailable: boolean;
  /**
   * Sprachen
   * @example ["Deutsch","Englisch"]
   */
  languages: string[];
  /**
   * Nachname des Mitarbeiters
   * @example "Schneider"
   */
  lastName: string;
  /** Standort-Informationen */
  location?: LocationResponseDto;
  /**
   * ID des Standorts
   * @example "uuid-string"
   */
  locationId?: string;
  /**
   * Notizen
   * @example "Erfahrener Mitarbeiter mit Spezialisierung auf Dialyse"
   */
  notes?: string;
  /**
   * ID der Organisation
   * @example "uuid-string"
   */
  organizationId: string;
  /**
   * Überstundenlohn
   * @example 35.6
   */
  overtimeRate?: number;
  /**
   * Telefonnummer
   * @example "+49 89 1234-001"
   */
  phoneNumber?: string;
  /**
   * Postleitzahl
   * @example "80331"
   */
  postalCode?: string;
  /** Hauptrolle-Informationen */
  primaryRole?: RoleResponseDto;
  /**
   * ID der Hauptrolle
   * @example "uuid-string"
   */
  primaryRoleId?: string;
  /**
   * URL des Profilbilds
   * @example "https://example.com/profile.jpg"
   */
  profilePictureUrl?: string;
  /** Alle Rollen des Mitarbeiters */
  roles?: RoleResponseDto[];
  /**
   * Fähigkeiten
   * @example ["Patientenbetreuung","Teamarbeit"]
   */
  skills: string[];
  /**
   * Status des Mitarbeiters
   * @example "active"
   */
  status: "active" | "inactive" | "on_leave" | "terminated" | "suspended";
  /** Untergebene Mitarbeiter */
  subordinates?: EmployeeResponseDto[];
  /** Vorgesetzter-Informationen */
  supervisor?: EmployeeResponseDto;
  /**
   * ID des Vorgesetzten
   * @example "uuid-string"
   */
  supervisorId?: string;
  /**
   * Kündigungsdatum
   * @format date-time
   * @example "2023-12-31"
   */
  terminationDate?: string;
  /**
   * Letztes Änderungsdatum
   * @format date-time
   * @example "2023-06-15T14:30:00Z"
   */
  updatedAt: string;
  /**
   * ID des Benutzers der den Eintrag zuletzt geändert hat
   * @example "uuid-string"
   */
  updatedBy?: string;
  /**
   * Jahre im Dienst
   * @example 3
   */
  yearsOfService: number;
}

export interface EmployeeUtilizationDto {
  /**
   * Constraint violations count
   * @example 0
   */
  constraintViolations?: number;
  /**
   * Planning efficiency score (0-100)
   * @example 85.2
   */
  efficiencyScore?: number;
  /** Employee ID */
  employeeId: string;
  /** Employee name */
  employeeName: string;
  /**
   * Hours difference from target
   * @example -2.5
   */
  hoursDifference: number;
  /** Location ID */
  locationId: string;
  /**
   * Preferred shift types assigned
   * @example 15
   */
  preferredShiftsAssigned?: number;
  /** Employee role */
  role: string;
  /**
   * Number of Saturday shifts worked
   * @example 2
   */
  saturdaysWorked: number;
  /**
   * Number of shifts assigned
   * @example 20
   */
  shiftsCount: number;
  /**
   * Target hours per month
   * @example 163
   */
  targetHours: number;
  /**
   * Total hours assigned
   * @example 160.5
   */
  totalHoursAssigned: number;
  /**
   * Workload percentage relative to target
   * @example 98.5
   */
  workloadPercentage: number;
}

export interface ExcelExportMetadataDto {
  /** Verwendete Export-Optionen */
  exportOptions: ExcelExportOptionsDto;
  /**
   * Gesamtanzahl der Planungstage
   * @example 31
   */
  totalDays: number;
  /**
   * Gesamtanzahl der Mitarbeiter im Export
   * @example 25
   */
  totalEmployees: number;
  /**
   * Gesamtanzahl der Schichten im Export
   * @example 456
   */
  totalShifts: number;
}

export interface ExcelExportOptionsDto {
  /**
   * Zusätzliche Spalten für den Export
   * @example [{"key":"overtime","header":"Überstunden","width":12},{"key":"vacation_days","header":"Urlaubstage","width":15}]
   */
  additionalColumns?: AdditionalColumnDto[];
  /**
   * URL zum Firmenlogo für den Export
   * @example "https://example.com/logo.png"
   */
  companyLogo?: string;
  /**
   * Benutzerdefinierter Titel für den Export
   * @example "Schichtplan Dezember 2024 - Standort Berlin"
   */
  customTitle?: string;
  /** Datumsbereich für den Export (überschreibt Standard-Monatsbereich) */
  dateRange?: DateRangeDto;
  /**
   * Constraint-Verletzungen in den Export einbeziehen
   * @default false
   * @example true
   */
  includeConstraintViolations?: boolean;
  /**
   * Detaillierte Mitarbeiterinformationen einbeziehen
   * @default false
   * @example true
   */
  includeEmployeeDetails?: boolean;
  /**
   * Statistiken in den Export einbeziehen
   * @default false
   * @example true
   */
  includeStatistics?: boolean;
  /**
   * Zusätzliche Metadaten für den Export
   * @example {"department":"Pflege","location":"Berlin"}
   */
  metadata?: Record<string, any>;
}

export interface ExcelExportRequestDto {
  /** Export-Optionen und Anpassungen */
  options?: ExcelExportOptionsDto;
  /**
   * ID des zu exportierenden Schichtplans
   * @example "uuid-string"
   */
  shiftPlanId: string;
}

export interface ExcelExportResultDto {
  /**
   * Dateiname der generierten Excel-Datei
   * @example "schichtplan-2024-12-20241227-1830.xlsx"
   */
  filename: string;
  /**
   * Zeitpunkt der Generierung
   * @format date-time
   * @example "2024-12-27T18:30:45Z"
   */
  generatedAt: string;
  /** Metadaten über den Export */
  metadata: ExcelExportMetadataDto;
  /**
   * MIME-Type der Datei
   * @example "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
   */
  mimeType: string;
  /**
   * Dateigröße in Bytes
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

export interface MultipleExcelExportRequestDto {
  /** Export-Optionen für alle Schichtpläne */
  options?: ExcelExportOptionsDto;
  /**
   * Liste der zu exportierenden Schichtplan-IDs
   * @example ["uuid-1","uuid-2","uuid-3"]
   */
  shiftPlanIds: string[];
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

export interface OptimizationCriteriaDto {
  /**
   * Weight for minimizing constraint violations
   * @min 0
   * @max 10
   * @example 3
   */
  constraintViolationWeight: number;
  /**
   * Maximum optimization iterations
   * @min 1
   * @max 100
   * @default 10
   */
  maxOptimizationIterations?: number;
  /**
   * Whether to optimize for cost efficiency
   * @default false
   */
  optimizeForCostEfficiency?: boolean;
  /**
   * Weight for minimizing overtime usage
   * @min 0
   * @max 10
   * @example 1.5
   */
  overtimeMinimizationWeight: number;
  /**
   * Weight for preference satisfaction
   * @min 0
   * @max 10
   * @example 1
   */
  preferenceSatisfactionWeight: number;
  /**
   * Target coverage percentage
   * @min 50
   * @max 100
   * @default 95
   */
  targetCoveragePercentage?: number;
  /**
   * Weight for balancing workload across employees
   * @min 0
   * @max 10
   * @example 2
   */
  workloadBalanceWeight: number;
}

export interface OrganizationResponseDto {
  /**
   * Erstellt am
   * @format date-time
   * @example "2024-01-01T12:00:00Z"
   */
  createdAt?: string;
  /**
   * Gelöscht am
   * @format date-time
   * @example null
   */
  deletedAt?: string;
  /**
   * Beschreibung
   * @example "Führendes Dialysezentrum in Berlin"
   */
  description?: string;
  /**
   * Aktivierte Features
   * @example ["shift-planning","reporting"]
   */
  features: string[];
  /**
   * Adresse des Hauptsitzes
   * @example "Alexanderplatz 1"
   */
  headquartersAddress?: string;
  /**
   * Stadt des Hauptsitzes
   * @example "Berlin"
   */
  headquartersCity?: string;
  /**
   * Land des Hauptsitzes
   * @example "Deutschland"
   */
  headquartersCountry?: string;
  /**
   * Postleitzahl des Hauptsitzes
   * @example "10178"
   */
  headquartersPostalCode?: string;
  /**
   * Eindeutige ID der Organisation
   * @example "uuid-string"
   */
  id: string;
  /**
   * Ist aktiv
   * @example true
   */
  isActive: boolean;
  /**
   * Rechtlicher Name der Organisation
   * @example "Dialyse Zentrum Berlin GmbH"
   */
  legalName?: string;
  /**
   * Logo URL
   * @example "https://example.com/logo.png"
   */
  logoUrl?: string;
  /**
   * Maximale Anzahl Mitarbeiter
   * @example 50
   */
  maxEmployees: number;
  /**
   * Maximale Anzahl Standorte
   * @example 5
   */
  maxLocations: number;
  /**
   * Name der Organisation
   * @example "Dialyse Zentrum Berlin"
   */
  name: string;
  /**
   * Haupt-E-Mail-Adresse
   * @example "info@dialyse-berlin.de"
   */
  primaryEmail?: string;
  /**
   * Haupttelefonnummer
   * @example "+49 30 1234-0"
   */
  primaryPhone?: string;
  /**
   * Registrierungsnummer
   * @example "HRB 12345"
   */
  registrationNumber?: string;
  /**
   * Einstellungen
   * @example {"timezone":"Europe/Berlin"}
   */
  settings: object;
  /**
   * Status der Organisation
   * @example "active"
   */
  status: "active" | "inactive" | "suspended" | "trial";
  /**
   * Ablaufdatum des Abonnements
   * @format date-time
   * @example "2025-01-01T00:00:00Z"
   */
  subscriptionExpiresAt?: string;
  /**
   * Abonnement-Plan
   * @example "basic"
   */
  subscriptionPlan: string;
  /**
   * Steuernummer
   * @example "DE123456789"
   */
  taxId?: string;
  /**
   * Typ der Organisation
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
   * Aktualisiert am
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

export interface PlanningPerformanceDto {
  /**
   * Algorithm used
   * @example "enhanced_backtracking"
   */
  algorithmUsed: string;
  /**
   * Number of backtracking attempts
   * @example 127
   */
  backtrackingAttempts: number;
  /**
   * Constraint checks performed
   * @example 3456
   */
  constraintChecks?: number;
  /**
   * Number of failed day assignments
   * @example 2
   */
  failedDays: number;
  /**
   * Number of planning iterations
   * @example 31
   */
  iterationsCount: number;
  /**
   * Memory usage in MB
   * @example 45.2
   */
  memoryUsageMB?: number;
  /**
   * Planning duration in milliseconds
   * @example 15432
   */
  planningDurationMs: number;
  /**
   * Planning efficiency score
   * @example 78.3
   */
  planningEfficiency?: number;
  /**
   * Planning success rate percentage
   * @example 93.5
   */
  successRate: number;
  /**
   * Number of successful day assignments
   * @example 29
   */
  successfulDays: number;
}

export interface QualityMetricsDto {
  /**
   * Constraint compliance score (0-100)
   * @example 95.8
   */
  constraintComplianceScore: number;
  /**
   * Cost efficiency score (0-100)
   * @example 82.3
   */
  costEfficiencyScore?: number;
  /**
   * Coverage optimization score (0-100)
   * @example 88.9
   */
  coverageOptimizationScore: number;
  /** Whether the plan meets high quality standards */
  isHighQuality?: boolean;
  /** Whether the plan needs improvement */
  needsImprovement?: boolean;
  /**
   * Overall quality score (0-100)
   * @example 87.5
   */
  overallScore: number;
  /**
   * Preference satisfaction score (0-100)
   * @example 76.4
   */
  preferenceSatisfactionScore: number;
  /**
   * Workload balance score (0-100)
   * @example 92.1
   */
  workloadBalanceScore: number;
}

export interface RoleResponseDto {
  /**
   * Kann an Feiertagen arbeiten
   * @example false
   */
  canWorkHolidays: boolean;
  /**
   * Kann Nachtschichten arbeiten
   * @example true
   */
  canWorkNights: boolean;
  /**
   * Kann Wochenendschichten arbeiten
   * @example true
   */
  canWorkWeekends: boolean;
  /**
   * Farbcode für UI-Anzeige (Hex)
   * @example "#1976d2"
   */
  colorCode?: string;
  /**
   * Erstellt am
   * @format date-time
   * @example "2024-01-01T12:00:00Z"
   */
  createdAt: string;
  /**
   * Erstellt von (Benutzer-ID)
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  createdBy?: string;
  /**
   * Gelöscht am
   * @format date-time
   * @example null
   */
  deletedAt?: string;
  /**
   * Beschreibung der Rolle
   * @example "Qualifizierte Fachkraft für die Durchführung von Dialysebehandlungen"
   */
  description?: string;
  /**
   * Anzeigename der Rolle (berechnet)
   * @example "Fachkraft Dialyse (specialist)"
   */
  displayName: string;
  /**
   * Stundensatz in Euro
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Eindeutige ID der Rolle
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Rolle ist aktiv
   * @example true
   */
  isActive: boolean;
  /**
   * Rolle ist verfügbar (berechnet)
   * @example true
   */
  isAvailable: boolean;
  /**
   * Maximale aufeinanderfolgende Arbeitstage
   * @example 6
   */
  maxConsecutiveDays: number;
  /**
   * Maximale monatliche Arbeitszeit
   * @example 160
   */
  maxMonthlyHours: number;
  /**
   * Maximale wöchentliche Arbeitszeit
   * @example 40
   */
  maxWeeklyHours: number;
  /**
   * Mindest-Berufserfahrung in Monaten
   * @example 12
   */
  minExperienceMonths: number;
  /**
   * Mindest-Ruhezeit zwischen Schichten in Stunden
   * @example 11
   */
  minRestHours: number;
  /**
   * Name der Rolle
   * @example "Fachkraft Dialyse"
   */
  name: string;
  /**
   * ID der Organisation
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  organizationId: string;
  /**
   * Überstundensatz in Euro
   * @example 31.88
   */
  overtimeRate?: number;
  /**
   * Berechtigungen
   * @example ["view_patient_data","manage_dialysis_machines"]
   */
  permissions: string[];
  /**
   * Prioritätslevel der Rolle (1-10, höher = wichtiger)
   * @example 1
   */
  priorityLevel: number;
  /**
   * Erforderliche Zertifizierungen
   * @example ["Dialyse-Grundkurs","Hygiene-Schulung"]
   */
  requiredCertifications: string[];
  /**
   * Erforderliche Fähigkeiten
   * @example ["Patientenbetreuung","Maschinenbedienung"]
   */
  requiredSkills: string[];
  /**
   * Status der Rolle
   * @example "active"
   */
  status: "active" | "inactive" | "deprecated";
  /**
   * Typ der Rolle
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
   * Aktualisiert am
   * @format date-time
   * @example "2024-02-01T12:00:00Z"
   */
  updatedAt: string;
  /**
   * Aktualisiert von (Benutzer-ID)
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

export interface ShiftDistributionDto {
  /**
   * Average shifts per day
   * @example 10.2
   */
  averageShiftsPerDay?: number;
  /** Shift distribution by day of week */
  dailyDistribution: object;
  /**
   * Evening shift (S) count
   * @example 145
   */
  eveningShifts: number;
  /**
   * Morning shift (F) count
   * @example 150
   */
  morningShifts: number;
  /**
   * Secondary location shifts
   * @example 30
   */
  secondaryLocationShifts?: number;
  /**
   * Split shift (FS) count
   * @example 20
   */
  splitShifts?: number;
  /**
   * Total shifts assigned
   * @example 315
   */
  totalShifts: number;
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

export interface ShiftPlanStatisticsDto {
  /**
   * Average hours per employee
   * @example 100.8
   */
  averageHoursPerEmployee: number;
  /** Timestamp when statistics were calculated */
  calculationTimestamp: string;
  /**
   * Statistics calculation version
   * @example "1.0"
   */
  calculationVersion?: string;
  /** Summary of constraint violations */
  constraintViolationsSummary: ConstraintViolationsSummaryDto;
  /**
   * Coverage percentage of required shifts
   * @example 96.8
   */
  coveragePercentage: number;
  /** Individual employee utilization statistics */
  employeeUtilization: EmployeeUtilizationDto[];
  /** Unique statistics ID */
  id: string;
  /**
   * Whether statistics are final
   * @example true
   */
  isFinal?: boolean;
  /**
   * Maximum hours assigned to any employee
   * @example 125
   */
  maxEmployeeHours: number;
  /** Additional metadata */
  metadata?: object;
  /**
   * Minimum hours assigned to any employee
   * @example 85.5
   */
  minEmployeeHours: number;
  /** Planning performance metrics */
  planningPerformance: PlanningPerformanceDto;
  /** Quality assessment metrics */
  qualityMetrics: QualityMetricsDto;
  /**
   * Recommendations for improvement
   * @example ["Consider redistributing Saturday shifts more evenly","Review workload for Employee X"]
   */
  recommendations?: string[];
  /**
   * Number of Saturday shifts covered
   * @example 4
   */
  saturdayCoverage: number;
  /** Shift distribution across types and days */
  shiftDistribution: ShiftDistributionDto;
  /** Shift plan ID */
  shiftPlanId: string;
  /**
   * Standard deviation of hours distribution
   * @example 12.3
   */
  standardDeviationHours: number;
  /**
   * Number of employees involved in planning
   * @example 25
   */
  totalEmployeesInvolved: number;
  /**
   * Total hours planned across all shifts
   * @example 2520
   */
  totalHoursPlanned: number;
  /**
   * Total number of shifts planned
   * @example 315
   */
  totalShiftsPlanned: number;
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
   * Adresse
   * @example "Musterstraße 123"
   */
  address?: string;
  /**
   * Zertifizierungen
   * @example ["Krankenpflege-Ausbildung","Erste Hilfe"]
   */
  certifications?: string[];
  /**
   * Stadt
   * @example "München"
   */
  city?: string;
  /**
   * Vertragstyp
   * @example "full_time"
   */
  contractType?:
    | "full_time"
    | "part_time"
    | "contract"
    | "temporary"
    | "intern";
  /**
   * Land
   * @example "Deutschland"
   */
  country?: string;
  /**
   * Geburtsdatum
   * @example "1985-03-15"
   */
  dateOfBirth?: string;
  /**
   * E-Mail-Adresse des Mitarbeiters
   * @example "anna.schneider@dialyse-praxis.de"
   */
  email?: string;
  /**
   * Name des Notfallkontakts
   * @example "Maria Schneider"
   */
  emergencyContactName?: string;
  /**
   * Telefonnummer des Notfallkontakts
   * @example "+49 89 1234-002"
   */
  emergencyContactPhone?: string;
  /**
   * Mitarbeiternummer
   * @example "EMP001"
   */
  employeeNumber?: string;
  /**
   * Vorname des Mitarbeiters
   * @example "Anna"
   */
  firstName?: string;
  /**
   * Einstellungsdatum
   * @example "2020-01-15"
   */
  hireDate?: string;
  /**
   * Stundenlohn
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Arbeitsstunden pro Monat
   * @min 1
   * @max 400
   * @example 160
   */
  hoursPerMonth?: number;
  /**
   * Arbeitsstunden pro Woche
   * @min 1
   * @max 60
   * @example 40
   */
  hoursPerWeek?: number;
  /**
   * Ist der Mitarbeiter aktiv
   * @example true
   */
  isActive?: boolean;
  /**
   * Sprachen
   * @example ["Deutsch","Englisch"]
   */
  languages?: string[];
  /**
   * Nachname des Mitarbeiters
   * @example "Schneider"
   */
  lastName?: string;
  /**
   * ID des Standorts
   * @example "uuid-string"
   */
  locationId?: string;
  /**
   * Notizen zum Mitarbeiter
   * @example "Erfahrener Mitarbeiter mit Spezialisierung auf Dialyse"
   */
  notes?: string;
  /**
   * ID der Organisation
   * @example "uuid-string"
   */
  organizationId?: string;
  /**
   * Überstundenlohn
   * @example 32.5
   */
  overtimeRate?: number;
  /**
   * Telefonnummer
   * @example "+49 89 1234-001"
   */
  phoneNumber?: string;
  /**
   * Postleitzahl
   * @example "80331"
   */
  postalCode?: string;
  /**
   * ID der Hauptrolle
   * @example "uuid-string"
   */
  primaryRoleId?: string;
  /**
   * URL des Profilbilds
   * @example "https://example.com/profile.jpg"
   */
  profilePictureUrl?: string;
  /**
   * Fähigkeiten
   * @example ["Patientenbetreuung","Teamarbeit"]
   */
  skills?: string[];
  /**
   * Status des Mitarbeiters
   * @example "active"
   */
  status?: "active" | "inactive" | "on_leave" | "terminated" | "suspended";
  /**
   * ID des Vorgesetzten
   * @example "uuid-string"
   */
  supervisorId?: string;
  /**
   * Kündigungsdatum
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
   * Beschreibung der Organisation
   * @example "Führendes Dialysezentrum in Berlin"
   */
  description?: string;
  /**
   * Aktivierte Features
   * @example ["shift-planning","reporting"]
   */
  features?: string[];
  /**
   * Hauptsitz-Adresse
   * @example "Alexanderplatz 1"
   */
  headquartersAddress?: string;
  /**
   * Hauptsitz-Stadt
   * @example "Berlin"
   */
  headquartersCity?: string;
  /**
   * Hauptsitz-Land
   * @example "Deutschland"
   */
  headquartersCountry?: string;
  /**
   * Hauptsitz-Postleitzahl
   * @example "10178"
   */
  headquartersPostalCode?: string;
  /**
   * Organisation ist aktiv
   * @example true
   */
  isActive?: boolean;
  /**
   * Rechtlicher Name der Organisation
   * @example "Dialyse Zentrum Berlin GmbH"
   */
  legalName?: string;
  /**
   * URL zum Logo
   * @example "https://example.com/logo.png"
   */
  logoUrl?: string;
  /**
   * Maximale Anzahl Mitarbeiter
   * @example 200
   */
  maxEmployees?: number;
  /**
   * Maximale Anzahl Standorte
   * @example 20
   */
  maxLocations?: number;
  /**
   * Name der Organisation
   * @example "Dialyse Zentrum Berlin"
   */
  name?: string;
  /**
   * Haupt-E-Mail-Adresse
   * @example "info@dialyse-berlin.de"
   */
  primaryEmail?: string;
  /**
   * Haupttelefonnummer
   * @example "+49 30 1234-0"
   */
  primaryPhone?: string;
  /**
   * Registrierungsnummer
   * @example "HRB 12345"
   */
  registrationNumber?: string;
  /**
   * Organisationseinstellungen
   * @example {"timezone":"Europe/Berlin"}
   */
  settings?: object;
  /**
   * Status der Organisation
   * @example "active"
   */
  status?: "active" | "inactive" | "suspended" | "trial";
  /**
   * Abonnement-Plan
   * @example "pro"
   */
  subscriptionPlan?: string;
  /**
   * Steuernummer
   * @example "DE123456789"
   */
  taxId?: string;
  /**
   * Typ der Organisation
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
   * Website der Organisation
   * @example "https://www.dialyse-berlin.de"
   */
  website?: string;
}

export interface UpdateRoleDto {
  /**
   * Kann an Feiertagen arbeiten
   * @example false
   */
  canWorkHolidays?: boolean;
  /**
   * Kann Nachtschichten arbeiten
   * @example true
   */
  canWorkNights?: boolean;
  /**
   * Kann Wochenendschichten arbeiten
   * @example true
   */
  canWorkWeekends?: boolean;
  /**
   * Farbcode für UI-Anzeige (Hex)
   * @example "#1976d2"
   */
  colorCode?: string;
  /**
   * Erstellt von (Benutzer-ID)
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  createdBy?: string;
  /**
   * Beschreibung der Rolle
   * @example "Qualifizierte Fachkraft für die Durchführung von Dialysebehandlungen"
   */
  description?: string;
  /**
   * Stundensatz in Euro
   * @example 25.5
   */
  hourlyRate?: number;
  /**
   * Rolle ist aktiv
   * @example true
   */
  isActive?: boolean;
  /**
   * Maximale aufeinanderfolgende Arbeitstage
   * @example 5
   */
  maxConsecutiveDays?: number;
  /**
   * Maximale monatliche Arbeitszeit
   * @example 160
   */
  maxMonthlyHours?: number;
  /**
   * Maximale wöchentliche Arbeitszeit
   * @example 40
   */
  maxWeeklyHours?: number;
  /**
   * Mindest-Berufserfahrung in Monaten
   * @example 12
   */
  minExperienceMonths?: number;
  /**
   * Mindest-Ruhezeit zwischen Schichten in Stunden
   * @example 11
   */
  minRestHours?: number;
  /**
   * Name der Rolle
   * @example "Fachkraft Dialyse"
   */
  name?: string;
  /**
   * ID der Organisation
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  organizationId?: string;
  /**
   * Überstundensatz in Euro
   * @example 31.88
   */
  overtimeRate?: number;
  /**
   * Berechtigungen
   * @example ["view_patient_data","manage_dialysis_machines"]
   */
  permissions?: string[];
  /**
   * Prioritätslevel der Rolle (1-10, höher = wichtiger)
   * @example 5
   */
  priorityLevel?: number;
  /**
   * Erforderliche Zertifizierungen
   * @example ["Dialyse-Grundkurs","Hygiene-Schulung"]
   */
  requiredCertifications?: string[];
  /**
   * Erforderliche Fähigkeiten
   * @example ["Patientenbetreuung","Maschinenbedienung"]
   */
  requiredSkills?: string[];
  /**
   * Status der Rolle
   * @example "active"
   */
  status?: "active" | "inactive" | "deprecated";
  /**
   * Typ der Rolle
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
   * Aktualisiert von (Benutzer-ID)
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
   * Beschreibung des Schichtplans
   * @maxLength 500
   * @example "Weihnachtszeit Schichtplan mit erhöhtem Personalbedarf"
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
   * Name des Schichtplans
   * @maxLength 255
   * @example "Dezember 2024 Schichtplan"
   */
  name?: string;
  /**
   * Optimization level used for this shift plan
   * @example "standard"
   */
  optimizationLevel?: string;
  /**
   * ID der Organisation
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
   * E-Mail-Adresse des Benutzers
   * @example "max.mustermann@example.com"
   */
  email?: string;
  /**
   * E-Mail-Adresse wurde verifiziert
   * @example true
   */
  emailVerified?: boolean;
  /**
   * Vorname des Benutzers
   * @example "Max"
   */
  firstName?: string;
  /**
   * Nachname des Benutzers
   * @example "Mustermann"
   */
  lastName?: string;
  /**
   * IDs der Organisationen, denen der Benutzer zugewiesen werden soll
   * @example ["uuid-org-1","uuid-org-2"]
   */
  organizationIds?: string[];
  /**
   * Neues Passwort des Benutzers (mindestens 8 Zeichen)
   * @example "NewSecurePassword123!"
   */
  password?: string;
  /**
   * Benutzerberechtigungen
   * @example ["read:shifts","write:shifts","manage:users"]
   */
  permissions?: string[];
  /**
   * Telefonnummer
   * @example "+49 89 1234-567"
   */
  phoneNumber?: string;
  /**
   * Benutzereinstellungen
   * @example {"theme":"dark","language":"de"}
   */
  preferences?: object;
  /**
   * URL zum Profilbild
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * Rolle des Benutzers
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
   * Status des Benutzers
   * @example "active"
   */
  status?: "active" | "inactive" | "suspended" | "pending";
  /**
   * Zwei-Faktor-Authentifizierung aktiviert
   * @example false
   */
  twoFactorEnabled?: boolean;
}

export interface UserResponseDto {
  /**
   * Erstellungsdatum
   * @format date-time
   * @example "2023-01-15T08:00:00Z"
   */
  createdAt?: string;
  /**
   * Löschdatum (falls gelöscht)
   * @format date-time
   * @example null
   */
  deletedAt?: string;
  /**
   * E-Mail-Adresse des Benutzers
   * @example "max.mustermann@example.com"
   */
  email: string;
  /**
   * E-Mail-Adresse wurde verifiziert
   * @example true
   */
  emailVerified: boolean;
  /**
   * Vorname des Benutzers
   * @example "Max"
   */
  firstName: string;
  /**
   * Vollständiger Name des Benutzers
   * @example "Max Mustermann"
   */
  fullName: string;
  /**
   * Eindeutige ID des Benutzers
   * @example "uuid-string"
   */
  id: string;
  /**
   * Ist der Benutzer aktiv
   * @example true
   */
  isActive: boolean;
  /**
   * Letzter Login-Zeitpunkt
   * @format date-time
   * @example "2023-12-01T10:30:00Z"
   */
  lastLoginAt?: string;
  /**
   * Nachname des Benutzers
   * @example "Mustermann"
   */
  lastName: string;
  /**
   * Liste der Organisationen des Benutzers
   * @example ["uuid-org-1","uuid-org-2"]
   */
  organizationIds: string[];
  /**
   * Benutzerberechtigungen
   * @example ["read:shifts","write:shifts"]
   */
  permissions: string[];
  /**
   * Telefonnummer
   * @example "+49 89 1234-567"
   */
  phoneNumber?: string;
  /**
   * Benutzereinstellungen
   * @example {"theme":"dark","language":"de"}
   */
  preferences: object;
  /**
   * URL zum Profilbild
   * @example "https://example.com/profile/image.jpg"
   */
  profilePictureUrl?: string;
  /**
   * Rolle des Benutzers
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
   * Status des Benutzers
   * @example "active"
   */
  status: "active" | "inactive" | "suspended" | "pending";
  /**
   * Zwei-Faktor-Authentifizierung aktiviert
   * @example false
   */
  twoFactorEnabled: boolean;
  /**
   * Datum der letzten Aktualisierung
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

export interface ValidationConfigDto {
  /** Custom validation parameters */
  customParameters?: object;
  /** Maximum validation time in milliseconds */
  maxValidationTimeMs?: number;
  /** Constraint rule overrides */
  ruleOverrides?: string[];
  /** Whether to perform strict validation */
  strictMode?: boolean;
  /** Whether to validate cross-employee constraints */
  validateCrossEmployeeConstraints?: boolean;
  /** Whether to validate resource constraints */
  validateResourceConstraints?: boolean;
  /** Whether to validate temporal constraints */
  validateTemporalConstraints?: boolean;
}

export interface ValidationRecommendationDto {
  /** Affected entity IDs (employees, shifts, etc.) */
  affectedEntities?: string[];
  /** Detailed recommendation description */
  description: string;
  /** Estimated time to implement */
  estimatedTimeToImplement?: string;
  /** Expected improvement if recommendation is followed */
  expectedImprovement?: string;
  /** Implementation difficulty (1-5) */
  implementationDifficulty?: number;
  /** Recommendation priority (1-5) */
  priority: number;
  /** Related violation codes */
  relatedViolations?: string[];
  /** Recommendation title */
  title: string;
  /** Recommendation type */
  type: string;
}

export interface ValidationStatisticsDto {
  /** Average constraint check time in milliseconds */
  averageCheckTimeMs: number;
  /** Constraint categories breakdown */
  categoryBreakdown?: object;
  /** Number of constraints failed */
  constraintsFailed: number;
  /** Number of constraints passed */
  constraintsPassed: number;
  /** Employee-specific violation counts */
  employeeViolationCounts?: object;
  /** Most frequently violated constraint */
  mostViolatedConstraint?: string;
  /** Total number of constraints checked */
  totalConstraintsChecked: number;
  /** Total validation time in milliseconds */
  totalValidationTimeMs: number;
  /** Validation success rate percentage */
  validationSuccessRate: number;
}
