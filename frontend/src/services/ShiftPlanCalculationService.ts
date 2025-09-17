import { EmployeeResponseDto, ShiftPlanResponseDto, ShiftPlanDetailResponseDto } from '../api/data-contracts';
import { ShiftPlanService } from './ShiftPlanService';
import { ShiftPlanDetailService } from './ShiftPlanDetailService';
import { EmployeeService } from './EmployeeService';
import { LocationService } from './LocationService';
import { EmployeeAbsenceService } from './EmployeeAbsenceService';
import { ShiftWeekdaysService } from './ShiftWeekdaysService';
import { getDaysInMonth, startOfMonth, addDays } from 'date-fns';

/**
 * Reduziertes Mitarbeiter-Interface für Schichtplan-Berechnungen
 */
export interface ReducedEmployee {
  id: string;
  name: string;
  role: string;
  location: string;
  monthlyWorkHours?: number;
}

/**
 * Interface für Mitarbeiter-Status an einem Tag
 */
export interface EmployeeDayStatus {
  employee: ReducedEmployee;
  assignedShift: string;
  shiftId: string;
  shiftName: string; // Vollständiger Name der Schicht für Tooltip
  absenceType: string; // 'vacation', 'sick_leave', 'other'
  absenceReason: string;
  isEmpty: boolean; // true wenn keine Schicht und keine Abwesenheit
}

/**
 * Interface für Rollen-Belegung in einer Schicht
 */
export interface RoleOccupancy {
  roleName: string;
  required: number;
  assigned: number;
  assignedEmployees: string[];
}

/**
 * Interface für Schicht-Belegung an einem Tag
 */
export interface ShiftOccupancy {
  shiftId: string;
  shiftName: string;
  shortName: string;
  startTime: string;
  endTime: string;
  requiredCount: number;
  assignedCount: number;
  assignedEmployees: string[]; // Employee names
  roleOccupancy: RoleOccupancy[]; // Belegung nach Rollen
  isUnderStaffed: boolean;
  isCorrectlyStaffed: boolean;
}

/**
 * Interface für einen Tag im Schichtplan
 */
export interface ShiftPlanDay {
  date: Date;
  dayKey: string; // Format: DD.MM.YYYY
  dayNumber: number;
  isWeekend: boolean;
  isToday: boolean;
  employees: EmployeeDayStatus[]; // Alle Mitarbeiter für diesen Tag
  shiftOccupancy: ShiftOccupancy[]; // Schicht-Belegung für diesen Tag
}

/**
 * Interface für die berechnete Schichtplan-Datenstruktur
 */
export interface CalculatedShiftPlan {
  shiftPlan: ShiftPlanResponseDto | null;
  shiftPlanDetails: ShiftPlanDetailResponseDto[];
  employees: (ReducedEmployee & { calculatedMonthlyHours: number })[];
  days: ShiftPlanDay[]; // Array von Tagen mit allen Mitarbeitern
  availableShifts: any[]; // Alle verfügbaren Schichten für diese Location
  shiftWeekdays: any[]; // Schicht-Wochentag Zuordnungen
  year: number;
  month: number;
  locationId: string;
  locationName: string | null;
  isLoading: boolean;
  hasData: boolean;
}

/**
 * Service für die Berechnung und Kapselung von Schichtplänen
 * Kapselt die komplette Logik für das Laden und Strukturieren von Schichtplan-Daten
 */
export class ShiftPlanCalculationService {
  private shiftPlanService: ShiftPlanService;
  private shiftPlanDetailService: ShiftPlanDetailService;
  private employeeService: EmployeeService;
  private shiftWeekdaysService: ShiftWeekdaysService;

  constructor() {
    this.shiftPlanService = new ShiftPlanService();
    this.shiftPlanDetailService = new ShiftPlanDetailService();
    this.employeeService = new EmployeeService();
    this.shiftWeekdaysService = new ShiftWeekdaysService();
  }

