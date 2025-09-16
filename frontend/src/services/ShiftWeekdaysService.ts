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
    // Mock implementation - return empty array for now
    return [];
  }

  async getAllShiftWeekdays(): Promise<ShiftWeekdayResponseDto[]> {
    // Mock implementation - return empty array for now
    return [];
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