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
    
    // Bestimme die Anforderungen für diese Schicht
    let requiredSlots: { validRoles: string[], count: number }[] = [];
    
    if (shiftName === "S00" || shiftName === "S" || shiftName === "FS" || shiftName === "S1" || shiftName === "S0") {
      console.log(`Versuche Spezialschicht ${shiftName} für Tag ${dayKey} zu besetzen`);
      
      // Spezielle Schichten, die nur von einem Mitarbeiter besetzt werden
      if (shiftName === "S1") {
        // S1-Schicht: Muss von einem Pfleger oder Schichtleiter besetzt werden
        requiredSlots.push({
          validRoles: ["Pfleger", "Schichtleiter"],
          count: 1
        });
      } else if (shiftName === "S0") {
        // S0-Schicht: Muss von einem Pfleger oder Schichtleiter besetzt werden
        // Pflegehelfer können optional auch hier eingesetzt werden
        requiredSlots.push({
          validRoles: ["Pfleger", "Schichtleiter", "Pflegehelfer"],
          count: 1
        });
      } else {
        // Alle anderen Spezialschichten
        requiredSlots.push({
          validRoles: shift.roles,
          count: 1
        });
      }
      
      // Strikter Sicherheitsmechanismus: Nur einen einzigen Slot für Spezialschichten erlauben
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
      
      // Explizite Überprüfung, ob die Spezialschicht besetzt wurde
      if (success) {
        console.log(`Spezialschicht ${shiftName} für Tag ${dayKey} erfolgreich besetzt`);
        
        // Prüfen, ob die Schicht tatsächlich Mitarbeiter zugewiesen bekommen hat
        const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
        if (!dayPlan[shiftName] || dayPlan[shiftName].length === 0) {
          console.error(`Fehler: Spezialschicht ${shiftName} wurde als erfolgreich markiert, hat aber keine Mitarbeiter`);
          return false;
        }
        
        // Weitermachen mit der nächsten Schicht
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
        console.warn(`Konnte Spezialschicht ${shiftName} für Tag ${dayKey} nicht besetzen`);
        return false;
      }
    } else {
      // Standard-Schichten: mind. 1 Schichtleiter, 1 Pflegehelfer, 4 Pfleger
      requiredSlots.push({ validRoles: ["Schichtleiter"], count: 1 });
      requiredSlots.push({ validRoles: ["Pflegehelfer"], count: 1 });
      requiredSlots.push({ validRoles: ["Pfleger"], count: 4 });
    }
    
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