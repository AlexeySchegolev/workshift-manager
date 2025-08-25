import { ShiftRules } from '../models/interfaces';
import { defaultRules, relaxedRules } from './defaultRules';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// Export leeres Objekt, damit die Datei als Modul erkannt wird
export {};

/**
 * Gesamte Regelbasis für den Schichtplanungs-Algorithmus
 * Diese zentrale Struktur fasst alle Regeln zusammen, die der Algorithmus berücksichtigen muss
 */
export interface ShiftPlanningRuleBase {
  // Allgemeine Regeln
  generalRules: ShiftRules;
  
  // Spezialschicht-Konfiguration
  specialShifts: {
    // Schichtname -> Besetzungsanforderungen
    [shiftName: string]: {
      requiredRoles: string[];  // Erlaubte Rollen
      minCount: number;         // Mindestanzahl an Mitarbeitern
      maxCount: number;         // Maximale Anzahl an Mitarbeitern
      priority: number;         // Priorität (höher = wichtiger)
    }
  };

  // Lange Tage (Mo, Mi, Fr) Konfiguration
  longDayRules: {
    requiredRoles: {
      Schichtleiter: number;    // Anzahl benötigter Schichtleiter
      Pfleger: number;          // Anzahl benötigter Pfleger
      Pflegehelfer: number;     // Anzahl benötigter Pflegehelfer
    };
    shiftPriority: string[];    // Prioritätsreihenfolge der Schichten
  };

  // Kurze Tage (Di, Do, Sa) Konfiguration
  shortDayRules: {
    requiredRoles: {
      Schichtleiter: number;    // Anzahl benötigter Schichtleiter
      Pfleger: number;          // Anzahl benötigter Pfleger
      Pflegehelfer: number;     // Anzahl benötigter Pflegehelfer
    };
    shiftPriority: string[];    // Prioritätsreihenfolge der Schichten
  };

  // Rollen-Einschränkungen
  roleConstraints: {
    Schichtleiter: {
      allowedShifts: string[];  // Erlaubte Schichten
      preferredShifts: string[]; // Bevorzugte Schichten
    };
    Pfleger: {
      allowedShifts: string[];  // Erlaubte Schichten
      preferredShifts: string[]; // Bevorzugte Schichten
    };
    Pflegehelfer: {
      allowedShifts: string[];  // Erlaubte Schichten
      preferredShifts: string[]; // Bevorzugte Schichten
    };
  };
}

// Zentrale Regelbasis (Standardmodus)
export const standardRuleBase: ShiftPlanningRuleBase = {
  generalRules: defaultRules,
  
  specialShifts: {
    'S0': {
      requiredRoles: ['Pfleger', 'Schichtleiter', 'Pflegehelfer'],
      minCount: 1,
      maxCount: 1,
      priority: 100
    },
    'S1': {
      requiredRoles: ['Pfleger', 'Schichtleiter'],
      minCount: 1,
      maxCount: 1,
      priority: 90
    },
    'S00': {
      requiredRoles: ['Pfleger'],
      minCount: 1,
      maxCount: 1,
      priority: 80
    },
    'S': {
      requiredRoles: ['Pfleger', 'Schichtleiter'],
      minCount: 1,
      maxCount: 1,
      priority: 70
    },
    'FS': {
      requiredRoles: ['Pfleger', 'Schichtleiter'],
      minCount: 1,
      maxCount: 1,
      priority: 60
    }
  },
  
  longDayRules: {
    requiredRoles: {
      Schichtleiter: 1,
      Pfleger: 4,
      Pflegehelfer: 1
    },
    shiftPriority: ['S0', 'S1', 'S00', 'S', 'F']
  },
  
  shortDayRules: {
    requiredRoles: {
      Schichtleiter: 1,
      Pfleger: 4,
      Pflegehelfer: 1
    },
    shiftPriority: ['FS', 'F']
  },
  
  roleConstraints: {
    Schichtleiter: {
      allowedShifts: ['F', 'S0', 'S1', 'FS'],
      preferredShifts: ['S1', 'S0']
    },
    Pfleger: {
      allowedShifts: ['F', 'S00', 'S0', 'S1', 'S', 'FS'],
      preferredShifts: []
    },
    Pflegehelfer: {
      allowedShifts: ['F', 'S0'],
      preferredShifts: ['F']
    }
  }
};

// Gelockerte Regelbasis (verwendet, wenn die Standardregeln zu keinem vollständigen Plan führen)
export const relaxedRuleBase: ShiftPlanningRuleBase = {
  ...standardRuleBase,
  generalRules: relaxedRules,
  
  // In der gelockerten Version könnten wir zusätzliche Flexibilität erlauben
  // z.B. für bestimmte Spezialschichten
  specialShifts: {
    ...standardRuleBase.specialShifts,
    'S0': {
      ...standardRuleBase.specialShifts['S0'],
      requiredRoles: ['Pfleger', 'Schichtleiter', 'Pflegehelfer'],
      minCount: 1,
      maxCount: 2  // Im gelockerten Modus mehr Flexibilität
    }
  }
};

// Hilfsfunktion, um aus der detaillierten Textbeschreibung die technische Regelbasis zu extrahieren
export function getActiveRuleBase(strictMode: boolean): ShiftPlanningRuleBase {
  return strictMode ? standardRuleBase : relaxedRuleBase;
}