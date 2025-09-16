import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShiftPlanDetailResponseDto {
  @ApiProperty({ description: 'Shift plan detail UUID', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Shift plan UUID', format: 'uuid' })
  shiftPlanId: string;

  @ApiProperty({ description: 'Employee UUID', format: 'uuid' })
  employeeId: string;

  @ApiProperty({ description: 'Shift UUID', format: 'uuid' })
  shiftId: string;

  @ApiProperty({ description: 'Day of the month', minimum: 1, maximum: 31 })
  day: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  // Related data
  @ApiPropertyOptional({ description: 'Shift plan information' })
  shiftPlan?: {
    id: string;
    name: string;
    year: number;
    month: number;
  };

  @ApiPropertyOptional({ description: 'Employee information' })
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
  };

  @ApiPropertyOptional({ description: 'Shift information' })
  shift?: {
    id: string;
    name: string;
    shortName: string;
    startTime: string;
    endTime: string;
    duration: number;
  };
}