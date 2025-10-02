import { ShiftPlanTimeUtils } from '../ShiftPlanTimeUtils';
import {
    ReducedEmployee,
    ShiftPlanDay,
    CalculatedShiftPlan
} from '../ShiftPlanTypes';
import { shiftPlanDetailService } from '../ShiftPlanDetailService';

/**
 * Service für Preview-Berechnungen von Schichtplänen
 * Berechnet Mitarbeiterzeiten und Schichtenbelegung für Preview-Daten
 */
export class ShiftPlanPreviewService {

  /**
   * Berechnet Mitarbeiterzeiten und Schichtenbelegung für Preview-Daten
   */
  calculatePreviewData(
    previewDays: ShiftPlanDay[],
    originalEmployees: ReducedEmployee[],
    originalData?: any
  ): {
    employeesWithHours: (ReducedEmployee & { calculatedMonthlyHours: number })[];
    daysWithOccupancy: ShiftPlanDay[];
  } {
    // Berechne Monatszeit für jeden Mitarbeiter basierend auf Preview-Daten
    const employeesWithHours = originalEmployees.map(employee => ({
      ...employee,
      calculatedMonthlyHours: this.calculateEmployeeHoursFromPreview(employee, previewDays)
    }));

    // Berechne Schichtenbelegung für jeden Tag mit originalen Schicht-Daten
    const daysWithOccupancy = previewDays.map(day => ({
      ...day,
      shiftOccupancy: this.calculateShiftOccupancyFromPreview(day, originalData)
    }));

    return {
      employeesWithHours,
      daysWithOccupancy
    };
  }

  /**
   * Berechnet die Monatszeit eines Mitarbeiters aus Preview-Daten
   */
  private calculateEmployeeHoursFromPreview(
    employee: ReducedEmployee,
    previewDays: ShiftPlanDay[]
  ): number {
    let totalHours = 0;
    
    previewDays.forEach(day => {
      const employeeStatus = day.employees.find(empStatus =>
        empStatus.employee.id === employee.id
      );
      
      if (employeeStatus?.assignedShift && employeeStatus.shiftName) {
        // Versuche verschiedene Formate zu extrahieren
        let startTime = '';
        let endTime = '';
        
        // Format: "Name (HH:MM - HH:MM)"
        let timeMatch = employeeStatus.shiftName.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
        if (timeMatch) {
          [, startTime, endTime] = timeMatch;
        } else {
          // Fallback: Versuche direkte Zeit-Extraktion aus dem Namen
          timeMatch = employeeStatus.shiftName.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
          if (timeMatch) {
            [, startTime, endTime] = timeMatch;
          } else {
            // Weitere Fallback-Logik: Standard-Schichtzeiten basierend auf shortName
            const shiftTimes = this.getDefaultShiftTimes(employeeStatus.assignedShift);
            startTime = shiftTimes.startTime;
            endTime = shiftTimes.endTime;
          }
        }
        
        if (startTime && endTime) {
          const duration = ShiftPlanTimeUtils.calculateShiftDuration(startTime, endTime);
          totalHours += duration;
        }
      }
    });
    
    return totalHours;
  }

  /**
   * Gibt Standard-Schichtzeiten basierend auf shortName zurück
   */
  private getDefaultShiftTimes(shortName: string): { startTime: string; endTime: string } {
    // Standard-Zeiten für häufige Schicht-Kürzel
    const defaultTimes: { [key: string]: { startTime: string; endTime: string } } = {
      'F': { startTime: '06:00', endTime: '14:00' }, // Frühschicht
      'S': { startTime: '14:00', endTime: '22:00' }, // Spätschicht
      'N': { startTime: '22:00', endTime: '06:00' }, // Nachtschicht
      'T': { startTime: '08:00', endTime: '16:00' }, // Tagschicht
    };
    
    return defaultTimes[shortName] || { startTime: '08:00', endTime: '16:00' };
  }

