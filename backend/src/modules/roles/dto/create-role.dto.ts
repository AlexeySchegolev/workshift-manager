import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsArray, IsUUID, Min, Max, Length } from 'class-validator';
import { RoleType, RoleStatus } from '@/database/entities';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Organization ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Role name',
    example: 'Dialysis Specialist'
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Role description',
    example: 'Qualified specialist for performing dialysis treatments'
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({
    description: 'Role type',
    enum: RoleType,
    example: RoleType.SPECIALIST
  })
  @IsEnum(RoleType)
  type: RoleType;

  @ApiPropertyOptional({
    description: 'Role status',
    enum: RoleStatus,
    example: RoleStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(RoleStatus)
  status?: RoleStatus;

  @ApiPropertyOptional({
    description: 'Hourly rate in Euro',
    example: 25.50
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'Overtime rate in Euro',
    example: 31.88
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  overtimeRate?: number;

  @ApiPropertyOptional({
    description: 'Minimum professional experience in months',
    example: 12
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minExperienceMonths?: number;

  @ApiPropertyOptional({
    description: 'Required certifications',
    example: ['Basic Dialysis Course', 'Hygiene Training']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredCertifications?: string[];

  @ApiPropertyOptional({
    description: 'Required skills',
    example: ['Patient Care', 'Machine Operation']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiPropertyOptional({
    description: 'Permissions',
    example: ['view_patient_data', 'manage_dialysis_machines']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiPropertyOptional({
    description: 'Can work night shifts',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  canWorkNights?: boolean;

  @ApiPropertyOptional({
    description: 'Can work weekend shifts',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  canWorkWeekends?: boolean;

  @ApiPropertyOptional({
    description: 'Can work on holidays',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  canWorkHolidays?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum consecutive working days',
    example: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(14)
  maxConsecutiveDays?: number;

  @ApiPropertyOptional({
    description: 'Minimum rest time between shifts in hours',
    example: 11
  })
  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(24)
  minRestHours?: number;

  @ApiPropertyOptional({
    description: 'Maximum weekly working hours',
    example: 40.0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(60)
  maxWeeklyHours?: number;

  @ApiPropertyOptional({
    description: 'Maximum monthly working hours',
    example: 160.0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(250)
  maxMonthlyHours?: number;

  @ApiPropertyOptional({
    description: 'Priority level of the role (1-10, higher = more important)',
    example: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priorityLevel?: number;

  @ApiPropertyOptional({
    description: 'Color code for UI display (Hex)',
    example: '#1976d2'
  })
  @IsOptional()
  @IsString()
  @Length(7, 7)
  colorCode?: string;

  @ApiPropertyOptional({
    description: 'Role is active',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Created by (User ID)',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}