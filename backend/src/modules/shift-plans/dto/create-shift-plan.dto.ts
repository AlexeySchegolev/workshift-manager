import { IsInt, IsOptional, IsBoolean, IsString, IsObject, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MonthlyShiftPlan } from '@/database/entities';

export class CreateShiftPlanDto {
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
  planData?: MonthlyShiftPlan;

  @ApiPropertyOptional({ 
    description: 'Whether this shift plan is published',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ 
    description: 'User ID who created this shift plan'
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class GenerateShiftPlanDto {
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

  @ApiPropertyOptional({ 
    description: 'Specific employee IDs to include in planning (if not provided, all active employees will be used)',
    type: [String],
    example: ['employee-uuid-1', 'employee-uuid-2', 'employee-uuid-3']
  })
  @IsOptional()
  @IsString({ each: true })
  employeeIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Whether to use relaxed rules during planning',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  useRelaxedRules?: boolean;

  @ApiPropertyOptional({ 
    description: 'Shift rules ID to use for planning (if not provided, default active rules will be used)'
  })
  @IsOptional()
  @IsString()
  shiftRulesId?: string;

  @ApiPropertyOptional({ 
    description: 'Location ID to generate plan for (if not provided, all locations will be considered)'
  })
  @IsOptional()
  @IsInt()
  locationId?: number;

  @ApiPropertyOptional({ 
    description: 'User ID who is generating this shift plan'
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class ValidateShiftPlanDto {
  @ApiProperty({ 
    description: 'Year for validation',
    example: 2024
  })
  @IsInt()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiProperty({ 
    description: 'Month for validation (1-12)',
    example: 12
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ 
    description: 'Monthly shift plan data to validate',
    type: 'object',
    additionalProperties: true
  })
  @IsObject()
  planData: MonthlyShiftPlan;

  @ApiProperty({ 
    description: 'Employee IDs involved in the plan',
    type: [String]
  })
  @IsString({ each: true })
  employeeIds: string[];

  @ApiPropertyOptional({ 
    description: 'Shift rules ID to validate against (if not provided, default active rules will be used)'
  })
  @IsOptional()
  @IsString()
  shiftRulesId?: string;
}