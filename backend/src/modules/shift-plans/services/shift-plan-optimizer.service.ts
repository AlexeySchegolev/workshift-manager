import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EmployeeAbsence } from '@/database/entities/employee-absence.entity';

/**
 * Reduziertes Mitarbeiter-Interface für Schichtplan-Berechnungen
 */
export interface ReducedEmployee {
  id: string;
  name: string;
  role: string;
  roleId?: string;
  location: string;
  monthlyWorkHours?: number;
}

/**
 * Interface für Mitarbeiter-Status an einem Tag
 */
export interface EmployeeDayStatus {
  employee: ReducedEmployee;
  assignedShift: string;
  shiftId: string;
  shiftName: string;
  absenceType: string;
  absenceReason: string;
  isEmpty: boolean;
}

/**
 * Interface für Rollen-Belegung in einer Schicht
 */
export interface RoleOccupancy {
  roleId?: string;
  roleName: string;
  required: number;
  assigned: number;
  assignedEmployees: string[];
  minRequired?: number;
  maxAllowed?: number;
  priority?: number;
}

/**
 * Interface für Schicht-Belegung an einem Tag
 */
export interface ShiftOccupancy {
  shiftId: string;
  shiftName: string;
  shortName: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
  assignedCount: number;
  assignedEmployees: string[];
  roleOccupancy: RoleOccupancy[];
  isUnderStaffed: boolean;
  isCorrectlyStaffed: boolean;
}

/**
 * Interface für einen Tag im Schichtplan
 */
export interface ShiftPlanDay {
  date: Date;
  dayKey: string;
  dayNumber: number;
  isWeekend: boolean;
  isToday: boolean;
  employees: EmployeeDayStatus[];
  shiftOccupancy: ShiftOccupancy[];
}

/**
 * Interface für die berechnete Schiftplan-Datenstruktur
 */
export interface CalculatedShiftPlan {
  employees: (ReducedEmployee & { calculatedMonthlyHours: number })[];
  days: ShiftPlanDay[];
  year: number;
  month: number;
  locationId: string;
}

/**
 * fairer Schichtplan-Optimizer
 * Implementiert einen Algorithmus zur schrittweisen Schichtbelegung
 */
@Injectable()
export class ShiftPlanOptimizer2Service {
  private readonly logger = new Logger(ShiftPlanOptimizer2Service.name);
  private lastModel: any = null;
  private absences: any[] = [];
  private employees: (ReducedEmployee & { calculatedMonthlyHours: number })[] = [];

  constructor(
    @InjectRepository(EmployeeAbsence)
    private readonly employeeAbsenceRepository: Repository<EmployeeAbsence>,
  ) {}

  /**
   * Optimiert Schichtplan mit fairem Algorithmus
   */
  async optimizeShiftPlan(shiftPlanData: CalculatedShiftPlan): Promise<ShiftPlanDay[]> {
    const { year, month, days, employees } = shiftPlanData;
    this.logger.log('🔧 ShiftPlanOptimizer2: Starte faire Optimierung');
    
    // Lade Abwesenheiten für den Monat (TODO: Implementierung)
    this.absences = await this.loadAbsencesForMonth(year, month);
    this.employees = employees;
    
    // Erstelle Kopie der Tage für Bearbeitung
    const optimizedDays = this.deepCopyDays(days);
    
    // Führe den Optimierungsalgorithmus aus
    const result = this.runOptimizationAlgorithm(optimizedDays);
    
    // Erstelle Modell-Informationen
    this.lastModel = {
      optimizer: 'ShiftPlanOptimizer2',
      status: result.success ? 'completed' : 'partial',
      message: result.message,
      assignmentsCount: result.assignmentsCount,
      iterations: result.iterations
    };
    
    this.logger.log('🔧 ShiftPlanOptimizer2: ' + result.message);
    
    return optimizedDays;
  }

