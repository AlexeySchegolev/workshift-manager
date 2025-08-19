import { ShiftRules } from '../models/interfaces';

/**
 * Standard-Schichtregeln für die Dialysepraxis
 */
export const defaultRules: ShiftRules = {
  // Mindestanzahl Pfleger pro Schicht (außer für spezielle Schichten)
  minNursesPerShift: 4,
  
  // Mindestanzahl Schichtleiter pro Schicht
  minNurseManagersPerShift: 1,
  
  // Mindestanzahl Pflegehelfer pro Schicht
  minHelpers: 1,
  
  // Maximale Anzahl an Samstagen pro Mitarbeiter und Monat
  maxSaturdaysPerMonth: 1,
  
  // Maximale Anzahl aufeinanderfolgender gleicher Schichten
  // 0 bedeutet keine gleichen Schichten hintereinander erlaubt
  maxConsecutiveSameShifts: 0,
  
  // Toleranz für Überstunden (10%)
  // Im gelockerten Modus werden bis zu 10% mehr Stunden als die wöchentliche
  // Sollarbeitszeit erlaubt
  weeklyHoursOverflowTolerance: 0.1
};

/**
 * Gelockerte Schichtregeln für die Dialysepraxis
 * Werden verwendet, wenn mit den Standardregeln kein vollständiger Plan erstellt werden kann
 */
export const relaxedRules: ShiftRules = {
  ...defaultRules,
  // Im gelockerten Modus sind bis zu 2 Samstage pro Monat erlaubt
  maxSaturdaysPerMonth: 2,
  // Höhere Toleranz für Überstunden (15%)
  weeklyHoursOverflowTolerance: 0.15
};