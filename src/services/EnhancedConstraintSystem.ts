import {
  Employee,
  EmployeeAvailability,
  MonthlyShiftPlan,
  DayShiftPlan,
  EmployeeRole
} from '../models/interfaces';
import { getActiveRuleBase } from '../data/allRules';

// Leerer Export um die Datei als Modul zu kennzeichnen
export {};

/**
 * Verbesserte Constraint-Verletzung mit detaillierten Informationen
 */
export interface ConstraintViolation {
  type: ConstraintViolationType;
  message: string;
  severity: 'hard' | 'soft';
  day?: string;
  employee?: string;
  role?: EmployeeRole;
  shift?: string;
  required?: number;
  actual?: number;
}

/**
 * Typen von Constraint-Verletzungen für klare Kategorisierung
 */
export type ConstraintViolationType = 
  | 'StaffingViolation'      // Verletzung der Besetzungsanforderungen
  | 'RoleViolation'          // Unerlaubte Rolle für eine Schicht
  | 'DuplicateAssignment'    // Mitarbeiter mehrfach am selben Tag eingeteilt
  | 'ConsecutiveShift'       // Gleiche Schichten an aufeinanderfolgenden Tagen
  | 'SaturdayOverload'       // Zu viele Samstage für einen Mitarbeiter
  | 'WorkloadExceeded'       // Überschreitung der Arbeitsstunden
  | 'IncompleteDay';         // Tag konnte nicht vollständig geplant werden

/**
 * Ergebnis der Constraint-Überprüfung
 */
export interface ConstraintCheckResult {
  isValid: boolean;
  hardViolations: ConstraintViolation[];
  softViolations: ConstraintViolation[];
}

/**
 * Enhanced Constraint System
 * Enthält Methoden zur klaren und strukturierten Überprüfung aller Constraints
 */
export class EnhancedConstraintSystem {
  /**
   * Prüft, ob ein Mitarbeiter einer Schicht zugewiesen werden kann
   * Berücksichtigt alle harten Constraints
   */
  static canAssignEmployeeToShift(
    employee: Employee,
    shiftName: string,
    dayKey: string,
    weekday: number,
    employeeAvailability: EmployeeAvailability,
    strictMode: boolean = true
  ): { allowed: boolean; reason?: string } {
    const ruleBase = getActiveRuleBase(strictMode);
    
    // 1. Rollenprüfung: Ist die Rolle für diese Schicht erlaubt?
    if (!this.isRoleAllowedForShift(employee.role, shiftName)) {
      return { 
        allowed: false, 
        reason: `Rolle ${employee.role} ist nicht für Schicht ${shiftName} erlaubt`
      };
    }
    
    // 2. Tägliche Verfügbarkeit: Arbeitet der Mitarbeiter bereits an diesem Tag?
    if (employeeAvailability[employee.id].shiftsAssigned.includes(dayKey)) {
      return {
        allowed: false,
        reason: `Mitarbeiter ist bereits für diesen Tag eingeteilt`
      };
    }
    
    // 3. Schichtwechsel: Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen
    const lastShiftType = employeeAvailability[employee.id].lastShiftType;
    const lastAssignedDay = employeeAvailability[employee.id].shiftsAssigned.length > 0
      ? employeeAvailability[employee.id].shiftsAssigned[employeeAvailability[employee.id].shiftsAssigned.length - 1]
      : null;
      
    if (lastShiftType === shiftName && lastAssignedDay && this.isConsecutiveDay(lastAssignedDay, dayKey)) {
      // Dies ist ein weiches Constraint, im strikten Modus wird es als Fehler betrachtet
      if (strictMode) {
        return {
          allowed: false,
          reason: `Gleiche Schicht an aufeinanderfolgenden Tagen`
        };
      }
      // Im gelockerten Modus wird es erlaubt, aber mit einer Warnung
    }
    
    // 4. Samstagsregel
    if (weekday === 6) { // Samstag
      const saturdaysWorked = employeeAvailability[employee.id].saturdaysWorked;
      const maxSaturdays = strictMode ? 
        ruleBase.generalRules.maxSaturdaysPerMonth : 
        ruleBase.generalRules.maxSaturdaysPerMonth + 1; // Im lockeren Modus ein Samstag mehr erlaubt
      
      if (saturdaysWorked >= maxSaturdays) {
        return {
          allowed: false,
          reason: `Mitarbeiter hat bereits ${saturdaysWorked} Samstage gearbeitet (Maximum: ${maxSaturdays})`
        };
      }
    }
    
    // 5. Arbeitszeitprüfung
    const shiftHours = this.estimateShiftHours(shiftName);
    const currentWeeklyHours = employeeAvailability[employee.id].weeklyHoursAssigned;
    // Wöchentliche Stunden aus Monatsstunden berechnen (4.33 Wochen pro Monat)
    const weeklyHours = employee.hoursPerMonth / 4.33;
    const maxWeeklyHours = weeklyHours * (1 + ruleBase.generalRules.weeklyHoursOverflowTolerance);
    
    if (currentWeeklyHours + shiftHours > maxWeeklyHours) {
      return {
        allowed: false,
        reason: `Wöchentliche Arbeitsstunden würden überschritten (${currentWeeklyHours + shiftHours}h > ${maxWeeklyHours}h)`
      };
    }
    
    // Alle Constraints erfüllt
    return { allowed: true };
  }
  
