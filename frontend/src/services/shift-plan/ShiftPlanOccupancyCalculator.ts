import { ShiftOccupancy, RoleOccupancy, EmployeeDayStatus } from './ShiftPlanTypes';
import { ShiftPlanDetailResponseDto } from '../../api/data-contracts';

/**
 * Service für die Berechnung von Schichtbelegungen
 */
export class ShiftPlanOccupancyCalculator {

  /**
   * Berechnet die Schicht-Belegung für einen bestimmten Tag
   */
  calculateShiftOccupancyForDay(
    dayNumber: number,
    dayOfWeek: number,
    shiftPlanDetails: ShiftPlanDetailResponseDto[],
    shiftWeekdays: any[],
    employeeStatuses: EmployeeDayStatus[]
  ): ShiftOccupancy[] {
    // Sammle alle relevanten Schichten für diesen Tag
    const allShifts = new Map<string, any>();
    
    // 1. Lade alle Schichten die für diesen Wochentag konfiguriert sind
    shiftWeekdays.forEach(shiftWeekday => {
      if (shiftWeekday.weekday === dayOfWeek && shiftWeekday.shift) {
        allShifts.set(shiftWeekday.shift.id, shiftWeekday.shift);
      }
    });
    
    // 2. Zusätzlich sammle Schichten die bereits für diesen Tag zugewiesen sind
    const shiftsForDay = shiftPlanDetails.filter(detail => detail.day === dayNumber);
    shiftsForDay.forEach(detail => {
      if (detail.shift && !allShifts.has(detail.shiftId)) {
        allShifts.set(detail.shiftId, detail.shift);
      }
    });

    // Gruppiere Zuweisungen nach Schicht-ID
    const assignmentGroups = new Map<string, ShiftPlanDetailResponseDto[]>();
    shiftsForDay.forEach(detail => {
      if (!assignmentGroups.has(detail.shiftId)) {
        assignmentGroups.set(detail.shiftId, []);
      }
      assignmentGroups.get(detail.shiftId)!.push(detail);
    });

    // Erstelle ShiftOccupancy Array für alle Schichten
    const occupancy: ShiftOccupancy[] = [];

    allShifts.forEach((shift, shiftId) => {
      const assignments = assignmentGroups.get(shiftId) || [];
      
      // Finde zugewiesene Mitarbeiter für diese Schicht
      const assignedEmployeesWithRoles = assignments
        .map(assignment => {
          const empStatus = employeeStatuses.find(emp =>
            emp.employee.id === assignment.employeeId
          );
          return {
            name: empStatus?.employee.name || 'Unbekannt',
            role: empStatus?.employee.role || 'Keine Rolle'
          };
        })
        .filter(emp => emp.name !== 'Unbekannt');

      const assignedEmployees = assignedEmployeesWithRoles.map(emp => emp.name);
      
      // Berechne Rollen-Belegung für Tooltip (zeigt alle Rollen an)
      const roleOccupancy = this.calculateTooltipRoleOccupancy(shift, assignedEmployeesWithRoles);
      
      // Berechne requiredCount aus der Summe aller Rollen-Anforderungen
      const requiredCount = roleOccupancy.reduce((sum, role) => sum + role.required, 0) || 1;
      const assignedCount = assignedEmployees.length;

      occupancy.push({
        shiftId,
        shiftName: shift?.name || 'Unbekannte Schicht',
        shortName: shift?.shortName || 'N/A',
        startTime: shift?.startTime || '00:00',
        endTime: shift?.endTime || '00:00',
        requiredCount,
        assignedCount,
        assignedEmployees,
        roleOccupancy,
        isUnderStaffed: assignedCount < requiredCount,
        isCorrectlyStaffed: assignedCount === requiredCount
      });
    });

    // Sortiere nach Startzeit
    return occupancy.sort((a, b) => {
      const timeA = a.startTime.replace(':', '');
      const timeB = b.startTime.replace(':', '');
      return timeA.localeCompare(timeB);
    });
  }

  /**
   * Ermittelt die benötigte Personalstärke für eine Schicht
   */
  private getRequiredStaffForShift(shift: any): number {
    // TODO: Implementiere Logik basierend auf Schicht-Rollen oder Konfiguration
    // Für jetzt nehmen wir 1 als Standard
    return shift?.requiredStaff || 1;
  }

