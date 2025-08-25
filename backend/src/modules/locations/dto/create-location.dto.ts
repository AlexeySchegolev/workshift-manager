import { IsString, IsInt, IsOptional, IsEmail, IsBoolean, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TimeSlot, OperatingHours } from '../../../database/entities/location.entity';

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
    description: 'Location name', 
    example: 'Hauptstandort Berlin',
    minLength: 2,
    maxLength: 255
  })
  @IsString()
  name: string;

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
  manager?: string;

  @ApiProperty({ 
    description: 'Location capacity (number of people)',
    example: 50,
    minimum: 1,
    maximum: 1000
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  capacity: number;

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