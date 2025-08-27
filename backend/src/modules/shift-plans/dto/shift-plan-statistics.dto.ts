import { IsNumber, IsString, IsArray, IsObject, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for individual employee utilization statistics
 */
export class EmployeeUtilizationDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  employeeId: string;

  @ApiProperty({ description: 'Employee name' })
  @IsString()
  employeeName: string;

  @ApiProperty({ description: 'Employee role' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'Location ID' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiProperty({ description: 'Total hours assigned', example: 160.5 })
  @IsNumber()
  @Type(() => Number)
  totalHoursAssigned: number;

  @ApiProperty({ description: 'Number of shifts assigned', example: 20 })
  @IsNumber()
  shiftsCount: number;

  @ApiProperty({ description: 'Workload percentage relative to target', example: 98.5 })
  @IsNumber()
  @Type(() => Number)
  workloadPercentage: number;

  @ApiProperty({ description: 'Number of Saturday shifts worked', example: 2 })
  @IsNumber()
  saturdaysWorked: number;

  @ApiProperty({ description: 'Target hours per month', example: 163.0 })
  @IsNumber()
  @Type(() => Number)
  targetHours: number;

  @ApiProperty({ description: 'Hours difference from target', example: -2.5 })
  @IsNumber()
  @Type(() => Number)
  hoursDifference: number;

  @ApiPropertyOptional({ description: 'Preferred shift types assigned', example: 15 })
  @IsOptional()
  @IsNumber()
  preferredShiftsAssigned?: number;

  @ApiPropertyOptional({ description: 'Constraint violations count', example: 0 })
  @IsOptional()
  @IsNumber()
  constraintViolations?: number;

  @ApiPropertyOptional({ description: 'Planning efficiency score (0-100)', example: 85.2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  efficiencyScore?: number;
}

/**
 * DTO for shift type distribution statistics
 */
export class ShiftDistributionDto {
  @ApiProperty({ description: 'Morning shift (F) count', example: 150 })
  @IsNumber()
  morningShifts: number;

  @ApiProperty({ description: 'Evening shift (S) count', example: 145 })
  @IsNumber()
  eveningShifts: number;

  @ApiPropertyOptional({ description: 'Split shift (FS) count', example: 20 })
  @IsOptional()
  @IsNumber()
  splitShifts?: number;

  @ApiPropertyOptional({ description: 'Secondary location shifts', example: 30 })
  @IsOptional()
  @IsNumber()
  secondaryLocationShifts?: number;

  @ApiProperty({ description: 'Total shifts assigned', example: 315 })
  @IsNumber()
  totalShifts: number;

  @ApiProperty({ description: 'Shift distribution by day of week' })
  @IsObject()
  dailyDistribution: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };

  @ApiPropertyOptional({ description: 'Average shifts per day', example: 10.2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  averageShiftsPerDay?: number;
}

/**
 * DTO for constraint violations summary
 */
export class ConstraintViolationsSummaryDto {
  @ApiProperty({ description: 'Total number of violations', example: 5 })
  @IsNumber()
  totalViolations: number;

  @ApiProperty({ description: 'Number of hard constraint violations', example: 0 })
  @IsNumber()
  hardViolations: number;

  @ApiProperty({ description: 'Number of soft constraint violations', example: 3 })
  @IsNumber()
  softViolations: number;

  @ApiProperty({ description: 'Number of warnings', example: 2 })
  @IsNumber()
  warnings: number;

  @ApiProperty({ description: 'Violations by category' })
  @IsObject()
  violationsByCategory: Record<string, number>;

  @ApiProperty({ description: 'Most common violation type' })
  @IsString()
  mostCommonViolationType: string;

  @ApiProperty({ description: 'Employees with violations count', example: 3 })
  @IsNumber()
  employeesWithViolations: number;

  @ApiPropertyOptional({ description: 'Average severity score', example: 2.4 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  averageSeverity?: number;
}

/**
 * DTO for planning performance metrics
 */
export class PlanningPerformanceDto {
  @ApiProperty({ description: 'Planning duration in milliseconds', example: 15432 })
  @IsNumber()
  planningDurationMs: number;

  @ApiProperty({ description: 'Algorithm used', example: 'enhanced_backtracking' })
  @IsString()
  algorithmUsed: string;

  @ApiProperty({ description: 'Number of planning iterations', example: 31 })
  @IsNumber()
  iterationsCount: number;

  @ApiProperty({ description: 'Number of backtracking attempts', example: 127 })
  @IsNumber()
  backtrackingAttempts: number;

  @ApiProperty({ description: 'Number of successful day assignments', example: 29 })
  @IsNumber()
  successfulDays: number;

  @ApiProperty({ description: 'Number of failed day assignments', example: 2 })
  @IsNumber()
  failedDays: number;

  @ApiProperty({ description: 'Planning success rate percentage', example: 93.5 })
  @IsNumber()
  @Type(() => Number)
  successRate: number;

  @ApiPropertyOptional({ description: 'Constraint checks performed', example: 3456 })
  @IsOptional()
  @IsNumber()
  constraintChecks?: number;

  @ApiPropertyOptional({ description: 'Memory usage in MB', example: 45.2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  memoryUsageMB?: number;

  @ApiPropertyOptional({ description: 'Planning efficiency score', example: 78.3 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  planningEfficiency?: number;
}

/**
 * DTO for quality metrics
 */
export class QualityMetricsDto {
  @ApiProperty({ description: 'Overall quality score (0-100)', example: 87.5 })
  @IsNumber()
  @Type(() => Number)
  overallScore: number;

  @ApiProperty({ description: 'Workload balance score (0-100)', example: 92.1 })
  @IsNumber()
  @Type(() => Number)
  workloadBalanceScore: number;

  @ApiProperty({ description: 'Constraint compliance score (0-100)', example: 95.8 })
  @IsNumber()
  @Type(() => Number)
  constraintComplianceScore: number;

  @ApiProperty({ description: 'Preference satisfaction score (0-100)', example: 76.4 })
  @IsNumber()
  @Type(() => Number)
  preferenceSatisfactionScore: number;

  @ApiProperty({ description: 'Coverage optimization score (0-100)', example: 88.9 })
  @IsNumber()
  @Type(() => Number)
  coverageOptimizationScore: number;

  @ApiPropertyOptional({ description: 'Cost efficiency score (0-100)', example: 82.3 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  costEfficiencyScore?: number;

  @ApiPropertyOptional({ description: 'Whether the plan meets high quality standards' })
  @IsOptional()
  @IsBoolean()
  isHighQuality?: boolean;

  @ApiPropertyOptional({ description: 'Whether the plan needs improvement' })
  @IsOptional()
  @IsBoolean()
  needsImprovement?: boolean;
}

/**
 * Main DTO for comprehensive shift plan statistics
 */
export class ShiftPlanStatisticsDto {
  @ApiProperty({ description: 'Unique statistics ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Shift plan ID' })
  @IsString()
  shiftPlanId: string;

  @ApiProperty({ description: 'Timestamp when statistics were calculated' })
  @IsString()
  calculationTimestamp: string;

  @ApiProperty({ description: 'Total number of shifts planned', example: 315 })
  @IsNumber()
  totalShiftsPlanned: number;

  @ApiProperty({ description: 'Total hours planned across all shifts', example: 2520.0 })
  @IsNumber()
  @Type(() => Number)
  totalHoursPlanned: number;

  @ApiProperty({ description: 'Number of employees involved in planning', example: 25 })
  @IsNumber()
  totalEmployeesInvolved: number;

  @ApiProperty({ description: 'Coverage percentage of required shifts', example: 96.8 })
  @IsNumber()
  @Type(() => Number)
  coveragePercentage: number;

  @ApiProperty({ description: 'Number of Saturday shifts covered', example: 4 })
  @IsNumber()
  saturdayCoverage: number;

  @ApiProperty({ description: 'Average hours per employee', example: 100.8 })
  @IsNumber()
  @Type(() => Number)
  averageHoursPerEmployee: number;

  @ApiProperty({ description: 'Standard deviation of hours distribution', example: 12.3 })
  @IsNumber()
  @Type(() => Number)
  standardDeviationHours: number;

  @ApiProperty({ description: 'Minimum hours assigned to any employee', example: 85.5 })
  @IsNumber()
  @Type(() => Number)
  minEmployeeHours: number;

  @ApiProperty({ description: 'Maximum hours assigned to any employee', example: 125.0 })
  @IsNumber()
  @Type(() => Number)
  maxEmployeeHours: number;

  @ApiProperty({ 
    description: 'Individual employee utilization statistics',
    type: [EmployeeUtilizationDto]
  })
  @IsArray()
  @Type(() => EmployeeUtilizationDto)
  employeeUtilization: EmployeeUtilizationDto[];

  @ApiProperty({ 
    description: 'Shift distribution across types and days',
    type: ShiftDistributionDto
  })
  @Type(() => ShiftDistributionDto)
  shiftDistribution: ShiftDistributionDto;

  @ApiProperty({ 
    description: 'Summary of constraint violations',
    type: ConstraintViolationsSummaryDto
  })
  @Type(() => ConstraintViolationsSummaryDto)
  constraintViolationsSummary: ConstraintViolationsSummaryDto;

  @ApiProperty({ 
    description: 'Planning performance metrics',
    type: PlanningPerformanceDto
  })
  @Type(() => PlanningPerformanceDto)
  planningPerformance: PlanningPerformanceDto;

  @ApiProperty({ 
    description: 'Quality assessment metrics',
    type: QualityMetricsDto
  })
  @Type(() => QualityMetricsDto)
  qualityMetrics: QualityMetricsDto;

  @ApiPropertyOptional({ 
    description: 'Recommendations for improvement',
    example: ['Consider redistributing Saturday shifts more evenly', 'Review workload for Employee X']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendations?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Whether statistics are final', example: true })
  @IsOptional()
  @IsBoolean()
  isFinal?: boolean;

  @ApiPropertyOptional({ description: 'Statistics calculation version', example: '1.0' })
  @IsOptional()
  @IsString()
  calculationVersion?: string;
}

/**
 * DTO for comparing two shift plan statistics
 */
export class StatisticsComparisonDto {
  @ApiProperty({ description: 'Baseline statistics', type: ShiftPlanStatisticsDto })
  @Type(() => ShiftPlanStatisticsDto)
  baseline: ShiftPlanStatisticsDto;

  @ApiProperty({ description: 'Comparison statistics', type: ShiftPlanStatisticsDto })
  @Type(() => ShiftPlanStatisticsDto)
  comparison: ShiftPlanStatisticsDto;

  @ApiProperty({ description: 'Quality score difference', example: 5.2 })
  @IsNumber()
  @Type(() => Number)
  qualityDifference: number;

  @ApiProperty({ description: 'Coverage percentage difference', example: 2.1 })
  @IsNumber()
  @Type(() => Number)
  coverageDifference: number;

  @ApiProperty({ description: 'Planning duration difference in milliseconds', example: -3250 })
  @IsNumber()
  planningDurationDifference: number;

  @ApiProperty({ description: 'Violation count difference', example: -2 })
  @IsNumber()
  violationDifference: number;

  @ApiProperty({ description: 'Workload balance improvement', example: 1.8 })
  @IsNumber()
  @Type(() => Number)
  workloadBalanceImprovement: number;

  @ApiProperty({ description: 'Summary of key improvements' })
  @IsArray()
  @IsString({ each: true })
  improvements: string[];

  @ApiProperty({ description: 'Summary of regressions' })
  @IsArray()
  @IsString({ each: true })
  regressions: string[];

  @ApiProperty({ description: 'Overall assessment' })
  @IsString()
  overallAssessment: 'better' | 'worse' | 'similar';
}