  /**
   * Berechnet und lädt den kompletten Schichtplan für Jahr, Monat und Lokation
   * @param year Jahr
   * @param month Monat (1-12)
   * @param locationId Lokations-ID
   * @returns Promise<CalculatedShiftPlan>
   */
  async calculateShiftPlan(
    year: number,
    month: number,
    locationId: string
  ): Promise<CalculatedShiftPlan> {
    try {
      // Parallel laden von Schichtplan, Mitarbeitern, Location-Info und Schicht-Wochentage
      const [shiftPlanResult, employees, locationInfo, shiftWeekdays] = await Promise.all([
        this.loadShiftPlanWithDetails(locationId, year, month),
        this.loadEmployeesByLocation(locationId),
        this.loadLocationInfo(locationId),
        this.loadShiftWeekdaysByLocation(locationId)
      ]);

      // Berechne Tage des Monats mit allen Mitarbeitern
      const selectedDate = new Date(year, month - 1, 1);
      const days = await this.calculateMonthDaysWithEmployees(
        selectedDate,
        employees,
        shiftPlanResult?.details || [],
        shiftWeekdays,
        year,
        month
      );

      // Berechne Monatszeit für jeden Mitarbeiter
      const employeesWithHours = employees.map(employee => ({
        ...employee,
        calculatedMonthlyHours: this.calculateEmployeeMonthlyHours(employee, days, shiftPlanResult?.details || [])
      }));

      // Sammle alle verfügbaren Schichten
      const availableShifts = this.extractAvailableShifts(shiftWeekdays, shiftPlanResult?.details || []);

      const result = {
        shiftPlan: shiftPlanResult?.shiftPlan || null,
        shiftPlanDetails: shiftPlanResult?.details || [],
        employees: employeesWithHours,
        days,
        availableShifts,
        shiftWeekdays,
        year,
        month,
        locationId,
        locationName: locationInfo?.name || null,
        isLoading: false,
        hasData: !!(shiftPlanResult?.shiftPlan && employees.length > 0)
      };

      // Console-Ausgabe für Debugging - komplettes fertiges Objekt
      console.log('🔍 Berechneter Schichtplan (komplettes Objekt):', result);

      return result;
    } catch (error) {
      console.error('Fehler beim Berechnen des Schichtplans:', error);
      return {
        shiftPlan: null,
        shiftPlanDetails: [],
        employees: [],
        days: [],
        availableShifts: [],
        shiftWeekdays: [],
        year,
        month,
        locationId,
        locationName: null,
        isLoading: false,
        hasData: false
      };
    }
  }

  /**
   * Lädt Location-Informationen
   * @private
   */
  private async loadLocationInfo(locationId: string): Promise<any> {
    try {
      const locationService = new LocationService();
      return await locationService.getLocationById(locationId);
    } catch (error) {
      console.error('Fehler beim Laden der Location-Info:', error);
      return null;
    }
  }

  /**
   * Lädt Schicht-Wochentage für eine Location
   * @private
   */
  private async loadShiftWeekdaysByLocation(locationId: string): Promise<any[]> {
    try {
      const shiftWeekdays = await this.shiftWeekdaysService.getShiftWeekdaysByLocationId(locationId);
      return shiftWeekdays;
    } catch (error) {
      console.error('Fehler beim Laden der Schicht-Wochentage:', error);
      return [];
    }
  }

