import { Shifts } from '@/api/Shifts';
import { HttpClient } from '@/api/http-client';
import { ShiftResponseDto, CreateShiftDto, UpdateShiftDto } from '@/api/data-contracts';

export class ShiftService {
  private shiftsApi: Shifts;

  constructor() {
    const httpClient = new HttpClient({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    });
    this.shiftsApi = new Shifts(httpClient);
  }

  /**
   * Get all shifts
   */
  async getAllShifts(options?: {
    organizationId?: string;
    locationId?: string;
    activeOnly?: boolean;
    includeRelations?: boolean;
  }): Promise<ShiftResponseDto[]> {
    try {
      const response = await this.shiftsApi.shiftsControllerFindAll(options);
      return response.data;
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  }

  /**
   * Get shift by ID
   */
  async getShiftById(id: string, includeRelations = false): Promise<ShiftResponseDto> {
    try {
      const response = await this.shiftsApi.shiftsControllerFindOne(id, { includeRelations });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift:', error);
      throw error;
    }
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
    try {
      const response = await this.shiftsApi.shiftsControllerFindByDateRange({
        startDate,
        endDate,
        organizationId,
        locationId,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shifts by date range:', error);
      throw error;
    }
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
    try {
      const response = await this.shiftsApi.shiftsControllerGetStats({ organizationId });
      return response.data as any;
    } catch (error) {
      console.error('Error fetching shift statistics:', error);
      throw error;
    }
  }

  /**
   * Create a new shift
   */
  async createShift(shiftData: CreateShiftDto): Promise<ShiftResponseDto> {
    try {
      const response = await this.shiftsApi.shiftsControllerCreate(shiftData);
      return response.data;
    } catch (error) {
      console.error('Error creating shift:', error);
      throw error;
    }
  }

  /**
   * Update an existing shift
   */
  async updateShift(id: string, shiftData: UpdateShiftDto): Promise<ShiftResponseDto> {
    try {
      const response = await this.shiftsApi.shiftsControllerUpdate(id, shiftData);
      return response.data;
    } catch (error) {
      console.error('Error updating shift:', error);
      throw error;
    }
  }

  /**
   * Delete a shift (soft delete)
   */
  async deleteShift(id: string): Promise<void> {
    try {
      await this.shiftsApi.shiftsControllerRemove(id);
    } catch (error) {
      console.error('Error deleting shift:', error);
      throw error;
    }
  }

  /**
   * Hard delete a shift (permanent)
   */
  async hardDeleteShift(id: string): Promise<void> {
    try {
      await this.shiftsApi.shiftsControllerHardRemove(id);
    } catch (error) {
      console.error('Error hard deleting shift:', error);
      throw error;
    }
  }

  /**
   * Restore a deleted shift
   */
  async restoreShift(id: string): Promise<ShiftResponseDto> {
    try {
      const response = await this.shiftsApi.shiftsControllerRestore(id);
      return response.data;
    } catch (error) {
      console.error('Error restoring shift:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const shiftService = new ShiftService();