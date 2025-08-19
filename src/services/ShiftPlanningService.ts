import {
  Employee,
  ShiftDefinitions,
  MonthlyShiftPlan,
  EmployeeAvailability,
  DayShiftPlan,
  ConstraintCheck
} from '../models/interfaces';
import { defaultShifts } from '../data/defaultShifts';
import { ShiftPlanningUtilService } from './ShiftPlanningUtilService';
import { ShiftPlanningConstraintService } from './ShiftPlanningConstraintService';
import { ShiftPlanningBacktrackingService } from './ShiftPlanningBacktrackingService';
import { UetersenShiftPlanningService } from './UetersenShiftPlanningService';
import { EmployeeRoleSortingService } from './EmployeeRoleSortingService';

/**
 * Hauptservice für die Schichtplanung
 * Koordiniert die verschiedenen Teilservices und stellt öffentliche API bereit
 */
export class ShiftPlanningService {
  /**
   * Generiert einen Schichtplan für einen bestimmten Monat
   * 
   * @param employees Mitarbeiterliste
   * @param year Jahr
   * @param month Monat (1-12)
   * @returns Generierter Schichtplan und finale Mitarbeiterverfügbarkeit
   */
  static generateShiftPlan(
    employees: Employee[],
    year: number,
    month: number
  ): { shiftPlan: MonthlyShiftPlan; employeeAvailability: EmployeeAvailability } {
    // Mitarbeiter nach Klinik filtern
    const elmshornerEmployees = employees.filter(emp => emp.clinic === 'Elmshorn' || !emp.clinic);
    const uetersenEmployees = employees.filter(emp => emp.clinic === 'Uetersen');
    
    // Mitarbeiter nach Rolle sortieren
    const sortedElmshornerEmployees = EmployeeRoleSortingService.sortEmployeesByRole(elmshornerEmployees);
    const sortedUetersenEmployees = EmployeeRoleSortingService.sortEmployeesByRole(uetersenEmployees);
    
    // Schichtplan für Elmshorn erstellen
    console.log("Versuche Schichtplan für Elmshorn mit strengen Regeln zu erstellen...");
    let elmshornerResult = this.runPlanningAttempt(sortedElmshornerEmployees, defaultShifts, year, month, true);
    
    // Prüfen, ob der Plan vollständig ist
    const hasElmshornerNullDays = Object.values(elmshornerResult.shiftPlan).some(dayPlan => dayPlan === null);
    
    if (hasElmshornerNullDays) {
      // Wenn nicht vollständig, mit gelockerten Regeln versuchen
      console.log("Konnte keinen vollständigen Plan für Elmshorn mit strengen Regeln erstellen. Versuche es mit gelockerten Regeln...");
      elmshornerResult = this.runPlanningAttempt(sortedElmshornerEmployees, defaultShifts, year, month, false);
    } else {
      console.log("Schichtplan für Elmshorn erfolgreich mit strengen Regeln erstellt.");
    }

    // Schichtplan für Uetersen erstellen
    console.log("Versuche Schichtplan für Uetersen zu erstellen...");
    const uetersenResult = UetersenShiftPlanningService.createUetersenShiftPlan(sortedUetersenEmployees, year, month);
    
    // Beide Pläne zusammenführen
    const combinedShiftPlan = { ...elmshornerResult.shiftPlan };
    const combinedAvailability = { ...elmshornerResult.employeeAvailability };
    
    // Uetersen-Plan in den kombinierten Plan integrieren
    for (const dayKey in uetersenResult.shiftPlan) {
      if (uetersenResult.shiftPlan[dayKey] !== null) {
        if (!combinedShiftPlan[dayKey]) {
          combinedShiftPlan[dayKey] = {};
        } else if (combinedShiftPlan[dayKey] === null) {
          combinedShiftPlan[dayKey] = {};
        }
        
        // Uetersen-Schichten zum kombinierten Plan hinzufügen
        const dayPlan = combinedShiftPlan[dayKey] as DayShiftPlan;
        const uetersenDayPlan = uetersenResult.shiftPlan[dayKey] as DayShiftPlan;
        
        for (const shiftName in uetersenDayPlan) {
          dayPlan[shiftName] = uetersenDayPlan[shiftName];
        }
      }
    }
    
    // Verfügbarkeiten zusammenführen
    for (const empId in uetersenResult.employeeAvailability) {
      combinedAvailability[empId] = uetersenResult.employeeAvailability[empId];
    }
    
    return {
      shiftPlan: combinedShiftPlan,
      employeeAvailability: combinedAvailability
    };
  }
  
