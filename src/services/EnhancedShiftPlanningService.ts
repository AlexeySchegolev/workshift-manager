import {
  Employee,
  EmployeeAvailability,
  MonthlyShiftPlan,
  DayShiftPlan,
  ConstraintCheck
} from '../models/interfaces';
import { EnhancedConstraintSystem, ConstraintViolation } from './EnhancedConstraintSystem';
import { EnhancedBacktrackingService } from './EnhancedBacktrackingService';
import { ShiftPlanningUtilService } from './ShiftPlanningUtilService';

// Leerer Export um die Datei als Modul zu kennzeichnen
export {};

/**
 * Ergebnis der Schichtplanung
 */
export interface ShiftPlanningResult {
  shiftPlan: MonthlyShiftPlan;
  employeeAvailability: EmployeeAvailability;
  violations: {
    hard: ConstraintViolation[];
    soft: ConstraintViolation[];
  };
  statistics: PlanningStatistics;
}

/**
 * Statistiken zur Schichtplanung
 */
export interface PlanningStatistics {
  completeDays: number;
  incompleteDays: number;
  completionRate: number;
  averageWorkload: number;
  workloadDistribution: {
    employeeId: string;
    name: string;
    assignedHours: number;
    targetHours: number;
    percentage: number;
  }[];
  saturdayDistribution: {
    employeeId: string;
    name: string;
    count: number;
  }[];
}

/**
 * Verbesserter Service für die Schichtplanung
 * Implementiert den robusten Algorithmus mit klarer Constraint-Struktur
 */
export class EnhancedShiftPlanningService {
  /**
   * Generiert einen Schichtplan für einen bestimmten Monat
   * Verwendet den verbesserten Backtracking-Algorithmus
   */
  static generateShiftPlan(
    employees: Employee[],
    year: number,
    month: number
  ): ShiftPlanningResult {
    console.log(`Generiere Schichtplan für ${month}/${year} mit ${employees.length} Mitarbeitern`);
    
    // Mitarbeiter nach Klinik filtern
    const hauptpraxisEmployees = employees.filter(emp => emp.clinic === 'Elmshorn' || !emp.clinic);
    const zweitepraxisEmployees = employees.filter(emp => emp.clinic === 'Uetersen');
    
    // Schichtplan für Hauptpraxis erstellen
    console.log("Generiere Schichtplan für Hauptpraxis (Elmshorn)...");
    const hauptpraxisResult = this.generatePlanForClinic(hauptpraxisEmployees, year, month);
    
    // Die ersten zwei Samstage des Monats identifizieren
    const erstenZweiSamstage = this.findErstenZweiSamstage(year, month);
    console.log(`Die ersten zwei Samstage des Monats sind: ${erstenZweiSamstage.join(', ')}`);
    
    // Überprüfen, ob die ersten zwei Samstage unbesetzt sind
    const unbelegteHauptpraxisSamstage = this.findUnbesetzteHauptpraxisSamstage(hauptpraxisResult.shiftPlan, year, month)
      .filter(dayKey => erstenZweiSamstage.includes(dayKey));
    
    // Wenn es unbesetzte Samstage unter den ersten zwei gibt und Mitarbeiter der zweiten Praxis verfügbar sind
    if (unbelegteHauptpraxisSamstage.length > 0 && zweitepraxisEmployees.length > 0) {
      console.log(`${unbelegteHauptpraxisSamstage.length} unbesetzte Samstage (unter den ersten zwei) in der Hauptpraxis gefunden. Verwende Mitarbeiter der zweiten Praxis...`);
      this.belegeSamstageMitZweitepraxisMitarbeitern(
        hauptpraxisResult.shiftPlan,
        hauptpraxisResult.employeeAvailability,
        zweitepraxisEmployees,
        unbelegteHauptpraxisSamstage
      );
    }
    
    // Alle weiteren Samstage (ab dem dritten) explizit als unbesetzt markieren
    this.markiereWeitereWochenendeAlsUnbesetzt(
      hauptpraxisResult.shiftPlan,
      year,
      month
    );
    
    // Schichtplan für zweite Praxis erstellen (falls benötigt)
    let zweitepraxisResult = null;
    if (zweitepraxisEmployees.length > 0) {
      console.log("Generiere Schichtplan für zweite Praxis (Uetersen)...");
      zweitepraxisResult = this.generatePlanForClinic(zweitepraxisEmployees, year, month);
    }
    
    // Pläne zusammenführen (falls ein Plan für die zweite Praxis existiert)
    const combinedPlan = { ...hauptpraxisResult.shiftPlan };
    const combinedAvailability = { ...hauptpraxisResult.employeeAvailability };
    
    if (zweitepraxisResult) {
      // Schichten der zweiten Praxis integrieren
      for (const dayKey in zweitepraxisResult.shiftPlan) {
        if (zweitepraxisResult.shiftPlan[dayKey] !== null) {
          // Wenn der Tag noch nicht existiert oder null ist, initialisieren
          if (!combinedPlan[dayKey] || combinedPlan[dayKey] === null) {
            combinedPlan[dayKey] = {};
          }
          
          // Schichten der zweiten Praxis zum kombinierten Plan hinzufügen
          const dayPlan = combinedPlan[dayKey] as DayShiftPlan;
          const zweitepraxisDayPlan = zweitepraxisResult.shiftPlan[dayKey] as DayShiftPlan;
          
          for (const shiftName in zweitepraxisDayPlan) {
            // Spezielles Präfix für Schichten der zweiten Praxis hinzufügen
            const zweitepraxisShiftName = `U_${shiftName}`;
            dayPlan[zweitepraxisShiftName] = zweitepraxisDayPlan[shiftName];
          }
        }
      }
      
      // Verfügbarkeiten zusammenführen
      for (const empId in zweitepraxisResult.employeeAvailability) {
        combinedAvailability[empId] = zweitepraxisResult.employeeAvailability[empId];
      }
    }
    
    // Abschließende Constraint-Prüfung für den gesamten Plan
    const constraintResult = EnhancedConstraintSystem.checkAllConstraints(
      combinedPlan,
      employees,
      combinedAvailability
    );
    
    // Statistiken berechnen
    const statistics = this.calculatePlanningStatistics(
      combinedPlan,
      employees,
      combinedAvailability,
      year,
      month
    );
    
    return {
      shiftPlan: combinedPlan,
      employeeAvailability: combinedAvailability,
      violations: {
        hard: constraintResult.hardViolations,
        soft: constraintResult.softViolations
      },
      statistics
    };
  }
  
