import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import { Employee, Location, ShiftRules } from '@/types/interfaces';

/**
 * Seed-Daten für die Datenbank
 * Migriert die bestehenden Daten aus dem Frontend
 */

/**
 * Mitarbeiterdaten (aus src/data/employeeData.ts)
 */
const employeeData: Omit<Employee, 'id'>[] = [
  // Schichtleiter
  { name: "Sonja M.", role: "ShiftLeader", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { name: "Andrea K.", role: "ShiftLeader", hoursPerWeek: 36, hoursPerMonth: 156.0, locationId: 1 },
  { name: "Christina L.", role: "ShiftLeader", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { name: "Uta S.", role: "ShiftLeader", hoursPerWeek: 28, hoursPerMonth: 121.3, locationId: 1 },
  { name: "Simone R.", role: "ShiftLeader", hoursPerWeek: 29, hoursPerMonth: 126.0, locationId: 1 },
  
  // Fachkräfte
  { name: "Andrea B.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 121.33, locationId: 1 },
  { name: "Sabrina H.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 152.0, locationId: 1 },
  { name: "Kay W.", role: "Specialist", hoursPerWeek: 33, hoursPerMonth: 142.5, locationId: 2 },
  { name: "Esther T.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { name: "Annika F.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.1, locationId: 1 },
  { name: "Alina G.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { name: "Britta N.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { name: "Saskia P.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { name: "Natalia V.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 121.3, locationId: 1 },
  { name: "Marina D.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { name: "Sandra J.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { name: "Susann C.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { name: "Mandy E.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { name: "Eugenia A.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { name: "Silke B.", role: "Specialist", hoursPerWeek: 24, hoursPerMonth: 106.2, locationId: 2 },
  { name: "Nisa O.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 },
  { name: "Tobias M.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 123.1, locationId: 1 },
  
  // Hilfskräfte
  { name: "Silke K.", role: "Assistant", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 2 },
  { name: "Karen L.", role: "Assistant", hoursPerWeek: 23, hoursPerMonth: 99.4, locationId: 1 },
  { name: "Birgit S.", role: "Assistant", hoursPerWeek: 31, hoursPerMonth: 135.0, locationId: 1 },
  { name: "Birgit W.", role: "Assistant", hoursPerWeek: 28, hoursPerMonth: 121.0, locationId: 1 },
  { name: "Jessica R.", role: "Assistant", hoursPerWeek: 39, hoursPerMonth: 169.1, locationId: 1 },
  { name: "Nurye T.", role: "Assistant", hoursPerWeek: 35, hoursPerMonth: 151.7, locationId: 1 }
];

/**
 * Standortdaten (aus src/data/locationData.ts)
 */
const locationData: Omit<Location, 'id'>[] = [
  {
    name: 'Dialysepraxis Elmshorn',
    address: 'Musterstraße 123',
    city: 'Elmshorn',
    postalCode: '25335',
    phone: '+49 4121 123456',
    email: 'elmshorn@dialysepraxis.de',
    manager: 'Dr. Schmidt',
    capacity: 24,
    operatingHours: {
      monday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      tuesday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      wednesday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      thursday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      friday: [
        { start: '06:00', end: '14:00' },
        { start: '14:00', end: '22:00' }
      ],
      saturday: [
        { start: '07:00', end: '15:00' }
      ],
      sunday: []
    },
    services: ['Hämodialyse', 'Hämofiltration', 'Hämodiafiltration'],
    equipment: [
      'Fresenius 5008S',
      'B. Braun Dialog+',
      'Wasseraufbereitungsanlage',
      'Notfallausrüstung'
    ],
    isActive: true
  },
  {
    name: 'Dialysepraxis Uetersen',
    address: 'Bahnhofstraße 45',
    city: 'Uetersen',
    postalCode: '25436',
    phone: '+49 4122 987654',
    email: 'uetersen@dialysepraxis.de',
    manager: 'Dr. Müller',
    capacity: 16,
    operatingHours: {
      monday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      tuesday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      wednesday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      thursday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      friday: [
        { start: '07:00', end: '15:00' },
        { start: '15:00', end: '21:00' }
      ],
      saturday: [
        { start: '08:00', end: '14:00' }
      ],
      sunday: []
    },
    services: ['Hämodialyse', 'Peritonealdialyse'],
    equipment: [
      'Fresenius 4008S',
      'Gambro AK 200',
      'Wasseraufbereitungsanlage',
      'Notfallausrüstung'
    ],
    isActive: true
  }
];

/**
 * Schichtdefinitionen (aus src/data/defaultShifts.ts)
 */
const shiftDefinitionsData = [
  // Standort A (ID: 1) - Lange Tage (Mo, Mi, Fr)
  {
    name: "F",
    display_name: "Frühschicht",
    start_time: "06:00",
    end_time: "13:00",
    hours: 7,
    day_type: "longDays",
    location_id: 1,
    allowed_roles: JSON.stringify(["Specialist", "ShiftLeader", "Assistant"])
  },
  {
    name: "S",
    display_name: "Spätschicht",
    start_time: "12:00",
    end_time: "19:00",
    hours: 7,
    day_type: "longDays",
    location_id: 1,
    allowed_roles: JSON.stringify(["Specialist", "ShiftLeader"])
  },
  
  // Standort A (ID: 1) - Kurze Tage (Di, Do, Sa)
  {
    name: "F",
    display_name: "Frühschicht",
    start_time: "06:00",
    end_time: "13:00",
    hours: 7,
    day_type: "shortDays",
    location_id: 1,
    allowed_roles: JSON.stringify(["Specialist", "ShiftLeader", "Assistant"])
  },
  
  // Standort B (ID: 2) - Lange Tage (Mo, Mi, Fr)
  {
    name: "4",
    display_name: "Frühschicht Standort B",
    start_time: "06:00",
    end_time: "13:00",
    hours: 7,
    day_type: "longDays",
    location_id: 2,
    allowed_roles: JSON.stringify(["Specialist", "Assistant"])
  },
  {
    name: "5",
    display_name: "Spätschicht Standort B",
    start_time: "12:00",
    end_time: "19:00",
    hours: 7,
    day_type: "longDays",
    location_id: 2,
    allowed_roles: JSON.stringify(["Specialist"])
  },
  {
    name: "6",
    display_name: "Schichtleiter Standort B",
    start_time: "06:00",
    end_time: "16:00",
    hours: 10,
    day_type: "longDays",
    location_id: 2,
    allowed_roles: JSON.stringify(["ShiftLeader"])
  }
];

/**
 * Standard-Schichtregeln (aus src/data/defaultRules.ts)
 */
const defaultShiftRules: Omit<ShiftRules, 'id'> = {
  minNursesPerShift: 4,
  minNurseManagersPerShift: 1,
  minHelpers: 1,
  maxSaturdaysPerMonth: 1,
  maxConsecutiveSameShifts: 0,
  weeklyHoursOverflowTolerance: 0.1
};

/**
 * Rollendaten
 */
const roleData = [
  {
    name: 'ShiftLeader',
    display_name: 'Schichtleiter',
    description: 'Verantwortlich für die Leitung einer Schicht und Koordination des Teams',
    color: '#1976d2',
    priority: 1,
    permissions: JSON.stringify(['manage_shifts', 'view_reports', 'manage_team']),
    requirements: JSON.stringify(['leadership_experience', 'medical_qualification'])
  },
  {
    name: 'Specialist',
    display_name: 'Fachkraft',
    description: 'Qualifizierte Fachkraft mit speziellen Kenntnissen und Fertigkeiten',
    color: '#388e3c',
    priority: 2,
    permissions: JSON.stringify(['perform_treatments', 'view_schedules']),
    requirements: JSON.stringify(['medical_qualification', 'certification'])
  },
  {
    name: 'Assistant',
    display_name: 'Hilfskraft',
    description: 'Unterstützende Kraft für allgemeine Aufgaben',
    color: '#f57c00',
    priority: 3,
    permissions: JSON.stringify(['basic_tasks', 'view_schedules']),
    requirements: JSON.stringify(['basic_training'])
  }
];

/**
 * Berechtigungsdaten
 */
const permissionData = [
  // Schichtplanung
  { name: 'manage_shifts', display_name: 'Schichten verwalten', description: 'Schichten erstellen, bearbeiten und löschen', category: 'shift_planning' },
  { name: 'view_schedules', display_name: 'Schichtpläne einsehen', description: 'Schichtpläne und Termine einsehen', category: 'shift_planning' },
  { name: 'assign_shifts', display_name: 'Schichten zuweisen', description: 'Mitarbeiter zu Schichten zuweisen', category: 'shift_planning' },
  
  // Verwaltung
  { name: 'manage_team', display_name: 'Team verwalten', description: 'Mitarbeiter verwalten und koordinieren', category: 'management' },
  { name: 'manage_locations', display_name: 'Standorte verwalten', description: 'Standorte erstellen und bearbeiten', category: 'management' },
  { name: 'manage_roles', display_name: 'Rollen verwalten', description: 'Rollen und Berechtigungen verwalten', category: 'management' },
  
  // Administration
  { name: 'system_admin', display_name: 'Systemadministration', description: 'Vollzugriff auf alle Systemfunktionen', category: 'administration' },
  { name: 'user_management', display_name: 'Benutzerverwaltung', description: 'Benutzerkonten verwalten', category: 'administration' },
  
  // Berichte
  { name: 'view_reports', display_name: 'Berichte einsehen', description: 'Berichte und Statistiken einsehen', category: 'reporting' },
  { name: 'export_data', display_name: 'Daten exportieren', description: 'Daten in verschiedene Formate exportieren', category: 'reporting' },
  
  // Grundlegende Aufgaben
  { name: 'basic_tasks', display_name: 'Grundaufgaben', description: 'Grundlegende Arbeitsaufgaben ausführen', category: 'general' },
  { name: 'perform_treatments', display_name: 'Behandlungen durchführen', description: 'Medizinische Behandlungen durchführen', category: 'medical' }
];

/**
 * Anforderungsdaten
 */
const requirementData = [
  // Qualifikationen
  { name: 'medical_qualification', display_name: 'Medizinische Qualifikation', description: 'Abgeschlossene medizinische Ausbildung', type: 'qualification', required: true },
  { name: 'leadership_experience', display_name: 'Führungserfahrung', description: 'Erfahrung in der Teamleitung', type: 'experience', required: false },
  { name: 'basic_training', display_name: 'Grundausbildung', description: 'Grundlegende berufliche Ausbildung', type: 'qualification', required: true },
  
  // Zertifizierungen
  { name: 'certification', display_name: 'Fachzertifizierung', description: 'Spezielle Fachzertifizierung', type: 'certification', required: true },
  { name: 'safety_training', display_name: 'Sicherheitsschulung', description: 'Arbeitsschutz und Sicherheitsschulung', type: 'certification', required: false },
  
  // Erfahrung
  { name: 'work_experience', display_name: 'Berufserfahrung', description: 'Mindestens 2 Jahre Berufserfahrung', type: 'experience', required: false }
];

/**
 * Seed-Manager-Klasse
 */
export class SeedManager {
  /**
   * Führt alle Seed-Operationen aus
   */
  public static async seedAll(): Promise<void> {
    console.log('Starte Datenbank-Seeding...');

    try {
      await this.seedEmployees();
      await this.seedLocations();
      await this.seedRoles();
      await this.seedPermissions();
      await this.seedRequirements();
      await this.seedShiftDefinitions();
      await this.seedShiftRules();
      await this.seedShiftRulesConfiguration();
      
      console.log('✓ Alle Seed-Daten erfolgreich eingefügt');
    } catch (error) {
      console.error('Fehler beim Seeding:', error);
      throw error;
    }
  }

  /**
   * Fügt Mitarbeiterdaten ein
   */
  private static async seedEmployees(): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO employees (
        id, name, role, hours_per_month, hours_per_week, location_id, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((employees: any[]) => {
      for (const emp of employees) {
        stmt.run(emp.id, emp.name, emp.role, emp.hoursPerMonth, emp.hoursPerWeek, emp.locationId);
      }
    });

    const employeesWithIds = employeeData.map(emp => ({
      id: uuidv4(),
      ...emp
    }));

    insertMany(employeesWithIds);
    console.log(`✓ ${employeesWithIds.length} Mitarbeiter eingefügt`);
  }

  /**
   * Fügt Standortdaten ein
   */
  private static async seedLocations(): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO locations (
        id, name, address, city, postal_code, phone, email, manager,
        capacity, operating_hours, specialties, equipment, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((locations: any[]) => {
      for (const loc of locations) {
        stmt.run(
          loc.id,
          loc.name,
          loc.address,
          loc.city,
          loc.postalCode,
          loc.phone,
          loc.email,
          loc.manager,
          loc.capacity,
          JSON.stringify(loc.operatingHours),
          JSON.stringify(loc.services),
          JSON.stringify(loc.equipment)
        );
      }
    });

    const locationsWithIds = locationData.map((loc, index) => ({
      id: index + 1, // Integer IDs: 1 für Elmshorn, 2 für Uetersen
      ...loc
    }));

    insertMany(locationsWithIds);
    console.log(`✓ ${locationsWithIds.length} Standorte eingefügt`);
  }

  /**
   * Fügt Rollendaten ein
   */
  public static async seedRoles(): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO roles (
        id, name, display_name, description, color, priority, permissions, requirements, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((roles: any[]) => {
      for (const role of roles) {
        stmt.run(
          role.id,
          role.name,
          role.display_name,
          role.description,
          role.color,
          role.priority,
          role.permissions,
          role.requirements
        );
      }
    });

    const rolesWithIds = roleData.map((role, index) => ({
      id: `role-${index + 1}`,
      ...role
    }));

    insertMany(rolesWithIds);
    console.log(`✓ ${rolesWithIds.length} Rollen eingefügt`);
  }

  /**
   * Fügt Berechtigungsdaten ein
   */
  public static async seedPermissions(): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO role_permissions (
        id, name, display_name, description, category, is_active
      ) VALUES (?, ?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((permissions: any[]) => {
      for (const permission of permissions) {
        stmt.run(
          permission.id,
          permission.name,
          permission.display_name,
          permission.description,
          permission.category
        );
      }
    });

    const permissionsWithIds = permissionData.map((permission, index) => ({
      id: `perm-${index + 1}`,
      ...permission
    }));

    insertMany(permissionsWithIds);
    console.log(`✓ ${permissionsWithIds.length} Berechtigungen eingefügt`);
  }

  /**
   * Fügt Anforderungsdaten ein
   */
  public static async seedRequirements(): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO role_requirements (
        id, name, display_name, description, type, required, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((requirements: any[]) => {
      for (const requirement of requirements) {
        stmt.run(
          requirement.id,
          requirement.name,
          requirement.display_name,
          requirement.description,
          requirement.type,
          requirement.required ? 1 : 0
        );
      }
    });

    const requirementsWithIds = requirementData.map((requirement, index) => ({
      id: `req-${index + 1}`,
      ...requirement
    }));

    insertMany(requirementsWithIds);
    console.log(`✓ ${requirementsWithIds.length} Anforderungen eingefügt`);
  }

  /**
   * Fügt Schichtdefinitionen ein
   */
  private static async seedShiftDefinitions(): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO shift_definitions (
        id, name, display_name, start_time, end_time, hours, day_type, location_id, allowed_roles, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((definitions: any[]) => {
      for (const def of definitions) {
        stmt.run(
          def.id,
          def.name,
          def.display_name,
          def.start_time,
          def.end_time,
          def.hours,
          def.day_type,
          def.location_id,
          def.allowed_roles
        );
      }
    });

    const definitionsWithIds = shiftDefinitionsData.map((def, index) => ({
      id: `shift-def-${index + 1}`,
      ...def
    }));

    insertMany(definitionsWithIds);
    console.log(`✓ ${definitionsWithIds.length} Schichtdefinitionen eingefügt`);
  }

  /**
   * Fügt Standard-Schichtregeln ein
   */
  private static async seedShiftRules(): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO shift_rules (
        id, min_nurses_per_shift, min_nurse_managers_per_shift, min_helpers,
        max_saturdays_per_month, max_consecutive_same_shifts, 
        weekly_hours_overflow_tolerance, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const rulesId = 'default-rules';
    stmt.run(
      rulesId,
      defaultShiftRules.minNursesPerShift,
      defaultShiftRules.minNurseManagersPerShift,
      defaultShiftRules.minHelpers,
      defaultShiftRules.maxSaturdaysPerMonth,
      defaultShiftRules.maxConsecutiveSameShifts,
      defaultShiftRules.weeklyHoursOverflowTolerance
    );

    console.log('✓ Standard-Schichtregeln eingefügt');
  }

  /**
   * Fügt Standard-Schichtregeln-Konfiguration ein
   */
  public static async seedShiftRulesConfiguration(): Promise<void> {
    // Prüfen ob bereits eine Konfiguration existiert
    const existingConfig = db.prepare('SELECT COUNT(*) as count FROM shift_rules_configurations').get() as { count: number };
    if (existingConfig.count > 0) {
      console.log('✓ Schichtregeln-Konfiguration bereits vorhanden');
      return;
    }

    const configId = 'default-config';
    const globalRulesId = uuidv4();

    // Transaction für die gesamte Konfiguration
    const transaction = db.transaction(() => {
      // Hauptkonfiguration erstellen
      const configStmt = db.prepare(`
        INSERT INTO shift_rules_configurations (
          id, name, description, is_default, is_active
        ) VALUES (?, ?, ?, 1, 1)
      `);
      
      configStmt.run(
        configId,
        'Standard Schichtregeln',
        'Standard-Konfiguration für beide Praxen mit allen Schichttypen'
      );

      // Globale Regeln erstellen
      const globalRulesStmt = db.prepare(`
        INSERT INTO global_shift_rules (
          id, configuration_id, max_consecutive_days, min_rest_hours_between_shifts,
          max_overtime_percentage, max_saturdays_per_month, allow_back_to_back_shifts,
          preferred_shift_rotation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      globalRulesStmt.run(
        globalRulesId,
        configId,
        5, // max_consecutive_days
        11, // min_rest_hours_between_shifts
        10, // max_overtime_percentage
        1, // max_saturdays_per_month
        0, // allow_back_to_back_shifts (false)
        'forward' // preferred_shift_rotation
      );

      // Schichten erstellen basierend auf DEFAULT_SHIFT_RULES_CONFIG
      const shifts = [
        // Elmshorn Frühschicht (Lange Tage)
        {
          id: uuidv4(),
          name: 'F',
          displayName: 'Frühschicht (Lange Tage)',
          startTime: '06:00',
          endTime: '13:00',
          location: 'Elmshorn',
          dayTypes: ['longDay'],
          requiredRoles: [
            { roleId: 'role-1', roleName: 'Schichtleiter', minCount: 1, maxCount: 1, priority: 1 },
            { roleId: 'role-2', roleName: 'Fachkraft', minCount: 3, maxCount: 5, priority: 2 },
            { roleId: 'role-3', roleName: 'Hilfskraft', minCount: 1, maxCount: 2, priority: 3 }
          ]
        },
        // Elmshorn Spätschicht (Lange Tage)
        {
          id: uuidv4(),
          name: 'S',
          displayName: 'Spätschicht (Lange Tage)',
          startTime: '12:00',
          endTime: '19:00',
          location: 'Elmshorn',
          dayTypes: ['longDay'],
          requiredRoles: [
            { roleId: 'role-1', roleName: 'Schichtleiter', minCount: 1, maxCount: 1, priority: 1 },
            { roleId: 'role-2', roleName: 'Fachkraft', minCount: 3, maxCount: 4, priority: 2 }
          ]
        },
        // Elmshorn Frühschicht (Kurze Tage)
        {
          id: uuidv4(),
          name: 'F',
          displayName: 'Frühschicht (Kurze Tage)',
          startTime: '06:00',
          endTime: '13:00',
          location: 'Elmshorn',
          dayTypes: ['shortDay', 'saturday'],
          requiredRoles: [
            { roleId: 'role-1', roleName: 'Schichtleiter', minCount: 1, maxCount: 1, priority: 1 },
            { roleId: 'role-2', roleName: 'Fachkraft', minCount: 2, maxCount: 3, priority: 2 },
            { roleId: 'role-3', roleName: 'Hilfskraft', minCount: 1, maxCount: 1, priority: 3 }
          ]
        },
        // Uetersen Frühschicht
        {
          id: uuidv4(),
          name: '4',
          displayName: 'Uetersen Frühschicht',
          startTime: '06:00',
          endTime: '13:00',
          location: 'Uetersen',
          dayTypes: ['longDay'],
          requiredRoles: [
            { roleId: 'role-2', roleName: 'Fachkraft', minCount: 1, maxCount: 2, priority: 1 },
            { roleId: 'role-3', roleName: 'Hilfskraft', minCount: 1, maxCount: 1, priority: 2 }
          ]
        },
        // Uetersen Spätschicht
        {
          id: uuidv4(),
          name: '5',
          displayName: 'Uetersen Spätschicht',
          startTime: '12:00',
          endTime: '19:00',
          location: 'Uetersen',
          dayTypes: ['longDay'],
          requiredRoles: [
            { roleId: 'role-2', roleName: 'Fachkraft', minCount: 1, maxCount: 1, priority: 1 }
          ]
        }
      ];

      const shiftStmt = db.prepare(`
        INSERT INTO configurable_shifts (
          id, configuration_id, name, display_name, start_time, end_time, location, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `);
      
      const dayTypeStmt = db.prepare(`
        INSERT INTO shift_day_types (id, shift_id, day_type) VALUES (?, ?, ?)
      `);
      
      const roleReqStmt = db.prepare(`
        INSERT INTO shift_role_requirements (
          id, shift_id, role_id, role_name, min_count, max_count, priority
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const shift of shifts) {
        // Schicht erstellen
        shiftStmt.run(
          shift.id,
          configId,
          shift.name,
          shift.displayName,
          shift.startTime,
          shift.endTime,
          shift.location
        );

        // Tag-Typen hinzufügen
        for (const dayType of shift.dayTypes) {
          dayTypeStmt.run(uuidv4(), shift.id, dayType);
        }

        // Rollenanforderungen hinzufügen
        for (const roleReq of shift.requiredRoles) {
          roleReqStmt.run(
            uuidv4(),
            shift.id,
            roleReq.roleId,
            roleReq.roleName,
            roleReq.minCount,
            roleReq.maxCount || null,
            roleReq.priority
          );
        }
      }
    });

    transaction();
    console.log('✓ Standard-Schichtregeln-Konfiguration eingefügt');
  }

  /**
   * Überprüft, ob bereits Seed-Daten vorhanden sind
   */
  public static checkSeedStatus(): { hasData: boolean; needsRoleSeeding: boolean } {
    try {
      const employeeCount = db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number };
      const locationCount = db.prepare('SELECT COUNT(*) as count FROM locations').get() as { count: number };
      const roleCount = db.prepare('SELECT COUNT(*) as count FROM roles').get() as { count: number };
      const permissionCount = db.prepare('SELECT COUNT(*) as count FROM role_permissions').get() as { count: number };
      const requirementCount = db.prepare('SELECT COUNT(*) as count FROM role_requirements').get() as { count: number };
      const shiftDefCount = db.prepare('SELECT COUNT(*) as count FROM shift_definitions').get() as { count: number };
      const rulesCount = db.prepare('SELECT COUNT(*) as count FROM shift_rules').get() as { count: number };
      const configCount = db.prepare('SELECT COUNT(*) as count FROM shift_rules_configurations').get() as { count: number };

      const hasBasicData = employeeCount.count > 0 || locationCount.count > 0 || shiftDefCount.count > 0 || rulesCount.count > 0;
      const needsRoleSeeding = roleCount.count === 0 || permissionCount.count === 0 || requirementCount.count === 0;
      
      console.log(`Vorhandene Daten: ${employeeCount.count} Mitarbeiter, ${locationCount.count} Standorte, ${roleCount.count} Rollen, ${permissionCount.count} Berechtigungen, ${requirementCount.count} Anforderungen, ${shiftDefCount.count} Schichtdefinitionen, ${rulesCount.count} Regelsets, ${configCount.count} Schichtregeln-Konfigurationen`);

      return { hasData: hasBasicData, needsRoleSeeding };
    } catch (error) {
      console.error('Fehler beim Überprüfen des Seed-Status:', error);
      return { hasData: false, needsRoleSeeding: true };
    }
  }

  /**
   * Löscht alle Seed-Daten (für Tests)
   */
  public static clearSeedData(): void {
    db.transaction(() => {
      db.exec('DELETE FROM constraint_violations');
      db.exec('DELETE FROM shift_assignments');
      db.exec('DELETE FROM shift_plans');
      db.exec('DELETE FROM shift_role_requirements');
      db.exec('DELETE FROM shift_day_types');
      db.exec('DELETE FROM configurable_shifts');
      db.exec('DELETE FROM global_shift_rules');
      db.exec('DELETE FROM shift_rules_configurations');
      db.exec('DELETE FROM shift_rules');
      db.exec('DELETE FROM shift_definitions');
      db.exec('DELETE FROM role_requirements');
      db.exec('DELETE FROM role_permissions');
      db.exec('DELETE FROM roles');
      db.exec('DELETE FROM locations');
      db.exec('DELETE FROM employees');
      db.exec('DELETE FROM audit_log');
    })();

    console.log('✓ Alle Seed-Daten gelöscht');
  }
}

/**
 * Hauptfunktion für Seeding
 */
export const seedDatabase = async (): Promise<void> => {
  const seedStatus = SeedManager.checkSeedStatus();
  
  // Prüfen ob Schichtregeln-Konfiguration fehlt
  const configCount = db.prepare('SELECT COUNT(*) as count FROM shift_rules_configurations').get() as { count: number };
  const needsConfigSeeding = configCount.count === 0;
  
  if (seedStatus.hasData && !seedStatus.needsRoleSeeding && !needsConfigSeeding) {
    console.log('Datenbank enthält bereits alle Daten. Seeding übersprungen.');
    return;
  }

  if (seedStatus.hasData && seedStatus.needsRoleSeeding) {
    console.log('Füge fehlende Rollen-Daten hinzu...');
    await SeedManager.seedRoles();
    await SeedManager.seedPermissions();
    await SeedManager.seedRequirements();
    console.log('✓ Rollen-Daten erfolgreich hinzugefügt');
  }

  if (needsConfigSeeding) {
    console.log('Füge Standard-Schichtregeln-Konfiguration hinzu...');
    await SeedManager.seedShiftRulesConfiguration();
    console.log('✓ Schichtregeln-Konfiguration erfolgreich hinzugefügt');
  }

  if (!seedStatus.hasData) {
    await SeedManager.seedAll();
  }
};