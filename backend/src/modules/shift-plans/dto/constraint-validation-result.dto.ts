import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, IsEnum } from 'class-validator';
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

/**
 * DTO for constraint validation statistics
 */
export class ValidationStatisticsDto {
  @ApiProperty({ description: 'Total number of constraints checked' })
  @IsNumber()
  totalConstraintsChecked: number;

  @ApiProperty({ description: 'Number of constraints passed' })
  @IsNumber()
  constraintsPassed: number;

  @ApiProperty({ description: 'Number of constraints failed' })
  @IsNumber()
  constraintsFailed: number;

  @ApiProperty({ description: 'Validation success rate percentage' })
  @IsNumber()
  @Type(() => Number)
  validationSuccessRate: number;

  @ApiProperty({ description: 'Average constraint check time in milliseconds' })
  @IsNumber()
  @Type(() => Number)
  averageCheckTimeMs: number;

  @ApiProperty({ description: 'Total validation time in milliseconds' })
  @IsNumber()
  totalValidationTimeMs: number;

  @ApiPropertyOptional({ description: 'Most frequently violated constraint' })
  @IsOptional()
  @IsString()
  mostViolatedConstraint?: string;

  @ApiPropertyOptional({ description: 'Constraint categories breakdown' })
  @IsOptional()
  categoryBreakdown?: Record<string, number>;

  @ApiPropertyOptional({ description: 'Employee-specific violation counts' })
  @IsOptional()
  employeeViolationCounts?: Record<string, number>;
}

/**
 * DTO for validation recommendations
 */
export class ValidationRecommendationDto {
  @ApiProperty({ description: 'Recommendation type' })
  @IsString()
  type: 'immediate' | 'optimization' | 'preventive' | 'informational';

  @ApiProperty({ description: 'Recommendation priority (1-5)' })
  @IsNumber()
  priority: number;

