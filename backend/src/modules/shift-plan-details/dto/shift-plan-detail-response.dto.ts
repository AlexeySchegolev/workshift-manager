import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShiftPlanDetailResponseDto {
  @ApiProperty({ description: 'Shift plan detail UUID', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Shift plan UUID', format: 'uuid' })
  shiftPlanId: string;

  @ApiProperty({ description: 'User UUID', format: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Shift UUID', format: 'uuid' })
  shiftId: string;

  @ApiProperty({ description: 'Day of the month', minimum: 1, maximum: 31 })
  day: number;

  @ApiPropertyOptional({ description: 'Created by user UUID', format: 'uuid' })
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Updated by user UUID', format: 'uuid' })
  updatedBy?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Deletion timestamp' })
  deletedAt?: Date;

  @ApiProperty({ description: 'Whether the shift plan detail is active' })
  isActive: boolean;

  // Related data
  @ApiPropertyOptional({ description: 'Shift plan information' })
  shiftPlan?: {
    id: string;
    name: string;
    year: number;
    month: number;
  };

  @ApiPropertyOptional({ description: 'User information' })
  user?: {
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
    type: string;
    startTime: string;
    endTime: string;
    duration: number;
  };
}