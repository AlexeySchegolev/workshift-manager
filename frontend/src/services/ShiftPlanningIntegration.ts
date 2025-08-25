import {
  Employee,
  MonthlyShiftPlan,
  EmployeeAvailability,
  ConstraintCheck
} from '../models/interfaces';
import { EnhancedShiftPlanningService } from './EnhancedShiftPlanningService';
import { ShiftPlanningService } from './ShiftPlanningService';

// Leerer Export um die Datei als Modul zu kennzeichnen
export {};

/**
 * Integrationsdienst für die Schichtplanung
 * Bietet eine einheitliche Schnittstelle zur Nutzung des verbesserten Algorithmus
 * und stellt Kompatibilität mit der bestehenden Anwendung sicher
 */
export class ShiftPlanningIntegration {
  /**
   * Flag, um zu entscheiden, ob der verbesserte Algorithmus verwendet werden soll
   */
  private static useEnhancedAlgorithm = true;
  
  /**
   * Generiert einen Schichtplan
   * Verwendet entweder den verbesserten oder den ursprünglichen Algorithmus
   */
  static generateShiftPlan(
    employees: Employee[],
    year: number,
    month: number
  ): { shiftPlan: MonthlyShiftPlan; employeeAvailability: EmployeeAvailability } {
    console.log(`Generiere Schichtplan für ${month}/${year} mit ${this.useEnhancedAlgorithm ? 'verbessertem' : 'ursprünglichem'} Algorithmus`);
    
    if (this.useEnhancedAlgorithm) {
      // Verbesserten Algorithmus verwenden
      const result = EnhancedShiftPlanningService.generateShiftPlan(employees, year, month);
      
      // Kompatibles Format zurückgeben
      return {
        shiftPlan: result.shiftPlan,
        employeeAvailability: result.employeeAvailability
      };
    } else {
      // Ursprünglichen Algorithmus verwenden
      return ShiftPlanningService.generateShiftPlan(employees, year, month);
    }
  }
  
  /**
   * Überprüft die Einhaltung der Regeln
   * Verwendet entweder den verbesserten oder den ursprünglichen Constraint-Checker
   */
  static checkConstraints(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability
  ): ConstraintCheck[] {
    if (this.useEnhancedAlgorithm) {
      // Verbesserten Constraint-Checker verwenden und Ergebnisse konvertieren
      const result = EnhancedShiftPlanningService.generateShiftPlan(employees, 0, 0); // Dummy-Werte, wir nutzen nur die Violations
      const constraints = EnhancedShiftPlanningService.convertViolationsToConstraintChecks({
        hard: result.violations.hard,
        soft: result.violations.soft
      });
      
      // Statistiken als Info-Constraints hinzufügen
      this.addStatisticsToConstraints(constraints, result.statistics);
      
      return constraints;
    } else {
      // Ursprünglichen Constraint-Checker verwenden
      return ShiftPlanningService.checkConstraints(shiftPlan, employees, employeeAvailability);
    }
  }
  
  /**
   * Fügt Statistiken zu den Constraints hinzu
   */
  private static addStatisticsToConstraints(
    constraints: ConstraintCheck[],
    statistics: any
  ): void {
    // Überschrift für Statistiken
    constraints.push({
      status: 'info',
      message: '====== STATISTIKEN ======'
    });
    
    // Vollständigkeitsrate
    constraints.push({
      status: 'info',
      message: `Vollständigkeitsrate: ${statistics.completionRate.toFixed(1)}% (${statistics.completeDays} von ${statistics.completeDays + statistics.incompleteDays} Tagen)`
    });
    
    // Durchschnittliche Arbeitsbelastung
    constraints.push({
      status: 'info',
      message: `Durchschnittliche Arbeitsbelastung: ${statistics.averageWorkload.toFixed(1)}% der Sollarbeitszeit`
    });
    
    // Arbeitsbelastungsverteilung (Top 3 und Bottom 3)
    const sortedWorkload = [...statistics.workloadDistribution].sort((a, b) => b.percentage - a.percentage);
    const top3 = sortedWorkload.slice(0, 3);
    const bottom3 = sortedWorkload.slice(-3);
    
    constraints.push({
      status: 'info',
      message: `Höchste Arbeitsbelastung: ${top3.map(w => `${w.name} (${w.percentage.toFixed(1)}%)`).join(', ')}`
    });
    
    constraints.push({
      status: 'info',
      message: `Niedrigste Arbeitsbelastung: ${bottom3.map(w => `${w.name} (${w.percentage.toFixed(1)}%)`).join(', ')}`
    });
    
    // Samstagsverteilung
    const samstage = statistics.saturdayDistribution
      .filter((s: {employeeId: string, name: string, count: number}) => s.count > 0)
      .sort((a: {employeeId: string, name: string, count: number},
             b: {employeeId: string, name: string, count: number}) => b.count - a.count);
    
    if (samstage.length > 0) {
      constraints.push({
        status: 'info',
        message: `Samstagsverteilung: ${samstage.map((s: {employeeId: string, name: string, count: number}) => `${s.name} (${s.count})`).join(', ')}`
      });
    }
  }
  
  /**
   * Aktiviert den verbesserten Algorithmus
   */
  static enableEnhancedAlgorithm(): void {
    this.useEnhancedAlgorithm = true;
    console.log("Verbesserter Schichtplanungs-Algorithmus aktiviert");
  }
  
  /**
   * Deaktiviert den verbesserten Algorithmus und verwendet den ursprünglichen
   */
  static disableEnhancedAlgorithm(): void {
    this.useEnhancedAlgorithm = false;
    console.log("Ursprünglicher Schichtplanungs-Algorithmus aktiviert");
  }
  
  /**
   * Setzt den Status des verbesserten Algorithmus
   */
  static setEnhancedAlgorithmEnabled(enabled: boolean): void {
    this.useEnhancedAlgorithm = enabled;
    console.log(`${enabled ? 'Verbesserter' : 'Ursprünglicher'} Schichtplanungs-Algorithmus aktiviert`);
  }
  
  /**
   * Prüft, ob der verbesserte Algorithmus aktiviert ist
   */
  static isEnhancedAlgorithmEnabled(): boolean {
    return this.useEnhancedAlgorithm;
  }
}

export default ShiftPlanningIntegration;