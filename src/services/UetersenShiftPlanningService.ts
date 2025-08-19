import {
  Employee,
  EmployeeAvailability,
  MonthlyShiftPlan,
  DayShiftPlan,
} from '../models/interfaces';
import { relaxedRules } from '../data/defaultRules';
import { uetersenShifts } from '../data/defaultShifts';
import { ShiftPlanningUtilService } from './ShiftPlanningUtilService';
import { ShiftPlanningConstraintService } from './ShiftPlanningConstraintService';

// Export stellt sicher, dass die Datei als Modul erkannt wird
export {};

/**
 * Service für die Schichtplanung der Uetersen-Praxis
 * Spezialisiert auf die besonderen Anforderungen der zweiten Praxis
 */
export class UetersenShiftPlanningService {
  /**
   * Erstellt einen Schichtplan für die Uetersen-Praxis
   * Implementiert die speziellen Regeln für Uetersen (Mo, Mi, Fr)
   */
  static createUetersenShiftPlan(
    employees: Employee[],
    year: number,
    month: number
  ): { shiftPlan: MonthlyShiftPlan; employeeAvailability: EmployeeAvailability } {
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
    
    // Mitarbeiterlisten nach Rolle
    const schichtleiter = employees.filter(emp => emp.role === 'Schichtleiter');
    const pfleger = employees.filter(emp => emp.role === 'Pfleger');
    const pflegehelfer = employees.filter(emp => emp.role === 'Pflegehelfer');
    
    // Für jede Woche Schichten planen
    for (const weekNumber in weeks) {
      // Mitarbeiterlisten mischen für faire Verteilung
      const shuffledSchichtleiter = [...schichtleiter].sort(() => Math.random() - 0.5);
      const shuffledPfleger = [...pfleger].sort(() => Math.random() - 0.5);
      const shuffledPflegehelfer = [...pflegehelfer].sort(() => Math.random() - 0.5);
      
      // Wöchentliche Stunden und letzte Schicht zurücksetzen
      employees.forEach(emp => {
        employeeAvailability[emp.id].weeklyHoursAssigned = 0;
        employeeAvailability[emp.id].lastShiftType = null; // Zurücksetzen des lastShiftType zwischen den Wochen
      });
      
      const weekDates = weeks[weekNumber];
      
      // Für jeden Tag der Woche Schichten planen
      for (const date of weekDates) {
        const day = date.getDate();
        const monthOfDay = date.getMonth() + 1;
        const yearOfDay = date.getFullYear();
        const dayKey = `${day}.${monthOfDay}.${yearOfDay}`;
        const weekday = date.getDay(); // 0 = Sonntag, 6 = Samstag
        
        // Uetersen hat nur an Mo (1), Mi (3), Fr (5) geöffnet
        if (![1, 3, 5].includes(weekday)) {
          if (!shiftPlan[dayKey]) {
            shiftPlan[dayKey] = null;
          }
          continue;
        }
        
        // Initialisieren des Tagesplans
        if (!shiftPlan[dayKey]) {
          shiftPlan[dayKey] = {};
        }
        
        const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
        
        // 1. Schichtleiter zuweisen (einer pro Tag, markiert als 6)
        let assignedSchichtleiter = false;
        for (const sl of shuffledSchichtleiter) {
          if (ShiftPlanningConstraintService.canAssignEmployeeToUetersen(
            sl, employeeAvailability, dayKey, "6", uetersenShifts.longDays["6"]
          )) {
            if (!dayPlan["6"]) {
              dayPlan["6"] = [];
            }
            dayPlan["6"].push(sl.id);
            
            // Verfügbarkeit aktualisieren
            const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
              uetersenShifts.longDays["6"].start,
              uetersenShifts.longDays["6"].end
            );
            employeeAvailability[sl.id].weeklyHoursAssigned += shiftHours;
            employeeAvailability[sl.id].totalHoursAssigned += shiftHours;
            employeeAvailability[sl.id].shiftsAssigned.push(dayKey);
            employeeAvailability[sl.id].lastShiftType = "6";
            
            assignedSchichtleiter = true;
            break;
          }
        }
        
        if (!assignedSchichtleiter) {
          // Kein Schichtleiter verfügbar, Tag überspringen
          shiftPlan[dayKey] = null;
          continue;
        }
        
        // 2. Frühschicht (4) - 2 Pfleger und 1 Pflegehelfer
        if (!dayPlan["4"]) {
          dayPlan["4"] = [];
        }
        
        // Pflegehelfer für Frühschicht
        let pflegehelferAssigned = false;
        for (const ph of shuffledPflegehelfer) {
          if (ShiftPlanningConstraintService.canAssignEmployeeToUetersen(
            ph, employeeAvailability, dayKey, "4", uetersenShifts.longDays["4"]
          )) {
            dayPlan["4"].push(ph.id);
            
            // Verfügbarkeit aktualisieren
            const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
              uetersenShifts.longDays["4"].start,
              uetersenShifts.longDays["4"].end
            );
            employeeAvailability[ph.id].weeklyHoursAssigned += shiftHours;
            employeeAvailability[ph.id].totalHoursAssigned += shiftHours;
            employeeAvailability[ph.id].shiftsAssigned.push(dayKey);
            employeeAvailability[ph.id].lastShiftType = "4";
            
            pflegehelferAssigned = true;
            break;
          }
        }
        
        // 2 Pfleger für Frühschicht
        let pflegerCount = 0;
        for (const p of shuffledPfleger) {
          if (pflegerCount >= 2) break;
          
          if (ShiftPlanningConstraintService.canAssignEmployeeToUetersen(
            p, employeeAvailability, dayKey, "4", uetersenShifts.longDays["4"]
          )) {
            dayPlan["4"].push(p.id);
            
            // Verfügbarkeit aktualisieren
            const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
              uetersenShifts.longDays["4"].start,
              uetersenShifts.longDays["4"].end
            );
            employeeAvailability[p.id].weeklyHoursAssigned += shiftHours;
            employeeAvailability[p.id].totalHoursAssigned += shiftHours;
            employeeAvailability[p.id].shiftsAssigned.push(dayKey);
            employeeAvailability[p.id].lastShiftType = "4";
            
            pflegerCount++;
          }
        }
        
