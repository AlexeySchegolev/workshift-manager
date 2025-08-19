import { Employee, MonthlyShiftPlan, ShiftRules } from '../models/interfaces';
import { defaultRules } from '../data/defaultRules';
import { employeeData } from '../data/employeeData';

/**
 * Service zum Speichern und Laden von Daten in/aus localStorage
 */
export class PersistenceService {
  // Keys für localStorage
  private static readonly EMPLOYEES_KEY = 'schichtplanung_employees';
  private static readonly RULES_KEY = 'schichtplanung_rules';
  private static readonly SHIFT_PLAN_KEY_PREFIX = 'schichtplanung_plan_';

  /**
   * Speichert Mitarbeiter im localStorage
   */
  static saveEmployees(employees: Employee[]): void {
    try {
      localStorage.setItem(this.EMPLOYEES_KEY, JSON.stringify(employees));
    } catch (error) {
      console.error('Fehler beim Speichern der Mitarbeiter:', error);
    }
  }

  /**
   * Lädt Mitarbeiter aus dem localStorage
   * Verwendet Dummy-Mitarbeiter, wenn keine gespeichert sind
   */
  static loadEmployees(): Employee[] {
    try {
      // Zurücksetzen des localStorage bei der ersten Verwendung der neuen Daten
      const firstRun = localStorage.getItem('firstRunWithRealData');
      if (!firstRun) {
        // Markieren, dass wir die echten Daten bereits verwendet haben
        localStorage.setItem('firstRunWithRealData', 'true');
        // Mitarbeiterdaten zurücksetzen
        this.saveEmployees(employeeData);
        console.log('Reale Mitarbeiterdaten im localStorage initialisiert');
        return employeeData;
      }
      
      const storedEmployees = localStorage.getItem(this.EMPLOYEES_KEY);
      if (storedEmployees) {
        return JSON.parse(storedEmployees);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Mitarbeiter:', error);
    }
    
    // Reale Mitarbeiterdaten verwenden und gleich im localStorage speichern
    this.saveEmployees(employeeData);
    return employeeData;
  }

  /**
   * Speichert Schichtregeln im localStorage
   */
  static saveRules(rules: ShiftRules): void {
    try {
      localStorage.setItem(this.RULES_KEY, JSON.stringify(rules));
    } catch (error) {
      console.error('Fehler beim Speichern der Schichtregeln:', error);
    }
  }

  /**
   * Lädt Schichtregeln aus dem localStorage
   * Verwendet Standard-Regeln, wenn keine gespeichert sind
   */
  static loadRules(): ShiftRules {
    try {
      const storedRules = localStorage.getItem(this.RULES_KEY);
      if (storedRules) {
        return JSON.parse(storedRules);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Schichtregeln:', error);
    }
    
    // Standard-Regeln verwenden
    return defaultRules;
  }

  /**
   * Speichert einen Schichtplan für einen bestimmten Monat im localStorage
   */
  static saveShiftPlan(year: number, month: number, plan: MonthlyShiftPlan): void {
    try {
      const key = this.getShiftPlanKey(year, month);
      localStorage.setItem(key, JSON.stringify(plan));
    } catch (error) {
      console.error('Fehler beim Speichern des Schichtplans:', error);
    }
  }

  /**
   * Lädt einen Schichtplan für einen bestimmten Monat aus dem localStorage
   * Gibt null zurück, wenn kein Plan gespeichert ist
   */
  static loadShiftPlan(year: number, month: number): MonthlyShiftPlan | null {
    try {
      const key = this.getShiftPlanKey(year, month);
      const storedPlan = localStorage.getItem(key);
      if (storedPlan) {
        return JSON.parse(storedPlan);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Schichtplans:', error);
    }
    
    return null;
  }

  /**
   * Generiert einen eindeutigen Schlüssel für einen Schichtplan
   */
  private static getShiftPlanKey(year: number, month: number): string {
    return `${this.SHIFT_PLAN_KEY_PREFIX}${year}_${month}`;
  }
}