import { IsEnum, IsBoolean, IsNumber, IsOptional, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PlanningAlgorithm {
  ENHANCED_BACKTRACKING = 'enhanced_backtracking',
  CONSTRAINT_SATISFACTION = 'constraint_satisfaction',
  MIXED = 'mixed'
}

export enum OptimizationLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  ADVANCED = 'advanced'
}

export enum EmployeeSortingStrategy {
  ROLE_PRIORITY = 'role_priority',
  WORKLOAD_BALANCING = 'workload_balancing',
  ROTATION_BASED = 'rotation_based'
}

export enum SaturdayDistributionMode {
  FAIR = 'fair',
  STRICT = 'strict',
  FLEXIBLE = 'flexible'
}

class ConstraintWeightsDto {
  // Index signature to make it compatible with Record<string, number>
  [key: string]: number | undefined;

  @ApiPropertyOptional({ 
    description: 'Weight for workload balance constraints', 
    minimum: 0, 
    maximum: 5, 
    default: 1.0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  workloadBalance?: number = 1.0;

  @ApiPropertyOptional({ 
    description: 'Weight for Saturday distribution constraints', 
    minimum: 0, 
    maximum: 5, 
    default: 1.5 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  saturdayDistribution?: number = 1.5;

  @ApiPropertyOptional({ 
    description: 'Weight for consecutive days constraints', 
    minimum: 0, 
    maximum: 5, 
    default: 2.0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  consecutiveDays?: number = 2.0;

  @ApiPropertyOptional({ 
    description: 'Weight for role requirements constraints', 
    minimum: 0, 
    maximum: 5, 
    default: 3.0 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  roleRequirements?: number = 3.0;

  @ApiPropertyOptional({ 
    description: 'Weight for overtime constraints', 
    minimum: 0, 
    maximum: 5, 
    default: 1.2 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  overtime?: number = 1.2;

  @ApiPropertyOptional({ 
    description: 'Weight for preference satisfaction', 
    minimum: 0, 
    maximum: 5, 
    default: 0.8 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  preferenceSatisfaction?: number = 0.8;
}

/**
 * DTO for advanced shift planning options and configuration
 */
export class AdvancedPlanningOptionsDto {
  @ApiProperty({ 
    enum: PlanningAlgorithm, 
    description: 'Planning algorithm to use',
    example: PlanningAlgorithm.ENHANCED_BACKTRACKING
  })
  @IsEnum(PlanningAlgorithm)
  algorithm: PlanningAlgorithm;

  @ApiProperty({ 
    enum: OptimizationLevel, 
    description: 'Level of optimization to apply',
    example: OptimizationLevel.STANDARD
  })
  @IsEnum(OptimizationLevel)
  optimizationLevel: OptimizationLevel;

  @ApiProperty({ 
    description: 'Whether to apply strict constraint checking',
    example: true
  })
  @IsBoolean()
  strictMode: boolean;

  @ApiProperty({ 
    description: 'Maximum number of planning attempts',
    minimum: 1,
    maximum: 10,
    example: 3
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  maxPlanningAttempts: number;

  @ApiProperty({ 
    enum: EmployeeSortingStrategy, 
    description: 'Strategy for sorting employees during planning',
    example: EmployeeSortingStrategy.WORKLOAD_BALANCING
  })
  @IsEnum(EmployeeSortingStrategy)
  employeeSortingStrategy: EmployeeSortingStrategy;

  @ApiProperty({ 
    enum: SaturdayDistributionMode, 
    description: 'Mode for distributing Saturday shifts',
    example: SaturdayDistributionMode.FAIR
  })
  @IsEnum(SaturdayDistributionMode)
  saturdayDistributionMode: SaturdayDistributionMode;

  @ApiPropertyOptional({ 
    description: 'Constraint weights for different types of rules',
    type: ConstraintWeightsDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConstraintWeightsDto)
  constraintWeights?: ConstraintWeightsDto;

  @ApiProperty({ 
    description: 'Whether to allow overtime assignments',
    example: false
  })
  @IsBoolean()
  allowOvertime: boolean;

  @ApiProperty({ 
    description: 'Flexibility percentage for weekly hours (0.0 to 1.0)',
    minimum: 0,
    maximum: 1,
    example: 0.15
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  weeklyHoursFlexibility: number;

  @ApiProperty({ 
    description: 'Maximum consecutive working days allowed',
    minimum: 1,
    maximum: 14,
    example: 5
  })
  @IsNumber()
  @Min(1)
  @Max(14)
  consecutiveDaysLimit: number;

  @ApiPropertyOptional({ 
    description: 'Employee IDs to exclude from planning'
  })
  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  excludedEmployeeIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Employee IDs to prioritize in planning'
  })
  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  prioritizedEmployeeIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Location IDs to include in planning'
  })
  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  includedLocationIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Whether to enable detailed logging during planning',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  enableDetailedLogging?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Custom planning parameters as key-value pairs'
  })
  @IsOptional()
  @IsObject()
  customParameters?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Timeout for planning operation in milliseconds',
    minimum: 10000,
    maximum: 600000,
    default: 300000
  })
  @IsOptional()
  @IsNumber()
  @Min(10000)
  @Max(600000)
  planningTimeoutMs?: number = 300000; // 5 minutes default

  @ApiPropertyOptional({ 
    description: 'Whether to validate constraints before starting planning',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  preValidateConstraints?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Whether to automatically retry with relaxed constraints on failure',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  autoRetryWithRelaxedConstraints?: boolean = true;
}

/**
 * DTO for backtracking-specific configuration options
 */
export class BacktrackingConfigDto {
  @ApiProperty({ 
    description: 'Maximum recursion depth for backtracking',
    minimum: 10,
    maximum: 1000,
    example: 100
  })
  @IsNumber()
  @Min(10)
  @Max(1000)
  maxRecursionDepth: number;

  @ApiProperty({ 
    description: 'Maximum number of backtracking attempts per day',
    minimum: 1,
    maximum: 100,
    example: 10
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  maxBacktrackingAttempts: number;

  @ApiProperty({ 
    description: 'Whether to use heuristic optimization in backtracking',
    example: true
  })
  @IsBoolean()
  enableHeuristicOptimization: boolean;

  @ApiPropertyOptional({ 
    description: 'Random seed for consistent results (for testing)',
    minimum: 0,
    maximum: 2147483647
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2147483647)
  randomSeed?: number;

  @ApiPropertyOptional({ 
    description: 'Whether to prioritize shift leaders in assignments',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  prioritizeShiftLeaders?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Whether to use constraint propagation',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  useConstraintPropagation?: boolean = true;
}

/**
 * DTO for optimization criteria
 */
export class OptimizationCriteriaDto {
  @ApiProperty({ 
    description: 'Weight for minimizing constraint violations',
    minimum: 0,
    maximum: 10,
    example: 3.0
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  constraintViolationWeight: number;

  @ApiProperty({ 
    description: 'Weight for balancing workload across employees',
    minimum: 0,
    maximum: 10,
    example: 2.0
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  workloadBalanceWeight: number;

  @ApiProperty({ 
    description: 'Weight for preference satisfaction',
    minimum: 0,
    maximum: 10,
    example: 1.0
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  preferenceSatisfactionWeight: number;

  @ApiProperty({ 
    description: 'Weight for minimizing overtime usage',
    minimum: 0,
    maximum: 10,
    example: 1.5
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  @Type(() => Number)
  overtimeMinimizationWeight: number;

  @ApiPropertyOptional({ 
    description: 'Target coverage percentage',
    minimum: 50,
    maximum: 100,
    default: 95
  })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(100)
  @Type(() => Number)
  targetCoveragePercentage?: number = 95;

  @ApiPropertyOptional({ 
    description: 'Whether to optimize for cost efficiency',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  optimizeForCostEfficiency?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Maximum optimization iterations',
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxOptimizationIterations?: number = 10;
}