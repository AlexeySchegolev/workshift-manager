import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  Matches, 
  IsNumber, 
  Min, 
  IsBoolean, 
  IsUUID
} from 'class-validator';
import { ShiftType } from '@/database/entities/shift.entity';

export class CreateShiftDto {
  @ApiProperty({
    description: 'Organization ID this shift belongs to',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Location ID where this shift takes place',
    example: '550e8400-e29b-41d4-a716-446655440002',
    format: 'uuid'
  })
  @IsUUID()
  locationId: string;

  @ApiProperty({
    description: 'Shift plan ID this shift belongs to (optional)',
    example: '550e8400-e29b-41d4-a716-446655440003',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsUUID()
  shiftPlanId?: string;

  @ApiProperty({
    description: 'Name of the shift',
    example: 'Morning Shift',
    maxLength: 100
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Abbreviation of the shift',
    example: 'MS',
    maxLength: 3
  })
  @IsString()
  abbreviation: string;

  @ApiProperty({
    description: 'Description of the shift',
    example: 'Regular morning shift covering basic operations',
    maxLength: 500,
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type of the shift',
    enum: ShiftType,
    example: ShiftType.MORNING
  })
  @IsEnum(ShiftType)
  type: ShiftType;


  @ApiProperty({
    description: 'Start time of the shift',
    example: '08:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format'
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the shift',
    example: '16:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format'
  })
  endTime: string;

  @ApiProperty({
    description: 'Whether this shift is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'User ID who is creating this shift',
    example: '550e8400-e29b-41d4-a716-446655440005',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}