  /**
   * Berechnet die Tage des Monats mit allen Mitarbeitern und ihren Zuordnungen
   * @private
   */
  private async calculateMonthDaysWithEmployees(
    selectedDate: Date,
    employees: ReducedEmployee[],
    shiftPlanDetails: ShiftPlanDetailResponseDto[],
    shiftWeekdays: any[],
    year: number,
    month: number
  ): Promise<ShiftPlanDay[]> {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = startOfMonth(selectedDate);
    const days: ShiftPlanDay[] = [];
    
    // Lade Abwesenheiten für den Monat
    const absences = await this.loadAbsencesForMonth(year, month);
    
    for (let i = 0; i < daysInMonth; i++) {
      const day = addDays(firstDay, i);
      const dayStr = day.getDate().toString().padStart(2, '0');
      const monthStr = (day.getMonth() + 1).toString().padStart(2, '0');
      const yearStr = day.getFullYear().toString();
      const dayKey = `${dayStr}.${monthStr}.${yearStr}`;
      const dayNumber = day.getDate();
      
      // Erstelle Mitarbeiter-Status für diesen Tag
      const employeeStatuses: EmployeeDayStatus[] = employees.map(employee => {
        // Suche nach Schicht-Zuordnung
        const shiftAssignment = shiftPlanDetails.find(detail =>
          detail.employeeId === employee.id && detail.day === dayNumber
        );
        
        // Suche nach Abwesenheit
        const absence = absences.find(abs =>
          abs.employeeId === employee.id &&
          this.isDateInAbsenceRange(day, abs.startDate, abs.endDate)
        );
        
        if (absence) {
          return {
            employee,
            assignedShift: '',
            shiftId: '',
            shiftName: '',
            absenceType: absence.absenceType,
            absenceReason: this.getAbsenceReasonText(absence.absenceType),
            isEmpty: false
          };
        }
        
        if (shiftAssignment) {
          return {
            employee,
            assignedShift: (shiftAssignment.shift as any).shortName,
            shiftId: shiftAssignment.shiftId,
            shiftName: (shiftAssignment.shift as any).name,
            absenceType: '',
            absenceReason: '',
            isEmpty: false
          };
        }
        
        return {
          employee,
          assignedShift: '',
          shiftId: '',
          shiftName: '',
          absenceType: '',
          absenceReason: '',
          isEmpty: true
        };
      });
      
      // Berechne Schicht-Belegung für diesen Tag basierend auf Wochentag
      const dayOfWeek = day.getDay(); // 0 = Sonntag, 1 = Montag, etc.
      const shiftOccupancy = this.calculateShiftOccupancyForDay(
        dayNumber,
        dayOfWeek,
        shiftPlanDetails,
        shiftWeekdays,
        employeeStatuses
      );

      days.push({
        date: day,
        dayKey,
        dayNumber,
        isWeekend: day.getDay() === 0 || day.getDay() === 6,
        isToday: this.isToday(day),
        employees: employeeStatuses,
        shiftOccupancy
      });
    }
    
    return days;
  }

  /**
   * Lädt Abwesenheiten für einen Monat
   * @private
   */
  private async loadAbsencesForMonth(year: number, month: number): Promise<any[]> {
    try {
      const absenceService = new EmployeeAbsenceService();
      
      // Verwende die getAbsencesByMonth Methode
      const monthAbsences = await absenceService.getAbsencesByMonth(
        year.toString(),
        month.toString()
      );
      
      return monthAbsences;
    } catch (error) {
      console.error('Fehler beim Laden der Abwesenheiten:', error);
      return [];
    }
  }

  /**
   * Prüft ob ein Datum in einem Abwesenheitszeitraum liegt
   * @private
   */
  private isDateInAbsenceRange(date: Date, startDate: string, endDate: string): boolean {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return checkDate >= start && checkDate <= end;
  }

  /**
   * Gibt den Text für einen Abwesenheitstyp zurück
   * @private
   */
  private getAbsenceReasonText(absenceType: string): string {
    switch (absenceType) {
      case 'vacation':
        return 'Urlaub';
      case 'sick_leave':
        return 'Krankheit';
      case 'other':
        return 'Sonstiges';
      default:
        return 'Abwesend';
    }
  }

