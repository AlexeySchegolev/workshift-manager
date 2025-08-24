import { v4 as uuidv4 } from 'uuid';
import { db } from '@/database/database';
import { 
  Employee, 
  MonthlyShiftPlan, 
  EmployeeAvailability, 
  GenerateShiftPlanRequest,
  GenerateShiftPlanResponse,
  PlanningStatistics,
  ConstraintViolation
} from '@/types/interfaces';
import { loggers } from '@/utils/logger';

/**
 * Backend-Service für Schichtplanung
 * Portiert die Frontend-Logik auf den Server
 */
export class ShiftPlanningService {
  
  /**
   * Generiert einen neuen Schichtplan
   */
  public static async generateShiftPlan(request: GenerateShiftPlanRequest): Promise<GenerateShiftPlanResponse> {
    const { year, month, employeeIds, useRelaxedRules = false } = request;
    
    loggers.service(`Generiere Schichtplan für ${month}/${year}`, { 
      employeeCount: employeeIds?.length || 'alle',
      useRelaxedRules 
    });

    try {
      // Mitarbeiter laden
      const employees = await this.loadEmployees(employeeIds);
      
      if (employees.length === 0) {
        throw new Error('Keine Mitarbeiter für Schichtplanung verfügbar');
      }

      // Schichtregeln laden
      const shiftRules = await this.loadShiftRules();
      
      // Schichtplan generieren (vereinfachte Version)
      const { shiftPlan, employeeAvailability } = this.generateBasicShiftPlan(
        employees, 
        year, 
        month, 
        useRelaxedRules
      );

      // Constraints prüfen
      const violations = this.validateShiftPlan(shiftPlan, employees, employeeAvailability, shiftRules);

      // Statistiken berechnen
      const statistics = this.calculateStatistics(shiftPlan, employees, employeeAvailability, year, month);

      // Schichtplan in Datenbank speichern
      const savedPlan = await this.saveShiftPlan({
        year,
        month,
        planData: shiftPlan,
        employeeAvailability,
        statistics
      });

      // Constraint-Verletzungen speichern
      if (violations.hard.length > 0 || violations.soft.length > 0) {
        await this.saveConstraintViolations(savedPlan.id, violations);
      }

      loggers.service(`Schichtplan erfolgreich generiert`, {
        planId: savedPlan.id,
        hardViolations: violations.hard.length,
        softViolations: violations.soft.length,
        completionRate: statistics.completionRate
      });

      return {
        shiftPlan,
        employeeAvailability,
        violations,
        statistics
      };

    } catch (error) {
      loggers.error('Fehler bei Schichtplan-Generierung', error as Error, { year, month });
      throw error;
    }
  }

  /**
   * Lädt Mitarbeiter aus der Datenbank
   */
  private static async loadEmployees(employeeIds?: string[]): Promise<Employee[]> {
    let query = 'SELECT * FROM employees WHERE is_active = 1';
    const params: any[] = [];

    if (employeeIds && employeeIds.length > 0) {
      query += ` AND id IN (${employeeIds.map(() => '?').join(',')})`;
      params.push(...employeeIds);
    }

    query += ' ORDER BY role, name';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as any[];

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      role: row.role,
      hoursPerMonth: row.hours_per_month,
      hoursPerWeek: row.hours_per_week,
      clinic: row.clinic,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  }

  /**
   * Lädt aktuelle Schichtregeln
   */
  private static async loadShiftRules(): Promise<any> {
    const stmt = db.prepare('SELECT * FROM shift_rules WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1');
    const row = stmt.get() as any;

    if (!row) {
      // Standard-Regeln zurückgeben
      return {
        minNursesPerShift: 4,
        minNurseManagersPerShift: 1,
        minHelpers: 1,
        maxSaturdaysPerMonth: 1,
        maxConsecutiveSameShifts: 0,
        weeklyHoursOverflowTolerance: 0.1
      };
    }

    return {
      minNursesPerShift: row.min_nurses_per_shift,
      minNurseManagersPerShift: row.min_nurse_managers_per_shift,
      minHelpers: row.min_helpers,
      maxSaturdaysPerMonth: row.max_saturdays_per_month,
      maxConsecutiveSameShifts: row.max_consecutive_same_shifts,
      weeklyHoursOverflowTolerance: row.weekly_hours_overflow_tolerance
    };
  }

