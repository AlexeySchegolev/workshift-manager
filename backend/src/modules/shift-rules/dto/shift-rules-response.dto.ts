import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShiftRulesResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the shift rules',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Minimum number of nurses required per shift',
    example: 2,
    minimum: 1,
    maximum: 20,
    default: 2,
  })
  minNursesPerShift: number;

  @ApiProperty({
    description: 'Minimum number of nurse managers required per shift',
    example: 1,
    minimum: 0,
    maximum: 10,
    default: 1,
  })
  minNurseManagersPerShift: number;

  @ApiProperty({
    description: 'Minimum number of helpers required',
    example: 1,
    minimum: 0,
    maximum: 10,
    default: 1,
  })
  minHelpers: number;

  @ApiProperty({
    description: 'Maximum number of Saturdays an employee can work per month',
    example: 2,
    minimum: 0,
    maximum: 5,
    default: 2,
  })
  maxSaturdaysPerMonth: number;

  @ApiProperty({
    description: 'Maximum number of consecutive same shifts',
    example: 3,
    minimum: 1,
    maximum: 10,
    default: 3,
  })
  maxConsecutiveSameShifts: number;

  @ApiProperty({
    description: 'Weekly hours overflow tolerance in hours',
    example: 5.0,
    minimum: 0,
    maximum: 20,
    default: 5.0,
  })
  weeklyHoursOverflowTolerance: number;

  @ApiProperty({
    description: 'Minimum rest hours between shifts',
    example: 11,
    minimum: 8,
    maximum: 24,
    default: 11,
  })
  minRestHoursBetweenShifts: number;

  @ApiProperty({
    description: 'Maximum consecutive working days',
    example: 6,
    minimum: 1,
    maximum: 14,
    default: 6,
  })
  maxConsecutiveWorkingDays: number;

  @ApiProperty({
    description: 'Whether this rule set is active',
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'User ID who created this rule set',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Description of this rule set',
    example: 'Standard shift rules for regular operations',
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    description: 'Date when the shift rules were created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the shift rules were last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}