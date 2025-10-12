import { ShiftPlanAbsenceManager } from '../ShiftPlanAbsenceManager';
import { CalculatedShiftPlan, EmployeeDayStatus, ReducedEmployee, RoleOccupancy, ShiftOccupancy, ShiftPlanDay } from '../ShiftPlanTypes';

/**
 * fairer Schichtplan-Optimizer
 * Implementiert einen Algorithmus zur schrittweisen Schichtbelegung
 */
export class ShiftPlanOptimizerFrontend {
  private lastModel: any = null;
  private absenceManager: ShiftPlanAbsenceManager;
  private absences: any[] = [];
  private employees: (ReducedEmployee & { calculatedMonthlyHours: number })[] = [];
  
  constructor() {
    this.absenceManager = new ShiftPlanAbsenceManager();
  }

  /**
   * Optimiert Schichtplan mit fairem Algorithmus
   */
  async optimizeShiftPlan(shiftPlanData: CalculatedShiftPlan): Promise<ShiftPlanDay[]> {
    const { year, month, days, employees } = shiftPlanData;
    console.log('🔧 ShiftPlanOptimizer: Starte faire Optimierung');
    
    // Lade Abwesenheiten für den Monat
    this.absences = await this.absenceManager.loadAbsencesForMonth(year, month);
    this.employees = employees;
    
    // Erstelle Kopie der Tage für Bearbeitung
    const optimizedDays = this.deepCopyDays(days);
    
    // Führe den Optimierungsalgorithmus aus
    const result = this.runOptimizationAlgorithm(optimizedDays);
    
    // Erstelle Modell-Informationen
    this.lastModel = {
      optimizer: 'ShiftPlanOptimizer',
      status: result.success ? 'completed' : 'partial',
      message: result.message,
      assignmentsCount: result.assignmentsCount,
      iterations: result.iterations
    };
    
    console.log('🔧 ShiftPlanOptimizer:', result.message);
    
    return optimizedDays;
  }

  /**
   * Hauptalgorithmus für faire Schichtbelegung
   */
  private runOptimizationAlgorithm(days: ShiftPlanDay[]): { success: boolean, message: string, assignmentsCount: number, iterations: number } {
    let assignmentsCount = 0;
    let iterations = 0;
    const maxIterations = 3000; // Schutz vor Endlosschleife
    const blockedDays = new Set<string>(); // Tage ohne verfügbare Mitarbeiter
    
    while (iterations < maxIterations) {
      iterations++;
      
      // 1) Finde alle Tage mit unvollständig belegten Schichten (außer blockierte)
      const availableDays = this.findAllDaysWithIncompleteShifts(days, blockedDays);
      if (availableDays.length === 0) {
        // Prüfe ob alle Schichten vollständig belegt sind
        const allComplete = this.areAllShiftsComplete(days);
        if (allComplete) {
          return {
            success: true,
            message: `Alle Schichten vollständig belegt nach ${assignmentsCount} Zuweisungen in ${iterations} Iterationen`,
            assignmentsCount,
            iterations
          };
        } else {
          // Es gibt noch unvollständige Schichten, aber keine verfügbaren Tage mehr
          this.logBlockedDaysWarning(blockedDays, days);
          return {
            success: false,
            message: `Keine weiteren Zuweisungen möglich. ${assignmentsCount} Zuweisungen durchgeführt. Blockierte Tage: ${blockedDays.size}`,
            assignmentsCount,
            iterations
          };
        }
      }
      
      // Wähle zufälligen Tag aus verfügbaren Tagen
      const randomIndex = Math.floor(Math.random() * availableDays.length);
      const selectedDay = availableDays[randomIndex];
      
      // 2) Finde die am wenigsten belegte Rolle in unvollständigen Schichten
      const targetRole = this.findLeastOccupiedRole(selectedDay);
      if (!targetRole) {
        blockedDays.add(selectedDay.dayKey);
        console.warn(`⚠️ Tag ${selectedDay.dayKey} blockiert: Keine verfügbaren Rollen mehr`);
        continue;
      }
      
      // 3) Finde verfügbaren Mitarbeiter mit passender Rolle und geringster Belastung
      const availableEmployee = this.findBestAvailableEmployee(selectedDay, targetRole);
      if (!availableEmployee) {
        // Prüfe ob für diesen Tag überhaupt noch Mitarbeiter verfügbar sind
        const hasAnyAvailableEmployees = this.hasAvailableEmployeesForDay(selectedDay);
        if (!hasAnyAvailableEmployees) {
          blockedDays.add(selectedDay.dayKey);
          console.warn(`⚠️ Tag ${selectedDay.dayKey} blockiert: Keine verfügbaren Mitarbeiter mehr`);
        }
        continue;
      }
      
      // 4) Führe Zuweisung durch
      const assigned = this.assignEmployeeToShift(selectedDay, targetRole, availableEmployee);
      if (assigned) {
        assignmentsCount++;
        console.log(`✅ Zuweisung ${assignmentsCount}: ${availableEmployee.employee.name} → ${targetRole.role.roleName} am ${selectedDay.dayKey}`);
      }
    }
    
    return {
      success: false,
      message: `Maximale Iterationen erreicht (${maxIterations}) nach ${assignmentsCount} Zuweisungen`,
      assignmentsCount,
      iterations
    };
  }

