import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  Matches, 
  IsNumber, 
  Min, 
  Max, 
  IsArray, 
  IsBoolean, 
  ValidateNested,
  IsUUID
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShiftType, ShiftStatus, ShiftPriority } from '@/database/entities/shift.entity';
import { ShiftRoleRequirementDto } from './shift-role-requirement.dto';

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
    description: 'Current status of the shift',
    enum: ShiftStatus,
    example: ShiftStatus.DRAFT,
    default: ShiftStatus.DRAFT
  })
  @IsOptional()
  @IsEnum(ShiftStatus)
  status?: ShiftStatus = ShiftStatus.DRAFT;

  @ApiProperty({
    description: 'Priority level of the shift',
    enum: ShiftPriority,
    example: ShiftPriority.NORMAL,
    default: ShiftPriority.NORMAL
  })
  @IsOptional()
  @IsEnum(ShiftPriority)
  priority?: ShiftPriority = ShiftPriority.NORMAL;

  @ApiProperty({
    description: 'Date when the shift takes place',
    example: '2024-01-15',
    format: 'date'
  })
  @IsDateString()
  shiftDate: string;

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
    description: 'Break duration in minutes',
    example: 30,
    minimum: 0,
    default: 30
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  breakDuration?: number = 30;

  @ApiProperty({
    description: 'Total hours for this shift',
    example: 8.0,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  totalHours: number;

  @ApiProperty({
    description: 'Minimum number of employees required',
    example: 2,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minEmployees?: number = 1;

  @ApiProperty({
    description: 'Maximum number of employees allowed',
    example: 5,
    minimum: 1,
    default: 10
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxEmployees?: number = 10;

  @ApiProperty({
    description: 'Role requirements for this shift',
    type: [ShiftRoleRequirementDto],
    example: [
      {
        roleId: '550e8400-e29b-41d4-a716-446655440004',
        requiredCount: 2,
        minCount: 1,
        maxCount: 3,
        priority: 3
      }
    ],
    default: []
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShiftRoleRequirementDto)
  roleRequirements?: ShiftRoleRequirementDto[] = [];

  @ApiProperty({
    description: 'Required skills for this shift',
    type: [String],
    example: ['CPR', 'First Aid', 'Patient Care'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[] = [];

  @ApiProperty({
    description: 'Required certifications for this shift',
    type: [String],
    example: ['Nursing License', 'BLS Certification'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredCertifications?: string[] = [];

  @ApiProperty({
    description: 'Whether this shift counts as overtime',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isOvertime?: boolean = false;

  @ApiProperty({
    description: 'Overtime rate multiplier',
    example: 1.5,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  overtimeRate?: number;

  @ApiProperty({
    description: 'Whether this shift is on a holiday',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isHoliday?: boolean = false;

  @ApiProperty({
    description: 'Holiday rate multiplier',
    example: 2.0,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  holidayRate?: number;

  @ApiProperty({
    description: 'Whether this shift is on a weekend',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isWeekend?: boolean = false;

  @ApiProperty({
    description: 'Weekend rate multiplier',
    example: 1.25,
    minimum: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  weekendRate?: number;

  @ApiProperty({
    description: 'Color code for UI display (hex format)',
    example: '#FF5722',
    pattern: '^#[0-9A-F]{6}$',
    required: false
  })
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, {
    message: 'Color code must be in hex format (#RRGGBB)'
  })
  colorCode?: string;

  @ApiProperty({
    description: 'Additional notes for this shift',
    example: 'Special requirements: Extra attention to patient in room 204',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Whether this is a recurring shift',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean = false;

  @ApiProperty({
    description: 'Recurrence pattern (e.g., weekly, monthly)',
    example: 'weekly',
    required: false
  })
  @IsOptional()
  @IsString()
  recurrencePattern?: string;

  @ApiProperty({
    description: 'End date for recurrence',
    example: '2024-12-31',
    format: 'date',
    required: false
  })
  @IsOptional()
  @IsDateString()
  recurrenceEndDate?: string;

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