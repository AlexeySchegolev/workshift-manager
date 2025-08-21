import {
  Employee,
  EmployeeAvailability,
  MonthlyShiftPlan,
  DayShiftPlan,
  EmployeeRole
} from '../models/interfaces';
import { EnhancedConstraintSystem } from './EnhancedConstraintSystem';
import { ShiftPlanningUtilService } from './ShiftPlanningUtilService';

// Leerer Export um die Datei als Modul zu kennzeichnen
export {};

/**
 * Anforderungen an die Besetzung einer Schicht
 */
export interface ShiftRequirement {
  role: EmployeeRole;
  count: number;
}

/**
 * Position innerhalb einer Schicht
 */
interface ShiftPosition {
  shiftName: string;
  role: EmployeeRole;
  positionIndex: number;
}

/**
 * Verbesserte Backtracking-Service für die Schichtplanung
 * Implementiert einen robusten Backtracking-Algorithmus mit Forward-Checking
 */
export class EnhancedBacktrackingService {
  /**
   * Hauptfunktion zum Zuweisen von Schichten für einen Tag
   * Implementiert den verbesserten Backtracking-Algorithmus
   */
  static assignDayWithBacktracking(
    date: Date,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability,
    shiftPlan: MonthlyShiftPlan,
    relaxedMode: boolean = false
  ): boolean {
    const dayKey = this.formatDayKey(date);
    const weekday = date.getDay();
    
    // Sonntage haben keinen Schichtplan
    if (weekday === 0) {
      shiftPlan[dayKey] = null;
      return true;
    }
    
    // Schichten für diesen Tag bestimmen
    const isLongDay = [1, 3, 5].includes(weekday); // Mo, Mi, Fr
    const dayShifts = this.getDayShifts(isLongDay);
    
    // Priorisierte Reihenfolge der Schichten
    const prioritizedShifts = this.prioritizeShifts(dayShifts, isLongDay, weekday === 6);
    
    // Schichtplan für diesen Tag initialisieren
    shiftPlan[dayKey] = {};
    
    // Anforderungen für jede Schicht bestimmen
    const shiftRequirements = this.determineShiftRequirements(prioritizedShifts, isLongDay);
    
    // Versuche, alle Schichten zuzuweisen
    const success = this.assignShiftsRecursively(
      prioritizedShifts,
      0,
      shiftRequirements,
      dayKey,
      weekday,
      employees,
      employeeAvailability,
      shiftPlan,
      relaxedMode
    );
    
    if (!success) {
      console.warn(`Konnte nicht alle Schichten für Tag ${dayKey} zuweisen`);
    }
    
    return success;
  }
  
  /**
   * Rekursive Funktion zum Zuweisen aller Schichten eines Tages
   */
  private static assignShiftsRecursively(
    prioritizedShifts: string[],
    shiftIndex: number,
    shiftRequirements: Map<string, ShiftRequirement[]>,
    dayKey: string,
    weekday: number,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability,
    shiftPlan: MonthlyShiftPlan,
    relaxedMode: boolean
  ): boolean {
    // Alle Schichten zugewiesen?
    if (shiftIndex >= prioritizedShifts.length) {
      return true;
    }
    
    const shiftName = prioritizedShifts[shiftIndex];
    const requirements = shiftRequirements.get(shiftName) || [];
    
    // Sicherstellen, dass das Array für diese Schicht existiert
    const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
    if (!dayPlan[shiftName]) {
      dayPlan[shiftName] = [];
    }
    
    // Versuche, alle Anforderungen für diese Schicht zu erfüllen
    const success = this.fillShiftPositions(
      shiftName,
      requirements,
      0,
      dayKey,
      weekday,
      employees,
      employeeAvailability,
      shiftPlan,
      relaxedMode
    );
    
    if (success) {
      // Wenn erfolgreich, zur nächsten Schicht
      return this.assignShiftsRecursively(
        prioritizedShifts,
        shiftIndex + 1,
        shiftRequirements,
        dayKey,
        weekday,
        employees,
        employeeAvailability,
        shiftPlan,
        relaxedMode
      );
    } else {
      // Wenn nicht erfolgreich, Schicht zurücksetzen
      dayPlan[shiftName] = [];
      
      // Versuche, in einem gelockerten Modus weiterzumachen, wenn noch nicht im lockeren Modus
      if (!relaxedMode) {
        console.warn(`Konnte Schicht ${shiftName} für Tag ${dayKey} nicht im strikten Modus zuweisen. Versuche im gelockerten Modus.`);
        return this.assignShiftsRecursively(
          prioritizedShifts,
          shiftIndex,
          shiftRequirements,
          dayKey,
          weekday,
          employees,
          employeeAvailability,
          shiftPlan,
          true
        );
      }
      
      return false;
    }
  }
  
