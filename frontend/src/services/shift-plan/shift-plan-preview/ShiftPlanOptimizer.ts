import * as solver from 'javascript-lp-solver';
import { CalculatedShiftPlan, ShiftPlanDay } from '../ShiftPlanTypes';

/**
 * Optimierungsmodell für Schichtplanung mit Simplex-Algorithmus
 */
export class ShiftPlanOptimizer {
  private lastModel: any = null;
  
  /**
   * Optimiert Schichtplan für einen Monat
   */
  optimizeShiftPlan(shiftPlanData: CalculatedShiftPlan): ShiftPlanDay[] {
    const { employees, days, availableShifts, shiftWeekdays } = shiftPlanData;
    
    // Erstelle Optimierungsmodell
    const model = this.createOptimizationModel(employees, days, availableShifts, shiftWeekdays);
    
    // Speichere Modell für LP-Anzeige
    this.lastModel = model;
    
    console.log('🔧 Optimierungsmodell erstellt:', model);
    
    // Löse mit Simplex
    const solution = solver.Solve(model);
    
    // Konvertiere Lösung zurück zu ShiftPlanDay[]
    return this.applySolutionToShiftPlan(solution, days, employees, availableShifts, shiftWeekdays);
  }
  
  /**
   * Gibt das zuletzt erstellte LP Modell zurück
   */
  getLastModel(): any {
    return this.lastModel;
  }
  
