import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationStatus } from '@/database/entities';
import { EmployeeResponseDto } from '../../employees/dto/employee-response.dto';
import { LocationStatsDto } from './location-stats.dto';

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
    description: 'Latitude coordinate',
    example: 52.5200
  })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: 13.4050
  })
  longitude?: number;

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
    example: 'Anna Schmidt'
  })
  managerName?: string;

  @ApiPropertyOptional({
    description: 'Manager email address',
    example: 'anna.schmidt@workshift.de'
  })
  managerEmail?: string;

  @ApiPropertyOptional({
    description: 'Manager phone number',
    example: '+49 30 12345679'
  })
  managerPhone?: string;

  @ApiProperty({
    description: 'Maximum capacity (number of people)',
    example: 50,
    minimum: 1,
  })
  maxCapacity: number;

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

  @ApiPropertyOptional({
    description: 'Floor area in square meters',
    example: 250.5
  })
  floorArea?: number;

  @ApiPropertyOptional({
    description: 'Number of rooms',
    example: 12
  })
  numberOfRooms?: number;

  @ApiPropertyOptional({
    description: 'Number of beds',
    example: 25
  })
  numberOfBeds?: number;

  @ApiPropertyOptional({
    description: 'Number of parking spaces',
    example: 30
  })
  parkingSpaces?: number;

  @ApiProperty({
    description: 'Accessibility features available',
    example: ['Rollstuhlzugang', 'Aufzug', 'Behindertengerechte Toiletten'],
    type: [String]
  })
  accessibilityFeatures: string[];

  @ApiProperty({
    description: 'Safety features available',
    example: ['Brandmeldeanlage', 'Notausgang', 'Erste-Hilfe-Station'],
    type: [String]
  })
  safetyFeatures: string[];

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