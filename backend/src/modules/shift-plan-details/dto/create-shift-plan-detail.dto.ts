import { IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftPlanDetailDto {
  @ApiProperty({ description: 'Shift plan UUID', format: 'uuid' })
  @IsUUID()
  shiftPlanId: string;

  @ApiProperty({ description: 'Employee UUID', format: 'uuid' })
  @IsUUID()
  employeeId: string;

  @ApiProperty({ description: 'Shift UUID', format: 'uuid' })
  @IsUUID()
  shiftId: string;

  @ApiProperty({ description: 'Day of the month', minimum: 1, maximum: 31, example: 15 })
  @IsInt()
  @Min(1)
  @Max(31)
  day: number;
}