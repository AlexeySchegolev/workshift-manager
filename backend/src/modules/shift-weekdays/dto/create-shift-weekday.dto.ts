import { IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateShiftWeekdayDto {
  @IsUUID()
  shiftId: string;

  @IsInt()
  @Min(0)
  @Max(6)
  weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  @IsOptional()
  @IsUUID()
  createdBy?: string;
}