        // 3. Spätschicht (5) - 2 Pfleger
        if (!dayPlan["5"]) {
          dayPlan["5"] = [];
        }
        
        let lateShiftPflegerCount = 0;
        for (const p of shuffledPfleger) {
          if (lateShiftPflegerCount >= 2) break;
          
          if (ShiftPlanningConstraintService.canAssignEmployeeToUetersen(
            p, employeeAvailability, dayKey, "5", uetersenShifts.longDays["5"]
          )) {
            dayPlan["5"].push(p.id);
            
            // Verfügbarkeit aktualisieren
            const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
              uetersenShifts.longDays["5"].start,
              uetersenShifts.longDays["5"].end
            );
            employeeAvailability[p.id].weeklyHoursAssigned += shiftHours;
            employeeAvailability[p.id].totalHoursAssigned += shiftHours;
            employeeAvailability[p.id].shiftsAssigned.push(dayKey);
            employeeAvailability[p.id].lastShiftType = "5";
            
            lateShiftPflegerCount++;
          }
        }
        
        // Prüfen, ob alle erforderlichen Mitarbeiter zugewiesen wurden
        const requiredFruhschichtCount = pflegehelferAssigned ? 3 : 2; // 2 Pfleger + evtl. 1 Pflegehelfer
        
        if (dayPlan["4"].length < requiredFruhschichtCount || dayPlan["5"].length < 2) {
          // Nicht genügend Mitarbeiter verfügbar, Tag als unvollständig markieren
          shiftPlan[dayKey] = null;
        }
      }
    }
    
    return { shiftPlan, employeeAvailability };
  }
}