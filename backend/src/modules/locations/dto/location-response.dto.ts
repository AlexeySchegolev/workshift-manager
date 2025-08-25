import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface TimeSlot {
  /** Start time in HH:MM format */
  start: string;
  /** End time in HH:MM format */
  end: string;
}

export interface OperatingHours {
  /** Monday operating hours */
  monday: TimeSlot[];
  /** Tuesday operating hours */
  tuesday: TimeSlot[];
  /** Wednesday operating hours */
  wednesday: TimeSlot[];
  /** Thursday operating hours */
  thursday: TimeSlot[];
  /** Friday operating hours */
  friday: TimeSlot[];
  /** Saturday operating hours */
  saturday: TimeSlot[];
  /** Sunday operating hours */
  sunday: TimeSlot[];
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
}

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

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+49 30 12345678',
    maxLength: 20,
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'berlin@company.com',
    maxLength: 255,
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Manager name',
    example: 'Anna Schmidt',
    maxLength: 255,
  })
  manager?: string;

  @ApiProperty({
    description: 'Location capacity (number of people)',
    example: 50,
    minimum: 1,
  })
  capacity: number;

  @ApiProperty({
    description: 'Operating hours for each day of the week',
    type: 'object',
    additionalProperties: true,
    example: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      saturday: [],
      sunday: []
    },
  })
  operatingHours: OperatingHours;

  @ApiProperty({
    description: 'Services provided at this location',
    type: [String],
    example: ['Nursing', 'Physical Therapy', 'Medical Consultation'],
  })
  services: string[];

  @ApiProperty({
    description: 'Equipment available at this location',
    type: [String],
    example: ['Wheelchair', 'Hospital Bed', 'Medical Monitor'],
  })
  equipment: string[];

  @ApiProperty({
    description: 'Whether the location is currently active',
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Employees assigned to this location',
    type: () => [EmployeeResponseDto],
  })
  employees: EmployeeResponseDto[];

  @ApiProperty({
    description: 'Date when the location was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the location was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}