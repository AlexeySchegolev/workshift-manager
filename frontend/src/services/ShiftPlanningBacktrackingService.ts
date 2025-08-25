import {
  Employee,
  EmployeeAvailability,
  MonthlyShiftPlan,
  DayShiftPlan,
} from '../models/interfaces';
import { ShiftPlanningConstraintService } from './ShiftPlanningConstraintService';
import { ShiftPlanningUtilService } from './ShiftPlanningUtilService';

// Export stellt sicher, dass die Datei als Modul erkannt wird
export {};

/**
 * Service für den Backtracking-Algorithmus der Schichtplanung
 * Implementiert den Kern-Algorithmus zur Schichtzuweisung
 */
export class ShiftPlanningBacktrackingService {
  /**
   * Weist Schichten für einen Tag zu (rekursiv)
   * Verbesserter Backtracking-Algorithmus mit robuster Fehlerbehandlung
   */
  static assignDayShiftsWithBacktracking(
    shiftNames: string[],
    index: number,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability,
    shiftPlan: MonthlyShiftPlan,
    dayKey: string,
    dayShifts: { [key: string]: any },
    weekday: number,
    strictMode: boolean
  ): boolean {
    // Robuste Fehlerbehandlung
    if (!shiftNames || !employees || !employeeAvailability || !shiftPlan || !dayKey || !dayShifts) {
      console.error("Fehlende Parameter in assignDayShiftsWithBacktracking");
      return false;
    }

    // Abbruchbedingung: Alle Schichten zugewiesen
    if (index >= shiftNames.length) {
      return true;
    }
    
    const shiftName = shiftNames[index];
    const shift = dayShifts[shiftName];
    
    // Sicherheitsprüfung: Existiert diese Schicht für diesen Tag?
    if (!shift) {
      console.warn(`Schicht ${shiftName} existiert nicht für Tag ${dayKey}`);
      return this.assignDayShiftsWithBacktracking(
        shiftNames,
        index + 1,
        employees,
        employeeAvailability,
        shiftPlan,
        dayKey,
        dayShifts,
        weekday,
        strictMode
      );
    }
    
    // VEREINFACHTE LOGIK: NUR SCHICHTLEITER-PLANUNG
    // Alle anderen Rollen sind auskommentiert für schrittweises Testen
    
    let requiredSlots: { validRoles: string[], count: number }[] = [];
    
    // VOLLSTÄNDIGE LOGIK: SCHICHTLEITER + 4 PFLEGER + 1 PFLEGEHELFER PRO SCHICHT
    console.log(`Versuche Schicht ${shiftName} für Tag ${dayKey} zu besetzen (1 Schichtleiter + 4 Pfleger + 1 Pflegehelfer)`);
    
    // 1 Schichtleiter pro Schicht
    requiredSlots.push({
      validRoles: ["Schichtleiter"],
      count: 1
    });
    
    // 4 Pfleger pro Schicht
    requiredSlots.push({
      validRoles: ["Pfleger"],
      count: 4
    });
    
    // 1 Pflegehelfer pro Schicht (neu aktiviert!)
    requiredSlots.push({
      validRoles: ["Pflegehelfer"],
      count: 1
    });
    
    // Prüfen, ob der Tag null ist und ggf. initialisieren
    if (shiftPlan[dayKey] === null) {
      shiftPlan[dayKey] = {};
    }
    
    // Leeres Array für diese Schicht anlegen
    const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
    if (!dayPlan[shiftName]) {
      dayPlan[shiftName] = [];
    }
    
    // Versuche alle Slots zu füllen
    const success = this.fillRequiredSlots(
      requiredSlots,
      0,
      employees,
      employeeAvailability,
      shiftPlan,
      dayKey,
      shiftName,
      shift,
      weekday,
      strictMode
    );
    
    if (success) {
      // Wenn erfolgreich, zur nächsten Schicht
      return this.assignDayShiftsWithBacktracking(
        shiftNames,
        index + 1,
        employees,
        employeeAvailability,
        shiftPlan,
        dayKey,
        dayShifts,
        weekday,
        strictMode
      );
    } else {
      // Wenn nicht erfolgreich, Schicht zurücksetzen
      if (shiftPlan[dayKey] !== null) {
        const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
        dayPlan[shiftName] = [];
      }
      return false;
    }
  }
  
  /**
   * Füllt die benötigten Slots für eine Schicht
   */
  private static fillRequiredSlots(
    requiredSlots: { validRoles: string[], count: number }[],
    slotIndex: number,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability,
    shiftPlan: MonthlyShiftPlan,
    dayKey: string,
    shiftName: string,
    shift: any,
    weekday: number,
    strictMode: boolean
  ): boolean {
    // Alle Slots gefüllt
    if (slotIndex >= requiredSlots.length) {
      return true;
    }
    
    const req = requiredSlots[slotIndex];
    const { validRoles, count } = req;
    
    // Rekursive Funktion für das Auffüllen mehrerer Mitarbeiter
    const assignMultiplePeople = (n: number): boolean => {
      // Alle Mitarbeiter für diesen Slot zugewiesen
      if (n === count) {
        return this.fillRequiredSlots(
          requiredSlots,
          slotIndex + 1,
          employees,
          employeeAvailability,
          shiftPlan,
          dayKey,
          shiftName,
          shift,
          weekday,
          strictMode
        );
      }
      
      // Versuche passenden Mitarbeiter zu finden
      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        
        if (ShiftPlanningConstraintService.canAssignEmployee(
          emp,
          validRoles as any[],
          employeeAvailability,
          dayKey,
          weekday,
          shiftName,
          shift,
          strictMode
        )) {
          // Sicherstellen, dass der Tag nicht null ist
          if (shiftPlan[dayKey] === null) {
            shiftPlan[dayKey] = {};
          }
          
          // Mitarbeiter zuweisen
          const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
          // Sicherstellen, dass das Array für diese Schicht existiert
          if (!dayPlan[shiftName]) {
            dayPlan[shiftName] = [];
          }
          dayPlan[shiftName].push(emp.id);
          
          // Verfügbarkeit aktualisieren
          const shiftHours = ShiftPlanningUtilService.calculateShiftHours(shift.start, shift.end);
          employeeAvailability[emp.id].weeklyHoursAssigned += shiftHours;
          employeeAvailability[emp.id].totalHoursAssigned += shiftHours;
          employeeAvailability[emp.id].shiftsAssigned.push(dayKey);
          employeeAvailability[emp.id].lastShiftType = shiftName;
          
          if (weekday === 6) { // Samstag
            employeeAvailability[emp.id].saturdaysWorked += 1;
          }
          
          // Rekursion für nächsten Mitarbeiter
          if (assignMultiplePeople(n + 1)) {
            return true;
          }
          
          // Backtracking: Zuweisung rückgängig machen
          if (shiftPlan[dayKey] !== null) {
            const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
            dayPlan[shiftName].pop();
          }
          employeeAvailability[emp.id].weeklyHoursAssigned -= shiftHours;
          employeeAvailability[emp.id].totalHoursAssigned -= shiftHours;
          employeeAvailability[emp.id].shiftsAssigned.pop();
          employeeAvailability[emp.id].lastShiftType = null;
          
          if (weekday === 6) {
            employeeAvailability[emp.id].saturdaysWorked -= 1;
          }
        }
      }
      
      // Kein passender Mitarbeiter gefunden
      return false;
    };
    
    // Starte mit dem ersten Mitarbeiter
    return assignMultiplePeople(0);
  }
}