import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {MonthlyShiftPlanDto} from "@/modules/shift-plans/dto/monthly-shift-plan.dto";


export class ShiftPlanResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the shift plan',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Year for the shift plan',
    example: 2024,
    minimum: 2020,
    maximum: 2030,
  })
  year: number;

  @ApiProperty({
    description: 'Month for the shift plan (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12,
  })
  month: number;

  @ApiPropertyOptional({
    description: 'Shift plan data organized by date and shift',
    type: [MonthlyShiftPlanDto],
    additionalProperties: true,
    example: {
      '01.12.2024': {
        'Morning': ['employee-id-1', 'employee-id-2'],
        'Evening': ['employee-id-3', 'employee-id-4']
      },
      '02.12.2024': {
        'Morning': ['employee-id-2', 'employee-id-3'],
        'Evening': ['employee-id-1', 'employee-id-4']
      }
    },
  })
  planData: MonthlyShiftPlanDto;


  @ApiPropertyOptional({
    description: 'User ID who created this shift plan',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  createdBy?: string;


  @ApiProperty({
    description: 'Date when the shift plan was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the shift plan was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}