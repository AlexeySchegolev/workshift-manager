import { v4 as uuidv4 } from 'uuid';
import { dbManager } from './database';
import { Employee, Location, ShiftRules } from '@/types/interfaces';
import { logger } from '../utils/logger';

/**
 * Seed-Daten für die PostgreSQL-Datenbank
 * Automatisch beim Dev-Start ausgeführt
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
    specialties: ['Hämodialyse', 'Hämofiltration', 'Hämodiafiltration'],
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
    specialties: ['Hämodialyse', 'Peritonealdialyse'],
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
    allowed_roles: ["Specialist", "ShiftLeader", "Assistant"]
  },
  {
    name: "S",
    display_name: "Spätschicht",
    start_time: "12:00",
    end_time: "19:00",
    hours: 7,
    day_type: "longDays",
    location_id: 1,
    allowed_roles: ["Specialist", "ShiftLeader"]
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
    allowed_roles: ["Specialist", "ShiftLeader", "Assistant"]
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
    allowed_roles: ["Specialist", "Assistant"]
  },
  {
    name: "5",
    display_name: "Spätschicht Standort B",
    start_time: "12:00",
    end_time: "19:00",
    hours: 7,
    day_type: "longDays",
    location_id: 2,
    allowed_roles: ["Specialist"]
  },
  {
    name: "6",
    display_name: "Schichtleiter Standort B",
    start_time: "06:00",
    end_time: "16:00",
    hours: 10,
    day_type: "longDays",
    location_id: 2,
    allowed_roles: ["ShiftLeader"]
  }
];

/**
 * Standard Schichtregeln
 */
const defaultShiftRules: Omit<ShiftRules, 'id'> = {
  minNursesPerShift: 4,
  minNurseManagersPerShift: 1,
  minHelpers: 1,
  maxSaturdaysPerMonth: 1,
  maxConsecutiveSameShifts: 0,
  weeklyHoursOverflowTolerance: 0.1,
  isActive: true
};

/**
 * Rollen-Daten
 */
const rolesData = [
  {
    name: 'ShiftLeader',
    display_name: 'Schichtleiter',
    description: 'Leitet die Schicht und übernimmt Verantwortung',
    color: '#2563eb',
    priority: 1,
    permissions: ['manage_shift', 'supervise_team', 'handle_emergencies'],
    requirements: ['leadership_experience', 'medical_qualification']
  },
  {
    name: 'Specialist', 
    display_name: 'Fachkraft',
    description: 'Qualifizierte Fachkraft mit speziellem Know-how',
    color: '#16a34a',
    priority: 2,
    permissions: ['operate_equipment', 'patient_care'],
    requirements: ['medical_qualification', 'certification']
  },
  {
    name: 'Assistant',
    display_name: 'Hilfskraft',
    description: 'Unterstützt bei allgemeinen Aufgaben',
    color: '#ca8a04',
    priority: 3,
    permissions: ['basic_tasks', 'assist_patients'],
    requirements: ['basic_training']
  }
];

/**
 * PostgreSQL Seed-Manager-Klasse
 */
export class SeedManager {
  /**
   * Führt alle Seed-Operationen aus
   */
  public static async seedAll(): Promise<void> {
    logger.info('Starte PostgreSQL-Datenbank-Seeding...');

    try {
      // Reihenfolge wichtig wegen Foreign Keys
      await this.seedLocations();
      await this.seedEmployees();
      await this.seedShiftDefinitions();
      await this.seedShiftRules();
      
      logger.info('✓ Alle Seed-Daten erfolgreich in PostgreSQL eingefügt');
    } catch (error) {
      logger.error('Fehler beim PostgreSQL-Seeding:', error);
      throw error;
    }
  }

  /**
   * Fügt Standortdaten ein (zuerst wegen Foreign Keys)
   */
  private static async seedLocations(): Promise<void> {
    const locationsWithIds = locationData.map((loc, index) => ({
      id: index + 1, // Integer IDs: 1 für Elmshorn, 2 für Uetersen
      ...loc
    }));

    await dbManager.transaction(async (client) => {
      for (const loc of locationsWithIds) {
        await client.query(`
          INSERT INTO locations (
            id, name, address, city, postal_code, phone, email, manager,
            capacity, operating_hours, specialties, equipment, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO NOTHING
        `, [
          loc.id,
          loc.name,
          loc.address,
          loc.city,
          loc.postalCode,
          loc.phone || null,
          loc.email || null,
          loc.manager || null,
          loc.capacity,
          JSON.stringify(loc.operatingHours), // JSONB field
          JSON.stringify(loc.specialties),    // JSONB field  
          JSON.stringify(loc.equipment),      // JSONB field
          true
        ]);
      }
    });

    logger.info(`✓ ${locationsWithIds.length} Standorte eingefügt`);
  }

