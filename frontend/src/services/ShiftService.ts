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
}

// Export singleton instance
export const shiftService = new ShiftService();