  @ApiProperty({ description: 'Recommendation title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Detailed recommendation description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Affected entity IDs (employees, shifts, etc.)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedEntities?: string[];

  @ApiPropertyOptional({ description: 'Expected improvement if recommendation is followed' })
  @IsOptional()
  @IsString()
  expectedImprovement?: string;

  @ApiPropertyOptional({ description: 'Implementation difficulty (1-5)' })
  @IsOptional()
  @IsNumber()
  implementationDifficulty?: number;

  @ApiPropertyOptional({ description: 'Estimated time to implement' })
  @IsOptional()
  @IsString()
  estimatedTimeToImplement?: string;

  @ApiPropertyOptional({ description: 'Related violation codes' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedViolations?: string[];
}

/**
 * Main DTO for comprehensive constraint validation results
 */
export class ConstraintValidationResultDto {
  @ApiProperty({ description: 'Whether the overall validation passed' })
  @IsBoolean()
  isValid: boolean;

  @ApiProperty({ description: 'Overall validation score (0-100)' })
  @IsNumber()
  @Type(() => Number)
  overallScore: number;

  @ApiProperty({ description: 'Timestamp when validation was performed' })
  @IsString()
  validationTimestamp: string;

  @ApiProperty({ description: 'Validation duration in milliseconds' })
  @IsNumber()
  validationDurationMs: number;

  @ApiProperty({ 
    description: 'Hard constraint violations (must be fixed)',
    type: [ConstraintViolationDto]
  })
  @IsArray()
  @Type(() => ConstraintViolationDto)
  hardViolations: ConstraintViolationDto[];

  @ApiProperty({ 
    description: 'Soft constraint violations (should be fixed)',
    type: [ConstraintViolationDto]
  })
  @IsArray()
  @Type(() => ConstraintViolationDto)
  softViolations: ConstraintViolationDto[];

  @ApiProperty({ 
    description: 'Warnings (minor issues)',
    type: [ConstraintViolationDto]
  })
  @IsArray()
  @Type(() => ConstraintViolationDto)
  warnings: ConstraintViolationDto[];

  @ApiPropertyOptional({ 
    description: 'Informational messages',
    type: [ConstraintViolationDto]
  })
  @IsOptional()
  @IsArray()
  @Type(() => ConstraintViolationDto)
  informationalMessages?: ConstraintViolationDto[];

  @ApiProperty({ 
    description: 'Validation statistics',
    type: ValidationStatisticsDto
  })
  @Type(() => ValidationStatisticsDto)
  statistics: ValidationStatisticsDto;

  @ApiProperty({ 
    description: 'Recommendations for improvement',
    type: [ValidationRecommendationDto]
  })
  @IsArray()
  @Type(() => ValidationRecommendationDto)
  recommendations: ValidationRecommendationDto[];

  @ApiPropertyOptional({ description: 'Critical issues that prevent plan execution' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  criticalIssues?: string[];

  @ApiPropertyOptional({ description: 'Validation summary for quick overview' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: 'Confidence level of validation results (0-100)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  confidenceLevel?: number;

  @ApiPropertyOptional({ description: 'Validation rules version used' })
  @IsOptional()
  @IsString()
  rulesVersion?: string;

  @ApiPropertyOptional({ description: 'Whether plan can be published despite violations' })
  @IsOptional()
  @IsBoolean()
  canPublishWithViolations?: boolean;

  @ApiPropertyOptional({ description: 'Additional validation metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * DTO for bulk constraint validation request
 */
export class BulkValidationRequestDto {
  @ApiProperty({ description: 'Shift plan IDs to validate' })
  @IsArray()
  @IsString({ each: true })
  shiftPlanIds: string[];

  @ApiPropertyOptional({ description: 'Validation rules to apply (empty means all)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ruleCodesToApply?: string[];

  @ApiPropertyOptional({ description: 'Whether to include detailed violation context' })
  @IsOptional()
  @IsBoolean()
  includeDetailedContext?: boolean = true;

  @ApiPropertyOptional({ description: 'Maximum violations to return per plan' })
  @IsOptional()
  @IsNumber()
  maxViolationsPerPlan?: number = 100;

  @ApiPropertyOptional({ description: 'Minimum severity level to include (1-5)' })
  @IsOptional()
  @IsNumber()
  minimumSeverityLevel?: number = 1;

  @ApiPropertyOptional({ description: 'Whether to generate recommendations' })
  @IsOptional()
  @IsBoolean()
  generateRecommendations?: boolean = true;
}

/**
 * DTO for bulk validation results
 */
export class BulkValidationResultDto {
  @ApiProperty({ description: 'Validation results for each shift plan' })
  @IsArray()
  results: Array<{
    shiftPlanId: string;
    validationResult: ConstraintValidationResultDto;
    success: boolean;
    error?: string;
  }>;

  @ApiProperty({ description: 'Overall bulk validation statistics' })
  bulkStatistics: {
    totalPlansValidated: number;
    plansWithoutViolations: number;
    plansWithHardViolations: number;
    plansWithSoftViolations: number;
    averageValidationTime: number;
    totalValidationTime: number;
  };

  @ApiProperty({ description: 'Cross-plan recommendations' })
  @IsOptional()
  @IsArray()
  @Type(() => ValidationRecommendationDto)
  crossPlanRecommendations?: ValidationRecommendationDto[];

  @ApiProperty({ description: 'Bulk validation completion timestamp' })
  @IsString()
  completionTimestamp: string;
}

/**
 * DTO for constraint validation configuration
 */
export class ValidationConfigDto {
  @ApiPropertyOptional({ description: 'Whether to perform strict validation' })
  @IsOptional()
  @IsBoolean()
  strictMode?: boolean = true;

  @ApiPropertyOptional({ description: 'Maximum validation time in milliseconds' })
  @IsOptional()
  @IsNumber()
  maxValidationTimeMs?: number = 60000;

  @ApiPropertyOptional({ description: 'Whether to validate cross-employee constraints' })
  @IsOptional()
  @IsBoolean()
  validateCrossEmployeeConstraints?: boolean = true;

  @ApiPropertyOptional({ description: 'Whether to validate temporal constraints' })
  @IsOptional()
  @IsBoolean()
  validateTemporalConstraints?: boolean = true;

  @ApiPropertyOptional({ description: 'Whether to validate resource constraints' })
  @IsOptional()
  @IsBoolean()
  validateResourceConstraints?: boolean = true;

  @ApiPropertyOptional({ description: 'Custom validation parameters' })
  @IsOptional()
  customParameters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Constraint rule overrides' })
  @IsOptional()
  ruleOverrides?: Array<{
    ruleCode: string;
    isActive: boolean;
    weight?: number;
  }>;
}