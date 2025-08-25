import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeRole } from '../../../database/entities/employee.entity';

export class LocationResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the location',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Location name',
    example: 'Berlin Office',
    maxLength: 255,
  })
  name: string;

  @ApiProperty({
    description: 'Location address',
    example: 'Musterstraße 123',
    maxLength: 500,
  })
  address: string;

  @ApiProperty({
    description: 'City where the location is situated',
    example: 'Berlin',
    maxLength: 100,
  })
  city: string;

  @ApiProperty({
    description: 'Postal code',
    example: '10115',
    maxLength: 10,
  })
  postalCode: string;
}

export class ShiftAssignmentResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the shift assignment',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;
}

export class EmployeeResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the employee',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Employee name',
    example: 'Max Mustermann',
    minLength: 2,
    maxLength: 255,
  })
  name: string;

  @ApiProperty({
    description: 'Employee role',
    enum: EmployeeRole,
    example: EmployeeRole.ASSISTANT,
  })
  role: EmployeeRole;

  @ApiProperty({
    description: 'Hours per month the employee should work',
    example: 160,
    minimum: 1,
    maximum: 300,
  })
  hoursPerMonth: number;

  @ApiPropertyOptional({
    description: 'Hours per week (optional)',
    example: 40,
    minimum: 1,
    maximum: 60,
  })
  hoursPerWeek?: number;

  @ApiPropertyOptional({
    description: 'Location ID where employee is assigned',
    example: 1,
  })
  locationId?: number;

  @ApiPropertyOptional({
    description: 'Location where the employee is assigned',
    type: () => LocationResponseDto,
  })
  location?: LocationResponseDto;

  @ApiProperty({
    description: 'Shift assignments for this employee',
    type: () => [ShiftAssignmentResponseDto],
  })
  shiftAssignments: ShiftAssignmentResponseDto[];

  @ApiProperty({
    description: 'Date when the employee was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the employee was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}