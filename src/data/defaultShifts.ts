import { ShiftDefinitions } from '../models/interfaces';

/**
 * Standard-Schichtdefinitionen für die Dialysepraxis
 */
export const defaultShifts: ShiftDefinitions = {
  // Lange Tage (Montag, Mittwoch, Freitag)
  longDays: {
    // Frühschicht
    F: {
      start: "06:00",
      end: "13:00",
      roles: ["Pfleger", "Schichtleiter", "Pflegehelfer"]
    },
    // Spätschicht 00 (wird immer nur von einem Pfleger belegt)
    S00: {
      start: "11:00",
      end: "18:00",
      roles: ["Pfleger"]
    },
    // Spätschicht 0
    S0: {
      start: "11:30",
      end: "18:30",
      roles: ["Pfleger", "Schichtleiter", "Pflegehelfer"]
    },
    // Spätschicht 1
    S1: {
      start: "12:00",
      end: "19:00",
      roles: ["Pfleger", "Schichtleiter"]
    },
    // Spätschicht (wird nur von einem Pfleger oder Schichtleiter belegt)
    S: {
      start: "12:00",
      end: "19:00",
      roles: ["Pfleger", "Schichtleiter"]
    }
  },
  
  // Kurze Tage (Dienstag, Donnerstag, Samstag)
  shortDays: {
    // Frühschicht
    F: {
      start: "06:00",
      end: "13:00",
      roles: ["Pfleger", "Schichtleiter", "Pflegehelfer"]
    },
    // Frühschicht Special (wird nur von einem Pfleger oder einem Schichtleiter belegt)
    FS: {
      start: "06:45",
      end: "14:00",
      roles: ["Pfleger", "Schichtleiter"]
    }
  }
};

/**
 * Schichtdefinitionen für die Uetersen-Praxis
 * Nur an langen Tagen (Mo, Mi, Fr)
 */
export const uetersenShifts: ShiftDefinitions = {
  // Lange Tage (Montag, Mittwoch, Freitag)
  longDays: {
    // Frühschicht (markiert als 4)
    "4": {
      start: "06:00",
      end: "13:00",
      roles: ["Pfleger", "Pflegehelfer"]
    },
    // Spätschicht (markiert als 5)
    "5": {
      start: "12:00",
      end: "19:00",
      roles: ["Pfleger"]
    },
    // Schichtleiter (markiert als 6)
    "6": {
      start: "06:00",
      end: "19:00",
      roles: ["Schichtleiter"]
    }
  },
  
  // Kurze Tage - Nicht relevant für Uetersen
  shortDays: {}
};