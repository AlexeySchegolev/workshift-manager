import {
  Employee,
  EmployeeAvailability,
  MonthlyShiftPlan,
  DayShiftPlan,
} from '../models/interfaces';
import { relaxedRules } from '../data/defaultRules';
import { standortBShifts } from '../data/defaultShifts';
import { ShiftPlanningUtilService } from './ShiftPlanningUtilService';
import { ShiftPlanningConstraintService } from './ShiftPlanningConstraintService';
import { EmployeeRoleSortingService } from './EmployeeRoleSortingService';

// Export stellt sicher, dass die Datei als Modul erkannt wird
export {};

/**
 * Service für die Schichtplanung von Standort B
 * Spezialisiert auf die besonderen Anforderungen des zweiten Standorts
 */
export class StandortBShiftPlanningService {
  /**
   * Erstellt einen Schichtplan für Standort B
   * Implementiert die speziellen Regeln für Standort B (Mo, Mi, Fr)
   */
  static createStandortBShiftPlan(
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
    
    // VOLLSTÄNDIGE LOGIK: ALLE ROLLEN FÜR STANDORT B
    const schichtleiter = employees.filter(emp => emp.role === 'ShiftLeader');
    const pfleger = employees.filter(emp => emp.role === 'Specialist');
    const pflegehelfer = employees.filter(emp => emp.role === 'Assistant');
    
    // Für jede Woche Schichten planen
    for (const weekNumber in weeks) {
      // Nur Schichtleiter mischen für faire Verteilung
      const shuffledSchichtleiter = [...schichtleiter].sort(() => Math.random() - 0.5);
      
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
        
        // Standort B hat nur an Mo (1), Mi (3), Fr (5) geöffnet
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
        
        // ERWEITERTE STANDORT B-PLANUNG: SCHICHTLEITER + FACHKRÄFTE
        // 1. Schichtleiter zuweisen (einer pro Tag, markiert als 6)
        let assignedSchichtleiter = false;
        for (const sl of shuffledSchichtleiter) {
          if (ShiftPlanningConstraintService.canAssignEmployeeToStandortB(
            sl, employeeAvailability, dayKey, "6", standortBShifts.longDays["6"]
          )) {
            if (!dayPlan["6"]) {
              dayPlan["6"] = [];
            }
            dayPlan["6"].push(sl.id);
            
            // Verfügbarkeit aktualisieren
            const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
              standortBShifts.longDays["6"].start,
              standortBShifts.longDays["6"].end
            );
            employeeAvailability[sl.id].weeklyHoursAssigned += shiftHours;
            employeeAvailability[sl.id].totalHoursAssigned += shiftHours;
            employeeAvailability[sl.id].shiftsAssigned.push(dayKey);
            employeeAvailability[sl.id].lastShiftType = "6";
            
            assignedSchichtleiter = true;
            console.log(`Schichtleiter ${sl.name} für Standort B am ${dayKey} zugewiesen`);
            break;
          }
        }
        
        if (!assignedSchichtleiter) {
          // Kein Schichtleiter verfügbar, Tag überspringen
          console.log(`Kein Schichtleiter für Standort B am ${dayKey} verfügbar`);
          shiftPlan[dayKey] = null;
          continue;
        }
        
        // 2. Frühschicht (4) - 2 Fachkräfte
        if (!dayPlan["4"]) {
          dayPlan["4"] = [];
        }
        
        // Fachkräfte für Standort B sortieren (abwechslungsreiche Verteilung)
        const standortBPfleger = employees.filter(emp => emp.role === 'Specialist' && emp.location === 'Standort B');
        const sortedStandortBPfleger = EmployeeRoleSortingService.sortAndShuffleByRole(
          standortBPfleger,
          employeeAvailability,
          "4"
        );
        
        // 2 Fachkräfte für Frühschicht (4)
        let pflegerCount4 = 0;
        for (const p of sortedStandortBPfleger) {
          if (pflegerCount4 >= 2) break;
          
          if (ShiftPlanningConstraintService.canAssignEmployeeToStandortB(
            p, employeeAvailability, dayKey, "4", standortBShifts.longDays["4"]
          )) {
            dayPlan["4"].push(p.id);
            
            // Verfügbarkeit aktualisieren
            const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
              standortBShifts.longDays["4"].start,
              standortBShifts.longDays["4"].end
            );
            employeeAvailability[p.id].weeklyHoursAssigned += shiftHours;
            employeeAvailability[p.id].totalHoursAssigned += shiftHours;
            employeeAvailability[p.id].shiftsAssigned.push(dayKey);
            employeeAvailability[p.id].lastShiftType = "4";
            
            pflegerCount4++;
            console.log(`Fachkraft ${p.name} für Standort B Schicht 4 am ${dayKey} zugewiesen (${pflegerCount4}/2)`);
          }
        }
        
        // 3. Spätschicht (5) - 2 Fachkräfte
        if (!dayPlan["5"]) {
          dayPlan["5"] = [];
        }
        
        // Fachkräfte für Spätschicht sortieren (abwechslungsreiche Verteilung)
        const sortedStandortBPflegerSpat = EmployeeRoleSortingService.sortAndShuffleByRole(
          standortBPfleger,
          employeeAvailability,
          "5"
        );
        
        let pflegerCount5 = 0;
        for (const p of sortedStandortBPflegerSpat) {
          if (pflegerCount5 >= 2) break;
          
          if (ShiftPlanningConstraintService.canAssignEmployeeToStandortB(
            p, employeeAvailability, dayKey, "5", standortBShifts.longDays["5"]
          )) {
            dayPlan["5"].push(p.id);
            
            // Verfügbarkeit aktualisieren
            const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
              standortBShifts.longDays["5"].start,
              standortBShifts.longDays["5"].end
            );
            employeeAvailability[p.id].weeklyHoursAssigned += shiftHours;
            employeeAvailability[p.id].totalHoursAssigned += shiftHours;
            employeeAvailability[p.id].shiftsAssigned.push(dayKey);
            employeeAvailability[p.id].lastShiftType = "5";
            
            pflegerCount5++;
            console.log(`Fachkraft ${p.name} für Standort B Schicht 5 am ${dayKey} zugewiesen (${pflegerCount5}/2)`);
          }
        }
        
        // Prüfen, ob genügend Fachkräfte zugewiesen wurden
        if (pflegerCount4 < 2 || pflegerCount5 < 2) {
          console.warn(`Standort B ${dayKey}: Nicht genügend Fachkräfte (${pflegerCount4}/2 für Schicht 4, ${pflegerCount5}/2 für Schicht 5)`);
          // Tag trotzdem behalten, auch wenn nicht vollständig besetzt
        }
      }
    }
    
    return { shiftPlan, employeeAvailability };
  }
}