  /**
   * Führt einen Planungsversuch durch
   * 
   * @param employees Mitarbeiterliste
   * @param shifts Schichtdefinitionen
   * @param year Jahr
   * @param month Monat (1-12)
   * @param strictMode Ob strenge Regeln angewendet werden sollen
   * @returns Generierter Schichtplan und Mitarbeiterverfügbarkeit
   */
  private static runPlanningAttempt(
    employees: Employee[],
    shifts: ShiftDefinitions,
    year: number,
    month: number,
    strictMode: boolean
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
    
    // Für jede Woche Schichten planen
    for (const weekNumber in weeks) {
      // Mitarbeiterliste nach Rolle sortieren und innerhalb jeder Rolle mischen
      const sortedAndShuffledEmployees = EmployeeRoleSortingService.sortAndShuffleByRole(employees);
      
      // Wöchentliche Stunden und letzte Schicht zurücksetzen
      sortedAndShuffledEmployees.forEach(emp => {
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
        
        // Sonntage ohne Schichten
        if (weekday === 0) {
          shiftPlan[dayKey] = null;
          continue;
        }
        
        // Initialisieren des Tagesplans
        shiftPlan[dayKey] = {};
        
        // Bestimmen, ob es ein langer oder kurzer Tag ist
        // Lange Tage: Montag (1), Mittwoch (3), Freitag (5)
        const isLongDay = [1, 3, 5].includes(weekday);
        const dayShifts = isLongDay ? shifts.longDays : shifts.shortDays;
        
        // Schichtpriorisierung: Spezialschichten zuerst
        const specialShifts = ['S0', 'S1', 'S00', 'S', 'FS'];
        const regularShifts = Object.keys(dayShifts).filter(s => !specialShifts.includes(s));
        
        // Sortierte Schichtnamen: Spezialschichten zuerst, dann reguläre Schichten
        const sortedShiftNames = [...specialShifts.filter(s => dayShifts[s]), ...regularShifts];
        
        console.log(`Tag ${dayKey}: Schichtzuweisung in Reihenfolge: ${sortedShiftNames.join(', ')}`);
        
        // Schichten für diesen Tag zuweisen
        const success = ShiftPlanningBacktrackingService.assignDayShiftsWithBacktracking(
          sortedShiftNames,
          0,
          sortedAndShuffledEmployees,
          employeeAvailability,
          shiftPlan,
          dayKey,
          dayShifts,
          weekday,
          strictMode
        );
        
        // Wenn keine erfolgreiche Zuweisung möglich war
        if (!success) {
          // Spezialbehandlung für Samstage: Sicherstellen, dass mindestens die Frühschicht besetzt ist
          if (weekday === 6) {
            console.log(`Keine vollständige Zuweisung für Samstag ${dayKey} möglich - versuche zumindest die Frühschicht zu besetzen`);
            
            // Zurücksetzen des Tagesplans
            shiftPlan[dayKey] = {};
            
            // Nur für die Frühschicht versuchen
            const frühschicht = 'F';
            if (dayShifts[frühschicht]) {
              // Sortierte und gemischte Mitarbeiterliste verwenden
              const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
              dayPlan[frühschicht] = [];
              
              // Versuchen, die Frühschicht mit mindestens einem Mitarbeiter zu besetzen
              let frühschichtBesetzt = false;
              
              for (const emp of sortedAndShuffledEmployees) {
                if (ShiftPlanningConstraintService.canAssignEmployee(
                  emp,
                  dayShifts[frühschicht].roles,
                  employeeAvailability,
                  dayKey,
                  weekday,
                  frühschicht,
                  dayShifts[frühschicht],
                  false // Im gelockerten Modus versuchen
                )) {
                  // Mitarbeiter zuweisen
                  dayPlan[frühschicht].push(emp.id);
                  
                  // Verfügbarkeit aktualisieren
                  const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
                    dayShifts[frühschicht].start,
                    dayShifts[frühschicht].end
                  );
                  employeeAvailability[emp.id].weeklyHoursAssigned += shiftHours;
                  employeeAvailability[emp.id].totalHoursAssigned += shiftHours;
                  employeeAvailability[emp.id].shiftsAssigned.push(dayKey);
                  employeeAvailability[emp.id].lastShiftType = frühschicht;
                  employeeAvailability[emp.id].saturdaysWorked += 1;
                  
                  frühschichtBesetzt = true;
                  console.log(`Frühschicht für Samstag ${dayKey} erfolgreich mit ${emp.name} besetzt`);
                  break; // Ein Mitarbeiter für die Frühschicht reicht
                }
              }
              
              // Wenn auch keine Frühschicht besetzt werden konnte, den Tag als null markieren
              if (!frühschichtBesetzt) {
                console.warn(`Konnte auch keine Frühschicht für Samstag ${dayKey} besetzen`);
                shiftPlan[dayKey] = null;
              }
            } else {
              // Wenn keine Frühschicht für diesen Tag definiert ist (unwahrscheinlich)
              console.warn(`Keine Frühschicht für Samstag ${dayKey} definiert`);
              shiftPlan[dayKey] = null;
            }
          } else {
            // Für andere Tage: Tag als null markieren, wenn keine Zuweisung möglich war
            shiftPlan[dayKey] = null;
          }
        }
      }
    }
    
    return { shiftPlan, employeeAvailability };
  }
  
  /**
   * Überprüft die Einhaltung der Regeln
   */
  static checkConstraints(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability
  ): ConstraintCheck[] {
    return ShiftPlanningConstraintService.checkConstraints(shiftPlan, employees, employeeAvailability);
  }
}