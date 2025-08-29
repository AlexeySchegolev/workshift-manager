import { IsInt, IsOptional, IsBoolean, IsString, IsObject, Min, Max, IsEnum, IsUUID, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {ApprovalStatus, MonthlyShiftPlan, ShiftPlanStatus} from "@/database/entities/shift-plan.entity";
import {MonthlyShiftPlanDto} from "@/modules/shift-plans/dto/monthly-shift-plan.dto";

export class CreateShiftPlanDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-string'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Shift plan name',
    example: 'December 2024 Shift Plan',
    maxLength: 255
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Shift plan description',
    example: 'Christmas period shift plan with increased staffing requirements',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Year for the shift plan',
    example: 2024,
    minimum: 2020,
    maximum: 2030
  })
  @IsInt()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiProperty({ 
    description: 'Month for the shift plan (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Start date of planning period',
    example: '2024-12-01'
  })
  @IsDateString()
  planningPeriodStart: string;

  @ApiProperty({
    description: 'End date of planning period',
    example: '2024-12-31'
  })
  @IsDateString()
  planningPeriodEnd: string;

  @ApiPropertyOptional({
    description: 'Status of the shift plan',
    enum: ShiftPlanStatus,
    example: ShiftPlanStatus.DRAFT
  })
  @IsOptional()
  @IsEnum(ShiftPlanStatus)
  status?: ShiftPlanStatus;

  @ApiPropertyOptional({
    description: 'Approval status',
    enum: ApprovalStatus,
    example: ApprovalStatus.PENDING
  })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @ApiPropertyOptional({ 
    description: 'Monthly shift plan data structure',
    type: 'object',
    additionalProperties: true,
    example: {
      '01.12.2024': {
        'F': ['employee-uuid-1', 'employee-uuid-2'],
        'S': ['employee-uuid-3'],
        'FS': ['employee-uuid-4']
      },
      '02.12.2024': {
        'F': ['employee-uuid-2', 'employee-uuid-5'],
        'S': ['employee-uuid-1']
      }
    }
  })
  @IsOptional()
  @IsObject()
  planData?: MonthlyShiftPlanDto;

  @ApiPropertyOptional({
    description: 'Metadata for the shift plan',
    type: 'object',
    additionalProperties: true,
    example: { generatedBy: 'system', version: '1.0' }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Total number of shifts in the plan',
    example: 150,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalShifts?: number;

  @ApiPropertyOptional({
    description: 'Total hours in the shift plan',
    example: 1200.50
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  totalHours?: number;

  @ApiPropertyOptional({
    description: 'Total number of employees in the plan',
    example: 25,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalEmployees?: number;

  @ApiPropertyOptional({
    description: 'Coverage percentage',
    example: 95.5,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  coveragePercentage?: number;

  @ApiPropertyOptional({
    description: 'Number of constraint violations',
    example: 2,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  constraintViolations?: number;

  @ApiPropertyOptional({ 
    description: 'Whether this shift plan is published',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'ID of user who created this shift plan',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class GenerateShiftPlanDto {
  @ApiProperty({ 
    description: 'Year for the shift plan',
    example: 2024,
    minimum: 2020,
    maximum: 2030
  })
  @IsInt()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiProperty({ 
    description: 'Month for the shift plan (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiPropertyOptional({ 
    description: 'Specific employee IDs to include in planning (if not provided, all active employees will be used)',
    type: [String],
    example: ['employee-uuid-1', 'employee-uuid-2', 'employee-uuid-3']
  })
  @IsOptional()
  @IsString({ each: true })
  employeeIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Whether to use relaxed rules during planning',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  useRelaxedRules?: boolean;

  @ApiPropertyOptional({ 
    description: 'Shift rules ID to use for planning (if not provided, default active rules will be used)'
  })
  @IsOptional()
  @IsString()
  shiftRulesId?: string;

  @ApiPropertyOptional({ 
    description: 'Location ID to generate plan for (if not provided, all locations will be considered)'
  })
  @IsOptional()
  @IsInt()
  locationId?: number;

  @ApiPropertyOptional({ 
    description: 'User ID who is generating this shift plan'
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class ValidateShiftPlanDto {
  @ApiProperty({ 
    description: 'Year for validation',
    example: 2024
  })
  @IsInt()
  @Min(2020)
  @Max(2030)
  year: number;

  @ApiProperty({ 
    description: 'Month for validation (1-12)',
    example: 12
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ 
    description: 'Monthly shift plan data to validate',
    type: 'object',
    additionalProperties: true
  })
  @IsObject()
  planData: MonthlyShiftPlan;

  @ApiProperty({ 
    description: 'Employee IDs involved in the plan',
    type: [String]
  })
  @IsString({ each: true })
  employeeIds: string[];

  @ApiPropertyOptional({ 
    description: 'Shift rules ID to validate against (if not provided, default active rules will be used)'
  })
  @IsOptional()
  @IsString()
  shiftRulesId?: string;
}