  /**
   * Prüft, ob eine Rolle für eine bestimmte Schicht erlaubt ist
   */
  static isRoleAllowedForShift(
    role: EmployeeRole,
    shiftName: string
  ): boolean {
    const allowedRoles = this.getAllowedRolesForShift(shiftName);
    return allowedRoles.includes(role);
  }
  
  /**
   * Gibt die für eine Schicht erlaubten Rollen zurück
   */
  static getAllowedRolesForShift(shiftName: string): EmployeeRole[] {
    // Rollenerlaubnis für jede Schicht
    const shiftRoles: { [key: string]: EmployeeRole[] } = {
      'S0': ['Schichtleiter', 'Pfleger', 'Pflegehelfer'],
      'S1': ['Schichtleiter', 'Pfleger'],
      'S00': ['Pfleger'],
      'S': ['Pfleger'],
      'FS': ['Schichtleiter', 'Pfleger'],
      'F': ['Schichtleiter', 'Pfleger', 'Pflegehelfer'],
      // Uetersen-Schichten
      '4': ['Pfleger', 'Pflegehelfer'],
      '5': ['Pfleger'],
      '6': ['Schichtleiter']
    };
    
    return shiftRoles[shiftName] || [];
  }
  
  /**
   * Schätzt die Stundenzahl einer Schicht basierend auf dem Schichtnamen
   */
  static estimateShiftHours(shiftName: string): number {
    // Ungefähre Stundenzahl pro Schichttyp
    const shiftHours: { [key: string]: number } = {
      'F': 7,    // 06:00-13:00
      'S00': 7,  // 11:00-18:00
      'S0': 7,   // 11:30-18:30
      'S1': 7,   // 12:00-19:00
      'S': 7,    // 12:00-19:00
      'FS': 7.25, // 06:45-14:00
      '4': 7,    // Frühschicht Uetersen
      '5': 7,    // Spätschicht Uetersen
      '6': 8     // Schichtleiter Uetersen
    };
    
    return shiftHours[shiftName] || 7; // 7 Stunden als Standardwert
  }
  
  /**
   * Prüft, ob zwei Tage aufeinanderfolgend sind
   */
  static isConsecutiveDay(day1: string, day2: string): boolean {
    const [d1, m1, y1] = day1.split('.').map(Number);
    const [d2, m2, y2] = day2.split('.').map(Number);
    
    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);
    