  /**
   * Füllt alle Positionen einer Schicht mit geeigneten Mitarbeitern
   */
  private static fillShiftPositions(
    shiftName: string,
    requirements: ShiftRequirement[],
    requirementIndex: number,
    dayKey: string,
    weekday: number,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability,
    shiftPlan: MonthlyShiftPlan,
    relaxedMode: boolean
  ): boolean {
    // Alle Anforderungen erfüllt?
    if (requirementIndex >= requirements.length) {
      return true;
    }
    
    const requirement = requirements[requirementIndex];
    
    // Recursive Funktion für das Auffüllen mehrerer Mitarbeiter der gleichen Rolle
    const assignMultipleEmployees = (count: number): boolean => {
      // Alle Mitarbeiter für diese Anforderung zugewiesen?
      if (count >= requirement.count) {
        return this.fillShiftPositions(
          shiftName,
          requirements,
          requirementIndex + 1,
          dayKey,
          weekday,
          employees,
          employeeAvailability,
          shiftPlan,
          relaxedMode
        );
      }
      
      // Finde geeignete Mitarbeiter für diese Position
      const suitableEmployees = this.findSuitableEmployees(
        requirement.role,
        shiftName,
        dayKey,
        weekday,
        employees,
        employeeAvailability,
        relaxedMode
      );
      
      // Versuche jeden geeigneten Mitarbeiter
      for (const employee of suitableEmployees) {
        // Tagesplan holen
        const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
        
        // Mitarbeiter zuweisen
        dayPlan[shiftName].push(employee.id);
        
        // Verfügbarkeit aktualisieren
        const shiftHours = EnhancedConstraintSystem.estimateShiftHours(shiftName);
        employeeAvailability[employee.id].weeklyHoursAssigned += shiftHours;
        employeeAvailability[employee.id].totalHoursAssigned += shiftHours;
        employeeAvailability[employee.id].shiftsAssigned.push(dayKey);
        employeeAvailability[employee.id].lastShiftType = shiftName;
        
        if (weekday === 6) { // Samstag
          employeeAvailability[employee.id].saturdaysWorked += 1;
        }
        
        // Rekursion für nächsten Mitarbeiter
        if (assignMultipleEmployees(count + 1)) {
          return true;
        }
        
        // Backtracking: Zuweisung rückgängig machen
        dayPlan[shiftName].pop();
        employeeAvailability[employee.id].weeklyHoursAssigned -= shiftHours;
        employeeAvailability[employee.id].totalHoursAssigned -= shiftHours;
        employeeAvailability[employee.id].shiftsAssigned.pop();
        employeeAvailability[employee.id].lastShiftType = null;
        
        if (weekday === 6) {
          employeeAvailability[employee.id].saturdaysWorked -= 1;
        }
      }
      
      // Keine gültige Zuordnung gefunden
      return false;
    };
    
    // Starte mit dem ersten Mitarbeiter
    return assignMultipleEmployees(0);
  }
  
  /**
   * Findet geeignete Mitarbeiter für eine Position und sortiert sie nach Eignung
   * Implementiert die verbesserte Mitarbeiterauswahl-Heuristik
   */
  private static findSuitableEmployees(
    role: EmployeeRole,
    shiftName: string,
    dayKey: string,
    weekday: number,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability,
    relaxedMode: boolean
  ): Employee[] {
    // 1. Filtere Mitarbeiter, die grundsätzlich geeignet sind
    const eligibleEmployees = employees.filter(emp => {
      // Nur Mitarbeiter der richtigen Rolle
      if (emp.role !== role) return false;
      
      // Nur Mitarbeiter, die an diesem Tag noch nicht eingeteilt sind
      if (employeeAvailability[emp.id].shiftsAssigned.includes(dayKey)) return false;
      
      // Prüfe, ob der Mitarbeiter für diese Schicht zugewiesen werden kann
      const canAssign = EnhancedConstraintSystem.canAssignEmployeeToShift(
        emp,
        shiftName,
        dayKey,
        weekday,
        employeeAvailability,
        !relaxedMode // Im gelockerten Modus sind die Constraints weniger streng
      );
      
      return canAssign.allowed;
    });
    
    // 2. Sortiere Mitarbeiter nach Eignung
    return eligibleEmployees.sort((a, b) => {
      // Priorität 1: Arbeitszeitverteilung
      const aWorkload = this.calculateWorkloadPercentage(a, employeeAvailability);
      const bWorkload = this.calculateWorkloadPercentage(b, employeeAvailability);
      
      if (Math.abs(aWorkload - bWorkload) > 10) { // Signifikanter Unterschied
        return aWorkload - bWorkload; // Weniger ausgelastete Mitarbeiter bevorzugen
      }
      
      // Priorität 2: Samstagsverteilung (für Samstage)
      if (weekday === 6) {
        return employeeAvailability[a.id].saturdaysWorked - employeeAvailability[b.id].saturdaysWorked;
      }
      
      // Priorität 3: Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen
      const aLastShift = employeeAvailability[a.id].lastShiftType;
      const bLastShift = employeeAvailability[b.id].lastShiftType;
      
      if (aLastShift === shiftName && bLastShift !== shiftName) return 1;
      if (aLastShift !== shiftName && bLastShift === shiftName) return -1;
      
      // Bei Gleichstand: Leicht zufällige Komponente für gleichmäßige Verteilung
      // Dies ist deterministisch, basierend auf der Mitarbeiter-ID
      return a.id.localeCompare(b.id);
    });
  }
  
