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
    // Spätschicht (vereinfacht)
    S: {
      start: "12:00",
      end: "19:00",
      roles: ["Pfleger", "Schichtleiter"]
    }
  },
  
  // Kurze Tage (Dienstag, Donnerstag, Samstag)
  shortDays: {
    // Frühschicht (auch für Samstag)
    F: {
      start: "06:00",
      end: "13:00",
      roles: ["Pfleger", "Schichtleiter", "Pflegehelfer"]
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
    // Schichtleiter (markiert als 6) - 10 Stunden
    "6": {
      start: "06:00",
      end: "16:00",
      roles: ["Schichtleiter"]
    }
  },
  
  // Kurze Tage - Nicht relevant für Uetersen
  shortDays: {}
};