import { ShiftDefinitions } from '../models/interfaces';

/**
 * Standard-Schichtdefinitionen für die Schichtplanung
 */
export const defaultShifts: ShiftDefinitions = {
  // Lange Tage (Montag, Mittwoch, Freitag)
  longDays: {
    // Frühschicht
    F: {
      start: "06:00",
      end: "13:00",
      roles: ["Specialist", "ShiftLeader", "Assistant"]
    },
    // Spätschicht (vereinfacht)
    S: {
      start: "12:00",
      end: "19:00",
      roles: ["Specialist", "ShiftLeader"]
    }
  },
  
  // Kurze Tage (Dienstag, Donnerstag, Samstag)
  shortDays: {
    // Frühschicht (auch für Samstag)
    F: {
      start: "06:00",
      end: "13:00",
      roles: ["Specialist", "ShiftLeader", "Assistant"]
    }
  }
};

/**
 * Schichtdefinitionen für Standort B
 * Nur an langen Tagen (Mo, Mi, Fr)
 */
export const standortBShifts: ShiftDefinitions = {
  // Lange Tage (Montag, Mittwoch, Freitag)
  longDays: {
    // Frühschicht (markiert als 4)
    "4": {
      start: "06:00",
      end: "13:00",
      roles: ["Specialist", "Assistant"]
    },
    // Spätschicht (markiert als 5)
    "5": {
      start: "12:00",
      end: "19:00",
      roles: ["Specialist"]
    },
    // Schichtleiter (markiert als 6) - 10 Stunden
    "6": {
      start: "06:00",
      end: "16:00",
      roles: ["ShiftLeader"]
    }
  },
  
  // Kurze Tage - Nicht relevant für Standort B
  shortDays: {}
};