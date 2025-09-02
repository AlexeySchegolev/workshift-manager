import { ApiProperty } from '@nestjs/swagger';
import { ShiftType } from '@/database/entities/shift.entity';
import { ShiftRoleRequirementDto } from './shift-role-requirement.dto';
import { RoleResponseDto } from '@/modules/roles/dto/role-response.dto';
import { LocationResponseDto } from '@/modules/locations/dto/location-response.dto';
import { OrganizationResponseDto } from '@/modules/organizations/dto/organization-response.dto';

export class ShiftResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the shift',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({
    description: 'Organization ID this shift belongs to',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid'
  })
  organizationId: string;

  @ApiProperty({
    description: 'Location ID where this shift takes place',
    example: '550e8400-e29b-41d4-a716-446655440002',
    format: 'uuid'
  })
  locationId: string;

  @ApiProperty({
    description: 'Shift plan ID this shift belongs to (optional)',
    example: '550e8400-e29b-41d4-a716-446655440003',
    format: 'uuid',
    required: false
  })
  shiftPlanId?: string;

  @ApiProperty({
    description: 'Name of the shift',
    example: 'Morning Shift',
    maxLength: 100
  })
  name: string;

  @ApiProperty({
    description: 'Description of the shift',
    example: 'Regular morning shift covering basic operations',
    maxLength: 500,
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Type of the shift',
    enum: ShiftType,
    example: ShiftType.MORNING
  })
  type: ShiftType;


  @ApiProperty({
    description: 'Date when the shift takes place',
    example: '2024-01-15',
    format: 'date'
  })
  shiftDate: string;

  @ApiProperty({
    description: 'Start time of the shift',
    example: '08:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the shift',
    example: '16:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
  })
  endTime: string;

  @ApiProperty({
    description: 'Break duration in minutes',
    example: 30,
    minimum: 0
  })
  breakDuration: number;

  @ApiProperty({
    description: 'Total hours for this shift',
    example: 8.0,
    minimum: 0
  })
  totalHours: number;

  @ApiProperty({
    description: 'Minimum number of employees required',
    example: 2,
    minimum: 1
  })
  minEmployees: number;

  @ApiProperty({
    description: 'Maximum number of employees allowed',
    example: 5,
    minimum: 1
  })
  maxEmployees: number;

  @ApiProperty({
    description: 'Current number of assigned employees',
    example: 3,
    minimum: 0
  })
  currentEmployees: number;


  @ApiProperty({
    description: 'Whether this shift counts as overtime',
    example: false
  })
  isOvertime: boolean;

  @ApiProperty({
    description: 'Overtime rate multiplier',
    example: 1.5,
    required: false
  })
  overtimeRate?: number;

  @ApiProperty({
    description: 'Whether this shift is on a holiday',
    example: false
  })
  isHoliday: boolean;

  @ApiProperty({
    description: 'Holiday rate multiplier',
    example: 2.0,
    required: false
  })
  holidayRate?: number;

  @ApiProperty({
    description: 'Whether this shift is on a weekend',
    example: false
  })
  isWeekend: boolean;

  @ApiProperty({
    description: 'Weekend rate multiplier',
    example: 1.25,
    required: false
  })
  weekendRate?: number;


  @ApiProperty({
    description: 'Whether this shift is active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Organization this shift belongs to',
    type: () => OrganizationResponseDto,
    required: false
  })
  organization?: OrganizationResponseDto;

  @ApiProperty({
    description: 'Location where this shift takes place',
    type: () => LocationResponseDto,
    required: false
  })
  location?: LocationResponseDto;

  @ApiProperty({
    description: 'Required roles for this shift',
    type: [RoleResponseDto],
    required: false
  })
  requiredRoles?: RoleResponseDto[];

  @ApiProperty({
    description: 'User ID who created this shift',
    example: '550e8400-e29b-41d4-a716-446655440005',
    format: 'uuid',
    required: false
  })
  createdBy?: string;

  @ApiProperty({
    description: 'User ID who last updated this shift',
    example: '550e8400-e29b-41d4-a716-446655440006',
    format: 'uuid',
    required: false
  })
  updatedBy?: string;

  @ApiProperty({
    description: 'Date when the shift was created',
    example: '2024-01-15T10:30:00Z',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date when the shift was last updated',
    example: '2024-01-15T14:45:00Z',
    format: 'date-time'
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Date when the shift was deleted (soft delete)',
    example: '2024-01-20T09:15:00Z',
    format: 'date-time',
    required: false
  })
  deletedAt?: string;

  // Virtual fields
  @ApiProperty({
    description: 'Whether the shift is fully staffed',
    example: true
  })
  isFullyStaffed: boolean;

  @ApiProperty({
    description: 'Whether the shift is over-staffed',
    example: false
  })
  isOverStaffed: boolean;

  @ApiProperty({
    description: 'Staffing percentage (current/minimum * 100)',
    example: 150.0,
    minimum: 0
  })
  staffingPercentage: number;

  @ApiProperty({
    description: 'Duration of the shift in hours',
    example: 8.0,
    minimum: 0
  })
  duration: number;

  @ApiProperty({
    description: 'Effective working hours (excluding breaks)',
    example: 7.5,
    minimum: 0
  })
  effectiveHours: number;

  @ApiProperty({
    description: 'Whether the shift is available for assignment',
    example: true
  })
  isAvailable: boolean;
}