  /**
   * Fügt Mitarbeiterdaten ein
   */
  private static async seedEmployees(): Promise<void> {
    const employeesWithIds = employeeData.map(emp => ({
      id: uuidv4(),
      ...emp
    }));

    await dbManager.transaction(async (client) => {
      for (const emp of employeesWithIds) {
        await client.query(`
          INSERT INTO employees (
            id, name, role, hours_per_month, hours_per_week, location_id, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING
        `, [
          emp.id,
          emp.name,
          emp.role,
          emp.hoursPerMonth,
          emp.hoursPerWeek || null,
          emp.locationId || null,
          true
        ]);
      }
    });

    logger.info(`✓ ${employeesWithIds.length} Mitarbeiter eingefügt`);
  }

  /**
   * Fügt Schichtdefinitionen ein
   */
  private static async seedShiftDefinitions(): Promise<void> {
    const definitionsWithIds = shiftDefinitionsData.map(def => ({
      id: uuidv4(),
      ...def
    }));

    await dbManager.transaction(async (client) => {
      for (const def of definitionsWithIds) {
        await client.query(`
          INSERT INTO shift_definitions (
            id, name, display_name, start_time, end_time, hours, day_type, location_id, allowed_roles, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (name, location_id) DO NOTHING
        `, [
          def.id,
          def.name,
          def.display_name,
          def.start_time,
          def.end_time,
          def.hours,
          def.day_type,
          def.location_id || null,
          JSON.stringify(def.allowed_roles), // JSONB field
          true
        ]);
      }
    });

    logger.info(`✓ ${definitionsWithIds.length} Schichtdefinitionen eingefügt`);
  }

  /**
   * Fügt Standard-Schichtregeln ein
   */
  private static async seedShiftRules(): Promise<void> {
    const ruleId = uuidv4();

    await dbManager.query(`
      INSERT INTO shift_rules (
        id, min_nurses_per_shift, min_nurse_managers_per_shift, min_helpers,
        max_saturdays_per_month, max_consecutive_same_shifts, 
        weekly_hours_overflow_tolerance, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO NOTHING
    `, [
      ruleId,
      defaultShiftRules.minNursesPerShift,
      defaultShiftRules.minNurseManagersPerShift,
      defaultShiftRules.minHelpers,
      defaultShiftRules.maxSaturdaysPerMonth,
      defaultShiftRules.maxConsecutiveSameShifts,
      defaultShiftRules.weeklyHoursOverflowTolerance,
      true
    ]);

    logger.info('✓ Standard-Schichtregeln eingefügt');
  }

  /**
   * Prüft ob Seed-Daten bereits vorhanden sind
   */
  public static async checkSeedStatus(): Promise<boolean> {
    try {
      const locationResult = await dbManager.query('SELECT COUNT(*) as count FROM locations');
      const employeeResult = await dbManager.query('SELECT COUNT(*) as count FROM employees');
      
      const locationCount = parseInt(locationResult.rows[0].count);
      const employeeCount = parseInt(employeeResult.rows[0].count);
      
      return locationCount > 0 && employeeCount > 0;
    } catch (error) {
      logger.error('Fehler beim Prüfen des Seed-Status:', error);
      return false;
    }
  }

  /**
   * Löscht alle Seed-Daten (für Tests)
   */
  public static async clearSeedData(): Promise<void> {
    logger.warn('Lösche alle Seed-Daten...');

    await dbManager.transaction(async (client) => {
      // Reihenfolge beachten wegen Foreign Keys
      await client.query('DELETE FROM shift_assignments');
      await client.query('DELETE FROM constraint_violations');  
      await client.query('DELETE FROM shift_plans');
      await client.query('DELETE FROM shift_definitions');
      await client.query('DELETE FROM shift_rules');
      await client.query('DELETE FROM employees');
      await client.query('DELETE FROM locations');
    });

    logger.info('✓ Alle Seed-Daten gelöscht');
  }
}

/**
 * Hauptfunktion für automatisches Seeding beim Dev-Start
 */
export async function seedDatabase(): Promise<void> {
  try {
    logger.info('Starte automatisches Database-Seeding...');
    
    // Prüfe ob bereits Daten vorhanden sind
    const hasData = await SeedManager.checkSeedStatus();
    
    if (hasData) {
      logger.info('Seed-Daten bereits vorhanden, überspringe Seeding');
      return;
    }

    // Führe Seeding aus
    await SeedManager.seedAll();
    
  } catch (error) {
    logger.error('Fehler beim automatischen Seeding:', error);
    throw error;
  }
}

// Export für manuellen Aufruf
export default SeedManager;