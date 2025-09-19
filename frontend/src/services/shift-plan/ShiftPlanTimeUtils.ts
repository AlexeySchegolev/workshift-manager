import { ShiftPlanDay, ReducedEmployee, EmployeeDayStatus } from './ShiftPlanTypes';
import { ShiftPlanDetailResponseDto } from '../../api/data-contracts';

/**
 * Utility-Klasse für Zeit- und Datumsberechnungen im Schichtplan-Kontext
 */
export class ShiftPlanTimeUtils {
  
  /**
   * Prüft ob ein Datum heute ist
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Berechnet die Monatszeit für einen Mitarbeiter
   */
  static calculateEmployeeMonthlyHours(
    employee: ReducedEmployee,
    days: ShiftPlanDay[],
    shiftPlanDetails: ShiftPlanDetailResponseDto[]
  ): number {
    let totalHours = 0;
    
    days.forEach(day => {
      const employeeStatus = day.employees.find(empStatus =>
        empStatus.employee.id === employee.id
      );
      
      if (employeeStatus?.assignedShift && employeeStatus.shiftId) {
        // Find shift details from shiftPlanDetails
        const shiftDetail = shiftPlanDetails.find(detail =>
          detail.shiftId === employeeStatus.shiftId
        );
        
        if (shiftDetail?.shift) {
          // Calculate duration from start and end time
          const shift = shiftDetail.shift as any;
          if (shift.startTime && shift.endTime) {
            const duration = this.calculateShiftDuration(shift.startTime, shift.endTime);
            totalHours += duration;
          }
        }
      }
    });
    
    return totalHours;
  }

  /**
   * Berechnet die Dauer einer Schicht in Stunden
   */
  static calculateShiftDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  /**
   * Formatiert eine Zeit für die Anzeige
   */
  static formatTime(time: string): string {
    if (!time) return '00:00';
    return time;
  }

  /**
   * Erstellt einen Datumsschlüssel im Format DD.MM.YYYY
   */
  static createDayKey(date: Date): string {
    const dayStr = date.getDate().toString().padStart(2, '0');
    const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearStr = date.getFullYear().toString();
    return `${dayStr}.${monthStr}.${yearStr}`;
  }

  /**
   * Prüft ob ein Tag ein Wochenende ist
   */
  static isWeekend(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }
}