  /**
   * Generiert einen Schichtplan für eine Klinik
   */
  private static generatePlanForClinic(
    employees: Employee[],
    year: number,
    month: number
  ): { shiftPlan: MonthlyShiftPlan; employeeAvailability: EmployeeAvailability } {
    // Initialisierung
    const shiftPlan: MonthlyShiftPlan = {};
    const employeeAvailability: EmployeeAvailability = {};
    
    // Verfügbarkeit initialisieren
    employees.forEach(emp => {
      employeeAvailability[emp.id] = {
        weeklyHoursAssigned: 0,
        totalHoursAssigned: 0,
        shiftsAssigned: [],
        lastShiftType: null,
        saturdaysWorked: 0
      };
    });
    
    // Alle Tage des Monats generieren
    const daysInMonth = new Date(year, month, 0).getDate();
    const weeks = ShiftPlanningUtilService.groupDaysByWeek(year, month, daysInMonth);
    
    // Für jede Woche Schichten planen
    for (const weekNumber in weeks) {
      // Wöchentliche Stunden zurücksetzen
      employees.forEach(emp => {
        employeeAvailability[emp.id].weeklyHoursAssigned = 0;
      });
      
      const weekDates = weeks[weekNumber];
      
      // Für jeden Tag der Woche Schichten planen
      for (const date of weekDates) {
        // Tag dem verbesserten Backtracking-Algorithmus übergeben
        const success = EnhancedBacktrackingService.assignDayWithBacktracking(
          date,
          employees,
          employeeAvailability,
          shiftPlan,
          false // Zunächst im strikten Modus versuchen
        );
        
        if (!success) {
          // Wenn im strikten Modus keine Lösung gefunden wurde, im gelockerten Modus versuchen
          console.warn(`Konnte keinen Plan für ${date.toLocaleDateString()} im strikten Modus erstellen. Versuche es im gelockerten Modus...`);
          
          const relaxedSuccess = EnhancedBacktrackingService.assignDayWithBacktracking(
            date,
            employees,
            employeeAvailability,
            shiftPlan,
            true // Gelockterter Modus
          );
          
          if (!relaxedSuccess) {
            console.error(`Konnte auch im gelockerten Modus keinen Plan für ${date.toLocaleDateString()} erstellen.`);
          }
        }
      }
    }
    
    return { shiftPlan, employeeAvailability };
  }
  