  /**
   * Berechnet die Rollen-Belegung für eine Schicht
   */
  private calculateRoleOccupancyForShift(
    shift: any,
    assignedEmployees: { name: string; role: string }[]
  ): RoleOccupancy[] {
    // Gruppiere zugewiesene Mitarbeiter nach Rollen
    const roleGroups = new Map<string, string[]>();
    
    assignedEmployees.forEach(emp => {
      if (!roleGroups.has(emp.role)) {
        roleGroups.set(emp.role, []);
      }
      roleGroups.get(emp.role)!.push(emp.name);
    });

    // Erstelle RoleOccupancy Array
    const roleOccupancy: RoleOccupancy[] = [];
    
    // TODO: Hier sollten die tatsächlichen Rollen-Anforderungen aus der Schicht-Konfiguration geladen werden
    // Für jetzt nehmen wir die vorhandenen Rollen und setzen required = 1
    roleGroups.forEach((employees, roleName) => {
      roleOccupancy.push({
        roleName,
        required: 1, // TODO: Aus Schicht-Rollen-Konfiguration laden
        assigned: employees.length,
        assignedEmployees: employees
      });
    });

    return roleOccupancy.sort((a, b) => a.roleName.localeCompare(b.roleName));
  }

  /**
   * Berechnet die vollständige Rollen-Belegung für Tooltip-Anzeige
   * Zeigt alle konfigurierten Rollen an, auch nicht belegte (0 aus X)
   */
  calculateTooltipRoleOccupancy(
    shift: any,
    assignedEmployees: { name: string; role: string }[]
  ): RoleOccupancy[] {
    // Gruppiere zugewiesene Mitarbeiter nach Rollen
    const assignedRoleGroups = new Map<string, string[]>();
    
    assignedEmployees.forEach(emp => {
      if (!assignedRoleGroups.has(emp.role)) {
        assignedRoleGroups.set(emp.role, []);
      }
      assignedRoleGroups.get(emp.role)!.push(emp.name);
    });

    // Sammle alle konfigurierten Rollen für diese Schicht
    const allRequiredRoles = new Map<string, number>();
    
    // Lade Schicht-Rollen aus der Konfiguration
    if (shift?.shiftRoles && Array.isArray(shift.shiftRoles)) {
      shift.shiftRoles.forEach((shiftRole: any) => {
        const roleName = shiftRole.role?.name || 'Unbekannte Rolle';
        const requiredCount = shiftRole.count || 1;
        allRequiredRoles.set(roleName, requiredCount);
      });
    }
    
    // Falls keine Schicht-Rollen konfiguriert sind, verwende zugewiesene Rollen
    if (allRequiredRoles.size === 0) {
      assignedRoleGroups.forEach((employees, roleName) => {
        allRequiredRoles.set(roleName, 1);
      });
    }

    // Erstelle RoleOccupancy Array für alle Rollen
    const roleOccupancy: RoleOccupancy[] = [];
    
    allRequiredRoles.forEach((required, roleName) => {
      const assignedEmployeesForRole = assignedRoleGroups.get(roleName) || [];
      
      roleOccupancy.push({
        roleName,
        required,
        assigned: assignedEmployeesForRole.length,
        assignedEmployees: assignedEmployeesForRole
      });
    });

    return roleOccupancy.sort((a, b) => a.roleName.localeCompare(b.roleName));
  }

  /**
   * Extrahiert alle verfügbaren Schichten aus ShiftWeekdays und ShiftPlanDetails
   */
  extractAvailableShifts(shiftWeekdays: any[], shiftPlanDetails: ShiftPlanDetailResponseDto[]): any[] {
    const shiftsMap = new Map<string, any>();
    
    // Sammle Schichten aus ShiftWeekdays
    shiftWeekdays.forEach(shiftWeekday => {
      if (shiftWeekday.shift && !shiftsMap.has(shiftWeekday.shift.id)) {
        shiftsMap.set(shiftWeekday.shift.id, shiftWeekday.shift);
      }
    });
    
    // Sammle zusätzliche Schichten aus ShiftPlanDetails
    shiftPlanDetails.forEach(detail => {
      if (detail.shift && !shiftsMap.has(detail.shiftId)) {
        shiftsMap.set(detail.shiftId, detail.shift);
      }
    });
    
    return Array.from(shiftsMap.values()).sort((a, b) => {
      const timeA = a.startTime?.replace(':', '') || '0000';
      const timeB = b.startTime?.replace(':', '') || '0000';
      return timeA.localeCompare(timeB);
    });
  }
}