import { IsInt, IsOptional, IsString, IsObject, Min, Max, IsUUID, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {MonthlyShiftPlanDto} from "@/modules/shift-plans/dto/monthly-shift-plan.dto";

export class CreateShiftPlanDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-string'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Shift plan name',
    example: 'December 2024 Shift Plan',
    maxLength: 255
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Shift plan description',
    example: 'Christmas period shift plan with increased staffing requirements',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Year for the shift plan',
    example: 2024,
    minimum: 2020,
    maximum: 2030
  })
  @IsInt()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiProperty({ 
    description: 'Month for the shift plan (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Start date of planning period',
    example: '2024-12-01'
  })
  @IsDateString()
  planningPeriodStart: string;

  @ApiProperty({
    description: 'End date of planning period',
    example: '2024-12-31'
  })
  @IsDateString()
  planningPeriodEnd: string;


  @ApiPropertyOptional({ 
    description: 'Monthly shift plan data structure',
    type: 'object',
    additionalProperties: true,
    example: {
      '01.12.2024': {
        'F': ['employee-uuid-1', 'employee-uuid-2'],
        'S': ['employee-uuid-3'],
        'FS': ['employee-uuid-4']
      },
      '02.12.2024': {
        'F': ['employee-uuid-2', 'employee-uuid-5'],
        'S': ['employee-uuid-1']
      }
    }
  })
  @IsOptional()
  @IsObject()
  planData?: MonthlyShiftPlanDto;


  @ApiPropertyOptional({
    description: 'Total number of shifts in the plan',
    example: 150,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalShifts?: number;

  @ApiPropertyOptional({
    description: 'Total hours in the shift plan',
    example: 1200.50
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  totalHours?: number;

  @ApiPropertyOptional({
    description: 'Total number of employees in the plan',
    example: 25,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalEmployees?: number;

  @ApiPropertyOptional({
    description: 'Coverage percentage',
    example: 95.5,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  coveragePercentage?: number;



  @ApiPropertyOptional({
    description: 'ID of user who created this shift plan',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
