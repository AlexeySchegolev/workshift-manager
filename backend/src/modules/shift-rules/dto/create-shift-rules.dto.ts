import { IsInt, IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShiftRulesDto {
  @ApiProperty({ 
    description: 'Minimum number of nurses required per shift',
    example: 2,
    minimum: 1,
    maximum: 20
  })
  @IsInt()
  @Min(1)
  @Max(20)
  minNursesPerShift: number;

  @ApiProperty({ 
    description: 'Minimum number of nurse managers required per shift',
    example: 1,
    minimum: 0,
    maximum: 10
  })
  @IsInt()
  @Min(0)
  @Max(10)
  minNurseManagersPerShift: number;

  @ApiProperty({ 
    description: 'Minimum number of helpers required',
    example: 1,
    minimum: 0,
    maximum: 10
  })
  @IsInt()
  @Min(0)
  @Max(10)
  minHelpers: number;

  @ApiProperty({ 
    description: 'Maximum number of Saturdays an employee can work per month',
    example: 2,
    minimum: 0,
    maximum: 5
  })
  @IsInt()
  @Min(0)
  @Max(5)
  maxSaturdaysPerMonth: number;

  @ApiProperty({ 
    description: 'Maximum number of consecutive same shifts',
    example: 3,
    minimum: 1,
    maximum: 10
  })
  @IsInt()
  @Min(1)
  @Max(10)
  maxConsecutiveSameShifts: number;

  @ApiProperty({ 
    description: 'Weekly hours overflow tolerance in hours',
    example: 5.0,
    minimum: 0,
    maximum: 20
  })
  @IsNumber()
  @Min(0)
  @Max(20)
  weeklyHoursOverflowTolerance: number;

  @ApiProperty({ 
    description: 'Minimum rest hours between shifts',
    example: 11,
    minimum: 8,
    maximum: 24
  })
  @IsInt()
  @Min(8)
  @Max(24)
  minRestHoursBetweenShifts: number;

  @ApiProperty({ 
    description: 'Maximum consecutive working days',
    example: 6,
    minimum: 1,
    maximum: 14
  })
  @IsInt()
  @Min(1)
  @Max(14)
  maxConsecutiveWorkingDays: number;

  @ApiPropertyOptional({ 
    description: 'Whether this rule set is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'User ID who created this rule set'
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ 
    description: 'Description of this rule set',
    example: 'Standard shift rules for regular operations',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  description?: string;
}