  /**
   * Findet alle Tage mit unvollständig belegten Schichten (außer blockierte)
   */
  private findAllDaysWithIncompleteShifts(days: ShiftPlanDay[], blockedDays: Set<string>): ShiftPlanDay[] {
    return days.filter(day =>
      !blockedDays.has(day.dayKey) &&
      day.shiftOccupancy.some(shift =>
        shift.roleOccupancy.some(role => role.assigned < role.required)
      )
    );
  }

  /**
   * Prüft ob alle Schichten vollständig belegt sind
   */
  private areAllShiftsComplete(days: ShiftPlanDay[]): boolean {
    return days.every(day =>
      day.shiftOccupancy.every(shift =>
        shift.roleOccupancy.every(role => role.assigned >= role.required)
      )
    );
  }

  /**
   * Prüft ob für einen Tag noch Mitarbeiter verfügbar sind
   */
  private hasAvailableEmployeesForDay(day: ShiftPlanDay): boolean {
    return day.employees.some(empStatus =>
      empStatus.isEmpty && empStatus.absenceType === ''
    );
  }

  /**
   * Loggt Warnung für blockierte Tage
   */
  private logBlockedDaysWarning(blockedDays: Set<string>, days: ShiftPlanDay[]): void {
    if (blockedDays.size > 0) {
      console.warn(`⚠️ WARNUNG: ${blockedDays.size} Tage konnten nicht vollständig belegt werden:`);
      blockedDays.forEach(dayKey => {
        const day = days.find(d => d.dayKey === dayKey);
        if (day) {
          const incompleteShifts = day.shiftOccupancy.filter(shift =>
            shift.roleOccupancy.some(role => role.assigned < role.required)
          );
          console.warn(`  - ${dayKey}: ${incompleteShifts.length} unvollständige Schichten`);
          incompleteShifts.forEach(shift => {
            const incompleteRoles = shift.roleOccupancy.filter(role => role.assigned < role.required);
            incompleteRoles.forEach(role => {
              console.warn(`    * ${shift.shiftName}: ${role.roleName} (${role.assigned}/${role.required})`);
            });
          });
        }
      });
    }
  }

  /**
   * Findet die am wenigsten belegte Rolle in unvollständigen Schichten
   */
  private findLeastOccupiedRole(day: ShiftPlanDay): { shift: ShiftOccupancy, role: RoleOccupancy } | null {
    let leastOccupiedRole: { shift: ShiftOccupancy, role: RoleOccupancy } | null = null;
    let lowestOccupancyRatio = Infinity;
    
    for (const shift of day.shiftOccupancy) {
      for (const role of shift.roleOccupancy) {
        if (role.assigned < role.required) {
          const occupancyRatio = role.assigned / role.required;
          if (occupancyRatio < lowestOccupancyRatio) {
            lowestOccupancyRatio = occupancyRatio;
            leastOccupiedRole = { shift, role };
          }
        }
      }
    }
    
    return leastOccupiedRole;
  }