  /**
   * Berechnet die Schichtenbelegung für einen Preview-Tag
   */
  private calculateShiftOccupancyFromPreview(day: ShiftPlanDay, originalData?: any): any[] {
    const shiftMap = new Map<string, any>();
    
    // 1. Sammle ALLE verfügbaren Schichten für diesen Wochentag aus originalData
    if (originalData?.shiftWeekdays) {
      const dayOfWeek = day.date.getDay();
      originalData.shiftWeekdays.forEach((shiftWeekday: any) => {
        if (shiftWeekday.weekday === dayOfWeek && shiftWeekday.shift) {
          const shift = shiftWeekday.shift;
          const shiftId = shift.id;
          
          if (!shiftMap.has(shiftId)) {
            shiftMap.set(shiftId, {
              shiftId,
              shiftName: shift.name,
              shortName: shift.shortName,
              startTime: shift.startTime || '00:00',
              endTime: shift.endTime || '00:00',
              requiredCount: 0, // Wird später berechnet
              assignedCount: 0,
              assignedEmployees: [],
              roleOccupancy: new Map<string, any>(),
              originalShift: shift,
              isUnderStaffed: false,
              isCorrectlyStaffed: false
            });
          }
        }
      });
    }
    
    // 2. Sammle alle Schichten und ihre Zuordnungen aus Preview-Daten
    day.employees.forEach(empStatus => {
      if (empStatus.assignedShift && empStatus.shiftId) {
        const shiftId = empStatus.shiftId;
        
        if (!shiftMap.has(shiftId)) {
          // Extrahiere Zeiten aus shiftName
          let startTime = '00:00';
          let endTime = '00:00';
          
          const timeMatch = empStatus.shiftName.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
          if (timeMatch) {
            [, startTime, endTime] = timeMatch;
          } else {
            // Fallback zu Standard-Zeiten
            const defaultTimes = this.getDefaultShiftTimes(empStatus.assignedShift);
            startTime = defaultTimes.startTime;
            endTime = defaultTimes.endTime;
          }
          
          // Finde originale Schicht-Daten für Soll-Werte
          const originalShift = this.findOriginalShiftData(shiftId, originalData);
          
          shiftMap.set(shiftId, {
            shiftId,
            shiftName: empStatus.shiftName,
            shortName: empStatus.assignedShift,
            startTime,
            endTime,
            requiredCount: 0, // Wird später berechnet
            assignedCount: 0,
            assignedEmployees: [],
            roleOccupancy: new Map<string, any>(), // Verwende Map für einfachere Bearbeitung
            originalShift, // Speichere originale Schicht-Daten
            isUnderStaffed: false,
            isCorrectlyStaffed: false
          });
        }
        
        const shift = shiftMap.get(shiftId);
        shift.assignedCount++;
        shift.assignedEmployees.push(empStatus.employee.name);
        
        // Rolle hinzufügen/aktualisieren
        const roleName = empStatus.employee.role;
        if (!shift.roleOccupancy.has(roleName)) {
          // Finde Soll-Wert aus originalen Schicht-Rollen
          const requiredForRole = this.getRequiredCountForRole(shift.originalShift, roleName);
          
          shift.roleOccupancy.set(roleName, {
            roleName,
            required: requiredForRole,
            assigned: 0,
            assignedEmployees: []
          });
        }
        const roleOccupancy = shift.roleOccupancy.get(roleName);
        roleOccupancy.assigned++;
        roleOccupancy.assignedEmployees.push(empStatus.employee.name);
      }
    });
    
    // 3. Initialisiere Rollen-Belegung für alle Schichten (auch leere)
    shiftMap.forEach((shift, shiftId) => {
      if (shift.originalShift?.shiftRoles) {
        shift.originalShift.shiftRoles.forEach((shiftRole: any) => {
          const roleName = shiftRole.role?.name;
          if (roleName && !shift.roleOccupancy.has(roleName)) {
            shift.roleOccupancy.set(roleName, {
              roleName,
              required: shiftRole.count || 1,
              assigned: 0,
              assignedEmployees: []
            });
          }
        });
      }
    });
    
    // Konvertiere Map zu Array und berechne finale Werte
    return Array.from(shiftMap.values()).map(shift => {
      // Konvertiere roleOccupancy Map zu Array
      const roleOccupancyArray = Array.from(shift.roleOccupancy.values()) as any[];
      
      // Berechne requiredCount aus der Summe aller Rollen-Anforderungen
      const requiredCount = roleOccupancyArray.reduce((sum: number, role: any) => sum + role.required, 0) || 1;
      
      return {
        ...shift,
        roleOccupancy: roleOccupancyArray.sort((a: any, b: any) => a.roleName.localeCompare(b.roleName)),
        requiredCount,
        isUnderStaffed: shift.assignedCount < requiredCount,
        isCorrectlyStaffed: shift.assignedCount === requiredCount
      };
    }).sort((a, b) => {
      // Sortiere nach Startzeit
      const timeA = a.startTime.replace(':', '');
      const timeB = b.startTime.replace(':', '');
      return timeA.localeCompare(timeB);
    });
  }

