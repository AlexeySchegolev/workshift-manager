import { Shifts } from '@/api/Shifts';
import { ShiftResponseDto, CreateShiftDto, UpdateShiftDto } from '@/api/data-contracts';
import { BaseService } from './BaseService';

export class ShiftService extends BaseService {
  private shiftsApi: Shifts;

  constructor() {
    super();
    this.shiftsApi = new Shifts(this.getHttpClient());
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
      throw error;
    }
  }

  /**
   * Get shifts by location ID
   */
  async getShiftsByLocationId(locationId: string, options?: {
    activeOnly?: boolean;
    includeRelations?: boolean;
  }): Promise<ShiftResponseDto[]> {
    try {
      // Note: This will use the new dedicated endpoint once the frontend API is regenerated
      // For now, we use the existing findAll method with locationId filter
      const response = await this.shiftsApi.shiftsControllerFindAll({
        locationId,
        ...options
      });
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }
}

// Export singleton instance
export const shiftService = new ShiftService();