  /**
   * Generiert einen einfachen Schichtplan (vereinfachte Version)
   */
  private static generateBasicShiftPlan(
    employees: Employee[], 
    year: number, 
    month: number, 
    useRelaxedRules: boolean
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

    // Tage des Monats generieren
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayKey = this.formatDateKey(date);
      const dayOfWeek = date.getDay();

      // Sonntage überspringen
      if (dayOfWeek === 0) {
        shiftPlan[dayKey] = null;
        continue;
      }

      // Samstage - nur die ersten zwei im Monat
      if (dayOfWeek === 6) {
        const saturdayCount = this.countSaturdaysUpToDate(year, month, day);
        if (saturdayCount > 2) {
          shiftPlan[dayKey] = null;
          continue;
        }
      }

      // Schichten für den Tag planen
      shiftPlan[dayKey] = this.planDayShifts(
        employees, 
        employeeAvailability, 
        date, 
        useRelaxedRules
      );
    }

    return { shiftPlan, employeeAvailability };
  }

  /**
   * Plant Schichten für einen einzelnen Tag
   */
  private static planDayShifts(
    employees: Employee[],
    availability: EmployeeAvailability,
    date: Date,
    useRelaxedRules: boolean
  ): { [shiftName: string]: string[] } {
    
    const dayShifts: { [shiftName: string]: string[] } = {};
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

    // Verfügbare Mitarbeiter nach Rolle sortieren
    const schichtleiter = employees.filter(emp => emp.role === 'Schichtleiter');
    const pfleger = employees.filter(emp => emp.role === 'Pfleger');
    const pflegehelfer = employees.filter(emp => emp.role === 'Pflegehelfer');

    if (isWeekend) {
      // Wochenend-Schichten (vereinfacht)
      dayShifts['F'] = this.assignEmployeesToShift(
        [...schichtleiter, ...pfleger, ...pflegehelfer].slice(0, 3),
        availability,
        date,
        'F',
        7
      );
      
      dayShifts['FS'] = this.assignEmployeesToShift(
        [...schichtleiter, ...pfleger].slice(0, 1),
        availability,
        date,
        'FS',
        7.25
      );
    } else {
      // Werktags-Schichten
      dayShifts['F'] = this.assignEmployeesToShift(
        [...schichtleiter.slice(0, 1), ...pfleger.slice(0, 3), ...pflegehelfer.slice(0, 1)],
        availability,
        date,
        'F',
        8
      );

      dayShifts['S'] = this.assignEmployeesToShift(
        [...schichtleiter.slice(1, 2), ...pfleger.slice(3, 6), ...pflegehelfer.slice(1, 2)],
        availability,
        date,
        'S',
        8
      );

      dayShifts['S0'] = this.assignEmployeesToShift(
        [...pfleger.slice(6, 8)],
        availability,
        date,
        'S0',
        4
      );
    }

    return dayShifts;
  }

  /**
   * Weist Mitarbeiter einer Schicht zu
   */
  private static assignEmployeesToShift(
    employees: Employee[],
    availability: EmployeeAvailability,
    date: Date,
    shiftType: string,
    hours: number
  ): string[] {
    const assigned: string[] = [];
    const dateKey = this.formatDateKey(date);

    for (const emp of employees) {
      // Einfache Verfügbarkeitsprüfung
      if (availability[emp.id].shiftsAssigned.includes(dateKey)) {
        continue; // Bereits an diesem Tag eingeteilt
      }

      // Stunden-Check (vereinfacht)
      if (availability[emp.id].totalHoursAssigned + hours > emp.hoursPerMonth * 1.1) {
        continue; // Zu viele Stunden
      }

      // Zuweisen
      assigned.push(emp.id);
      availability[emp.id].totalHoursAssigned += hours;
      availability[emp.id].shiftsAssigned.push(dateKey);
      availability[emp.id].lastShiftType = shiftType;

      // Samstag zählen
      if (date.getDay() === 6) {
        availability[emp.id].saturdaysWorked += 1;
      }
    }

    return assigned;
  }

  /**
   * Validiert den Schichtplan gegen Constraints
   */
  private static validateShiftPlan(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    availability: EmployeeAvailability,
    rules: any
  ): { hard: ConstraintViolation[]; soft: ConstraintViolation[] } {
    
    const hardViolations: ConstraintViolation[] = [];
    const softViolations: ConstraintViolation[] = [];

    // Beispiel-Validierungen (vereinfacht)
    for (const [dateKey, dayPlan] of Object.entries(shiftPlan)) {
      if (!dayPlan) continue;

      for (const [shiftName, employeeIds] of Object.entries(dayPlan)) {
        // Mindestbesetzung prüfen
        if (employeeIds.length < rules.minNursesPerShift) {
          hardViolations.push({
            id: uuidv4(),
            shiftPlanId: '', // Wird später gesetzt
            type: 'hard',
            rule: 'min_nurses_per_shift',
            message: `Schicht ${shiftName} am ${dateKey}: Zu wenige Mitarbeiter (${employeeIds.length}/${rules.minNursesPerShift})`,
            date: dateKey,
            createdAt: new Date()
          });
        }
      }
    }

    // Überstunden prüfen
    employees.forEach(emp => {
      const assigned = availability[emp.id].totalHoursAssigned;
      const target = emp.hoursPerMonth;
      const tolerance = target * rules.weeklyHoursOverflowTolerance;

      if (assigned > target + tolerance) {
        softViolations.push({
          id: uuidv4(),
          shiftPlanId: '', // Wird später gesetzt
          type: 'soft',
          rule: 'hours_overflow',
          message: `${emp.name}: Überstunden (${assigned}h/${target}h)`,
          employeeId: emp.id,
          createdAt: new Date()
        });
      }
    });

    return { hard: hardViolations, soft: softViolations };
  }

  /**
   * Berechnet Planungsstatistiken
   */
  private static calculateStatistics(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    availability: EmployeeAvailability,
    year: number,
    month: number
  ): PlanningStatistics {
    
    const daysInMonth = new Date(year, month, 0).getDate();
    let completeDays = 0;
    let incompleteDays = 0;

    // Tage zählen
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayKey = this.formatDateKey(date);
      
      if (date.getDay() === 0) continue; // Sonntage ausschließen

      if (shiftPlan[dayKey] && shiftPlan[dayKey] !== null) {
        const dayPlan = shiftPlan[dayKey]!;
        const hasShifts = Object.values(dayPlan).some(shifts => shifts.length > 0);
        if (hasShifts) {
          completeDays++;
        } else {
          incompleteDays++;
        }
      } else {
        incompleteDays++;
      }
    }

    const workingDays = daysInMonth - this.countSundays(year, month);
    const completionRate = (completeDays / workingDays) * 100;

    // Arbeitsbelastung
    const workloadDistribution = employees.map(emp => {
      const assigned = availability[emp.id]?.totalHoursAssigned || 0;
      const target = emp.hoursPerMonth;
      const percentage = (assigned / target) * 100;

      return {
        employeeId: emp.id,
        name: emp.name,
        assignedHours: assigned,
        targetHours: target,
        percentage
      };
    });

    const averageWorkload = workloadDistribution.reduce((sum, emp) => sum + emp.percentage, 0) / employees.length;

    // Samstagsverteilung
    const saturdayDistribution = employees.map(emp => ({
      employeeId: emp.id,
      name: emp.name,
      count: availability[emp.id]?.saturdaysWorked || 0
    }));

    return {
      completeDays,
      incompleteDays,
      completionRate,
      averageWorkload,
      workloadDistribution,
      saturdayDistribution
    };
  }

  /**
   * Speichert Schichtplan in der Datenbank
   */
  private static async saveShiftPlan(planData: any): Promise<{ id: string }> {
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO shift_plans (
        id, year, month, plan_data, employee_availability, statistics, is_finalized
      ) VALUES (?, ?, ?, ?, ?, ?, 0)
    `);

    stmt.run(
      id,
      planData.year,
      planData.month,
      JSON.stringify(planData.planData),
      JSON.stringify(planData.employeeAvailability),
      JSON.stringify(planData.statistics)
    );

    return { id };
  }

  /**
   * Speichert Constraint-Verletzungen
   */
  private static async saveConstraintViolations(
    shiftPlanId: string, 
    violations: { hard: ConstraintViolation[]; soft: ConstraintViolation[] }
  ): Promise<void> {
    
    const stmt = db.prepare(`
      INSERT INTO constraint_violations (
        id, shift_plan_id, type, rule, message, employee_id, date, severity, is_resolved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const insertMany = db.transaction((allViolations: ConstraintViolation[]) => {
      for (const violation of allViolations) {
        stmt.run(
          violation.id,
          shiftPlanId,
          violation.type,
          violation.rule,
          violation.message,
          violation.employeeId || null,
          violation.date || null,
          violation.type === 'hard' ? 3 : 2
        );
      }
    });

    insertMany([...violations.hard, ...violations.soft]);
  }

  /**
   * Hilfsfunktionen
   */
  private static formatDateKey(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  private static countSaturdaysUpToDate(year: number, month: number, day: number): number {
    let count = 0;
    for (let d = 1; d <= day; d++) {
      const date = new Date(year, month - 1, d);
      if (date.getDay() === 6) count++;
    }
    return count;
  }

  private static countSundays(year: number, month: number): number {
    const daysInMonth = new Date(year, month, 0).getDate();
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() === 0) count++;
    }
    return count;
  }
}