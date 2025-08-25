/**
 * Interface für konfigurierbare Schichtregeln
 */
export interface ConfigurableShiftRule {
  id: string;
  name: string; // Wie die Schicht in der Schichtplanung benannt wird
  displayName: string; // Anzeigename für die UI
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  requiredRoles: ShiftRoleRequirement[];
  dayTypes: DayType[]; // An welchen Tagen diese Schicht verfügbar ist
  location?: 'Elmshorn' | 'Uetersen' | 'Both'; // Standort-spezifisch
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Rollenanforderungen für eine Schicht
 */
export interface ShiftRoleRequirement {
  roleId: string; // Referenz auf RoleDefinition
  roleName: string; // Name der Rolle (z.B. "Pfleger", "Schichtleiter")
  minCount: number; // Mindestanzahl dieser Rolle
  maxCount?: number; // Maximale Anzahl (optional)
  priority: number; // Priorität bei der Zuteilung (1 = höchste Priorität)
}

/**
 * Tag-Typen für Schichten
 */
export type DayType = 'longDay' | 'shortDay' | 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

/**
 * Schichtregeln-Konfiguration
 */
export interface ShiftRulesConfiguration {
  id: string;
  name: string;
  description: string;
  shifts: ConfigurableShiftRule[];
  globalRules: GlobalShiftRules;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Globale Schichtregeln
 */
export interface GlobalShiftRules {
  maxConsecutiveDays: number; // Maximale aufeinanderfolgende Arbeitstage
  minRestHoursBetweenShifts: number; // Mindest-Ruhezeit zwischen Schichten
  maxOvertimePercentage: number; // Maximale Überstunden in Prozent
  maxSaturdaysPerMonth: number; // Maximale Samstage pro Monat
  allowBackToBackShifts: boolean; // Erlaubt aufeinanderfolgende Schichten
  preferredShiftRotation: 'forward' | 'backward' | 'none'; // Bevorzugte Schichtrotation
}

/**
 * Schichtregeln-Validierung
 */
export interface ShiftRuleValidation {
  isValid: boolean;
  errors: ShiftRuleError[];
  warnings: ShiftRuleWarning[];
}

/**
 * Schichtregeln-Fehler
 */
export interface ShiftRuleError {
  field: string;
  message: string;
  code: string;
}

/**
 * Schichtregeln-Warnung
 */
export interface ShiftRuleWarning {
  field: string;
  message: string;
  code: string;
}

/**
 * Standard-Schichtregeln-Konfiguration
 */
export const DEFAULT_SHIFT_RULES_CONFIG: ShiftRulesConfiguration = {
  id: 'default',
  name: 'Standard Schichtregeln',
  description: 'Standard-Konfiguration für beide Praxen',
  shifts: [
    {
      id: 'frueh-lang',
      name: 'F',
      displayName: 'Frühschicht (Lange Tage)',
      startTime: '06:00',
      endTime: '13:00',
      requiredRoles: [
        {
          roleId: 'schichtleiter',
          roleName: 'Schichtleiter',
          minCount: 1,
          maxCount: 1,
          priority: 1
        },
        {
          roleId: 'pfleger',
          roleName: 'Pfleger',
          minCount: 3,
          maxCount: 5,
          priority: 2
        },
        {
          roleId: 'pflegehelfer',
          roleName: 'Pflegehelfer',
          minCount: 1,
          maxCount: 2,
          priority: 3
        }
      ],
      dayTypes: ['longDay'],
      location: 'Elmshorn',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'spaet-lang',
      name: 'S',
      displayName: 'Spätschicht (Lange Tage)',
      startTime: '12:00',
      endTime: '19:00',
      requiredRoles: [
        {
          roleId: 'schichtleiter',
          roleName: 'Schichtleiter',
          minCount: 1,
          maxCount: 1,
          priority: 1
        },
        {
          roleId: 'pfleger',
          roleName: 'Pfleger',
          minCount: 3,
          maxCount: 4,
          priority: 2
        }
      ],
      dayTypes: ['longDay'],
      location: 'Elmshorn',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'frueh-kurz',
      name: 'F',
      displayName: 'Frühschicht (Kurze Tage)',
      startTime: '06:00',
      endTime: '13:00',
      requiredRoles: [
        {
          roleId: 'schichtleiter',
          roleName: 'Schichtleiter',
          minCount: 1,
          maxCount: 1,
          priority: 1
        },
        {
          roleId: 'pfleger',
          roleName: 'Pfleger',
          minCount: 2,
          maxCount: 3,
          priority: 2
        },
        {
          roleId: 'pflegehelfer',
          roleName: 'Pflegehelfer',
          minCount: 1,
          maxCount: 1,
          priority: 3
        }
      ],
      dayTypes: ['shortDay', 'saturday'],
      location: 'Elmshorn',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'uetersen-frueh',
      name: '4',
      displayName: 'Uetersen Frühschicht',
      startTime: '06:00',
      endTime: '13:00',
      requiredRoles: [
        {
          roleId: 'pfleger',
          roleName: 'Pfleger',
          minCount: 1,
          maxCount: 2,
          priority: 1
        },
        {
          roleId: 'pflegehelfer',
          roleName: 'Pflegehelfer',
          minCount: 1,
          maxCount: 1,
          priority: 2
        }
      ],
      dayTypes: ['longDay'],
      location: 'Uetersen',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'uetersen-spaet',
      name: '5',
      displayName: 'Uetersen Spätschicht',
      startTime: '12:00',
      endTime: '19:00',
      requiredRoles: [
        {
          roleId: 'pfleger',
          roleName: 'Pfleger',
          minCount: 1,
          maxCount: 1,
          priority: 1
        }
      ],
      dayTypes: ['longDay'],
      location: 'Uetersen',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ],
  globalRules: {
    maxConsecutiveDays: 5,
    minRestHoursBetweenShifts: 11,
    maxOvertimePercentage: 10,
    maxSaturdaysPerMonth: 1,
    allowBackToBackShifts: false,
    preferredShiftRotation: 'forward'
  },
  isDefault: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};