import { ShiftWeekday } from '../../../database/entities/shift-weekday.entity';

export class ShiftWeekdayResponseDto {
  id: string;
  shiftId: string;
  weekday: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(shiftWeekday: ShiftWeekday) {
    this.id = shiftWeekday.id;
    this.shiftId = shiftWeekday.shiftId;
    this.weekday = shiftWeekday.weekday;
    this.createdAt = shiftWeekday.createdAt;
    this.updatedAt = shiftWeekday.updatedAt;
  }
}