  /**
   * Erstellt das lineare Optimierungsmodell
   */
  private createOptimizationModel(employees: any[], days: ShiftPlanDay[], availableShifts: any[], shiftWeekdays: any[]) {
    const model: any = {
      optimize: 'fairness',
      opType: 'max',
      constraints: {},
      variables: {}
    };
    
    // Variablen: x_employee_day_shift (0 oder 1)
    // Nur für Schichten erstellen, die an diesem Wochentag definiert sind
    employees.forEach(employee => {
      days.forEach(day => {
        // Filtere verfügbare Schichten für diesen Wochentag
        const shiftsForDay = this.getShiftsForWeekday(day.date, availableShifts, shiftWeekdays);
        
        shiftsForDay.forEach(shift => {
          const varName = `x_${employee.id}_${day.dayKey}_${shift.id}`;
          
          model.variables[varName] = {
            fairness: 1, // Zielfunktion: Maximiere Fairness
            // Constraints werden unten definiert
          };
        });
      });
    });
    
    // Constraint 1: Jede Schicht muss vollständig besetzt sein
    // Nur für Schichten, die an diesem Tag definiert sind
    days.forEach(day => {
      day.shiftOccupancy.forEach(shiftOcc => {
        // Prüfe ob Schicht an diesem Wochentag definiert ist
        if (!this.isShiftAvailableOnWeekday(day.date, shiftOcc.shiftId, shiftWeekdays)) {
          return; // Überspringe Schichten, die an diesem Tag nicht definiert sind
        }
        
        const constraintName = `shift_coverage_${day.dayKey}_${shiftOcc.shiftId}`;
        
        // STRIKTE Anforderung: Exakt die benötigte Anzahl
        model.constraints[constraintName] = { equal: shiftOcc.requiredCount };
        
        employees.forEach(employee => {
          const varName = `x_${employee.id}_${day.dayKey}_${shiftOcc.shiftId}`;
          if (model.variables[varName]) {
            model.variables[varName][constraintName] = 1;
          }
        });
      });
    });
    
    // Constraint 1b: Rollen-spezifische Besetzung für jede Schicht
    days.forEach(day => {
      day.shiftOccupancy.forEach(shiftOcc => {
        if (!this.isShiftAvailableOnWeekday(day.date, shiftOcc.shiftId, shiftWeekdays)) {
          return;
        }
        
        const shift = availableShifts.find(s => s.id === shiftOcc.shiftId);
        if (!shift?.shiftRoles) return;
        
        // Für jede erforderliche Rolle in dieser Schicht
        shift.shiftRoles.forEach((shiftRole: any) => {
          const roleConstraintName = `role_coverage_${day.dayKey}_${shiftOcc.shiftId}_${shiftRole.roleId}`;
          
          // Exakt die benötigte Anzahl dieser Rolle
          model.constraints[roleConstraintName] = { equal: shiftRole.count };
          
          // Nur Mitarbeiter mit passender Rolle können diese Variable haben
          employees.forEach(employee => {
            if (employee.role === shiftRole.role?.name ||
                (employee.roleId && shiftRole.roleId === employee.roleId)) {
              const varName = `x_${employee.id}_${day.dayKey}_${shiftOcc.shiftId}`;
              if (model.variables[varName]) {
                model.variables[varName][roleConstraintName] = 1;
              }
            }
          });
        });
      });
    });
    
    // Constraint 2: Ein Mitarbeiter kann nur eine Schicht pro Tag haben
    employees.forEach(employee => {
      days.forEach(day => {
        const constraintName = `one_shift_per_day_${employee.id}_${day.dayKey}`;
        model.constraints[constraintName] = { max: 1 };
        
        // Nur Schichten berücksichtigen, die an diesem Tag verfügbar sind
        const shiftsForDay = this.getShiftsForWeekday(day.date, availableShifts, shiftWeekdays);
        shiftsForDay.forEach(shift => {
          const varName = `x_${employee.id}_${day.dayKey}_${shift.id}`;
          if (model.variables[varName]) {
            model.variables[varName][constraintName] = 1;
          }
        });
      });
    });
    
    // Constraint 3: Gleichmäßige Arbeitszeit-Verteilung
    const avgHoursPerEmployee = this.calculateAverageHours(employees, days, availableShifts);
    employees.forEach(employee => {
      const constraintNameMin = `min_hours_${employee.id}`;
      const constraintNameMax = `max_hours_${employee.id}`;
      
      // Mindestens 90% der durchschnittlichen Stunden
      model.constraints[constraintNameMin] = { min: Math.floor(avgHoursPerEmployee * 0.9) };
      // Höchstens 110% der durchschnittlichen Stunden
      model.constraints[constraintNameMax] = { max: Math.ceil(avgHoursPerEmployee * 1.1) };
      
      days.forEach(day => {
        // Nur Schichten berücksichtigen, die an diesem Tag verfügbar sind
        const shiftsForDay = this.getShiftsForWeekday(day.date, availableShifts, shiftWeekdays);
        shiftsForDay.forEach(shift => {
          const varName = `x_${employee.id}_${day.dayKey}_${shift.id}`;
          const shiftHours = this.calculateShiftHours(shift);
          
          if (model.variables[varName]) {
            model.variables[varName][constraintNameMin] = shiftHours;
            model.variables[varName][constraintNameMax] = shiftHours;
          }
        });
      });
    });
    
    // Constraint 4: Rollen-Kompatibilität
    employees.forEach(employee => {
      days.forEach(day => {
        // Nur Schichten berücksichtigen, die an diesem Tag verfügbar sind
        const shiftsForDay = this.getShiftsForWeekday(day.date, availableShifts, shiftWeekdays);
        shiftsForDay.forEach(shift => {
          const varName = `x_${employee.id}_${day.dayKey}_${shift.id}`;
          
          // Prüfe ob Mitarbeiter für diese Schicht qualifiziert ist
          if (!this.isEmployeeQualifiedForShift(employee, shift)) {
            // Setze Variable auf 0 wenn nicht qualifiziert
            if (model.variables[varName]) {
              model.variables[varName].max = 0;
            }
          }
        });
      });
    });
    
    return model;
  }
  