  /**
   * Findet den besten verfügbaren Mitarbeiter für eine Rolle
   */
  private findBestAvailableEmployee(day: ShiftPlanDay, targetRole: { shift: ShiftOccupancy, role: RoleOccupancy }): { employee: ReducedEmployee & { calculatedMonthlyHours: number }, employeeStatus: EmployeeDayStatus } | null {
    // Filtere verfügbare Mitarbeiter mit passender Rolle
    const availableEmployees = day.employees.filter(empStatus => {
      const employee = this.employees.find(emp => emp.name === empStatus.employee.name);
      return employee &&
             employee.role === targetRole.role.roleName &&
             empStatus.isEmpty && // Nicht bereits zugewiesen
             empStatus.absenceType === ''; // Nicht abwesend
    });
    
    if (availableEmployees.length === 0) {
      return null;
    }
    
    // Finde Mitarbeiter mit geringster prozentueller Belastung
    let bestEmployee: { employee: ReducedEmployee & { calculatedMonthlyHours: number }, employeeStatus: EmployeeDayStatus } | null = null;
    let lowestWorkloadRatio = Infinity;
    
    for (const empStatus of availableEmployees) {
      const employee = this.employees.find(emp => emp.name === empStatus.employee.name);
      if (employee) {
        // Berechne prozentuelle Belastung (aktuelle Stunden / maximale Monatsstunden)
        const maxMonthlyHours = employee.monthlyWorkHours || 160; // Fallback: 160h
        const workloadRatio = employee.calculatedMonthlyHours / maxMonthlyHours;
        
        if (workloadRatio < lowestWorkloadRatio) {
          lowestWorkloadRatio = workloadRatio;
          bestEmployee = { employee, employeeStatus: empStatus };
        }
      }
    }
    
    return bestEmployee;
  }

  /**
   * Weist einen Mitarbeiter einer Schicht zu
   */
  private assignEmployeeToShift(day: ShiftPlanDay, targetRole: { shift: ShiftOccupancy, role: RoleOccupancy }, employeeData: { employee: ReducedEmployee & { calculatedMonthlyHours: number }, employeeStatus: EmployeeDayStatus }): boolean {
    const { shift, role } = targetRole;
    const { employee, employeeStatus } = employeeData;
    
    // Aktualisiere Mitarbeiter-Status
    employeeStatus.assignedShift = shift.shortName;
    employeeStatus.shiftId = shift.shiftId;
    employeeStatus.shiftName = shift.shiftName;
    employeeStatus.isEmpty = false;
    
    // Aktualisiere Rollen-Belegung
    role.assigned++;
    role.assignedEmployees.push(employee.name);
    
    // Aktualisiere Schicht-Belegung
    shift.assignedCount++;
    shift.assignedEmployees.push(employee.name);
    shift.isUnderStaffed = shift.assignedCount < shift.requiredCount;
    shift.isCorrectlyStaffed = shift.assignedCount === shift.requiredCount;
    
    // Aktualisiere Mitarbeiter-Monatsstunden (geschätzt 8h pro Schicht)
    employee.calculatedMonthlyHours += 8;
    
    return true;
  }

  /**
   * Erstellt eine tiefe Kopie der Tage-Datenstruktur
   * Behält Date-Objekte bei (JSON.stringify konvertiert sie zu Strings)
   */
  private deepCopyDays(days: ShiftPlanDay[]): ShiftPlanDay[] {
    return days.map(day => ({
      ...day,
      date: new Date(day.date), // Stelle sicher, dass date ein Date-Objekt bleibt
      employees: day.employees.map(emp => ({
        ...emp,
        employee: { ...emp.employee }
      })),
      shiftOccupancy: day.shiftOccupancy.map(shift => ({
        ...shift,
        assignedEmployees: [...shift.assignedEmployees],
        roleOccupancy: shift.roleOccupancy.map(role => ({
          ...role,
          assignedEmployees: [...role.assignedEmployees]
        }))
      }))
    }));
  }
  
  /**
   * Gibt das zuletzt erstellte Modell zurück
   */
  getLastModel(): any {
    return this.lastModel;
  }
}