  /**
   * Hauptalgorithmus für faire Schichtbelegung
   */
  private runOptimizationAlgorithm(days: ShiftPlanDay[]): { success: boolean, message: string, assignmentsCount: number, iterations: number } {
    let assignmentsCount = 0;
    let iterations = 0;
    const maxIterations = 3000;
    const blockedDays = new Set<string>();
    
    while (iterations < maxIterations) {
      iterations++;
      
      const availableDays = this.findAllDaysWithIncompleteShifts(days, blockedDays);
      if (availableDays.length === 0) {
        const allComplete = this.areAllShiftsComplete(days);
        if (allComplete) {
          return {
            success: true,
            message: `Alle Schichten vollständig belegt nach ${assignmentsCount} Zuweisungen in ${iterations} Iterationen`,
            assignmentsCount,
            iterations
          };
        } else {
          this.logBlockedDaysWarning(blockedDays, days);
          return {
            success: false,
            message: `Keine weiteren Zuweisungen möglich. ${assignmentsCount} Zuweisungen durchgeführt. Blockierte Tage: ${blockedDays.size}`,
            assignmentsCount,
            iterations
          };
        }
      }
      
      const randomIndex = Math.floor(Math.random() * availableDays.length);
      const selectedDay = availableDays[randomIndex];
      
      const targetRole = this.findLeastOccupiedRole(selectedDay);
      if (!targetRole) {
        blockedDays.add(selectedDay.dayKey);
        this.logger.warn(`⚠️ Tag ${selectedDay.dayKey} blockiert: Keine verfügbaren Rollen mehr`);
        continue;
      }
      
      const availableEmployee = this.findBestAvailableEmployee(selectedDay, targetRole);
      if (!availableEmployee) {
        const hasAnyAvailableEmployees = this.hasAvailableEmployeesForDay(selectedDay);
        if (!hasAnyAvailableEmployees) {
          blockedDays.add(selectedDay.dayKey);
          this.logger.warn(`⚠️ Tag ${selectedDay.dayKey} blockiert: Keine verfügbaren Mitarbeiter mehr`);
        }
        continue;
      }
      
      const assigned = this.assignEmployeeToShift(selectedDay, targetRole, availableEmployee);
      if (assigned) {
        assignmentsCount++;
        this.logger.log(`✅ Zuweisung ${assignmentsCount}: ${availableEmployee.employee.name} → ${targetRole.role.roleName} am ${selectedDay.dayKey}`);
      }
    }
    
    return {
      success: false,
      message: `Maximale Iterationen erreicht (${maxIterations}) nach ${assignmentsCount} Zuweisungen`,
      assignmentsCount,
      iterations
    };
  }

  private findAllDaysWithIncompleteShifts(days: ShiftPlanDay[], blockedDays: Set<string>): ShiftPlanDay[] {
    return days.filter(day =>
      !blockedDays.has(day.dayKey) &&
      day.shiftOccupancy.some(shift =>
        shift.roleOccupancy.some(role => role.assigned < role.required)
      )
    );
  }

  private areAllShiftsComplete(days: ShiftPlanDay[]): boolean {
    return days.every(day =>
      day.shiftOccupancy.every(shift =>
        shift.roleOccupancy.every(role => role.assigned >= role.required)
      )
    );
  }

  private hasAvailableEmployeesForDay(day: ShiftPlanDay): boolean {
    return day.employees.some(empStatus =>
      empStatus.isEmpty && empStatus.absenceType === ''
    );
  }

  private logBlockedDaysWarning(blockedDays: Set<string>, days: ShiftPlanDay[]): void {
    if (blockedDays.size > 0) {
      this.logger.warn(`⚠️ WARNUNG: ${blockedDays.size} Tage konnten nicht vollständig belegt werden:`);
      blockedDays.forEach(dayKey => {
        const day = days.find(d => d.dayKey === dayKey);
        if (day) {
          const incompleteShifts = day.shiftOccupancy.filter(shift =>
            shift.roleOccupancy.some(role => role.assigned < role.required)
          );
          this.logger.warn(`  - ${dayKey}: ${incompleteShifts.length} unvollständige Schichten`);
          incompleteShifts.forEach(shift => {
            const incompleteRoles = shift.roleOccupancy.filter(role => role.assigned < role.required);
            incompleteRoles.forEach(role => {
              this.logger.warn(`    * ${shift.shiftName}: ${role.roleName} (${role.assigned}/${role.required})`);
            });
          });
        }
      });
    }
  }

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

