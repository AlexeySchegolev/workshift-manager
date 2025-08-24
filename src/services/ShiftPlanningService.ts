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
import { StandortBShiftPlanningService } from './StandortBShiftPlanningService';
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
    const elmshornerEmployees = employees.filter(emp => emp.location === 'Standort A' || !emp.location);
    const uetersenEmployees = employees.filter(emp => emp.location === 'Standort B');
    
    // ALLE Mitarbeiter für Samstagsplanung (Elmshorn + Uetersen)
    const allEmployeesForSaturdays = [...elmshornerEmployees, ...uetersenEmployees];
    
    // Mitarbeiter nach Rolle sortieren
    const sortedElmshornerEmployees = EmployeeRoleSortingService.sortEmployeesByRole(elmshornerEmployees);
    const sortedUetersenEmployees = EmployeeRoleSortingService.sortEmployeesByRole(uetersenEmployees);
    
    // Schichtplan für Elmshorn erstellen (mit allen Mitarbeitern für Samstage)
    console.log("Versuche Schichtplan für Elmshorn mit strengen Regeln zu erstellen...");
    let elmshornerResult = this.runPlanningAttempt(sortedElmshornerEmployees, allEmployeesForSaturdays, defaultShifts, year, month, true);
    
    // Prüfen, ob der Plan vollständig ist
    const hasElmshornerNullDays = Object.values(elmshornerResult.shiftPlan).some(dayPlan => dayPlan === null);
    
    if (hasElmshornerNullDays) {
      // Wenn nicht vollständig, mit gelockerten Regeln versuchen
      console.log("Konnte keinen vollständigen Plan für Elmshorn mit strengen Regeln erstellen. Versuche es mit gelockerten Regeln...");
      elmshornerResult = this.runPlanningAttempt(sortedElmshornerEmployees, allEmployeesForSaturdays, defaultShifts, year, month, false);
    } else {
      console.log("Schichtplan für Elmshorn erfolgreich mit strengen Regeln erstellt.");
    }

    // Schichtplan für Uetersen erstellen
    console.log("Versuche Schichtplan für Uetersen zu erstellen...");
    const uetersenResult = StandortBShiftPlanningService.createStandortBShiftPlan(sortedUetersenEmployees, year, month);
    
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
    allEmployeesForSaturdays: Employee[],
    shifts: ShiftDefinitions,
    year: number,
    month: number,
    strictMode: boolean
  ): { shiftPlan: MonthlyShiftPlan; employeeAvailability: EmployeeAvailability } {
    const shiftPlan: MonthlyShiftPlan = {};
    const employeeAvailability: EmployeeAvailability = {};
    
    // Verfügbarkeit für ALLE Mitarbeiter initialisieren (auch Uetersen für Samstage)
    allEmployeesForSaturdays.forEach(emp => {
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
      // Mitarbeiterliste nach Rolle sortieren - wird für jeden Tag neu sortiert
      // (wird später in der Schichtschleife mit aktuellem Schichttyp aufgerufen)
      let sortedAndShuffledEmployees = EmployeeRoleSortingService.sortAndShuffleByRole(employees, employeeAvailability);
      
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
        
        // SPEZIELLE SAMSTAGS-LOGIK: F-SCHICHT MIT 1 SCHICHTLEITER + 4 PFLEGER + 1 PFLEGEHELFER
        if (weekday === 6) { // Samstag
          console.log(`Samstag ${dayKey}: F-Schicht mit 1 Schichtleiter + 4 Pfleger + 1 Pflegehelfer planen`);
          
          const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
          let saturdaySuccess = true;
          
          // Nur F-Schicht versuchen
          if (dayShifts['F']) {
            dayPlan['F'] = [];
            
            // ALLE Mitarbeiter für Samstag sortieren (Elmshorn + Uetersen) - faire Samstagsverteilung!
            const employeesForSaturday = EmployeeRoleSortingService.sortEmployeesForSaturday(
              allEmployeesForSaturdays,
              employeeAvailability
            );
            
            // 1. Einen Schichtleiter für F-Schicht finden
            let schichtleiterAssigned = false;
            for (const emp of employeesForSaturday) {
              if (emp.role !== 'ShiftLeader') continue;
              
              if (ShiftPlanningConstraintService.canAssignEmployee(
                emp,
                dayShifts['F'].roles,
                employeeAvailability,
                dayKey,
                weekday,
                'F',
                dayShifts['F'],
                strictMode
              )) {
                // Schichtleiter zuweisen
                dayPlan['F'].push(emp.id);
                
                // Verfügbarkeit aktualisieren
                const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
                  dayShifts['F'].start,
                  dayShifts['F'].end
                );
                employeeAvailability[emp.id].weeklyHoursAssigned += shiftHours;
                employeeAvailability[emp.id].totalHoursAssigned += shiftHours;
                employeeAvailability[emp.id].shiftsAssigned.push(dayKey);
                employeeAvailability[emp.id].lastShiftType = 'F';
                employeeAvailability[emp.id].saturdaysWorked += 1;
                
                schichtleiterAssigned = true;
                console.log(`Samstag ${dayKey}: Schichtleiter ${emp.name} für F-Schicht zugewiesen`);
                break;
              }
            }
            
            // 2. 4 Pfleger für F-Schicht finden
            let pflegerAssigned = 0;
            for (const emp of employeesForSaturday) {
              if (emp.role !== 'Specialist' || pflegerAssigned >= 4) continue;
              
              if (ShiftPlanningConstraintService.canAssignEmployee(
                emp,
                dayShifts['F'].roles,
                employeeAvailability,
                dayKey,
                weekday,
                'F',
                dayShifts['F'],
                strictMode
              )) {
                // Pfleger zuweisen
                dayPlan['F'].push(emp.id);
                
                // Verfügbarkeit aktualisieren
                const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
                  dayShifts['F'].start,
                  dayShifts['F'].end
                );
                employeeAvailability[emp.id].weeklyHoursAssigned += shiftHours;
                employeeAvailability[emp.id].totalHoursAssigned += shiftHours;
                employeeAvailability[emp.id].shiftsAssigned.push(dayKey);
                employeeAvailability[emp.id].lastShiftType = 'F';
                employeeAvailability[emp.id].saturdaysWorked += 1;
                
                pflegerAssigned++;
                console.log(`Samstag ${dayKey}: Pfleger ${emp.name} für F-Schicht zugewiesen (${pflegerAssigned}/4)`);
              }
            }
            
            // 3. 1 Pflegehelfer für F-Schicht finden
            let pflegehelferAssigned = 0;
            for (const emp of employeesForSaturday) {
              if (emp.role !== 'Assistant' || pflegehelferAssigned >= 1) continue;
              
              if (ShiftPlanningConstraintService.canAssignEmployee(
                emp,
                dayShifts['F'].roles,
                employeeAvailability,
                dayKey,
                weekday,
                'F',
                dayShifts['F'],
                strictMode
              )) {
                // Pflegehelfer zuweisen
                dayPlan['F'].push(emp.id);
                
                // Verfügbarkeit aktualisieren
                const shiftHours = ShiftPlanningUtilService.calculateShiftHours(
                  dayShifts['F'].start,
                  dayShifts['F'].end
                );
                employeeAvailability[emp.id].weeklyHoursAssigned += shiftHours;
                employeeAvailability[emp.id].totalHoursAssigned += shiftHours;
                employeeAvailability[emp.id].shiftsAssigned.push(dayKey);
                employeeAvailability[emp.id].lastShiftType = 'F';
                employeeAvailability[emp.id].saturdaysWorked += 1;
                
                pflegehelferAssigned++;
                console.log(`Samstag ${dayKey}: Pflegehelfer ${emp.name} für F-Schicht zugewiesen (${pflegehelferAssigned}/1)`);
                break; // Nur 1 Pflegehelfer benötigt
              }
            }
            
            // Prüfen ob Mindestbesetzung erreicht wurde
            if (!schichtleiterAssigned || pflegerAssigned < 4 || pflegehelferAssigned < 1) {
              console.warn(`Samstag ${dayKey}: Nicht genügend Mitarbeiter (${schichtleiterAssigned ? 1 : 0} Schichtleiter, ${pflegerAssigned}/4 Pfleger, ${pflegehelferAssigned}/1 Pflegehelfer)`);
              saturdaySuccess = false;
            }
          }
          
          if (!saturdaySuccess) {
            shiftPlan[dayKey] = null;
          }
          
          continue; // Samstag ist fertig, weiter zum nächsten Tag
        }
        
        // NORMALE PLANUNG FÜR ANDERE TAGE
        // Vereinfachte Schichtpriorisierung: Nur F und S
        const sortedShiftNames = Object.keys(dayShifts).sort((a, b) => {
          // F zuerst, dann S
          if (a === 'F') return -1;
          if (b === 'F') return 1;
          if (a === 'S') return -1;
          if (b === 'S') return 1;
          return 0;
        });
        
        console.log(`Tag ${dayKey}: Schichtzuweisung in Reihenfolge: ${sortedShiftNames.join(', ')}`);
        
        // Für jede Schicht die Mitarbeiter neu sortieren für Abwechslung
        let daySuccess = true;
        for (const shiftName of sortedShiftNames) {
          if (!dayShifts[shiftName]) continue;
          
          // Mitarbeiter für diese spezifische Schicht sortieren (Abwechslung!)
          const employeesForShift = EmployeeRoleSortingService.sortAndShuffleByRole(
            employees,
            employeeAvailability,
            shiftName
          );
          
          // Einzelne Schicht zuweisen
          const shiftSuccess = ShiftPlanningBacktrackingService.assignDayShiftsWithBacktracking(
            [shiftName], // Nur diese eine Schicht
            0,
            employeesForShift,
            employeeAvailability,
            shiftPlan,
            dayKey,
            dayShifts,
            weekday,
            strictMode
          );
          
          if (!shiftSuccess) {
            daySuccess = false;
            break;
          }
        }
        
        const success = daySuccess;
        
        // Wenn keine erfolgreiche Zuweisung möglich war
        if (!success) {
          // Für andere Tage (nicht Samstag): Tag als null markieren, wenn keine Zuweisung möglich war
          // Samstage werden bereits oben speziell behandelt
          shiftPlan[dayKey] = null;
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