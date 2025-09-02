import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsUUID, Min, Max, Length } from 'class-validator';

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