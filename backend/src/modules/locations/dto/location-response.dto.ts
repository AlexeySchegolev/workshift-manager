import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeResponseDto } from '../../employees/dto/employee-response.dto';
import { LocationStatsDto } from './location-stats.dto';
import {LocationStatus} from "@/database/entities/location.entity";

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


export class LocationResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the location',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-string'
  })
  organizationId: string;

  @ApiProperty({
    description: 'Location name',
    example: 'Berlin Office',
    maxLength: 255,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Short identifier code for location',
    example: 'BER-01'
  })
  code?: string;

  @ApiPropertyOptional({
    description: 'Description of the location',
    example: 'Hauptstandort mit vollständiger Dialyse-Ausstattung'
  })
  description?: string;

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
    description: 'State or region',
    example: 'Berlin'
  })
  state?: string;

  @ApiProperty({
    description: 'Country',
    example: 'Germany'
  })
  country: string;


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



  @ApiProperty({
    description: 'Current capacity (number of people currently)',
    example: 25,
    minimum: 0,
  })
  currentCapacity: number;

  @ApiProperty({
    description: 'Location status',
    enum: LocationStatus,
    example: LocationStatus.ACTIVE
  })
  status: LocationStatus;



  @ApiProperty({
    description: 'Timezone for this location',
    example: 'Europe/Berlin'
  })
  timezone: string;

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

  @ApiPropertyOptional({
    description: 'ID of user who created this location',
    example: 'uuid-string'
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'ID of user who last updated this location',
    example: 'uuid-string'
  })
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Deletion timestamp (soft delete)',
    example: '2024-01-15T10:30:00Z'
  })
  deletedAt?: Date;

  @ApiPropertyOptional({
    description: 'Location statistics and metrics',
    type: () => LocationStatsDto
  })
  stats?: LocationStatsDto;
}