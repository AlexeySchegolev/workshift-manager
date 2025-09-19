import { BaseService } from './BaseService';
import { ShiftWeekdays } from '../api/ShiftWeekdays';
import { CreateShiftWeekdayDto } from '../api/data-contracts';

// Temporary interface until backend generates proper types
export interface ShiftWeekdayResponseDto {
  id: string;
  shiftId: string;
  weekday: number;
  createdAt: string;
  updatedAt: string;
}

export class ShiftWeekdaysService extends BaseService {
  private shiftWeekdaysApi: ShiftWeekdays<unknown>;

  constructor() {
    super();
    this.shiftWeekdaysApi = new ShiftWeekdays(this.getHttpClient());
  }

  async createShiftWeekday(data: CreateShiftWeekdayDto): Promise<void> {
    await this.shiftWeekdaysApi.shiftWeekdaysControllerCreate(data);
  }

  async getShiftWeekdaysByShiftId(shiftId: string): Promise<ShiftWeekdayResponseDto[]> {
    try {
      const response = await this.getHttpClient().request({
        path: `/api/shift-weekdays?shiftId=${shiftId}`,
        method: 'GET'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift weekdays by shift ID:', error);
      return [];
    }
  }

  async getShiftWeekdaysByLocationId(locationId: string): Promise<any[]> {
    try {
      const response = await this.getHttpClient().request({
        path: `/api/shift-weekdays?locationId=${locationId}&includeRelations=true`,
        method: 'GET'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift weekdays by location ID:', error);
      return [];
    }
  }

  async getAllShiftWeekdays(): Promise<ShiftWeekdayResponseDto[]> {
    try {
      const response = await this.getHttpClient().request({
        path: '/api/shift-weekdays',
        method: 'GET'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all shift weekdays:', error);
      return [];
    }
  }

  async updateShiftWeekday(id: string, data: Partial<CreateShiftWeekdayDto>): Promise<void> {
    await this.shiftWeekdaysApi.shiftWeekdaysControllerUpdate(id, data);
  }

  async deleteShiftWeekday(id: string): Promise<void> {
    await this.shiftWeekdaysApi.shiftWeekdaysControllerRemove(id);
  }

  async deleteShiftWeekdaysByShiftId(shiftId: string): Promise<void> {
    await this.shiftWeekdaysApi.shiftWeekdaysControllerRemoveByShiftId(shiftId);
  }
}

export const shiftWeekdaysService = new ShiftWeekdaysService();