  /**
   * Berechnet Statistiken für den Schichtplan
   */
  private static calculatePlanningStatistics(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability,
    year: number,
    month: number
  ): PlanningStatistics {
    const daysInMonth = new Date(year, month, 0).getDate();
    let completeDays = 0;
    let incompleteDays = 0;
    
    // Zähle vollständige und unvollständige Tage
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayKey = this.formatDayKey(date);
      
      // Sonntage ausschließen
      if (date.getDay() === 0) continue;
      
      if (shiftPlan[dayKey] && shiftPlan[dayKey] !== null) {
        completeDays++;
      } else {
        incompleteDays++;
      }
    }
    
    // Berechne die Vollständigkeitsrate
    const nonSundayDays = daysInMonth - this.countSundays(year, month);
    const completionRate = (completeDays / nonSundayDays) * 100;
    
    // Berechne die Arbeitsbelastung pro Mitarbeiter
    let totalWorkloadPercentage = 0;
    const workloadDistribution = employees.map(emp => {
      const assignedHours = employeeAvailability[emp.id]?.totalHoursAssigned || 0;
      const targetHours = emp.hoursPerMonth; // Verwende direkt die Monatsstunden
      const percentage = (assignedHours / targetHours) * 100;
      
      totalWorkloadPercentage += percentage;
      
      return {
        employeeId: emp.id,
        name: emp.name,
        assignedHours,
        targetHours,
        percentage
      };
    });
    
    // Durchschnittliche Arbeitsbelastung
    const averageWorkload = employees.length > 0 ? totalWorkloadPercentage / employees.length : 0;
    
    // Samstagsverteilung
    const saturdayDistribution = employees.map(emp => ({
      employeeId: emp.id,
      name: emp.name,
      count: employeeAvailability[emp.id]?.saturdaysWorked || 0
    }));
    
