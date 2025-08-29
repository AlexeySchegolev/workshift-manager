import { IsString, IsInt, IsOptional, IsEmail, IsBoolean, IsArray, ValidateNested, Min, Max, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {LocationStatus, OperatingHours, TimeSlot} from "@/database/entities/location.entity";

class TimeSlotDto implements TimeSlot {
  @ApiProperty({ 
    description: 'Start time in HH:MM format',
    example: '09:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
  })
  @IsString()
  start: string;

  @ApiProperty({ 
    description: 'End time in HH:MM format',
    example: '17:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
  })
  @IsString()
  end: string;
}

class OperatingHoursDto implements OperatingHours {
  @ApiPropertyOptional({ 
    description: 'Monday operating hours',
    type: [TimeSlotDto],
    default: []
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  monday: TimeSlot[];

  @ApiPropertyOptional({ 
    description: 'Tuesday operating hours',
    type: [TimeSlotDto],
    default: []
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  tuesday: TimeSlot[];

  @ApiPropertyOptional({ 
    description: 'Wednesday operating hours',
    type: [TimeSlotDto],
    default: []
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  wednesday: TimeSlot[];

  @ApiPropertyOptional({ 
    description: 'Thursday operating hours',
    type: [TimeSlotDto],
    default: []
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  thursday: TimeSlot[];

  @ApiPropertyOptional({ 
    description: 'Friday operating hours',
    type: [TimeSlotDto],
    default: []
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  friday: TimeSlot[];

  @ApiPropertyOptional({ 
    description: 'Saturday operating hours',
    type: [TimeSlotDto],
    default: []
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  saturday: TimeSlot[];

  @ApiPropertyOptional({ 
    description: 'Sunday operating hours',
    type: [TimeSlotDto],
    default: []
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  sunday: TimeSlot[];
}

export class CreateLocationDto {
  @ApiProperty({
    description: 'ID der Organisation',
    example: 'uuid-string'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({ 
    description: 'Location name', 
    example: 'Hauptstandort Berlin',
    minLength: 2,
    maxLength: 255
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Short identifier code for location',
    example: 'BER-01',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Description of the location',
    example: 'Hauptstandort mit vollständiger Dialyse-Ausstattung',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Street address',
    example: 'Musterstraße 123',
    maxLength: 500
  })
  @IsString()
  address: string;

  @ApiProperty({ 
    description: 'City name',
    example: 'Berlin',
    maxLength: 100
  })
  @IsString()
  city: string;

  @ApiProperty({ 
    description: 'Postal code',
    example: '10115',
    maxLength: 10
  })
  @IsString()
  postalCode: string;

  @ApiPropertyOptional({
    description: 'State or region',
    example: 'Berlin',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Germany',
    default: 'Germany',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    example: 52.5200
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate', 
    example: 13.4050
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 8 })
  longitude?: number;

  @ApiPropertyOptional({ 
    description: 'Phone number',
    example: '+49 30 12345678',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Email address',
    example: 'berlin@workshift.de',
    maxLength: 255
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Manager name',
    example: 'Max Mustermann',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  managerName?: string;

  @ApiPropertyOptional({
    description: 'Manager email address',
    example: 'max.mustermann@workshift.de',
    maxLength: 255
  })
  @IsOptional()
  @IsEmail()
  managerEmail?: string;

  @ApiPropertyOptional({
    description: 'Manager phone number',
    example: '+49 30 12345679',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  managerPhone?: string;

  @ApiProperty({ 
    description: 'Maximum location capacity (number of people)',
    example: 50,
    minimum: 1,
    maximum: 2000
  })
  @IsInt()
  @Min(1)
  @Max(2000)
  maxCapacity: number;

  @ApiPropertyOptional({
    description: 'Current capacity usage',
    example: 35,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentCapacity?: number;

  @ApiPropertyOptional({
    description: 'Location status',
    enum: LocationStatus,
    example: LocationStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(LocationStatus)
  status?: LocationStatus;

  @ApiPropertyOptional({
    description: 'Floor area in square meters',
    example: 250.5
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  floorArea?: number;

  @ApiPropertyOptional({
    description: 'Number of rooms',
    example: 12,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfRooms?: number;

  @ApiPropertyOptional({
    description: 'Number of beds',
    example: 25,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfBeds?: number;

  @ApiPropertyOptional({
    description: 'Number of parking spaces',
    example: 30,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  parkingSpaces?: number;

  @ApiPropertyOptional({
    description: 'Accessibility features available',
    example: ['Rollstuhlzugang', 'Aufzug', 'Behindertengerechte Toiletten'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessibilityFeatures?: string[];

  @ApiPropertyOptional({
    description: 'Safety features available',
    example: ['Brandmeldeanlage', 'Notausgang', 'Erste-Hilfe-Station'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  safetyFeatures?: string[];

  @ApiPropertyOptional({
    description: 'Timezone for this location',
    example: 'Europe/Berlin',
    default: 'Europe/Berlin',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ 
    description: 'Operating hours for each day of the week',
    type: OperatingHoursDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OperatingHoursDto)
  operatingHours?: OperatingHours;

  @ApiPropertyOptional({ 
    description: 'Services provided at this location',
    example: ['Pflege', 'Beratung', 'Therapie'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiPropertyOptional({ 
    description: 'Equipment available at this location',
    example: ['Rollstuhl', 'Patientenlift', 'Notfallausrüstung'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];

  @ApiPropertyOptional({ 
    description: 'Whether the location is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}