  /**
   * Findet originale Schicht-Daten für Soll-Werte
   */
  private findOriginalShiftData(shiftId: string, originalData?: any): any {
    if (!originalData) return null;
    
    // Suche in availableShifts
    if (originalData.availableShifts) {
      const shift = originalData.availableShifts.find((s: any) => s.id === shiftId);
      if (shift) return shift;
    }
    
    // Suche in shiftWeekdays
    if (originalData.shiftWeekdays) {
      for (const shiftWeekday of originalData.shiftWeekdays) {
        if (shiftWeekday.shift && shiftWeekday.shift.id === shiftId) {
          return shiftWeekday.shift;
        }
      }
    }
    
    return null;
  }

  /**
   * Ermittelt den Soll-Wert für eine Rolle in einer Schicht
   */
  private getRequiredCountForRole(originalShift: any, roleName: string): number {
    if (!originalShift || !originalShift.shiftRoles) {
      return 1; // Standard-Fallback
    }
    
    // Suche in shiftRoles nach der spezifischen Rolle
    const shiftRole = originalShift.shiftRoles.find((sr: any) =>
      sr.role && sr.role.name === roleName
    );
    
    return shiftRole ? (shiftRole.count || 1) : 1;
  }

  /**
   * Übernimmt Preview-Daten in den aktuellen Schichtplan
   */
  async applyPreviewToShiftPlan(
    previewData: ShiftPlanDay[],
    originalData: CalculatedShiftPlan
  ): Promise<void> {
    if (!originalData.shiftPlan?.id) {
      throw new Error('Kein Schichtplan vorhanden');
    }

    const shiftPlanId = originalData.shiftPlan.id;

    // 1. Lösche alle bestehenden ShiftPlanDetails für diesen Schichtplan
    try {
      const existingDetails = await shiftPlanDetailService.getDetailsByShiftPlan(shiftPlanId);
      
      for (const detail of existingDetails) {
        await shiftPlanDetailService.deleteShiftPlanDetail(detail.id);
      }
    } catch (error) {
      console.error('Fehler beim Löschen bestehender Schichtplan-Details:', error);
      throw new Error('Fehler beim Löschen bestehender Zuordnungen');
    }

    // 2. Sammle alle neuen Zuordnungen aus den Preview-Daten
    const assignments: Array<{
      employeeId: string;
      shiftId: string;
      day: number;
    }> = [];

    previewData.forEach(dayInfo => {
      const day = dayInfo.date.getDate();
      
      dayInfo.employees.forEach(empStatus => {
        if (empStatus.assignedShift && empStatus.shiftId && !empStatus.isEmpty) {
          assignments.push({
            employeeId: empStatus.employee.id,
            shiftId: empStatus.shiftId,
            day: day
          });
        }
      });
    });

    // 3. Erstelle alle neuen Zuordnungen
    for (const assignment of assignments) {
      try {
        await shiftPlanDetailService.createShiftPlanDetail({
          shiftPlanId,
          employeeId: assignment.employeeId,
          shiftId: assignment.shiftId,
          day: assignment.day
        });
      } catch (error) {
        console.error(`Fehler beim Erstellen der Zuordnung für Mitarbeiter ${assignment.employeeId} zu Schicht ${assignment.shiftId} am Tag ${assignment.day}:`, error);
        // Weiter mit nächster Zuordnung
      }
    }
  }
}

// Export singleton instance
export const shiftPlanPreviewService = new ShiftPlanPreviewService();