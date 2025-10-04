import * as solver from 'javascript-lp-solver';
import { CalculatedShiftPlan, ShiftPlanDay } from '../ShiftPlanTypes';

/**
 * Optimierungsmodell für Schichtplanung mit Simplex-Algorithmus
 */
export class ShiftPlanOptimizer {
  
  /**
   * Optimiert Schichtplan für einen Monat
   */
  optimizeShiftPlan(shiftPlanData: CalculatedShiftPlan): ShiftPlanDay[] {
    const { employees, days, availableShifts } = shiftPlanData;
    
    // Erstelle Optimierungsmodell
    const model = this.createOptimizationModel(employees, days, availableShifts);
    
    console.log('🔧 Optimierungsmodell erstellt:', model);
    
    // Löse mit Simplex
    const solution = solver.Solve(model);
    
    // Konvertiere Lösung zurück zu ShiftPlanDay[]
    return this.applySolutionToShiftPlan(solution, days, employees, availableShifts);
  }
  
  /**
   * Erstellt das lineare Optimierungsmodell
   */
  private createOptimizationModel(employees: any[], days: ShiftPlanDay[], availableShifts: any[]) {
    const model: any = {
      optimize: 'fairness',
      opType: 'max',
      constraints: {},
      variables: {}
    };
    
    // Variablen: x_employee_day_shift (0 oder 1)
    // Ignoriere bestehende Zuweisungen - starte immer von null
    employees.forEach(employee => {
      days.forEach(day => {
        availableShifts.forEach(shift => {
          const varName = `x_${employee.id}_${day.dayKey}_${shift.id}`;
          
          // Alle Variablen sind frei optimierbar
          model.variables[varName] = {
            fairness: 1, // Zielfunktion: Maximiere Fairness
            // Constraints werden unten definiert
          };
        });
      });
    });
    
    // Constraint 1: Jede Schicht muss vollständig besetzt sein
    // Ignoriere bestehende Zuweisungen - plane komplett neu
    days.forEach(day => {
      day.shiftOccupancy.forEach(shiftOcc => {
        const constraintName = `shift_coverage_${day.dayKey}_${shiftOcc.shiftId}`;
        
        // Benötige die volle Anzahl (ignoriere bestehende Zuweisungen)
        model.constraints[constraintName] = { equal: shiftOcc.requiredCount };
        
        employees.forEach(employee => {
          const varName = `x_${employee.id}_${day.dayKey}_${shiftOcc.shiftId}`;
          if (model.variables[varName]) {
            model.variables[varName][constraintName] = 1;
          }
        });
      });
    });
    
    // Constraint 2: Ein Mitarbeiter kann nur eine Schicht pro Tag haben
    employees.forEach(employee => {
      days.forEach(day => {
        const constraintName = `one_shift_per_day_${employee.id}_${day.dayKey}`;
        model.constraints[constraintName] = { max: 1 };
        
        availableShifts.forEach(shift => {
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
        availableShifts.forEach(shift => {
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
        availableShifts.forEach(shift => {
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
    availableShifts: any[]
  ): ShiftPlanDay[] {
    
    if (!solution.feasible) {
      console.warn('Keine optimale Lösung gefunden, verwende Fallback-Strategie');
      return this.fallbackAssignment(days, employees, availableShifts);
    }
    
    // Erstelle neue Tage mit optimierten Zuweisungen
    const optimizedDays = days.map(day => {
      const optimizedEmployees = day.employees.map(empStatus => {
        // Ignoriere bestehende Zuweisungen - weise komplett neu zu
        const assignedShift = this.findAssignedShift(solution, empStatus.employee.id, day.dayKey, availableShifts);
        
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
    // Vereinfachte Logik - kann erweitert werden
    return true; // Alle Mitarbeiter können alle Schichten (vorerst)
  }
  
  /**
   * Findet zugewiesene Schicht aus der Lösung
   */
  private findAssignedShift(solution: any, employeeId: string, dayKey: string, availableShifts: any[]): any | null {
    for (const shift of availableShifts) {
      const varName = `x_${employeeId}_${dayKey}_${shift.id}`;
      if (solution[varName] && solution[varName] > 0.5) { // > 0.5 für binäre Variablen
        return shift;
      }
    }
    return null;
  }
  
  /**
   * Fallback-Strategie wenn keine optimale Lösung gefunden wird
   * Behält bereits belegte Schichten bei
   */
  private fallbackAssignment(days: ShiftPlanDay[], employees: any[], availableShifts: any[]): ShiftPlanDay[] {
    console.log('Verwende einfache Fallback-Zuweisung (startet von null)');
    
    return days.map(day => {
      // Alle Mitarbeiter sind verfügbar (ignoriere bestehende Zuweisungen)
      const availableEmployees = [...day.employees];
      let employeeIndex = 0;
      
      const updatedShiftOccupancy = day.shiftOccupancy.map(shiftOcc => {
        const assignedEmployees: string[] = [];
        
        // Weise Mitarbeiter zu (ignoriere bestehende Zuweisungen)
        for (let i = 0; i < shiftOcc.requiredCount && employeeIndex < availableEmployees.length; i++) {
          assignedEmployees.push(availableEmployees[employeeIndex].employee.name);
          employeeIndex++;
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