    // Differenz in Millisekunden
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    
    // Ein Tag hat 86400000 Millisekunden
    return diffTime === 86400000;
  }
  
  /**
   * Überprüft alle harten Constraints für einen Schichtplan
   * Fokus auf der korrekten Besetzung jeder Schicht
   */
  static checkHardConstraints(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    
    // Überprüfung der Staffing-Anforderungen für jeden Tag
    for (const dayKey in shiftPlan) {
      const dayPlan = shiftPlan[dayKey];
      if (dayPlan === null) continue; // Sonntage überspringen
      
      // Prüfe die Besetzungsanforderungen
      const staffingViolations = this.checkDayStaffingRequirements(dayKey, dayPlan, employees);
      violations.push(...staffingViolations);
      
      // Prüfe auf doppelte Zuweisungen (ein Mitarbeiter mehrfach am selben Tag)
      const assignedEmployees = new Set<string>();
      
      for (const shiftName in dayPlan) {
        for (const empId of dayPlan[shiftName]) {
          if (assignedEmployees.has(empId)) {
            violations.push({
              type: 'DuplicateAssignment',
              message: `Mitarbeiter ${empId} ist am ${dayKey} mehrfach eingeteilt`,
              severity: 'hard',
              day: dayKey,
              employee: empId
            });
          }
          assignedEmployees.add(empId);
          
          // Prüfe Rollenkonformität
          const employee = employees.find(e => e.id === empId);
          if (employee && !this.isRoleAllowedForShift(employee.role, shiftName)) {
            violations.push({
              type: 'RoleViolation',
              message: `Mitarbeiter ${employee.name} (${employee.role}) darf nicht in Schicht ${shiftName} am ${dayKey} arbeiten`,
              severity: 'hard',
              day: dayKey,
              employee: empId,
              shift: shiftName,
              role: employee.role
            });
          }
        }
      }
    }
    
    return violations;
  }
  
  /**
   * Überprüft die Besetzungsanforderungen für einen Tag
   * Stellt sicher, dass die richtige Anzahl an Mitarbeitern jeder Rolle eingeteilt ist
   */
  static checkDayStaffingRequirements(
    dayKey: string,
    dayPlan: DayShiftPlan,
    employees: Employee[]
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    
    // Bestimme den Wochentag
    const [day, month, year] = dayKey.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay(); // 0 = Sonntag, 6 = Samstag
    
    // Minimale Besetzungsanforderungen
    const minRequirements = {
      Pfleger: 4,
      Schichtleiter: 1,
      Pflegehelfer: 1
    };
    
    // Zähle die tatsächlich eingeteilten Mitarbeiter nach Rolle
    const roleCounts: Record<EmployeeRole, number> = {
      Pfleger: 0,
      Schichtleiter: 0,
      Pflegehelfer: 0
    };
    
    // Alle Schichten des Tages durchgehen und Mitarbeiter zählen
    for (const shiftName in dayPlan) {
      const employeeIds = dayPlan[shiftName];
      for (const empId of employeeIds) {
        const employee = employees.find(e => e.id === empId);
        if (employee) {
          roleCounts[employee.role]++;
        }
      }
    }
    
    // Prüfen, ob die Mindestanforderungen erfüllt sind
    for (const role in minRequirements) {
      const requiredCount = minRequirements[role as EmployeeRole];
      const actualCount = roleCounts[role as EmployeeRole];
      
      if (actualCount < requiredCount) {
        violations.push({
          type: 'StaffingViolation',
          message: `Nur ${actualCount} ${role} am ${dayKey} (mindestens ${requiredCount} erforderlich)`,
          severity: 'hard',
          day: dayKey,
          role: role as EmployeeRole,
          required: requiredCount,
          actual: actualCount
        });
      }
    }
    
    return violations;
  }
  
  /**
   * Überprüft alle weichen Constraints für einen Schichtplan
   */
  static checkSoftConstraints(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability
  ): ConstraintViolation[] {
    const violations: ConstraintViolation[] = [];
    
    // 1. Überprüfung der Samstagsregel
    for (const empId in employeeAvailability) {
      const saturdaysWorked = employeeAvailability[empId].saturdaysWorked;
      const employee = employees.find(e => e.id === empId);
      const maxSaturdays = 1; // Standardwert: max. 1 Samstag pro Mitarbeiter
      
      if (saturdaysWorked > maxSaturdays && employee) {
        violations.push({
          type: 'SaturdayOverload',
          message: `${employee.name} arbeitet an ${saturdaysWorked} Samstagen (max. erlaubt: ${maxSaturdays})`,
          severity: 'soft',
          employee: empId
        });
      }
    }
    
    // 2. Überprüfung der Arbeitszeitverteilung
    for (const empId in employeeAvailability) {
      const employee = employees.find(e => e.id === empId);
      if (!employee) continue;
      
      const totalHoursAssigned = employeeAvailability[empId].totalHoursAssigned;
      const targetHoursPerMonth = employee.hoursPerMonth; // Direkt die Monatsstunden verwenden
      const maxAllowedHours = targetHoursPerMonth * 1.1; // 10% Überstundentoleranz
      
      if (totalHoursAssigned > maxAllowedHours) {
        violations.push({
          type: 'WorkloadExceeded',
          message: `${employee.name} hat ${totalHoursAssigned.toFixed(1)}h zugewiesen (Ziel: ${targetHoursPerMonth.toFixed(1)}h, max. erlaubt: ${maxAllowedHours.toFixed(1)}h)`,
          severity: 'soft',
          employee: empId
        });
      }
    }
    
    // 3. Überprüfung auf gleiche Schichten an aufeinanderfolgenden Tagen
    // Für jeden Mitarbeiter die zugewiesenen Tage prüfen
    for (const empId in employeeAvailability) {
      const assignedDays = employeeAvailability[empId].shiftsAssigned.slice().sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('.').map(Number);
        const [dayB, monthB, yearB] = b.split('.').map(Number);
        
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        
        return dateA.getTime() - dateB.getTime();
      });
      
      // Aufeinanderfolgende Tage mit gleichen Schichten finden
      for (let i = 0; i < assignedDays.length - 1; i++) {
        const currentDay = assignedDays[i];
        const nextDay = assignedDays[i + 1];
        
        // Prüfen, ob es aufeinanderfolgende Tage sind
        if (this.isConsecutiveDay(currentDay, nextDay)) {
          // Schichttypen für beide Tage ermitteln
          const currentShift = this.getShiftTypeForEmployeeOnDay(empId, currentDay, shiftPlan);
          const nextShift = this.getShiftTypeForEmployeeOnDay(empId, nextDay, shiftPlan);
          
          if (currentShift && nextShift && currentShift === nextShift) {
            const employee = employees.find(e => e.id === empId);
            violations.push({
              type: 'ConsecutiveShift',
              message: `${employee?.name || empId} hat gleiche Schichten (${currentShift}) an aufeinanderfolgenden Tagen: ${currentDay} und ${nextDay}`,
              severity: 'soft',
              employee: empId,
              shift: currentShift
            });
          }
        }
      }
    }
    
    return violations;
  }
  
  /**
   * Ermittelt den Schichttyp eines Mitarbeiters an einem bestimmten Tag
   */
  private static getShiftTypeForEmployeeOnDay(
    employeeId: string,
    dayKey: string,
    shiftPlan: MonthlyShiftPlan
  ): string | null {
    const dayPlan = shiftPlan[dayKey];
    if (!dayPlan) return null;
    
    for (const shiftName in dayPlan) {
      if (dayPlan[shiftName].includes(employeeId)) {
        return shiftName;
      }
    }
    
    return null;
  }
  
  /**
   * Prüft alle Constraints (hart und weich) für einen Schichtplan
   */
  static checkAllConstraints(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability
  ): ConstraintCheckResult {
    const hardViolations = this.checkHardConstraints(shiftPlan, employees, employeeAvailability);
    const softViolations = this.checkSoftConstraints(shiftPlan, employees, employeeAvailability);
    
    return {
      isValid: hardViolations.length === 0,
      hardViolations,
      softViolations
    };
  }
}