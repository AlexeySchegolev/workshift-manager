import {
  Employee,
  EmployeeAvailability,
  MonthlyShiftPlan,
  DayShiftPlan,
  ConstraintCheck
} from '../models/interfaces';
import { getActiveRuleBase } from '../data/allRules';

// Export leeres Objekt, damit die Datei als Modul erkannt wird
export {};

/**
 * Service für die Überprüfung von Constraints und Regeln in der Schichtplanung
 */
export class ShiftPlanningConstraintService {
  /**
   * Prüft, ob ein Mitarbeiter einer Schicht zugewiesen werden kann
   * Verwendet die zentrale Regelstruktur für konsistente Entscheidungen
   */
  static canAssignEmployee(
    emp: Employee,
    validRoles: string[],
    employeeAvailability: EmployeeAvailability,
    dayKey: string,
    weekday: number,
    shiftName: string,
    shift: any,
    strictMode: boolean
  ): boolean {
    // Zentrale Regelstruktur abrufen
    const ruleBase = getActiveRuleBase(strictMode);
    
    // 1) Rolle prüfen
    if (!validRoles.includes(emp.role)) {
      return false;
    }
    
    // 2) Prüfen, ob die Rolle für diese Schichtart erlaubt ist
    // Zusätzliche Prüfung gegen die zentrale Regelstruktur
    if (ruleBase.roleConstraints[emp.role] &&
        !ruleBase.roleConstraints[emp.role].allowedShifts.includes(shiftName)) {
      return false;
    }
    
    // 3) Arbeitet der Mitarbeiter schon an diesem Tag?
    if (employeeAvailability[emp.id].shiftsAssigned.includes(dayKey)) {
      return false;
    }
    
    // 4) Wochenstunden-Kapazität prüfen
    const shiftHours = this.calculateShiftHours(shift.start, shift.end);
    const currentWeeklyHours = employeeAvailability[emp.id].weeklyHoursAssigned;
    const rules = ruleBase.generalRules;
    const maxWeeklyHours = emp.hoursPerWeek * (1 + rules.weeklyHoursOverflowTolerance);
    
    // Etwas mehr Flexibilität bei der Stundenverteilung über den Monat
    // Je später im Monat, desto flexibler mit den wöchentlichen Stunden
    const [, , dayYear] = dayKey.split('.').map(Number);
    const date = new Date(dayYear, 0, 1);
    const weekOfMonth = Math.ceil(date.getDate() / 7);
    
    // Erhöhe die Toleranz für spätere Wochen im Monat
    const toleranceMultiplier = 1.0 + (weekOfMonth * 0.05);
    const adjustedMaxWeeklyHours = maxWeeklyHours * toleranceMultiplier;
    
    if (currentWeeklyHours + shiftHours > adjustedMaxWeeklyHours) {
      return false;
    }
    
    // 4) Samstagsregel
    if (weekday === 6) {
      const maxSaturdays = rules.maxSaturdaysPerMonth;
      
      // Für den letzten Samstag im Monat (30.8.) flexibler sein
      const [, monthOfDay, yearOfDay] = dayKey.split('.').map(Number);
      const isLastSaturdayOfMonth = dayKey.startsWith('30.') || dayKey.startsWith('31.') ||
                                  (new Date(yearOfDay, monthOfDay, 0).getDate() - 6 <= Number(dayKey.split('.')[0]));
      
      if (employeeAvailability[emp.id].saturdaysWorked >= maxSaturdays) {
        // Am letzten Samstag des Monats mit 40% Wahrscheinlichkeit einen zusätzlichen Samstag erlauben
        if (isLastSaturdayOfMonth && Math.random() < 0.4) {
          console.log(`Samstagsregel gelockert für ${emp.name} am letzten Samstag ${dayKey}`);
        } else {
          return false;
        }
      }
    }
    
    // 5) Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen
    const lastAssignedDay = employeeAvailability[emp.id].shiftsAssigned.length > 0
      ? employeeAvailability[emp.id].shiftsAssigned[employeeAvailability[emp.id].shiftsAssigned.length - 1]
      : null;
    
    // Wenn der Mitarbeiter eine Schicht am Vortag hatte und es dieselbe Schichtart ist
    if (lastAssignedDay && employeeAvailability[emp.id].lastShiftType === shiftName) {
      const [lastDay, lastMonth, lastYear] = lastAssignedDay.split('.').map(Number);
      const [currentDay, currentMonth, currentYear] = dayKey.split('.').map(Number);
      
      // Prüfen, ob es sich um aufeinanderfolgende Tage handelt
      const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
      const currentDate = new Date(currentYear, currentMonth - 1, currentDay);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Für Samstage (30.8.) etwas flexibler sein, wenn es gegen Monatsende geht
        if (currentDay > 25 && weekday === 6 && Math.random() < 0.3) {
          // 30% Chance, die Regel zu ignorieren für Samstage am Monatsende
          console.log(`Flexibilitätsregel angewendet: Erlaube gleiche Schicht für ${emp.name} am ${dayKey}`);
        } else {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Prüft, ob ein Mitarbeiter einer Uetersen-Schicht zugewiesen werden kann
   */
  static canAssignEmployeeToUetersen(
    emp: Employee,
    employeeAvailability: EmployeeAvailability,
    dayKey: string,
    shiftName: string,
    shift: any
  ): boolean {
    // 1) Arbeitet der Mitarbeiter schon an diesem Tag?
    if (employeeAvailability[emp.id].shiftsAssigned.includes(dayKey)) {
      return false;
    }
    
    // 1.5) Maximiere die Verteilung der Mitarbeiter über den Monat
    // Je mehr Schichten ein Mitarbeiter bereits hat, desto geringer die Wahrscheinlichkeit für weitere
    const shiftsCount = employeeAvailability[emp.id].shiftsAssigned.length;
    const [, monthOfDay, dayYear] = dayKey.split('.').map(Number);
    const daysInMonth = new Date(dayYear, monthOfDay, 0).getDate();
    
    // Zufallsfaktor basierend auf der Anzahl der bereits zugewiesenen Schichten
    const randomFactor = Math.random();
    const assignmentRatio = shiftsCount / (daysInMonth * 0.5); // Annahme: im Durchschnitt arbeitet ein MA ca. 50% der Tage
    
    // Je mehr Schichten bereits zugewiesen wurden, desto höher muss der Zufallsfaktor sein
    if (assignmentRatio > 0.5 && randomFactor < assignmentRatio * 0.8) {
      return false;
    }
    
    // 2) Wochenstunden-Kapazität prüfen
    const shiftHours = this.calculateShiftHours(shift.start, shift.end);
    const currentWeeklyHours = employeeAvailability[emp.id].weeklyHoursAssigned;
    
    // Wir verwenden für Uetersen immer die gelockerten Regeln
    // mit noch etwas mehr Toleranz als für die Hauptpraxis
    const weeklyHoursOverflowTolerance = 0.15 + 0.1; // relaxedRules.weeklyHoursOverflowTolerance + 0.1
    const maxWeeklyHours = emp.hoursPerWeek * (1 + weeklyHoursOverflowTolerance);
    
    if (currentWeeklyHours + shiftHours > maxWeeklyHours) {
      return false;
    }
    
    // 3) Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen
    const lastAssignedDay = employeeAvailability[emp.id].shiftsAssigned.length > 0
      ? employeeAvailability[emp.id].shiftsAssigned[employeeAvailability[emp.id].shiftsAssigned.length - 1]
      : null;
    
    if (lastAssignedDay && employeeAvailability[emp.id].lastShiftType === shiftName) {
      const [lastDay, lastMonth, lastYear] = lastAssignedDay.split('.').map(Number);
      const [currentDay, currentMonth, currentYear] = dayKey.split('.').map(Number);
      
      // Prüfen, ob es sich um aufeinanderfolgende Tage handelt
      const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
      const currentDate = new Date(currentYear, currentMonth - 1, currentDay);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Berechnet die Stundenzahl einer Schicht
   */
  private static calculateShiftHours(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const start = startHour + startMinute / 60;
    const end = endHour + endMinute / 60;
    
    return end - start;
  }
  
  /**
   * Überprüft die Einhaltung der Regeln
   */
  static checkConstraints(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability
  ): ConstraintCheck[] {
    const checks: ConstraintCheck[] = [];
    
    // ALLGEMEINE REGELN
    checks.push({
      status: 'info',
      message: '====== ALLGEMEINE REGELN UND STATISTIKEN ======'
    });
    
    // 1. Überprüfung: Gab es Tage, die nicht belegt werden konnten?
    const nullDays = Object.keys(shiftPlan).filter(dayKey => {
      // Sonntage ausschließen - diese sollen keine Schichten haben
      const [day, month, year] = dayKey.split('.').map(Number);
      const date = new Date(year, month - 1, day);
      const isSunday = date.getDay() === 0;
      
      return shiftPlan[dayKey] === null && !isSunday;
    });
    
    if (nullDays.length > 0) {
      checks.push({
        status: 'violation',
        message: `${nullDays.length} Tag(e) konnten nicht vollständig belegt werden: ${nullDays.join(', ')}`
      });
    } else {
      checks.push({
        status: 'ok',
        message: 'Alle Tage konnten erfolgreich belegt werden.'
      });
    }
    
    // 2. Überprüfung: Schichtbesetzung nach Regeln
    // Prüfe Einhaltung der Spezialschicht-Regel (S0, S00, S, S1, FS - nur ein Mitarbeiter)
    const specialShifts = ['S0', 'S00', 'S', 'S1', 'FS'];
    let specialShiftViolations = 0;
    
    for (const dayKey in shiftPlan) {
      const dayPlan = shiftPlan[dayKey];
      if (dayPlan === null) continue;
      
      for (const shiftName of specialShifts) {
        if (dayPlan[shiftName] && dayPlan[shiftName].length > 1) {
          specialShiftViolations++;
          checks.push({
            status: 'violation',
            message: `Am ${dayKey} sind ${dayPlan[shiftName].length} Mitarbeiter für Schicht ${shiftName} eingeteilt (max. 1 erlaubt)`
          });
        }
      }
    }
    
    if (specialShiftViolations === 0) {
      checks.push({
        status: 'ok',
        message: 'Alle Spezialschichten (S0, S00, S, S1, FS) sind korrekt mit maximal einem Mitarbeiter besetzt.'
      });
    }
    
    return checks;
  }
}