  /**
   * Berechnet den Prozentsatz der Arbeitsbelastung eines Mitarbeiters
   */
  private static calculateWorkloadPercentage(
    employee: Employee,
    employeeAvailability: EmployeeAvailability
  ): number {
    const totalHoursAssigned = employeeAvailability[employee.id].totalHoursAssigned;
    const targetHoursPerMonth = employee.hoursPerMonth; // Verwende direkt die Monatsstunden
    
    return (totalHoursAssigned / targetHoursPerMonth) * 100;
  }
  
  /**
   * Formatiert ein Datum als Schlüssel für den Schichtplan
   */
  private static formatDayKey(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  }
  
  /**
   * Bestimmt die Schichten für einen Tag
   */
  private static getDayShifts(isLongDay: boolean): string[] {
    if (isLongDay) {
      // Lange Tage: Mo, Mi, Fr
      return ['S0', 'S1', 'S00', 'S', 'F'];
    } else {
      // Kurze Tage: Di, Do, Sa
      return ['FS', 'F'];
    }
  }
  
  /**
   * Priorisiert die Schichten basierend auf Tagestyp und anderen Faktoren
   */
  private static prioritizeShifts(
    shifts: string[],
    isLongDay: boolean,
    isSaturday: boolean
  ): string[] {
    // Basis-Prioritäten für verschiedene Schichttypen
    const shiftPriorities: { [key: string]: number } = {
      'S0': 100,  // Höchste Priorität
      'S1': 90,
      'FS': 85,   // Besonders wichtig an kurzen Tagen
      'S00': 80,
      'S': 70,
      'F': 60     // Niedrigste Priorität
    };
    
    // Tagestyp-spezifische Anpassungen
    if (isSaturday) {
      // An Samstagen hat FS höchste Priorität
      shiftPriorities['FS'] = 110;
    } else if (!isLongDay) {
      // An anderen kurzen Tagen (Di, Do) hat FS auch hohe Priorität
      shiftPriorities['FS'] = 100;
    }
    
    // Sortieren nach Priorität (höhere Werte zuerst)
    return shifts.slice().sort((a, b) => {
      const priorityA = shiftPriorities[a] || 0;
      const priorityB = shiftPriorities[b] || 0;
      return priorityB - priorityA;
    });
  }
  
  /**
   * Bestimmt die Besetzungsanforderungen für jede Schicht
   */
  private static determineShiftRequirements(
    prioritizedShifts: string[],
    isLongDay: boolean
  ): Map<string, ShiftRequirement[]> {
    const requirements = new Map<string, ShiftRequirement[]>();
    
    for (const shiftName of prioritizedShifts) {
      switch (shiftName) {
        case 'S0':
          // S0 kann von Schichtleitern, Pflegern und Pflegehelfern besetzt werden
          requirements.set(shiftName, [
            { role: 'Schichtleiter', count: 1 },
            { role: 'Pfleger', count: isLongDay ? 1 : 0 },
            { role: 'Pflegehelfer', count: 1 }
          ]);
          break;
          
        case 'S1':
          // S1 kann von Schichtleitern und Pflegern besetzt werden
          requirements.set(shiftName, [
            { role: 'Pfleger', count: 1 }
          ]);
          break;
          
        case 'S00':
          // S00 kann nur von Pflegern besetzt werden
          requirements.set(shiftName, [
            { role: 'Pfleger', count: 1 }
          ]);
          break;
          
        case 'S':
          // S kann von Pflegern besetzt werden
          requirements.set(shiftName, [
            { role: 'Pfleger', count: 1 }
          ]);
          break;
          
        case 'FS':
          // FS kann von Schichtleitern und Pflegern besetzt werden
          requirements.set(shiftName, [
            { role: 'Pfleger', count: 1 }
          ]);
          break;
          
        case 'F':
          // F kann von allen Rollen besetzt werden
          // An langen Tagen brauchen wir mehr Mitarbeiter als an kurzen
          const pflegerCount = isLongDay ? 3 : 4;
          requirements.set(shiftName, [
            { role: 'Pfleger', count: pflegerCount },
            { role: 'Schichtleiter', count: isLongDay ? 0 : 1 }, // Schichtleiter nur an kurzen Tagen in F
            { role: 'Pflegehelfer', count: isLongDay ? 0 : 1 }   // Pflegehelfer nur an kurzen Tagen in F
          ]);
          break;
          
        default:
          requirements.set(shiftName, []);
          break;
      }
    }
    
    return requirements;
  }
}

export default EnhancedBacktrackingService;