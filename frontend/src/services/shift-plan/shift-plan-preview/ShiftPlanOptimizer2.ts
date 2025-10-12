import { ShiftPlanAbsenceManager } from '../ShiftPlanAbsenceManager';
import { CalculatedShiftPlan, ShiftPlanDay, RoleOccupancy, ShiftOccupancy, EmployeeDayStatus, ReducedEmployee } from '../ShiftPlanTypes';

/**
 * Zufallsbasierter Schichtplan-Optimizer
 * Implementiert einen Algorithmus zur schrittweisen Schichtbelegung
 */
export class ShiftPlanOptimizer2 {
  private lastModel: any = null;
  private absenceManager: ShiftPlanAbsenceManager;
  private absences: any[] = [];
  private employees: (ReducedEmployee & { calculatedMonthlyHours: number })[] = [];
  
  constructor() {
    this.absenceManager = new ShiftPlanAbsenceManager();
  }

  /**
   * Optimiert Schichtplan mit zufallsbasiertem Algorithmus
   */
  async optimizeShiftPlan(shiftPlanData: CalculatedShiftPlan): Promise<ShiftPlanDay[]> {
    const { year, month, days, employees } = shiftPlanData;
    console.log('🔧 ShiftPlanOptimizer2: Starte zufallsbasierte Optimierung');
    
    // Lade Abwesenheiten für den Monat
    this.absences = await this.absenceManager.loadAbsencesForMonth(year, month);
    this.employees = employees;
    
    // Erstelle Kopie der Tage für Bearbeitung
    const optimizedDays = this.deepCopyDays(days);
    
    // Führe den Optimierungsalgorithmus aus
    const result = this.runRandomOptimizationAlgorithm(optimizedDays);
    
    // Erstelle Modell-Informationen
    this.lastModel = {
      optimizer: 'ShiftPlanOptimizer2',
      status: result.success ? 'completed' : 'partial',
      message: result.message,
      assignmentsCount: result.assignmentsCount,
      iterations: result.iterations
    };
    
    console.log('🔧 ShiftPlanOptimizer2:', result.message);
    
    return optimizedDays;
  }

  /**
   * Hauptalgorithmus für zufallsbasierte Schichtbelegung
   */
  private runRandomOptimizationAlgorithm(days: ShiftPlanDay[]): { success: boolean, message: string, assignmentsCount: number, iterations: number } {
    let assignmentsCount = 0;
    let iterations = 0;
    const maxIterations = 1000; // Schutz vor Endlosschleife
    
    while (iterations < maxIterations) {
      iterations++;
      
      // 1) Finde zufällig einen Tag mit unvollständig belegten Schichten
      const dayWithIncompleteShifts = this.findRandomDayWithIncompleteShifts(days);
      if (!dayWithIncompleteShifts) {
        return {
          success: true,
          message: `Alle Schichten vollständig belegt nach ${assignmentsCount} Zuweisungen in ${iterations} Iterationen`,
          assignmentsCount,
          iterations
        };
      }
      
      // 2) Finde die am wenigsten belegte Rolle in unvollständigen Schichten
      const targetRole = this.findLeastOccupiedRole(dayWithIncompleteShifts);
      if (!targetRole) {
        return {
          success: false,
          message: `Keine verfügbaren Rollen mehr für Tag ${dayWithIncompleteShifts.dayKey} nach ${assignmentsCount} Zuweisungen`,
          assignmentsCount,
          iterations
        };
      }
      
      // 3) Finde verfügbaren Mitarbeiter mit passender Rolle und geringster Belastung
      const availableEmployee = this.findBestAvailableEmployee(dayWithIncompleteShifts, targetRole);
      if (!availableEmployee) {
        return {
          success: false,
          message: `Keine verfügbaren Mitarbeiter für Rolle ${targetRole.role.roleName} am ${dayWithIncompleteShifts.dayKey} nach ${assignmentsCount} Zuweisungen`,
          assignmentsCount,
          iterations
        };
      }
      
      // 4) Führe Zuweisung durch
      const assigned = this.assignEmployeeToShift(dayWithIncompleteShifts, targetRole, availableEmployee);
      if (assigned) {
        assignmentsCount++;
        console.log(`✅ Zuweisung ${assignmentsCount}: ${availableEmployee.employee.name} → ${targetRole.role.roleName} am ${dayWithIncompleteShifts.dayKey}`);
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
   * Findet zufällig einen Tag mit unvollständig belegten Schichten
   */
  private findRandomDayWithIncompleteShifts(days: ShiftPlanDay[]): ShiftPlanDay | null {
    const daysWithIncompleteShifts = days.filter(day =>
      day.shiftOccupancy.some(shift =>
        shift.roleOccupancy.some(role => role.assigned < role.required)
      )
    );
    
    if (daysWithIncompleteShifts.length === 0) {
      return null;
    }
    
    // Wähle zufälligen Tag
    const randomIndex = Math.floor(Math.random() * daysWithIncompleteShifts.length);
    return daysWithIncompleteShifts[randomIndex];
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