  /**
   * Wendet die Optimierungslösung auf den Schichtplan an
   */
  private applySolutionToShiftPlan(
    solution: any,
    days: ShiftPlanDay[],
    employees: any[],
    availableShifts: any[],
    shiftWeekdays: any[]
  ): ShiftPlanDay[] {
    
    if (!solution.feasible) {
      console.warn('Keine optimale Lösung gefunden, verwende Fallback-Strategie');
      return this.fallbackAssignment(days, employees, availableShifts, shiftWeekdays);
    }
    
    // Erstelle neue Tage mit optimierten Zuweisungen
    const optimizedDays = days.map(day => {
      const optimizedEmployees = day.employees.map(empStatus => {
        // Ignoriere bestehende Zuweisungen - weise komplett neu zu
        const assignedShift = this.findAssignedShift(solution, empStatus.employee.id, day.dayKey, availableShifts, shiftWeekdays);
        
        if (assignedShift) {
          return {
            ...empStatus,
            assignedShift: assignedShift.shortName,
            shiftId: assignedShift.id,
            shiftName: assignedShift.name,
            isEmpty: false
          };
        }
        
        // Setze auf leer wenn keine Zuweisung gefunden
        return {
          ...empStatus,
          assignedShift: '',
          shiftId: '',
          shiftName: '',
          isEmpty: true
        };
      });
      
      // Aktualisiere Schicht-Belegung
      const updatedShiftOccupancy = day.shiftOccupancy.map(shiftOcc => {
        const assignedEmployees = optimizedEmployees
          .filter(emp => emp.shiftId === shiftOcc.shiftId)
          .map(emp => emp.employee.name);
        
        return {
          ...shiftOcc,
          assignedCount: assignedEmployees.length,
          assignedEmployees,
          isCorrectlyStaffed: assignedEmployees.length === shiftOcc.requiredCount,
          isUnderStaffed: assignedEmployees.length < shiftOcc.requiredCount
        };
      });
      
      return {
        ...day,
        employees: optimizedEmployees,
        shiftOccupancy: updatedShiftOccupancy
      };
    });
    
    return optimizedDays;
  }
  
  /**
   * Berechnet durchschnittliche Arbeitsstunden pro Mitarbeiter
   */
  private calculateAverageHours(employees: any[], days: ShiftPlanDay[], availableShifts: any[]): number {
    const totalShiftHours = days.reduce((total, day) => {
      return total + day.shiftOccupancy.reduce((dayTotal, shift) => {
        const shiftHours = this.calculateShiftHours(availableShifts.find(s => s.id === shift.shiftId));
        return dayTotal + (shift.requiredCount * shiftHours);
      }, 0);
    }, 0);
    
    return totalShiftHours / employees.length;
  }
  