  /**
   * Prüft ob ein Datum heute ist
   * @private
   */
  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Lädt den Schichtplan mit Details
   * @private
   */
  private async loadShiftPlanWithDetails(
    locationId: string,
    year: number,
    month: number
  ): Promise<{ shiftPlan: ShiftPlanResponseDto; details: ShiftPlanDetailResponseDto[] } | null> {
    try {
      const result = await this.shiftPlanService.getShiftPlanWithDetailsByLocationMonthYear(
        locationId,
        year,
        month
      );
      return result;
    } catch (error) {
      console.error('Fehler beim Laden des Schichtplans:', error);
      return null;
    }
  }

  /**
   * Lädt Mitarbeiter für eine Lokation
   * @private
   */
  private async loadEmployeesByLocation(locationId: string): Promise<ReducedEmployee[]> {
    try {
      const employees = await this.employeeService.getEmployeesByLocation(locationId, {
        includeRelations: true
      });
      
      // Reduziere Mitarbeiterdaten auf benötigte Felder
      return employees.map(emp => this.reduceEmployeeData(emp));
    } catch (error) {
      console.error('Fehler beim Laden der Mitarbeiter:', error);
      return [];
    }
  }

  /**
   * Reduziert EmployeeResponseDto auf benötigte Felder
   * @private
   */
  private reduceEmployeeData(employee: EmployeeResponseDto): ReducedEmployee {
    return {
      id: employee.id,
      name: employee.fullName || `${employee.firstName} ${employee.lastName}`,
      role: employee.primaryRole?.name || 'Keine Rolle',
      location: employee.location?.name || 'Keine Location',
      monthlyWorkHours: typeof employee.monthlyWorkHours === 'string'
        ? parseFloat(employee.monthlyWorkHours)
        : employee.monthlyWorkHours
    };
  }

  /**
   * Aktualisiert einen bestehenden Schichtplan
   * @param locationId Lokations-ID
   * @param year Jahr
   * @param month Monat
   * @returns Promise<CalculatedShiftPlan>
   */
  async refreshShiftPlan(
    locationId: string,
    year: number,
    month: number
  ): Promise<CalculatedShiftPlan> {
    return this.calculateShiftPlan(year, month, locationId);
  }

  /**
   * Prüft ob ein Schichtplan für die gegebenen Parameter existiert
   * @param locationId Lokations-ID
   * @param year Jahr
   * @param month Monat
   * @returns Promise<boolean>
   */
  async hasShiftPlan(
    locationId: string,
    year: number,
    month: number
  ): Promise<boolean> {
    try {
      const shiftPlan = await this.shiftPlanService.getShiftPlanByLocationMonthYear(
        locationId,
        year,
        month
      );
      return !!shiftPlan;
    } catch (error) {
      return false;
    }
  }

  /**
   * Erstellt eine leere Schichtplan-Struktur für den Fall, dass noch kein Plan existiert
   * @param locationId Lokations-ID
   * @param year Jahr
   * @param month Monat
   * @returns CalculatedShiftPlan
   */
  async createEmptyShiftPlan(
    locationId: string,
    year: number,
    month: number
  ): Promise<CalculatedShiftPlan> {
    try {
      const [employees, locationInfo] = await Promise.all([
        this.loadEmployeesByLocation(locationId),
        this.loadLocationInfo(locationId)
      ]);
      const selectedDate = new Date(year, month - 1, 1);
      const days = await this.calculateMonthDaysWithEmployees(selectedDate, employees, [], [], year, month);
      
      // Berechne Monatszeit für jeden Mitarbeiter (wird 0 sein da keine Schichten)
      const employeesWithHours = employees.map(employee => ({
        ...employee,
        calculatedMonthlyHours: 0
      }));
      
      return {
        shiftPlan: null,
        shiftPlanDetails: [],
        employees: employeesWithHours,
        days,
        availableShifts: [],
        shiftWeekdays: [],
        year,
        month,
        locationId,
        locationName: locationInfo?.name || null,
        isLoading: false,
        hasData: false
      };
    } catch (error) {
      console.error('Fehler beim Erstellen der leeren Schichtplan-Struktur:', error);
      return {
        shiftPlan: null,
        shiftPlanDetails: [],
        employees: [],
        days: [],
        availableShifts: [],
        shiftWeekdays: [],
        year,
        month,
        locationId,
        locationName: null,
        isLoading: false,
        hasData: false
      };
    }
  }