    return {
      completeDays,
      incompleteDays,
      completionRate,
      averageWorkload,
      workloadDistribution,
      saturdayDistribution
    };
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
   * Zählt die Anzahl der Sonntage in einem Monat
   */
  private static countSundays(year: number, month: number): number {
    const daysInMonth = new Date(year, month, 0).getDate();
    let sundays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() === 0) sundays++;
    }
    
    return sundays;
  }
  
  /**
   * Identifiziert die ersten zwei Samstage eines Monats
   */
  private static findErstenZweiSamstage(
    year: number,
    month: number
  ): string[] {
    const erstenZweiSamstage: string[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Alle Tage des Monats durchgehen, um Samstage zu finden
    for (let day = 1; day <= daysInMonth && erstenZweiSamstage.length < 2; day++) {
      const date = new Date(year, month - 1, day);
      
      // Nur Samstage berücksichtigen
      if (date.getDay() === 6) {
        const dayKey = this.formatDayKey(date);
        erstenZweiSamstage.push(dayKey);
      }
    }
    
    return erstenZweiSamstage;
  }

  /**
   * Findet alle unbelegten oder unvollständig belegten Samstage im Schichtplan der Hauptpraxis
   */
  private static findUnbesetzteHauptpraxisSamstage(
    shiftPlan: MonthlyShiftPlan,
    year: number,
    month: number
  ): string[] {
    const unbelegteSamstage: string[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Alle Samstage des Monats prüfen
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      
      // Nur Samstage berücksichtigen
      if (date.getDay() === 6) {
        const dayKey = this.formatDayKey(date);
        
        // Prüfen, ob der Tag im Plan fehlt oder leer ist
        if (!shiftPlan[dayKey] || shiftPlan[dayKey] === null) {
          unbelegteSamstage.push(dayKey);
          continue;
        }
        
        // Prüfen, ob der Tag unvollständig belegt ist
        const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
        const hasValidShifts = Object.keys(dayPlan).length > 0 &&
                              Object.values(dayPlan).some(employees => employees.length > 0);
        
        if (!hasValidShifts) {
          unbelegteSamstage.push(dayKey);
        }
      }
    }
    
    return unbelegteSamstage;
  }

  /**
   * Markiert explizit alle Samstage ab dem dritten im Monat als unbesetzt
   */
  private static markiereWeitereWochenendeAlsUnbesetzt(
    shiftPlan: MonthlyShiftPlan,
    year: number,
    month: number
  ): void {
    const daysInMonth = new Date(year, month, 0).getDate();
    const erstenZweiSamstage = this.findErstenZweiSamstage(year, month);
    
    // Alle Samstage des Monats durchgehen
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      
      // Nur Samstage berücksichtigen
      if (date.getDay() === 6) {
        const dayKey = this.formatDayKey(date);
        
        // Wenn es nicht einer der ersten zwei Samstage ist, explizit als unbesetzt markieren
        if (!erstenZweiSamstage.includes(dayKey)) {
          shiftPlan[dayKey] = null;
        }
      }
    }
  }
  
  /**
   * Belegt unbesetzte Samstage mit Mitarbeitern aus der zweiten Praxis
   */
  private static belegeSamstageMitZweitepraxisMitarbeitern(
    shiftPlan: MonthlyShiftPlan,
    employeeAvailability: EmployeeAvailability,
    zweitepraxisEmployees: Employee[],
    unbelegteSamstage: string[]
  ): void {
    // Sortiere Mitarbeiter der zweiten Praxis nach Verfügbarkeit (weniger ausgelastete zuerst)
    const sortedZweitepraxisEmployees = [...zweitepraxisEmployees].sort((a, b) => {
      const aWorkload = this.calculateEmployeeWorkload(a, employeeAvailability);
      const bWorkload = this.calculateEmployeeWorkload(b, employeeAvailability);
      return aWorkload - bWorkload;
    });
    
    // Versuche, jeden unbelegten Samstag zu besetzen
    for (const dayKey of unbelegteSamstage) {
      console.log(`Versuche, unbelegten Samstag ${dayKey} mit Mitarbeitern der zweiten Praxis zu besetzen...`);
      
      // Initialisiere den Tagesplan, falls er nicht existiert
      if (!shiftPlan[dayKey] || shiftPlan[dayKey] === null) {
        shiftPlan[dayKey] = {};
      }
      
      const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
      
      // Standard-Samstagschichten für die Hauptpraxis
      if (!dayPlan['F']) dayPlan['F'] = [];
      if (!dayPlan['FS']) dayPlan['FS'] = [];
      
      // Finde verfügbare Mitarbeiter für FS-Schicht (bevorzugt Pfleger oder Schichtleiter)
      const fsEligibleEmployees = sortedZweitepraxisEmployees.filter(emp =>
        (emp.role === 'Pfleger' || emp.role === 'Schichtleiter') &&
        !this.isEmployeeAssignedOnDay(emp.id, dayKey, employeeAvailability)
      );
      
      // Finde verfügbare Mitarbeiter für F-Schicht (alle Rollen)
      const fEligibleEmployees = sortedZweitepraxisEmployees.filter(emp =>
        !this.isEmployeeAssignedOnDay(emp.id, dayKey, employeeAvailability)
      );
      
      // Versuche, FS-Schicht zu besetzen
      if (fsEligibleEmployees.length > 0 && dayPlan['FS'].length === 0) {
        const employee = fsEligibleEmployees[0];
        dayPlan['FS'].push(employee.id);
        
        // Verfügbarkeit aktualisieren
        this.updateEmployeeAvailability(
          employee,
          employeeAvailability,
          dayKey,
          'FS',
          7.25 // FS-Schicht: 06:45-14:00 (7.25h)
        );
        
        console.log(`Samstag ${dayKey}: ${employee.name} (Zweite Praxis) für FS-Schicht eingeteilt`);
      }
      
      // Versuche, F-Schicht mit weiteren Mitarbeitern zu besetzen
      let assignedToF = 0;
      const maxFAssignments = 4; // Maximal 4 Mitarbeiter für F-Schicht
      
      for (const employee of fEligibleEmployees) {
        // Abbrechen, wenn genug Mitarbeiter eingeteilt wurden oder keine verfügbaren mehr
        if (assignedToF >= maxFAssignments ||
            this.isEmployeeAssignedOnDay(employee.id, dayKey, employeeAvailability)) {
          break;
        }
        
        dayPlan['F'].push(employee.id);
        
        // Verfügbarkeit aktualisieren
        this.updateEmployeeAvailability(
          employee,
          employeeAvailability,
          dayKey,
          'F',
          7 // F-Schicht: 06:00-13:00 (7h)
        );
        
        assignedToF++;
        console.log(`Samstag ${dayKey}: ${employee.name} (Zweite Praxis) für F-Schicht eingeteilt`);
      }
      
      // Wenn keine Schichten besetzt werden konnten, Tag als unbelegt markieren
      const isStillEmpty = (dayPlan['F'].length === 0 && dayPlan['FS'].length === 0);
      if (isStillEmpty) {
        console.log(`Konnte Samstag ${dayKey} nicht mit Mitarbeitern der zweiten Praxis besetzen`);
      }
    }
  }
  
  /**
   * Prüft, ob ein Mitarbeiter bereits an einem bestimmten Tag eingeteilt ist
   */
  private static isEmployeeAssignedOnDay(
    employeeId: string,
    dayKey: string,
    employeeAvailability: EmployeeAvailability
  ): boolean {
    return employeeAvailability[employeeId]?.shiftsAssigned.includes(dayKey) || false;
  }
  
  /**
   * Aktualisiert die Verfügbarkeit eines Mitarbeiters nach Zuweisung
   */
  private static updateEmployeeAvailability(
    employee: Employee,
    employeeAvailability: EmployeeAvailability,
    dayKey: string,
    shiftName: string,
    shiftHours: number
  ): void {
    // Wenn der Mitarbeiter noch nicht in der Verfügbarkeit existiert, initialisieren
    if (!employeeAvailability[employee.id]) {
      employeeAvailability[employee.id] = {
        weeklyHoursAssigned: 0,
        totalHoursAssigned: 0,
        shiftsAssigned: [],
        lastShiftType: null,
        saturdaysWorked: 0
      };
    }
    
    // Verfügbarkeit aktualisieren
    employeeAvailability[employee.id].weeklyHoursAssigned += shiftHours;
    employeeAvailability[employee.id].totalHoursAssigned += shiftHours;
    employeeAvailability[employee.id].shiftsAssigned.push(dayKey);
    employeeAvailability[employee.id].lastShiftType = shiftName;
    
    // Samstagsarbeit zählen
    const [day, month, year] = dayKey.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDay() === 6) { // Samstag
      employeeAvailability[employee.id].saturdaysWorked += 1;
    }
  }
  
  /**
   * Berechnet die aktuelle Arbeitsbelastung eines Mitarbeiters
   */
  private static calculateEmployeeWorkload(
    employee: Employee,
    employeeAvailability: EmployeeAvailability
  ): number {
    if (!employeeAvailability[employee.id]) {
      return 0;
    }
    
    const totalAssignedHours = employeeAvailability[employee.id].totalHoursAssigned;
    const targetHoursPerMonth = employee.hoursPerMonth; // Verwende direkt die Monatsstunden
    
    return totalAssignedHours / targetHoursPerMonth * 100;
  }
  
  /**
   * Konvertiert die erweiterten Constraints in das alte Format für Kompatibilität
   */
  static convertViolationsToConstraintChecks(
    violations: {
      hard: ConstraintViolation[];
      soft: ConstraintViolation[];
    }
  ): ConstraintCheck[] {
    const checks: ConstraintCheck[] = [];
    
    // Überschrift für harte Constraints
    if (violations.hard.length > 0) {
      checks.push({
        status: 'info',
        message: '====== HARTE CONSTRAINTS (KRITISCH) ======'
      });
      
      // Harte Constraint-Verletzungen hinzufügen
      for (const violation of violations.hard) {
        checks.push({
          status: 'violation',
          message: violation.message
        });
      }
    } else {
      checks.push({
        status: 'ok',
        message: 'Alle harten Constraints wurden erfüllt.'
      });
    }
    
    // Überschrift für weiche Constraints
    if (violations.soft.length > 0) {
      checks.push({
        status: 'info',
        message: '====== WEICHE CONSTRAINTS (OPTIMIERBAR) ======'
      });
      
      // Weiche Constraint-Verletzungen hinzufügen
      for (const violation of violations.soft) {
        checks.push({
          status: 'warning',
          message: violation.message
        });
      }
    } else {
      checks.push({
        status: 'ok',
        message: 'Alle weichen Constraints wurden optimal erfüllt.'
      });
    }
    
    return checks;
  }
}

export default EnhancedShiftPlanningService;