  private findBestAvailableEmployee(day: ShiftPlanDay, targetRole: { shift: ShiftOccupancy, role: RoleOccupancy }): { employee: ReducedEmployee & { calculatedMonthlyHours: number }, employeeStatus: EmployeeDayStatus } | null {
    const availableEmployees = day.employees.filter(empStatus => {
      const employee = this.employees.find(emp => emp.name === empStatus.employee.name);
      return employee &&
             employee.role === targetRole.role.roleName &&
             empStatus.isEmpty &&
             empStatus.absenceType === '';
    });
    
    if (availableEmployees.length === 0) {
      return null;
    }
    
    let bestEmployee: { employee: ReducedEmployee & { calculatedMonthlyHours: number }, employeeStatus: EmployeeDayStatus } | null = null;
    let lowestWorkloadRatio = Infinity;
    
    for (const empStatus of availableEmployees) {
      const employee = this.employees.find(emp => emp.name === empStatus.employee.name);
      if (employee) {
        const maxMonthlyHours = employee.monthlyWorkHours || 160;
        const workloadRatio = employee.calculatedMonthlyHours / maxMonthlyHours;
        
        if (workloadRatio < lowestWorkloadRatio) {
          lowestWorkloadRatio = workloadRatio;
          bestEmployee = { employee, employeeStatus: empStatus };
        }
      }
    }
    
    return bestEmployee;
  }

  private assignEmployeeToShift(day: ShiftPlanDay, targetRole: { shift: ShiftOccupancy, role: RoleOccupancy }, employeeData: { employee: ReducedEmployee & { calculatedMonthlyHours: number }, employeeStatus: EmployeeDayStatus }): boolean {
    const { shift, role } = targetRole;
    const { employee, employeeStatus } = employeeData;
    
    employeeStatus.assignedShift = shift.shortName;
    employeeStatus.shiftId = shift.shiftId;
    employeeStatus.shiftName = shift.shiftName;
    employeeStatus.isEmpty = false;
    
    role.assigned++;
    role.assignedEmployees.push(employee.name);
    
    shift.assignedCount++;
    shift.assignedEmployees.push(employee.name);
    shift.isUnderStaffed = shift.assignedCount < shift.requiredCount;
    shift.isCorrectlyStaffed = shift.assignedCount === shift.requiredCount;
    
    employee.calculatedMonthlyHours += 8;
    
    return true;
  }

  private deepCopyDays(days: ShiftPlanDay[]): ShiftPlanDay[] {
    return days.map(day => ({
      ...day,
      date: new Date(day.date),
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

  private async loadAbsencesForMonth(year: number, month: number): Promise<any[]> {
    this.logger.log(`Lade Abwesenheiten für ${month}/${year}`);
    
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);
    
    try {
      const absences = await this.employeeAbsenceRepository.find({
        where: [
          // Abwesenheiten die im Monat beginnen
          {
            startDate: Between(startOfMonth, endOfMonth)
          },
          // Abwesenheiten die im Monat enden
          {
            endDate: Between(startOfMonth, endOfMonth)
          },
          // Abwesenheiten die den ganzen Monat überspannen
          {
            startDate: Between(new Date(year - 1, 0, 1), startOfMonth),
            endDate: Between(endOfMonth, new Date(year + 1, 11, 31))
          }
        ],
        relations: ['employee']
      });

      this.logger.log(`${absences.length} Abwesenheiten für ${month}/${year} geladen`);
      
      return absences.map(absence => ({
        id: absence.id,
        employeeId: absence.employeeId,
        employee: absence.employee,
        startDate: absence.startDate,
        endDate: absence.endDate,
        type: absence.absenceType,
        reason: absence.absenceType || 'Abwesenheit',
        daysCount: absence.daysCount,
        hoursCount: absence.hoursCount
      }));
    } catch (error) {
      this.logger.error(`Fehler beim Laden der Abwesenheiten: ${error.message}`);
      return [];
    }
  }
  
  getLastModel(): any {
    return this.lastModel;
  }
}