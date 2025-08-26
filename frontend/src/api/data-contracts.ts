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

export interface EmployeeResponseDto {
  /**
   * Adresse
   * @example "Musterstraße 123"
   */
  address?: string;
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