  /**
   * Berechnet die Monatszeit für einen Mitarbeiter
   * @private
   */
  private calculateEmployeeMonthlyHours(
    employee: ReducedEmployee,
    days: ShiftPlanDay[],
    shiftPlanDetails: ShiftPlanDetailResponseDto[]
  ): number {
    let totalHours = 0;
    
    days.forEach(day => {
      const employeeStatus = day.employees.find(empStatus =>
        empStatus.employee.id === employee.id
      );
      
      if (employeeStatus?.assignedShift && employeeStatus.shiftId) {
        // Find shift details from shiftPlanDetails
        const shiftDetail = shiftPlanDetails.find(detail =>
          detail.shiftId === employeeStatus.shiftId
        );
        
        if (shiftDetail?.shift) {
          // Calculate duration from start and end time
          const shift = shiftDetail.shift as any;
          if (shift.startTime && shift.endTime) {
            const start = new Date(`2000-01-01T${shift.startTime}`);
            const end = new Date(`2000-01-01T${shift.endTime}`);
            
            // Handle overnight shifts
            if (end < start) {
              end.setDate(end.getDate() + 1);
            }
            
            const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            totalHours += duration;
          }
        }
      }
    });
    
    return totalHours;
  }

  /**
   * Berechnet die Schicht-Belegung für einen bestimmten Tag
   * @private
   */
  private calculateShiftOccupancyForDay(
    dayNumber: number,
    dayOfWeek: number,
    shiftPlanDetails: ShiftPlanDetailResponseDto[],
    shiftWeekdays: any[],
    employeeStatuses: EmployeeDayStatus[]
  ): ShiftOccupancy[] {
    // Sammle alle verfügbaren Schichten für diesen Wochentag
    const allShifts = new Map<string, any>();
    
    // Lade alle Schichten die für diesen Wochentag konfiguriert sind
    shiftWeekdays.forEach(shiftWeekday => {
      if (shiftWeekday.weekday === dayOfWeek && shiftWeekday.shift) {
        allShifts.set(shiftWeekday.shift.id, shiftWeekday.shift);
      }
    });
    
    // Zusätzlich sammle alle Schichten aus den Details (falls welche fehlen)
    shiftPlanDetails.forEach(detail => {
      if (detail.shift && !allShifts.has(detail.shiftId)) {
        allShifts.set(detail.shiftId, detail.shift);
      }
    });

    // Sammle Zuweisungen für diesen Tag
    const shiftsForDay = shiftPlanDetails.filter(detail => detail.day === dayNumber);
    
    // Gruppiere Zuweisungen nach Schicht-ID
    const assignmentGroups = new Map<string, ShiftPlanDetailResponseDto[]>();
    shiftsForDay.forEach(detail => {
      if (!assignmentGroups.has(detail.shiftId)) {
        assignmentGroups.set(detail.shiftId, []);
      }
      assignmentGroups.get(detail.shiftId)!.push(detail);
    });

    // Erstelle ShiftOccupancy Array für alle Schichten
    const occupancy: ShiftOccupancy[] = [];

    allShifts.forEach((shift, shiftId) => {
      const assignments = assignmentGroups.get(shiftId) || [];
      
      // Finde zugewiesene Mitarbeiter für diese Schicht
      const assignedEmployeesWithRoles = assignments
        .map(assignment => {
          const empStatus = employeeStatuses.find(emp =>
            emp.employee.id === assignment.employeeId
          );
          return {
            name: empStatus?.employee.name || 'Unbekannt',
            role: empStatus?.employee.role || 'Keine Rolle'
          };
        })
        .filter(emp => emp.name !== 'Unbekannt');

      const assignedEmployees = assignedEmployeesWithRoles.map(emp => emp.name);
      
      // Berechne Rollen-Belegung
      const roleOccupancy = this.calculateRoleOccupancyForShift(shift, assignedEmployeesWithRoles);
      
      const requiredCount = this.getRequiredStaffForShift(shift);
      const assignedCount = assignedEmployees.length;

      occupancy.push({
        shiftId,
        shiftName: shift?.name || 'Unbekannte Schicht',
        shortName: shift?.shortName || 'N/A',
        startTime: shift?.startTime || '00:00',
        endTime: shift?.endTime || '00:00',
        requiredCount,
        assignedCount,
        assignedEmployees,
        roleOccupancy,
        isUnderStaffed: assignedCount < requiredCount,
        isCorrectlyStaffed: assignedCount === requiredCount
      });
    });

    // Sortiere nach Startzeit
    return occupancy.sort((a, b) => {
      const timeA = a.startTime.replace(':', '');
      const timeB = b.startTime.replace(':', '');
      return timeA.localeCompare(timeB);
    });
  }

