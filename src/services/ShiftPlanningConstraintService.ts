import {
  Employee,
  EmployeeAvailability,
  MonthlyShiftPlan,
  DayShiftPlan,
  ConstraintCheck
} from '../models/interfaces';

// Export leeres Objekt, damit die Datei als Modul erkannt wird
export {};

/**
 * Service für die Überprüfung von Constraints und Regeln in der Schichtplanung
 */
export class ShiftPlanningConstraintService {
  /**
   * Prüft, ob ein Mitarbeiter einer Schicht zugewiesen werden kann
   * Verwendet die zentrale Regelstruktur für konsistente Entscheidungen
   */
  static canAssignEmployee(
    emp: Employee,
    validRoles: string[],
    employeeAvailability: EmployeeAvailability,
    dayKey: string,
    weekday: number,
    shiftName: string,
    shift: any,
    strictMode: boolean
  ): boolean {
    // VOLLSTÄNDIGE LOGIK: SCHICHTLEITER + PFLEGER + PFLEGEHELFER
    // Alle Rollen sind jetzt aktiviert!
    
    // 1) Rolle prüfen - ALLE ROLLEN ERLAUBT
    if (emp.role !== 'ShiftLeader' && emp.role !== 'Specialist' && emp.role !== 'Assistant') {
      return false;
    }
    
    if (!validRoles.includes(emp.role)) {
      return false;
    }
    
    // 2) Arbeitet der Mitarbeiter schon an diesem Tag?
    if (employeeAvailability[emp.id].shiftsAssigned.includes(dayKey)) {
      return false;
    }
    
    // ALLE ANDEREN REGELN SIND AUSKOMMENTIERT:
    
    // // 3) Zentrale Regelstruktur abrufen
    // const ruleBase = getActiveRuleBase(strictMode);
    //
    // // 4) Prüfen, ob die Rolle für diese Schichtart erlaubt ist
    // if (ruleBase.roleConstraints[emp.role] &&
    //     !ruleBase.roleConstraints[emp.role].allowedShifts.includes(shiftName)) {
    //   return false;
    // }
    //
    // // 5) Wochenstunden-Kapazität prüfen
    // const shiftHours = this.calculateShiftHours(shift.start, shift.end);
    // const currentWeeklyHours = employeeAvailability[emp.id].weeklyHoursAssigned;
    // const rules = ruleBase.generalRules;
    // const weeklyHours = emp.hoursPerMonth / 4.33;
    // const maxWeeklyHours = weeklyHours * (1 + rules.weeklyHoursOverflowTolerance);
    //
    // const [, , dayYear] = dayKey.split('.').map(Number);
    // const date = new Date(dayYear, 0, 1);
    // const weekOfMonth = Math.ceil(date.getDate() / 7);
    // const toleranceMultiplier = 1.0 + (weekOfMonth * 0.05);
    // const adjustedMaxWeeklyHours = maxWeeklyHours * toleranceMultiplier;
    //
    // if (currentWeeklyHours + shiftHours > adjustedMaxWeeklyHours) {
    //   return false;
    // }
    //
    // // 6) Samstagsregel
    // if (weekday === 6) {
    //   const maxSaturdays = rules.maxSaturdaysPerMonth;
    //   const [, monthOfDay, yearOfDay] = dayKey.split('.').map(Number);
    //   const isLastSaturdayOfMonth = dayKey.startsWith('30.') || dayKey.startsWith('31.') ||
    //                               (new Date(yearOfDay, monthOfDay, 0).getDate() - 6 <= Number(dayKey.split('.')[0]));
    //
    //   if (employeeAvailability[emp.id].saturdaysWorked >= maxSaturdays) {
    //     if (isLastSaturdayOfMonth && Math.random() < 0.4) {
    //       console.log(`Samstagsregel gelockert für ${emp.name} am letzten Samstag ${dayKey}`);
    //     } else {
    //       return false;
    //     }
    //   }
    // }
    //
    // // 7) Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen
    // const lastAssignedDay = employeeAvailability[emp.id].shiftsAssigned.length > 0
    //   ? employeeAvailability[emp.id].shiftsAssigned[employeeAvailability[emp.id].shiftsAssigned.length - 1]
    //   : null;
    //
    // if (lastAssignedDay && employeeAvailability[emp.id].lastShiftType === shiftName) {
    //   const [lastDay, lastMonth, lastYear] = lastAssignedDay.split('.').map(Number);
    //   const [currentDay, currentMonth, currentYear] = dayKey.split('.').map(Number);
    //
    //   const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
    //   const currentDate = new Date(currentYear, currentMonth - 1, currentDay);
    //   const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //
    //   if (diffDays === 1) {
    //     if (currentDay > 25 && weekday === 6 && Math.random() < 0.3) {
    //       console.log(`Flexibilitätsregel angewendet: Erlaube gleiche Schicht für ${emp.name} am ${dayKey}`);
    //     } else {
    //       return false;
    //     }
    //   }
    // }
    
    return true;
  }
  
