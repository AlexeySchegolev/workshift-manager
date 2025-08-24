"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = exports.SeedManager = void 0;
const uuid_1 = require("uuid");
const database_1 = require("./database");
const employeeData = [
    { name: "Sonja M.", role: "ShiftLeader", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort B" },
    { name: "Andrea K.", role: "ShiftLeader", hoursPerWeek: 36, hoursPerMonth: 156.0, location: "Standort A" },
    { name: "Christina L.", role: "ShiftLeader", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" },
    { name: "Uta S.", role: "ShiftLeader", hoursPerWeek: 28, hoursPerMonth: 121.3, location: "Standort A" },
    { name: "Simone R.", role: "ShiftLeader", hoursPerWeek: 29, hoursPerMonth: 126.0, location: "Standort A" },
    { name: "Andrea B.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 121.33, location: "Standort A" },
    { name: "Sabrina H.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 152.0, location: "Standort A" },
    { name: "Kay W.", role: "Specialist", hoursPerWeek: 33, hoursPerMonth: 142.5, location: "Standort B" },
    { name: "Esther T.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" },
    { name: "Annika F.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.1, location: "Standort A" },
    { name: "Alina G.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort B" },
    { name: "Britta N.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" },
    { name: "Saskia P.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" },
    { name: "Natalia V.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 121.3, location: "Standort A" },
    { name: "Marina D.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" },
    { name: "Sandra J.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort B" },
    { name: "Susann C.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" },
    { name: "Mandy E.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort B" },
    { name: "Eugenia A.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" },
    { name: "Silke B.", role: "Specialist", hoursPerWeek: 24, hoursPerMonth: 106.2, location: "Standort B" },
    { name: "Nisa O.", role: "Specialist", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" },
    { name: "Tobias M.", role: "Specialist", hoursPerWeek: 28, hoursPerMonth: 123.1, location: "Standort A" },
    { name: "Silke K.", role: "Assistant", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort B" },
    { name: "Karen L.", role: "Assistant", hoursPerWeek: 23, hoursPerMonth: 99.4, location: "Standort A" },
    { name: "Birgit S.", role: "Assistant", hoursPerWeek: 31, hoursPerMonth: 135.0, location: "Standort A" },
    { name: "Birgit W.", role: "Assistant", hoursPerWeek: 28, hoursPerMonth: 121.0, location: "Standort A" },
    { name: "Jessica R.", role: "Assistant", hoursPerWeek: 39, hoursPerMonth: 169.1, location: "Standort A" },
    { name: "Nurye T.", role: "Assistant", hoursPerWeek: 35, hoursPerMonth: 151.7, location: "Standort A" }
];
const locationData = [
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
const shiftDefinitionsData = [
    {
        name: "F",
        display_name: "Frühschicht",
        start_time: "06:00",
        end_time: "13:00",
        hours: 7,
        day_type: "longDays",
        location: "Standort A",
        allowed_roles: JSON.stringify(["Specialist", "ShiftLeader", "Assistant"])
    },
    {
        name: "S",
        display_name: "Spätschicht",
        start_time: "12:00",
        end_time: "19:00",
        hours: 7,
        day_type: "longDays",
        location: "Standort A",
        allowed_roles: JSON.stringify(["Specialist", "ShiftLeader"])
    },
    {
        name: "F",
        display_name: "Frühschicht",
        start_time: "06:00",
        end_time: "13:00",
        hours: 7,
        day_type: "shortDays",
        location: "Standort A",
        allowed_roles: JSON.stringify(["Specialist", "ShiftLeader", "Assistant"])
    },
    {
        name: "4",
        display_name: "Frühschicht Standort B",
        start_time: "06:00",
        end_time: "13:00",
        hours: 7,
        day_type: "longDays",
        location: "Standort B",
        allowed_roles: JSON.stringify(["Specialist", "Assistant"])
    },
    {
        name: "5",
        display_name: "Spätschicht Standort B",
        start_time: "12:00",
        end_time: "19:00",
        hours: 7,
        day_type: "longDays",
        location: "Standort B",
        allowed_roles: JSON.stringify(["Specialist"])
    },
    {
        name: "6",
        display_name: "Schichtleiter Standort B",
        start_time: "06:00",
        end_time: "16:00",
        hours: 10,
        day_type: "longDays",
        location: "Standort B",
        allowed_roles: JSON.stringify(["ShiftLeader"])
    }
];
const defaultShiftRules = {
    minNursesPerShift: 4,
    minNurseManagersPerShift: 1,
    minHelpers: 1,
    maxSaturdaysPerMonth: 1,
    maxConsecutiveSameShifts: 0,
    weeklyHoursOverflowTolerance: 0.1
};
class SeedManager {
    static async seedAll() {
        console.log('Starte Datenbank-Seeding...');
        try {
            await this.seedEmployees();
            await this.seedLocations();
            await this.seedShiftDefinitions();
            await this.seedShiftRules();
            console.log('✓ Alle Seed-Daten erfolgreich eingefügt');
        }
        catch (error) {
            console.error('Fehler beim Seeding:', error);
            throw error;
        }
    }
    static async seedEmployees() {
        const stmt = database_1.db.prepare(`
      INSERT OR IGNORE INTO employees (
        id, name, role, hours_per_month, hours_per_week, location, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
        const insertMany = database_1.db.transaction((employees) => {
            for (const emp of employees) {
                stmt.run(emp.id, emp.name, emp.role, emp.hoursPerMonth, emp.hoursPerWeek, emp.location);
            }
        });
        const employeesWithIds = employeeData.map(emp => ({
            id: (0, uuid_1.v4)(),
            ...emp
        }));
        insertMany(employeesWithIds);
        console.log(`✓ ${employeesWithIds.length} Mitarbeiter eingefügt`);
    }
    static async seedLocations() {
        const stmt = database_1.db.prepare(`
      INSERT OR IGNORE INTO locations (
        id, name, address, city, postal_code, phone, email, manager,
        capacity, operating_hours, specialties, equipment, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
        const insertMany = database_1.db.transaction((locations) => {
            for (const loc of locations) {
                stmt.run(loc.id, loc.name, loc.address, loc.city, loc.postalCode, loc.phone, loc.email, loc.manager, loc.capacity, JSON.stringify(loc.operatingHours), JSON.stringify(loc.services), JSON.stringify(loc.equipment));
            }
        });
        const locationsWithIds = locationData.map(loc => ({
            id: loc.name === 'Dialysepraxis Elmshorn' ? 'elmshorn' : 'uetersen',
            ...loc
        }));
        insertMany(locationsWithIds);
        console.log(`✓ ${locationsWithIds.length} Standorte eingefügt`);
    }
    static async seedShiftDefinitions() {
        const stmt = database_1.db.prepare(`
      INSERT OR IGNORE INTO shift_definitions (
        id, name, display_name, start_time, end_time, hours, day_type, location, allowed_roles, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
        const insertMany = database_1.db.transaction((definitions) => {
            for (const def of definitions) {
                stmt.run(def.id, def.name, def.display_name, def.start_time, def.end_time, def.hours, def.day_type, def.location, def.allowed_roles);
            }
        });
        const definitionsWithIds = shiftDefinitionsData.map((def, index) => ({
            id: `shift-def-${index + 1}`,
            ...def
        }));
        insertMany(definitionsWithIds);
        console.log(`✓ ${definitionsWithIds.length} Schichtdefinitionen eingefügt`);
    }
    static async seedShiftRules() {
        const stmt = database_1.db.prepare(`
      INSERT OR IGNORE INTO shift_rules (
        id, min_nurses_per_shift, min_nurse_managers_per_shift, min_helpers,
        max_saturdays_per_month, max_consecutive_same_shifts, 
        weekly_hours_overflow_tolerance, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);
        const rulesId = 'default-rules';
        stmt.run(rulesId, defaultShiftRules.minNursesPerShift, defaultShiftRules.minNurseManagersPerShift, defaultShiftRules.minHelpers, defaultShiftRules.maxSaturdaysPerMonth, defaultShiftRules.maxConsecutiveSameShifts, defaultShiftRules.weeklyHoursOverflowTolerance);
        console.log('✓ Standard-Schichtregeln eingefügt');
    }
    static checkSeedStatus() {
        try {
            const employeeCount = database_1.db.prepare('SELECT COUNT(*) as count FROM employees').get();
            const locationCount = database_1.db.prepare('SELECT COUNT(*) as count FROM locations').get();
            const shiftDefCount = database_1.db.prepare('SELECT COUNT(*) as count FROM shift_definitions').get();
            const rulesCount = database_1.db.prepare('SELECT COUNT(*) as count FROM shift_rules').get();
            const hasData = employeeCount.count > 0 || locationCount.count > 0 || shiftDefCount.count > 0 || rulesCount.count > 0;
            if (hasData) {
                console.log(`Vorhandene Daten: ${employeeCount.count} Mitarbeiter, ${locationCount.count} Standorte, ${shiftDefCount.count} Schichtdefinitionen, ${rulesCount.count} Regelsets`);
            }
            return hasData;
        }
        catch (error) {
            console.error('Fehler beim Überprüfen des Seed-Status:', error);
            return false;
        }
    }
    static clearSeedData() {
        database_1.db.transaction(() => {
            database_1.db.exec('DELETE FROM constraint_violations');
            database_1.db.exec('DELETE FROM shift_assignments');
            database_1.db.exec('DELETE FROM shift_plans');
            database_1.db.exec('DELETE FROM shift_rules');
            database_1.db.exec('DELETE FROM shift_definitions');
            database_1.db.exec('DELETE FROM locations');
            database_1.db.exec('DELETE FROM employees');
            database_1.db.exec('DELETE FROM audit_log');
        })();
        console.log('✓ Alle Seed-Daten gelöscht');
    }
}
exports.SeedManager = SeedManager;
const seedDatabase = async () => {
    const hasExistingData = SeedManager.checkSeedStatus();
    if (hasExistingData) {
        console.log('Datenbank enthält bereits Daten. Seeding übersprungen.');
        return;
    }
    await SeedManager.seedAll();
};
exports.seedDatabase = seedDatabase;
//# sourceMappingURL=seed.js.map