  /**
   * Ermittelt die benötigte Personalstärke für eine Schicht
   * @private
   */
  private getRequiredStaffForShift(shift: any): number {
    // TODO: Implementiere Logik basierend auf Schicht-Rollen oder Konfiguration
    // Für jetzt nehmen wir 1 als Standard
    return shift?.requiredStaff || 1;
  }

  /**
   * Berechnet die Rollen-Belegung für eine Schicht
   * @private
   */
  private calculateRoleOccupancyForShift(
    shift: any,
    assignedEmployees: { name: string; role: string }[]
  ): RoleOccupancy[] {
    // Gruppiere zugewiesene Mitarbeiter nach Rollen
    const roleGroups = new Map<string, string[]>();
    
    assignedEmployees.forEach(emp => {
      if (!roleGroups.has(emp.role)) {
        roleGroups.set(emp.role, []);
      }
      roleGroups.get(emp.role)!.push(emp.name);
    });

    // Erstelle RoleOccupancy Array
    const roleOccupancy: RoleOccupancy[] = [];
    
    // TODO: Hier sollten die tatsächlichen Rollen-Anforderungen aus der Schicht-Konfiguration geladen werden
    // Für jetzt nehmen wir die vorhandenen Rollen und setzen required = 1
    roleGroups.forEach((employees, roleName) => {
      roleOccupancy.push({
        roleName,
        required: 1, // TODO: Aus Schicht-Rollen-Konfiguration laden
        assigned: employees.length,
        assignedEmployees: employees
      });
    });

    return roleOccupancy.sort((a, b) => a.roleName.localeCompare(b.roleName));
  }

  /**
   * Extrahiert alle verfügbaren Schichten aus ShiftWeekdays und ShiftPlanDetails
   * @private
   */
  private extractAvailableShifts(shiftWeekdays: any[], shiftPlanDetails: ShiftPlanDetailResponseDto[]): any[] {
    const shiftsMap = new Map<string, any>();
    
    // Sammle Schichten aus ShiftWeekdays
    shiftWeekdays.forEach(shiftWeekday => {
      if (shiftWeekday.shift && !shiftsMap.has(shiftWeekday.shift.id)) {
        shiftsMap.set(shiftWeekday.shift.id, shiftWeekday.shift);
      }
    });
    
    // Sammle zusätzliche Schichten aus ShiftPlanDetails
    shiftPlanDetails.forEach(detail => {
      if (detail.shift && !shiftsMap.has(detail.shiftId)) {
        shiftsMap.set(detail.shiftId, detail.shift);
      }
    });
    
    return Array.from(shiftsMap.values()).sort((a, b) => {
      const timeA = a.startTime?.replace(':', '') || '0000';
      const timeB = b.startTime?.replace(':', '') || '0000';
      return timeA.localeCompare(timeB);
    });
  }
}

// Export singleton instance
export const shiftPlanCalculationService = new ShiftPlanCalculationService();