import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    AbsenceReason,
    AvailabilityStatus,
    AvailabilityType,
    RecurrencePattern, WeeklyAvailability
} from "@/database/entities/employee-availability.entity";

export class EmployeeAvailabilityResponseDto {
  @ApiProperty({
    description: 'Unique ID of availability record',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({
    description: 'Employee ID',
    example: 'uuid-string'
  })
  employeeId: string;

  @ApiProperty({
    description: 'Availability type',
    enum: AvailabilityType,
    example: AvailabilityType.AVAILABLE
  })
  type: AvailabilityType;

  @ApiProperty({
    description: 'Availability status',
    enum: AvailabilityStatus,
    example: AvailabilityStatus.ACTIVE
  })
  status: AvailabilityStatus;

  @ApiProperty({
    description: 'Start date of availability period',
    type: 'string',
    format: 'date',
    example: '2024-01-15'
  })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'End date of availability period',
    type: 'string',
    format: 'date',
    example: '2024-01-20'
  })
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Start time for partial day availability (HH:MM)',
    example: '09:00'
  })
  startTime?: string;

  @ApiPropertyOptional({
    description: 'End time for partial day availability (HH:MM)',
    example: '17:00'
  })
  endTime?: string;

  @ApiProperty({
    description: 'All-day availability',
    example: true
  })
  isAllDay: boolean;

  @ApiProperty({
    description: 'Recurring availability',
    example: false
  })
  isRecurring: boolean;

  @ApiProperty({
    description: 'Recurrence pattern',
    enum: RecurrencePattern,
    example: RecurrencePattern.NONE
  })
  recurrencePattern: RecurrencePattern;

  @ApiProperty({
    description: 'Recurrence interval (e.g. every 2 weeks)',
    example: 1
  })
  recurrenceInterval: number;

  @ApiProperty({
    description: 'Recurrence days (0=Sunday, 1=Monday, etc.)',
    type: [Number],
    example: [1, 2, 3, 4, 5]
  })
  recurrenceDays: number[];

  @ApiPropertyOptional({
    description: 'End date of recurrence',
    type: 'string',
    format: 'date',
    example: '2024-12-31'
  })
  recurrenceEndDate?: Date;

  @ApiPropertyOptional({
    description: 'Reason for absence',
    enum: AbsenceReason,
    example: AbsenceReason.VACATION
  })
  absenceReason?: AbsenceReason;

  @ApiPropertyOptional({
    description: 'Detailed reason description',
    example: 'Doctor appointment in the morning'
  })
  reasonDescription?: string;

  @ApiPropertyOptional({
    description: 'Weekly availability times',
    type: 'object',
    additionalProperties: true
  })
  weeklyAvailability?: WeeklyAvailability;

  @ApiPropertyOptional({
    description: 'Maximum hours per day',
    example: 8.0
  })
  maxHoursPerDay?: number;

  @ApiPropertyOptional({
    description: 'Maximum hours per week',
    example: 40.0
  })
  maxHoursPerWeek?: number;

  @ApiProperty({
    description: 'Preferred shift types',
    type: [String],
    example: ['F', 'S']
  })
  preferredShiftTypes: string[];

  @ApiProperty({
    description: 'Excluded shift types',
    type: [String],
    example: ['N']
  })
  excludedShiftTypes: string[];

  @ApiProperty({
    description: 'Preferred locations',
    type: [String],
    example: ['location-uuid-1', 'location-uuid-2']
  })
  preferredLocations: string[];

  @ApiProperty({
    description: 'Excluded locations',
    type: [String],
    example: ['location-uuid-3']
  })
  excludedLocations: string[];

  @ApiProperty({
    description: 'Priority level (1-5, higher = more important)',
    example: 1
  })
  priorityLevel: number;

  @ApiProperty({
    description: 'Requires approval',
    example: false
  })
  requiresApproval: boolean;

  @ApiPropertyOptional({
    description: 'Approved by (User ID)',
    example: 'user-uuid'
  })
  approvedBy?: string;

  @ApiPropertyOptional({
    description: 'Approval date',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z'
  })
  approvedAt?: Date;

  @ApiPropertyOptional({
    description: 'Rejected by (User ID)',
    example: 'user-uuid'
  })
  rejectedBy?: string;

  @ApiPropertyOptional({
    description: 'Rejection date',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z'
  })
  rejectedAt?: Date;

  @ApiPropertyOptional({
    description: 'Rejection reason',
    example: 'Staffing already sufficient'
  })
  rejectionReason?: string;

  @ApiPropertyOptional({
    description: 'Submission date',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T09:00:00Z'
  })
  submittedAt?: Date;

  @ApiProperty({
    description: 'Emergency',
    example: false
  })
  isEmergency: boolean;

  @ApiProperty({
    description: 'Affects payroll',
    example: false
  })
  affectsPayroll: boolean;

  @ApiProperty({
    description: 'Documentation required',
    example: false
  })
  documentationRequired: boolean;

  @ApiProperty({
    description: 'Documentation provided',
    example: false
  })
  documentationProvided: boolean;

  @ApiProperty({
    description: 'Attached documents (URLs or IDs)',
    type: [String],
    example: []
  })
  attachedDocuments: string[];

  @ApiPropertyOptional({
    description: 'Notes',
    example: 'Additional information'
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Internal notes (only visible to managers)',
    example: 'Internal remarks'
  })
  internalNotes?: string;

  @ApiProperty({
    description: 'Notification sent',
    example: false
  })
  notificationSent: boolean;

  @ApiProperty({
    description: 'Reminder sent',
    example: false
  })
  reminderSent: boolean;

  @ApiProperty({
    description: 'Is active',
    example: true
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Created by (User ID)',
    example: 'user-uuid'
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Updated by (User ID)',
    example: 'user-uuid'
  })
  updatedBy?: string;

  @ApiProperty({
    description: 'Creation date',
    type: 'string',
    format: 'date-time',
    example: '2024-01-01T00:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z'
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Deletion timestamp (Soft Delete)',
    type: 'string',
    format: 'date-time',
    example: '2023-12-31T23:59:59Z'
  })
  deletedAt?: Date;

  // Computed properties
  @ApiProperty({
    description: 'Is currently active',
    example: true
  })
  isCurrentlyActive: boolean;

  @ApiProperty({
    description: 'Duration in days',
    example: 5
  })
  duration: number;

  @ApiProperty({
    description: 'Is expired',
    example: false
  })
  isExpired: boolean;

  @ApiProperty({
    description: 'Waiting for approval',
    example: false
  })
  isPending: boolean;

  @ApiProperty({
    description: 'Needs approval',
    example: false
  })
  needsApproval: boolean;

  @ApiProperty({
    description: 'Is absence',
    example: false
  })
  isAbsence: boolean;

  @ApiProperty({
    description: 'Display name for reason',
    example: 'Available'
  })
  displayReason: string;

  @ApiProperty({
    description: 'Time range as text',
    example: '09:00 - 17:00'
  })
  timeRange: string;

  @ApiProperty({
    description: 'Date range as text',
    example: '15.01.2024 - 20.01.2024'
  })
  dateRange: string;
}