import { EmployeeResponseDto, ShiftPlanResponseDto, ShiftPlanDetailResponseDto } from '../../api/data-contracts';
import { ReducedEmployee } from './ShiftPlanTypes';
import { ShiftPlanService } from '../ShiftPlanService';
import { EmployeeService } from '../EmployeeService';
import { LocationService } from '../LocationService';
import { ShiftWeekdaysService } from '../ShiftWeekdaysService';

/**
 * Service für das Laden von Schichtplan-relevanten Daten
 */
export class ShiftPlanDataLoader {
  private shiftPlanService: ShiftPlanService;
  private employeeService: EmployeeService;
  private locationService: LocationService;
  private shiftWeekdaysService: ShiftWeekdaysService;

  constructor() {
    this.shiftPlanService = new ShiftPlanService();
    this.employeeService = new EmployeeService();
    this.locationService = new LocationService();
    this.shiftWeekdaysService = new ShiftWeekdaysService();
  }

  /**
   * Lädt den Schichtplan mit Details
   */
  async loadShiftPlanWithDetails(
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
   */
  async loadEmployeesByLocation(locationId: string): Promise<ReducedEmployee[]> {
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
   * Lädt Location-Informationen
   */
  async loadLocationInfo(locationId: string): Promise<any> {
    try {
      return await this.locationService.getLocationById(locationId);
    } catch (error) {
      console.error('Fehler beim Laden der Location-Info:', error);
      return null;
    }
  }

  /**
   * Lädt Schicht-Wochentage für eine Location
   */
  async loadShiftWeekdaysByLocation(locationId: string): Promise<any[]> {
    try {
      const shiftWeekdays = await this.shiftWeekdaysService.getShiftWeekdaysByLocationId(locationId);
      return shiftWeekdays;
    } catch (error) {
      console.error('Fehler beim Laden der Schicht-Wochentage:', error);
      return [];
    }
  }

  /**
   * Reduziert EmployeeResponseDto auf benötigte Felder
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
}