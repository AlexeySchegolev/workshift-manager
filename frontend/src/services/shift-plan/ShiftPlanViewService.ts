import { getDaysInMonth, startOfMonth, addDays } from 'date-fns';
import { 
  CalculatedShiftPlan, 
  ShiftPlanDay, 
  EmployeeDayStatus, 
  ReducedEmployee 
} from './ShiftPlanTypes';
import { ShiftPlanDataLoader } from './ShiftPlanDataLoader';
import { ShiftPlanAbsenceManager } from './ShiftPlanAbsenceManager';
import { ShiftPlanTimeUtils } from './ShiftPlanTimeUtils';
import { ShiftPlanOccupancyCalculator } from './ShiftPlanOccupancyCalculator';

/**
 * Service für die Erstellung von Schichtplan-Views
 * Orchestriert die verschiedenen Teilservices für eine komplette Schichtplan-Darstellung
 */
export class ShiftPlanViewService {
  private dataLoader: ShiftPlanDataLoader;
  private absenceManager: ShiftPlanAbsenceManager;
  private occupancyCalculator: ShiftPlanOccupancyCalculator;

  constructor() {
    this.dataLoader = new ShiftPlanDataLoader();
    this.absenceManager = new ShiftPlanAbsenceManager();
    this.occupancyCalculator = new ShiftPlanOccupancyCalculator();
  }

  /**
   * Berechnet und lädt den kompletten Schichtplan für Jahr, Monat und Lokation
   */
  async calculateShiftPlan(
    year: number,
    month: number,
    locationId: string
  ): Promise<CalculatedShiftPlan> {
    try {
      // Parallel laden von Schichtplan, Mitarbeitern, Location-Info und Schicht-Wochentage
      const [shiftPlanResult, employees, locationInfo, shiftWeekdays] = await Promise.all([
        this.dataLoader.loadShiftPlanWithDetails(locationId, year, month),
        this.dataLoader.loadEmployeesByLocation(locationId),
        this.dataLoader.loadLocationInfo(locationId),
        this.dataLoader.loadShiftWeekdaysByLocation(locationId)
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
        calculatedMonthlyHours: ShiftPlanTimeUtils.calculateEmployeeMonthlyHours(
          employee, 
          days, 
          shiftPlanResult?.details || []
        )
      }));

      // Sammle alle verfügbaren Schichten
      const availableShifts = this.occupancyCalculator.extractAvailableShifts(
        shiftWeekdays, 
        shiftPlanResult?.details || []
      );

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

      console.log('🔍 Berechneter Schichtplan (komplettes Objekt):', result);
      return result;
    } catch (error) {
      console.error('Fehler beim Berechnen des Schichtplans:', error);
      return this.createEmptyResult(year, month, locationId);
    }
  }

  /**
   * Berechnet die Tage des Monats mit allen Mitarbeitern und ihren Zuordnungen
   */
  private async calculateMonthDaysWithEmployees(
    selectedDate: Date,
    employees: ReducedEmployee[],
    shiftPlanDetails: any[],
    shiftWeekdays: any[],
    year: number,
    month: number
  ): Promise<ShiftPlanDay[]> {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = startOfMonth(selectedDate);
    const days: ShiftPlanDay[] = [];
    
    // Lade Abwesenheiten für den Monat
    const absences = await this.absenceManager.loadAbsencesForMonth(year, month);
    
    for (let i = 0; i < daysInMonth; i++) {
      const day = addDays(firstDay, i);
      const dayKey = ShiftPlanTimeUtils.createDayKey(day);
      const dayNumber = day.getDate();
      
      // Erstelle Mitarbeiter-Status für diesen Tag
      const employeeStatuses: EmployeeDayStatus[] = employees.map(employee => {
        return this.createEmployeeDayStatus(employee, dayNumber, day, shiftPlanDetails, absences);
      });
      
      // Berechne Schicht-Belegung für diesen Tag basierend auf Wochentag
      const dayOfWeek = day.getDay();
      const shiftOccupancy = this.occupancyCalculator.calculateShiftOccupancyForDay(
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
        isWeekend: ShiftPlanTimeUtils.isWeekend(day),
        isToday: ShiftPlanTimeUtils.isToday(day),
        employees: employeeStatuses,
        shiftOccupancy
      });
    }
    
    return days;
  }

  /**
   * Erstellt den Status eines Mitarbeiters für einen bestimmten Tag
   */
  private createEmployeeDayStatus(
    employee: ReducedEmployee,
    dayNumber: number,
    day: Date,
    shiftPlanDetails: any[],
    absences: any[]
  ): EmployeeDayStatus {
    // Suche nach Schicht-Zuordnung
    const shiftAssignment = shiftPlanDetails.find(detail =>
      detail.employeeId === employee.id && detail.day === dayNumber
    );
    
    // Suche nach Abwesenheit
    const absence = absences.find(abs =>
      abs.employeeId === employee.id &&
      this.absenceManager.isDateInAbsenceRange(day, abs.startDate, abs.endDate)
    );
    
    if (absence) {
      return {
        employee,
        assignedShift: '',
        shiftId: '',
        shiftName: '',
        absenceType: absence.absenceType,
        absenceReason: this.absenceManager.getAbsenceReasonText(absence.absenceType),
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
  }

  /**
   * Aktualisiert einen bestehenden Schichtplan
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
   */
  async hasShiftPlan(
    locationId: string,
    year: number,
    month: number
  ): Promise<boolean> {
    try {
      const shiftPlan = await this.dataLoader.loadShiftPlanWithDetails(locationId, year, month);
      return !!shiftPlan;
    } catch (error) {
      return false;
    }
  }

  /**
   * Erstellt eine leere Schichtplan-Struktur
   */
  async createEmptyShiftPlan(
    locationId: string,
    year: number,
    month: number
  ): Promise<CalculatedShiftPlan> {
    try {
      const [employees, locationInfo] = await Promise.all([
        this.dataLoader.loadEmployeesByLocation(locationId),
        this.dataLoader.loadLocationInfo(locationId)
      ]);
      
      const selectedDate = new Date(year, month - 1, 1);
      const days = await this.calculateMonthDaysWithEmployees(
        selectedDate, 
        employees, 
        [], 
        [], 
        year, 
        month
      );
      
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
      return this.createEmptyResult(year, month, locationId);
    }
  }

  /**
   * Erstellt ein leeres Ergebnis-Objekt
   */
  private createEmptyResult(year: number, month: number, locationId: string): CalculatedShiftPlan {
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

// Export singleton instance
export const shiftPlanViewService = new ShiftPlanViewService();