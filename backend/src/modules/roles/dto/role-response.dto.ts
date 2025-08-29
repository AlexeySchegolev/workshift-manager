import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType, RoleStatus } from '../../../database/entities/role.entity';

export class RoleResponseDto {
  @ApiProperty({ 
    description: 'Unique role ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'Organization ID', 
    example: '123e4567-e89b-12d3-a456-426614174001' 
  })
  organizationId: string;

  @ApiProperty({ 
    description: 'Role name', 
    example: 'Dialysis Specialist' 
  })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Role description', 
    example: 'Qualified specialist for performing dialysis treatments' 
  })
  description?: string;

  @ApiProperty({ 
    description: 'Role type', 
    enum: RoleType, 
    example: RoleType.SPECIALIST 
  })
  type: RoleType;

  @ApiProperty({ 
    description: 'Role status', 
    enum: RoleStatus, 
    example: RoleStatus.ACTIVE 
  })
  status: RoleStatus;

  @ApiPropertyOptional({ 
    description: 'Hourly rate in Euro', 
    example: 25.50 
  })
  hourlyRate?: number;

  @ApiPropertyOptional({ 
    description: 'Overtime rate in Euro', 
    example: 31.88 
  })
  overtimeRate?: number;

  @ApiProperty({ 
    description: 'Minimum professional experience in months', 
    example: 12 
  })
  minExperienceMonths: number;

  @ApiProperty({ 
    description: 'Required certifications', 
    example: ['Basic Dialysis Course', 'Hygiene Training'] 
  })
  requiredCertifications: string[];

  @ApiProperty({ 
    description: 'Required skills', 
    example: ['Patient Care', 'Machine Operation'] 
  })
  requiredSkills: string[];

  @ApiProperty({ 
    description: 'Permissions', 
    example: ['view_patient_data', 'manage_dialysis_machines'] 
  })
  permissions: string[];

  @ApiProperty({ 
    description: 'Can work night shifts', 
    example: true 
  })
  canWorkNights: boolean;

  @ApiProperty({ 
    description: 'Can work weekend shifts', 
    example: true 
  })
  canWorkWeekends: boolean;

  @ApiProperty({ 
    description: 'Can work on holidays', 
    example: false 
  })
  canWorkHolidays: boolean;

  @ApiProperty({ 
    description: 'Maximum consecutive working days', 
    example: 6 
  })
  maxConsecutiveDays: number;

  @ApiProperty({ 
    description: 'Minimum rest time between shifts in hours', 
    example: 11 
  })
  minRestHours: number;

  @ApiProperty({ 
    description: 'Maximum weekly working hours', 
    example: 40.0 
  })
  maxWeeklyHours: number;

  @ApiProperty({ 
    description: 'Maximum monthly working hours', 
    example: 160.0 
  })
  maxMonthlyHours: number;

  @ApiProperty({ 
    description: 'Priority level of the role (1-10, higher = more important)', 
    example: 1 
  })
  priorityLevel: number;

  @ApiPropertyOptional({ 
    description: 'Color code for UI display (Hex)', 
    example: '#1976d2' 
  })
  colorCode?: string;

  @ApiProperty({ 
    description: 'Role is active', 
    example: true 
  })
  isActive: boolean;

  @ApiPropertyOptional({ 
    description: 'Created by (User ID)', 
    example: '123e4567-e89b-12d3-a456-426614174002' 
  })
  createdBy?: string;

  @ApiPropertyOptional({ 
    description: 'Updated by (User ID)', 
    example: '123e4567-e89b-12d3-a456-426614174003' 
  })
  updatedBy?: string;

  @ApiProperty({ 
    description: 'Created at', 
    example: '2024-01-01T12:00:00Z' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Updated at', 
    example: '2024-02-01T12:00:00Z' 
  })
  updatedAt: Date;

  @ApiPropertyOptional({ 
    description: 'Deleted at', 
    example: null 
  })
  deletedAt?: Date;

  @ApiProperty({ 
    description: 'Role is available (computed)', 
    example: true 
  })
  isAvailable: boolean;

  @ApiProperty({ 
    description: 'Display name of the role (computed)', 
    example: 'Dialysis Specialist (specialist)' 
  })
  displayName: string;
}