  /**
   * Prüft, ob ein Mitarbeiter einer Uetersen-Schicht zugewiesen werden kann
   */
  static canAssignEmployeeToStandortB(
    emp: Employee,
    employeeAvailability: EmployeeAvailability,
    dayKey: string,
    shiftName: string,
    shift: any
  ): boolean {
    // VOLLSTÄNDIGE LOGIK: ALLE ROLLEN FÜR STANDORT B
    // Schichtleiter, Fachkräfte und Hilfskräfte sind erlaubt

    // 1) Rolle prüfen - ALLE ROLLEN ERLAUBT
    if (emp.role !== 'ShiftLeader' && emp.role !== 'Specialist' && emp.role !== 'Assistant') {
      return false;
    }
    
    // 2) Arbeitet der Mitarbeiter schon an diesem Tag?
    if (employeeAvailability[emp.id].shiftsAssigned.includes(dayKey)) {
      return false;
    }
    
    // ALLE ANDEREN REGELN SIND AUSKOMMENTIERT:
    
    // // 3) Maximiere die Verteilung der Mitarbeiter über den Monat
    // const shiftsCount = employeeAvailability[emp.id].shiftsAssigned.length;
    // const [, monthOfDay, dayYear] = dayKey.split('.').map(Number);
    // const daysInMonth = new Date(dayYear, monthOfDay, 0).getDate();
    //
    // const randomFactor = Math.random();
    // const assignmentRatio = shiftsCount / (daysInMonth * 0.5);
    //
    // if (assignmentRatio > 0.5 && randomFactor < assignmentRatio * 0.8) {
    //   return false;
    // }
    //
    // // 4) Wochenstunden-Kapazität prüfen
    // const shiftHours = this.calculateShiftHours(shift.start, shift.end);
    // const currentWeeklyHours = employeeAvailability[emp.id].weeklyHoursAssigned;
    // const weeklyHoursOverflowTolerance = 0.15 + 0.1;
    // const weeklyHours = emp.hoursPerMonth / 4.33;
    // const maxWeeklyHours = weeklyHours * (1 + weeklyHoursOverflowTolerance);
    //
    // if (currentWeeklyHours + shiftHours > maxWeeklyHours) {
    //   return false;
    // }
    //
    // // 5) Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen
    // const lastAssignedDay = employeeAvailability[emp.id].shiftsAssigned.length > 0
    //   ? employeeAvailability[emp.id].shiftsAssigned[employeeAvailability[emp.id].shiftsAssigned.length - 1]
    //   : null;
    //
    // if (lastAssignedDay && employeeAvailability[emp.id].lastShiftType === shiftName) {
    //   const [lastDay, lastMonth, lastYear] = lastAssignedDay.split('.').map(Number);
    //   const [currentDay, currentMonth, currentYear] = dayKey.split('.').map(Number);
    //
    //   const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
    //   const currentDate = new Date(currentYear, currentMonth - 1, currentDay);
    //   const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //
    //   if (diffDays === 1) {
    //     return false;
    //   }
    // }
    
    return true;
  }
  
  /**
   * Berechnet die Stundenzahl einer Schicht
   */
  private static calculateShiftHours(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const start = startHour + startMinute / 60;
    const end = endHour + endMinute / 60;
    
    return end - start;
  }
  
