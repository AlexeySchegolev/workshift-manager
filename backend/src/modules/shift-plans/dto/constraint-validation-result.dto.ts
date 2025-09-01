import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViolationType, ConstraintCategory } from '@/database/entities/constraint-violation.entity';

/**
 * DTO for individual constraint violation details
 */
export class ConstraintViolationDto {
  @ApiProperty({ description: 'Unique rule code identifying the constraint' })
  @IsString()
  ruleCode: string;

  @ApiProperty({ description: 'Human-readable rule name' })
  @IsString()
  ruleName: string;

  @ApiProperty({ description: 'Detailed violation message' })
  @IsString()
  message: string;

  @ApiProperty({ 
    enum: ViolationType,
    description: 'Type of violation (hard, soft, warning, info)'
  })
  @IsEnum(ViolationType)
  type: ViolationType;

  @ApiProperty({ 
    enum: ConstraintCategory,
    description: 'Category of the constraint'
  })
  @IsEnum(ConstraintCategory)
  category: ConstraintCategory;

  @ApiProperty({ 
    description: 'Severity level (1-5, where 5 is most severe)',
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  severity: number;

  @ApiPropertyOptional({ description: 'ID of affected employee' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Name of affected employee' })
  @IsOptional()
  @IsString()
  employeeName?: string;

  @ApiPropertyOptional({ description: 'Affected shift type (F, S, FS)' })
  @IsOptional()
  @IsString()
  shiftType?: string;

  @ApiPropertyOptional({ description: 'Date key when violation occurs (DD.MM.YYYY)' })
  @IsOptional()
  @IsString()
  dayKey?: string;

  @ApiPropertyOptional({ description: 'Location ID where violation occurs' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({ description: 'Suggested action to resolve violation' })
  @IsOptional()
  @IsString()
  suggestedAction?: string;

  @ApiPropertyOptional({ description: 'Priority score for resolution order' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priorityScore?: number;

  @ApiPropertyOptional({ description: 'Additional context data' })
  @IsOptional()
  contextData?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Whether violation can be automatically resolved' })
  @IsOptional()
  @IsBoolean()
  canAutoResolve?: boolean;

  @ApiPropertyOptional({ description: 'Estimated impact of violation on overall plan quality' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  qualityImpact?: number;
}