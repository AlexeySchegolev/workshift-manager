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
  { name: "Sr. Sonja", role: "Schichtleiter", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { name: "Sr. Andrea 2", role: "Schichtleiter", hoursPerWeek: 36, hoursPerMonth: 156.0, clinic: "Elmshorn" },
  { name: "Sr. Christina", role: "Schichtleiter", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { name: "Sr. Uta", role: "Schichtleiter", hoursPerWeek: 28, hoursPerMonth: 121.3, clinic: "Elmshorn" },
  { name: "Sr. Simone", role: "Schichtleiter", hoursPerWeek: 29, hoursPerMonth: 126.0, clinic: "Elmshorn" },
  
  // Pfleger
  { name: "Sr. Andrea B", role: "Pfleger", hoursPerWeek: 28, hoursPerMonth: 121.33, clinic: "Elmshorn" },
  { name: "Sr. Sabrina", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 152.0, clinic: "Elmshorn" },
  { name: "Sr. Kay", role: "Pfleger", hoursPerWeek: 33, hoursPerMonth: 142.5, clinic: "Uetersen" },
  { name: "Sr. Esther", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { name: "Sr. Annika", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.1, clinic: "Elmshorn" },
  { name: "Sr. Alina", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { name: "Sr. Britta", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { name: "Sr. Saskia", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { name: "Sr. Natalia", role: "Pfleger", hoursPerWeek: 28, hoursPerMonth: 121.3, clinic: "Elmshorn" },
  { name: "Sr. Marina", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { name: "Sr. Sandra", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { name: "Sr. Susann", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { name: "Sr. Mandy", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { name: "Sr. Eugenia", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { name: "Sr. Silke B", role: "Pfleger", hoursPerWeek: 24, hoursPerMonth: 106.2, clinic: "Uetersen" },
  { name: "Nisa", role: "Pfleger", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" },
  { name: "Pfl. Tobias", role: "Pfleger", hoursPerWeek: 28, hoursPerMonth: 123.1, clinic: "Elmshorn" },
  
  // Pflegehelfer
  { name: "Silke", role: "Pflegehelfer", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Uetersen" },
  { name: "Karen", role: "Pflegehelfer", hoursPerWeek: 23, hoursPerMonth: 99.4, clinic: "Elmshorn" },
  { name: "Birgit", role: "Pflegehelfer", hoursPerWeek: 31, hoursPerMonth: 135.0, clinic: "Elmshorn" },
  { name: "Birgit 2", role: "Pflegehelfer", hoursPerWeek: 28, hoursPerMonth: 121.0, clinic: "Elmshorn" },
  { name: "Jessica", role: "Pflegehelfer", hoursPerWeek: 39, hoursPerMonth: 169.1, clinic: "Elmshorn" },
  { name: "Nurye", role: "Pflegehelfer", hoursPerWeek: 35, hoursPerMonth: 151.7, clinic: "Elmshorn" }
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
      await this.seedShiftRules();
      
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
        id, name, role, hours_per_month, hours_per_week, clinic, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    const insertMany = db.transaction((employees: any[]) => {
      for (const emp of employees) {
        stmt.run(emp.id, emp.name, emp.role, emp.hoursPerMonth, emp.hoursPerWeek, emp.clinic);
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
          JSON.stringify(loc.specialties),
          JSON.stringify(loc.equipment)
        );
      }
    });

    const locationsWithIds = locationData.map(loc => ({
      id: loc.name === 'Dialysepraxis Elmshorn' ? 'elmshorn' : 'uetersen',
      ...loc
    }));

    insertMany(locationsWithIds);
    console.log(`✓ ${locationsWithIds.length} Standorte eingefügt`);
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
   * Überprüft, ob bereits Seed-Daten vorhanden sind
   */
  public static checkSeedStatus(): boolean {
    try {
      const employeeCount = db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number };
      const locationCount = db.prepare('SELECT COUNT(*) as count FROM locations').get() as { count: number };
      const rulesCount = db.prepare('SELECT COUNT(*) as count FROM shift_rules').get() as { count: number };

      const hasData = employeeCount.count > 0 || locationCount.count > 0 || rulesCount.count > 0;
      
      if (hasData) {
        console.log(`Vorhandene Daten: ${employeeCount.count} Mitarbeiter, ${locationCount.count} Standorte, ${rulesCount.count} Regelsets`);
      }

      return hasData;
    } catch (error) {
      console.error('Fehler beim Überprüfen des Seed-Status:', error);
      return false;
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
      db.exec('DELETE FROM shift_rules');
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
  const hasExistingData = SeedManager.checkSeedStatus();
  
  if (hasExistingData) {
    console.log('Datenbank enthält bereits Daten. Seeding übersprungen.');
    return;
  }

  await SeedManager.seedAll();
};