  /**
   * Berechnet Stunden einer Schicht
   */
  private calculateShiftHours(shift: any): number {
    if (!shift || !shift.startTime || !shift.endTime) return 8; // Default 8 Stunden
    
    const start = new Date(`2000-01-01T${shift.startTime}`);
    const end = new Date(`2000-01-01T${shift.endTime}`);
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
  
  /**
   * Prüft ob Mitarbeiter für Schicht qualifiziert ist
   */
  private isEmployeeQualifiedForShift(employee: any, shift: any): boolean {
    // Prüfe ob Mitarbeiter die erforderliche Rolle für diese Schicht hat
    if (!shift.shiftRoles || shift.shiftRoles.length === 0) {
      return true; // Keine spezifischen Rollen-Anforderungen
    }
    
    // Mitarbeiter muss mindestens eine der erforderlichen Rollen haben
    return shift.shiftRoles.some((shiftRole: any) =>
      shiftRole.role?.name === employee.role ||
      (employee.roleId && shiftRole.roleId === employee.roleId)
    );
  }
  
  /**
   * Findet zugewiesene Schicht aus der Lösung
   */
  private findAssignedShift(solution: any, employeeId: string, dayKey: string, availableShifts: any[], shiftWeekdays: any[]): any | null {
    // Rekonstruiere Datum aus dayKey für Wochentag-Prüfung
    const [day, month, year] = dayKey.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    
    // Nur Schichten prüfen, die an diesem Wochentag verfügbar sind
    const shiftsForDay = this.getShiftsForWeekday(date, availableShifts, shiftWeekdays);
    
    for (const shift of shiftsForDay) {
      const varName = `x_${employeeId}_${dayKey}_${shift.id}`;
      if (solution[varName] && solution[varName] > 0.5) { // > 0.5 für binäre Variablen
        return shift;
      }
    }
    return null;
  }

  /**
   * Filtert Schichten nach verfügbaren Wochentagen
   */
  private getShiftsForWeekday(date: Date, availableShifts: any[], shiftWeekdays: any[]): any[] {
    const weekday = date.getDay(); // 0 = Sonntag, 1 = Montag, etc.
    
    // Finde alle Schicht-IDs, die für diesen Wochentag definiert sind
    const shiftIdsForWeekday = shiftWeekdays
      .filter(sw => sw.weekday === weekday)
      .map(sw => sw.shiftId);
    
    // Filtere verfügbare Schichten nach den IDs
    return availableShifts.filter(shift => shiftIdsForWeekday.includes(shift.id));
  }

  /**
   * Prüft ob eine Schicht an einem bestimmten Wochentag verfügbar ist
   */
  private isShiftAvailableOnWeekday(date: Date, shiftId: string, shiftWeekdays: any[]): boolean {
    const weekday = date.getDay();
    
    return shiftWeekdays.some(sw => sw.shiftId === shiftId && sw.weekday === weekday);
  }
  
  /**
   * Fallback-Strategie wenn keine optimale Lösung gefunden wird
   * Behält bereits belegte Schichten bei
   */
  private fallbackAssignment(days: ShiftPlanDay[], employees: any[], availableShifts: any[], shiftWeekdays: any[]): ShiftPlanDay[] {
    console.log('Verwende einfache Fallback-Zuweisung (startet von null)');
    
    return days.map(day => {
      // Alle Mitarbeiter sind verfügbar (ignoriere bestehende Zuweisungen)
      const availableEmployees = [...day.employees];
      let employeeIndex = 0;
      
      const updatedShiftOccupancy = day.shiftOccupancy.map(shiftOcc => {
        // Prüfe ob Schicht an diesem Wochentag definiert ist
        if (!this.isShiftAvailableOnWeekday(day.date, shiftOcc.shiftId, shiftWeekdays)) {
          // Schicht ist an diesem Tag nicht definiert - keine Zuweisungen
          return {
            ...shiftOcc,
            assignedCount: 0,
            assignedEmployees: [],
            isCorrectlyStaffed: false,
            isUnderStaffed: true
          };
        }
        
        const assignedEmployees: string[] = [];
        
        // Weise Mitarbeiter zu basierend auf Rollen-Anforderungen
        const shift = availableShifts.find(s => s.id === shiftOcc.shiftId);
        
        if (shift?.shiftRoles && shift.shiftRoles.length > 0) {
          // Rollen-basierte Zuweisung
          shift.shiftRoles.forEach((shiftRole: any) => {
            const roleEmployees = availableEmployees.filter(emp =>
              !assignedEmployees.includes(emp.employee.name) &&
              (emp.employee.role === shiftRole.role?.name ||
               (emp.employee.roleId && shiftRole.roleId === emp.employee.roleId))
            );
            
            // Weise exakt die benötigte Anzahl dieser Rolle zu
            for (let i = 0; i < shiftRole.count && i < roleEmployees.length; i++) {
              assignedEmployees.push(roleEmployees[i].employee.name);
            }
          });
        } else {
          // Fallback: Einfache Zuweisung ohne Rollen-Spezifikation
          for (let i = 0; i < shiftOcc.requiredCount && employeeIndex < availableEmployees.length; i++) {
            if (!assignedEmployees.includes(availableEmployees[employeeIndex].employee.name)) {
              assignedEmployees.push(availableEmployees[employeeIndex].employee.name);
            }
            employeeIndex++;
          }
        }
        
        return {
          ...shiftOcc,
          assignedCount: assignedEmployees.length,
          assignedEmployees,
          isCorrectlyStaffed: assignedEmployees.length === shiftOcc.requiredCount,
          isUnderStaffed: assignedEmployees.length < shiftOcc.requiredCount
        };
      });
      
      // Aktualisiere Mitarbeiter-Status (komplett neu zuweisen)
      const updatedEmployees = day.employees.map(empStatus => {
        // Finde neue Zuweisung für alle Mitarbeiter
        const assignedShift = updatedShiftOccupancy.find(shift =>
          shift.assignedEmployees.includes(empStatus.employee.name)
        );
        
        if (assignedShift) {
          const shift = availableShifts.find(s => s.id === assignedShift.shiftId);
          return {
            ...empStatus,
            assignedShift: assignedShift.shortName,
            shiftId: assignedShift.shiftId,
            shiftName: shift?.name || assignedShift.shiftName,
            isEmpty: false
          };
        }
        
        // Setze auf leer wenn keine Zuweisung
        return {
          ...empStatus,
          assignedShift: '',
          shiftId: '',
          shiftName: '',
          isEmpty: true
        };
      });
      
      return {
        ...day,
        employees: updatedEmployees,
        shiftOccupancy: updatedShiftOccupancy
      };
    });
  }
}