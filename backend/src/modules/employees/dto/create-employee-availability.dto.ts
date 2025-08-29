import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsDate, IsBoolean, IsOptional, IsArray, IsNumber, Min, Max, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';
import { AvailabilityType, AvailabilityStatus, AbsenceReason, RecurrencePattern, WeeklyAvailability } from '@/database/entities';

export class CreateEmployeeAvailabilityDto {
  @ApiProperty({
    description: 'Employee ID',
    example: 'uuid-string'
  })
  @IsString()
  employeeId: string;

  @ApiProperty({
    description: 'Availability type',
    enum: AvailabilityType,
    example: AvailabilityType.AVAILABLE
  })
  @IsEnum(AvailabilityType)
  type: AvailabilityType;

  @ApiPropertyOptional({
    description: 'Availability status',
    enum: AvailabilityStatus,
    example: AvailabilityStatus.ACTIVE,
    default: AvailabilityStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(AvailabilityStatus)
  status?: AvailabilityStatus;

  @ApiProperty({
    description: 'Start date of availability period',
    type: 'string',
    format: 'date',
    example: '2024-01-15'
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({
    description: 'End date of availability period',
    type: 'string',
    format: 'date',
    example: '2024-01-20'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Start time for partial day availability (HH:MM)',
    example: '09:00'
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'End time for partial day availability (HH:MM)',
    example: '17:00'
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'All-day availability',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;

  @ApiPropertyOptional({
    description: 'Recurring availability',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({
    description: 'Recurrence pattern',
    enum: RecurrencePattern,
    example: RecurrencePattern.NONE,
    default: RecurrencePattern.NONE
  })
  @IsOptional()
  @IsEnum(RecurrencePattern)
  recurrencePattern?: RecurrencePattern;

  @ApiPropertyOptional({
    description: 'Recurrence interval (e.g. every 2 weeks)',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  recurrenceInterval?: number;

  @ApiPropertyOptional({
    description: 'Recurrence days (0=Sunday, 1=Monday, etc.)',
    type: [Number],
    example: [1, 2, 3, 4, 5]
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  recurrenceDays?: number[];

  @ApiPropertyOptional({
    description: 'End date of recurrence',
    type: 'string',
    format: 'date',
    example: '2024-12-31'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  recurrenceEndDate?: Date;

  @ApiPropertyOptional({
    description: 'Reason for absence',
    enum: AbsenceReason,
    example: AbsenceReason.VACATION
  })
  @IsOptional()
  @IsEnum(AbsenceReason)
  absenceReason?: AbsenceReason;

  @ApiPropertyOptional({
    description: 'Detailed reason description',
    example: 'Doctor appointment in the morning'
  })
  @IsOptional()
  @IsString()
  reasonDescription?: string;

  @ApiPropertyOptional({
    description: 'Weekly availability times',
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  @IsJSON()
  weeklyAvailability?: WeeklyAvailability;

  @ApiPropertyOptional({
    description: 'Maximum hours per day',
    example: 8.0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHoursPerDay?: number;

  @ApiPropertyOptional({
    description: 'Maximum hours per week',
    example: 40.0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHoursPerWeek?: number;

  @ApiPropertyOptional({
    description: 'Preferred shift types',
    type: [String],
    example: ['F', 'S'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredShiftTypes?: string[];

  @ApiPropertyOptional({
    description: 'Excluded shift types',
    type: [String],
    example: ['N'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedShiftTypes?: string[];

  @ApiPropertyOptional({
    description: 'Preferred locations',
    type: [String],
    example: ['location-uuid-1', 'location-uuid-2'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLocations?: string[];

  @ApiPropertyOptional({
    description: 'Excluded locations',
    type: [String],
    example: ['location-uuid-3'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedLocations?: string[];

  @ApiPropertyOptional({
    description: 'Priority level (1-5, higher = more important)',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priorityLevel?: number;

  @ApiPropertyOptional({
    description: 'Requires approval',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiPropertyOptional({
    description: 'Emergency',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;

  @ApiPropertyOptional({
    description: 'Affects payroll',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  affectsPayroll?: boolean;

  @ApiPropertyOptional({
    description: 'Documentation required',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  documentationRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Documentation provided',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  documentationProvided?: boolean;

  @ApiPropertyOptional({
    description: 'Attached documents (URLs or IDs)',
    type: [String],
    example: [],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachedDocuments?: string[];

  @ApiPropertyOptional({
    description: 'Notes',
    example: 'Additional information'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Internal notes (only visible to managers)',
    example: 'Internal remarks'
  })
  @IsOptional()
  @IsString()
  internalNotes?: string;
}