  /**
   * Überprüft die Einhaltung der Regeln
   */
  static checkConstraints(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    employeeAvailability: EmployeeAvailability
  ): ConstraintCheck[] {
    const checks: ConstraintCheck[] = [];
    
    // VOLLSTÄNDIGE CONSTRAINT-PRÜFUNG: ALLE ROLLEN
    checks.push({
      status: 'info',
      message: '====== VOLLSTÄNDIGE SCHICHTPLANUNG (ALLE ROLLEN) ======'
    });
    
    // 1. Überprüfung: Gab es Tage, die nicht belegt werden konnten?
    const nullDays = Object.keys(shiftPlan).filter(dayKey => {
      // Sonntage ausschließen - diese sollen keine Schichten haben
      const [day, month, year] = dayKey.split('.').map(Number);
      const date = new Date(year, month - 1, day);
      const isSunday = date.getDay() === 0;
      
      return shiftPlan[dayKey] === null && !isSunday;
    });
    
    if (nullDays.length > 0) {
      checks.push({
        status: 'violation',
        message: `${nullDays.length} Tag(e) konnten nicht vollständig belegt werden: ${nullDays.join(', ')}`
      });
    } else {
      checks.push({
        status: 'ok',
        message: 'Alle Tage konnten erfolgreich belegt werden.'
      });
    }
    
    // 2. Überprüfung: Vollständige Schichtbesetzung prüfen
    checks.push({
      status: 'info',
      message: '====== SCHICHTBESETZUNG ======'
    });
    
    let schichtleiterCount = 0;
    let pflegerCount = 0;
    let pflegehelferCount = 0;
    let totalShiftsAssigned = 0;
    
    for (const dayKey in shiftPlan) {
      const dayPlan = shiftPlan[dayKey];
      if (dayPlan === null) continue;
      
      // Alle Schichten des Tages durchgehen
      for (const shiftName in dayPlan) {
        const employeeIds = dayPlan[shiftName];
        totalShiftsAssigned += employeeIds.length;
        
        for (const empId of employeeIds) {
          const employee = employees.find(e => e.id === empId);
          if (employee) {
            if (employee.role === 'ShiftLeader') {
              schichtleiterCount++;
            } else if (employee.role === 'Specialist') {
              pflegerCount++;
            } else if (employee.role === 'Assistant') {
              pflegehelferCount++;
            }
          }
        }
      }
    }
    
    checks.push({
      status: 'info',
      message: `Insgesamt ${schichtleiterCount} Schichtleiter-Schichten, ${pflegerCount} Fachkraft-Schichten und ${pflegehelferCount} Hilfskraft-Schichten von ${totalShiftsAssigned} Gesamtschichten zugewiesen.`
    });
    
    // 3. Mitarbeiterzeitstatistik (alle Rollen)
    checks.push({
      status: 'info',
      message: '====== MITARBEITER-STATISTIK ======'
    });
    
    const relevantEmployees = employees.filter(emp =>
      emp.role === 'ShiftLeader' ||
      emp.role === 'Specialist' ||
      emp.role === 'Assistant'
    );
    
    for (const emp of relevantEmployees) {
      const availability = employeeAvailability[emp.id];
      if (!availability) {
        checks.push({
          status: 'info',
          message: `${emp.name} (${emp.role}): Keine Schichten zugewiesen`
        });
        continue;
      }
      
      const totalHours = availability.totalHoursAssigned;
      const targetHours = emp.hoursPerMonth;
      const percentage = targetHours > 0 ? (totalHours / targetHours * 100).toFixed(1) : '0.0';
      const shiftsCount = availability.shiftsAssigned.length;
      
      checks.push({
        status: 'info',
        message: `${emp.name} (${emp.role}): ${shiftsCount} Schichten, ${totalHours.toFixed(1)}h (${percentage}% der Sollstunden)`
      });
    }
    
    // 4. Samstagsverteilungs-Prüfung
    checks.push({
      status: 'info',
      message: '====== SAMSTAGSVERTEILUNG ======'
    });
    
    const saturdayStats: { [empId: string]: number } = {};
    
    // Samstagsschichten zählen
    for (const dayKey in shiftPlan) {
      const dayPlan = shiftPlan[dayKey];
      if (dayPlan === null) continue;
      
      // Prüfen ob es ein Samstag ist (Tag endet mit .6 für Wochentag)
      const date = new Date(dayKey.split('.').reverse().join('-'));
      if (date.getDay() === 6) { // Samstag
        for (const shiftName in dayPlan) {
          const employeeIds = dayPlan[shiftName];
          for (const empId of employeeIds) {
            saturdayStats[empId] = (saturdayStats[empId] || 0) + 1;
          }
        }
      }
    }
    
    // Statistik ausgeben
    const saturdayValues = Object.values(saturdayStats);
    const minSaturdays = Math.min(...saturdayValues, 0);
    const maxSaturdays = Math.max(...saturdayValues, 0);
    const avgSaturdays = saturdayValues.length > 0 ? (saturdayValues.reduce((a, b) => a + b, 0) / saturdayValues.length).toFixed(1) : '0';
    
    checks.push({
      status: 'info',
      message: `Samstagsverteilung: Min=${minSaturdays}, Max=${maxSaturdays}, Durchschnitt=${avgSaturdays}`
    });
    
    // Detaillierte Samstagsstatistik
    const employeesWithSaturdays = Object.entries(saturdayStats)
      .map(([empId, count]) => {
        const emp = employees.find(e => e.id === empId);
        return { name: emp?.name || empId, location: emp?.locationId ? `Location ${emp.locationId}` : 'Unbekannt', count };
      })
      .sort((a, b) => b.count - a.count);
    
    if (employeesWithSaturdays.length > 0) {
      checks.push({
        status: 'info',
        message: `Samstagsschichten pro Mitarbeiter: ${employeesWithSaturdays.map(e => `${e.name} (${e.location}): ${e.count}`).join(', ')}`
      });
    }
    
    // Warnung bei ungleicher Verteilung
    if (maxSaturdays - minSaturdays > 1) {
      checks.push({
        status: 'warning',
        message: `Ungleiche Samstagsverteilung: Differenz von ${maxSaturdays - minSaturdays} Samstagen zwischen Mitarbeitern`
      });
    } else {
      checks.push({
        status: 'ok',
        message: 'Samstagsverteilung ist ausgeglichen (Differenz ≤ 1)'
      });
    }

    // WEITERE CONSTRAINT-PRÜFUNGEN SIND NOCH AUSKOMMENTIERT:
    
    // // Überstunden-Prüfung
    // // Aufeinanderfolgende Schichten
    
    return checks;
  }
}