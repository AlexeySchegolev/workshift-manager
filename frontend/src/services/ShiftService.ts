import { BaseService } from './BaseService';
import { Shifts } from '../api/Shifts';
import { 
  CreateShiftDto, 
  UpdateShiftDto, 
  ShiftResponseDto 
} from '../api/data-contracts';

/**
 * Service class for shift operations
 * Provides a clean interface between components and the Shifts API
 */
export class ShiftService extends BaseService {
  private shiftsApi: Shifts;

  constructor() {
    super();
    this.shiftsApi = new Shifts(this.getHttpClient());
  }

  /**
   * Get all shifts with optional filtering
   */
  async getAllShifts(options?: {
    organizationId?: string;
    locationId?: string;
    shiftPlanId?: string;
    activeOnly?: boolean;
    includeRelations?: boolean;
  }): Promise<ShiftResponseDto[]> {
    const response = await this.shiftsApi.shiftsControllerFindAll(options);
    return response.data;
  }

  /**
   * Get shift by ID
   */
  async getShiftById(id: string, options?: {
    includeRelations?: boolean;
  }): Promise<ShiftResponseDto> {
    const response = await this.shiftsApi.shiftsControllerFindOne(id, options);
    return response.data;
  }

  /**
   * Create new shift
   */
  async createShift(shiftData: CreateShiftDto): Promise<ShiftResponseDto> {
    const response = await this.shiftsApi.shiftsControllerCreate(shiftData);
    return response.data;
  }

  /**
   * Update existing shift
   */
  async updateShift(id: string, shiftData: UpdateShiftDto): Promise<ShiftResponseDto> {
    const response = await this.shiftsApi.shiftsControllerUpdate(id, shiftData);
    return response.data;
  }

  /**
   * Delete shift (soft delete)
   */
  async deleteShift(id: string): Promise<void> {
    await this.shiftsApi.shiftsControllerRemove(id);
  }

  /**
   * Hard delete shift (permanent)
   */
  async hardDeleteShift(id: string): Promise<void> {
    await this.shiftsApi.shiftsControllerHardRemove(id);
  }

  /**
   * Restore a deleted shift
   */
  async restoreShift(id: string): Promise<ShiftResponseDto> {
    const response = await this.shiftsApi.shiftsControllerRestore(id);
    return response.data;
  }

  /**
   * Get shifts by date range
   */
  async getShiftsByDateRange(
    startDate: string,
    endDate: string,
    organizationId?: string,
    locationId?: string
  ): Promise<ShiftResponseDto[]> {
    const response = await this.shiftsApi.shiftsControllerFindByDateRange({
      startDate,
      endDate,
      organizationId,
      locationId
    });
    return response.data;
  }

  /**
   * Get shift statistics
   */
  async getShiftStats(organizationId?: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    averageStaffing: number;
  }> {
    const response = await this.shiftsApi.shiftsControllerGetStats({ organizationId });
    const data = response.data;
    
    return {
      total: data.total ?? 0,
      active: data.active ?? 0,
      inactive: data.inactive ?? 0,
      byType: data.byType ?? {},
      byStatus: data.byStatus ?? {},
      averageStaffing: data.averageStaffing ?? 0
    };
  }

  /**
   * Get shifts by location
   */
  async getShiftsByLocation(locationId: string, options?: {
    activeOnly?: boolean;
    includeRelations?: boolean;
  }): Promise<ShiftResponseDto[]> {
    return await this.getAllShifts({
      locationId,
      activeOnly: options?.activeOnly,
      includeRelations: options?.includeRelations
    });
  }

  /**
   * Get shifts by organization
   */
  async getShiftsByOrganization(organizationId: string, options?: {
    activeOnly?: boolean;
    includeRelations?: boolean;
  }): Promise<ShiftResponseDto[]> {
    return await this.getAllShifts({
      organizationId,
      activeOnly: options?.activeOnly,
      includeRelations: options?.includeRelations
    });
  }

  /**
   * Validate shift data (client-side basic validation)
   */
  async validateShift(shiftData: CreateShiftDto | UpdateShiftDto): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    
    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if ('startTime' in shiftData && shiftData.startTime && !timeRegex.test(shiftData.startTime)) {
      errors.push('Start time must be in HH:MM format');
    }
    
    if ('endTime' in shiftData && shiftData.endTime && !timeRegex.test(shiftData.endTime)) {
      errors.push('End time must be in HH:MM format');
    }
    
    // Validate that end time is after start time
    if ('startTime' in shiftData && 'endTime' in shiftData && 
        shiftData.startTime && shiftData.endTime) {
      const startTime = new Date(`2000-01-01T${shiftData.startTime}`);
      const endTime = new Date(`2000-01-01T${shiftData.endTime}`);
      
      if (endTime <= startTime) {
        errors.push('End time must be after start time');
      }
    }
    
    // Validate employee counts
    if ('minEmployees' in shiftData && shiftData.minEmployees != null && shiftData.minEmployees < 1) {
      errors.push('Minimum employees must be at least 1');
    }
    
    if ('maxEmployees' in shiftData && 'minEmployees' in shiftData && 
        shiftData.maxEmployees != null && shiftData.minEmployees != null &&
        shiftData.maxEmployees < shiftData.minEmployees) {
      errors.push('Maximum employees must be greater than or equal to minimum employees');
    }
    
    // Validate total hours
    if ('totalHours' in shiftData && shiftData.totalHours != null && shiftData.totalHours <= 0) {
      errors.push('Total hours must be greater than 0');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Helper method to calculate shift duration from start and end time
   */
  calculateShiftDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Return hours
  }

  /**
   * Helper method to format shift duration as string
   */
  formatShiftDuration(startTime: string, endTime: string): string {
    const duration = this.calculateShiftDuration(startTime, endTime);
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  }
}