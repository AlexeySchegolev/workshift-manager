import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Shift } from './shift.entity';
import { Organization } from './organization.entity';
import { Location } from './location.entity';
import { Role } from './role.entity';

export enum ShiftConstraintType {
  MINIMUM_EXPERIENCE = 'minimum_experience',
  REQUIRED_CERTIFICATION = 'required_certification',
  REQUIRED_SKILL = 'required_skill',
  TEAM_COMPOSITION = 'team_composition',
  MINIMUM_STAFF_LEVEL = 'minimum_staff_level',
  MAXIMUM_STAFF_LEVEL = 'maximum_staff_level',
  ROLE_DISTRIBUTION = 'role_distribution',
  SENIORITY_REQUIREMENT = 'seniority_requirement',
  LANGUAGE_REQUIREMENT = 'language_requirement',
  EQUIPMENT_PROFICIENCY = 'equipment_proficiency',
  SAFETY_CERTIFICATION = 'safety_certification',
  UNION_MEMBERSHIP = 'union_membership',
  AVAILABILITY_REQUIREMENT = 'availability_requirement',
  PREFERENCE_WEIGHT = 'preference_weight',
  OVERTIME_LIMITATION = 'overtime_limitation',
  CONSECUTIVE_SHIFT_LIMIT = 'consecutive_shift_limit',
  REST_PERIOD_REQUIREMENT = 'rest_period_requirement',
  WORKLOAD_BALANCE = 'workload_balance',
  COST_OPTIMIZATION = 'cost_optimization',
  QUALITY_ASSURANCE = 'quality_assurance',
  EMERGENCY_COVERAGE = 'emergency_coverage',
  TRAINING_REQUIREMENT = 'training_requirement',
  PERFORMANCE_THRESHOLD = 'performance_threshold',
  CUSTOM = 'custom'
}

export enum ConstraintCategory {
  STAFFING = 'staffing',
  SKILLS = 'skills',
  COMPLIANCE = 'compliance',
  QUALITY = 'quality',
  COST = 'cost',
  SAFETY = 'safety',
  PREFERENCE = 'preference',
  WORKLOAD = 'workload',
  LEGAL = 'legal',
  BUSINESS = 'business',
  OPERATIONAL = 'operational'
}

export enum ConstraintPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
  MANDATORY = 5
}

export enum ConstraintStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
  DRAFT = 'draft'
}

export enum ConstraintOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN = 'less_than',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  BETWEEN = 'between',
  IN = 'in',
  NOT_IN = 'not_in',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  REGEX = 'regex'
}

export interface ConstraintCondition {
  field: string;
  operator: ConstraintOperator;
  value: any;
  weight?: number;
  description?: string;
}

export interface ConstraintRule {
  name: string;
  description?: string;
  conditions: ConstraintCondition[];
  logicalOperator: 'AND' | 'OR';
  weight: number;
  isRequired: boolean;
}

export interface ConstraintValidationResult {
  isValid: boolean;
  score: number;
  violations: string[];
  warnings: string[];
  suggestions: string[];
}

@Entity('shift_constraints')
export class ShiftConstraint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid', nullable: true })
  organizationId?: string;

  @Column({ name: 'shift_id', type: 'uuid', nullable: true })
  shiftId?: string;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId?: string;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId?: string;

  @Column({
    type: 'enum',
    enum: ShiftConstraintType,
  })
  constraintType: ShiftConstraintType;

  @Column({
    type: 'enum',
    enum: ConstraintCategory,
    default: ConstraintCategory.OPERATIONAL,
  })
  category: ConstraintCategory;

  @Column({
    type: 'enum',
    enum: ConstraintPriority,
    default: ConstraintPriority.MEDIUM,
  })
  priority: ConstraintPriority;

  @Column({
    type: 'enum',
    enum: ConstraintStatus,
    default: ConstraintStatus.ACTIVE,
  })
  status: ConstraintStatus;

  @Column({ name: 'constraint_name', type: 'varchar', length: 255 })
  constraintName: string;

  @Column({ name: 'constraint_description', type: 'text', nullable: true })
  constraintDescription?: string;

  @Column({ 
    name: 'constraint_rules',
    type: 'jsonb',
    default: []
  })
  constraintRules: ConstraintRule[];

  @Column({ 
    name: 'constraint_conditions',
    type: 'jsonb',
    default: []
  })
  constraintConditions: ConstraintCondition[];

  @Column({ name: 'logical_operator', type: 'varchar', length: 10, default: 'AND' })
  logicalOperator: 'AND' | 'OR';

  @Column({ name: 'weight', type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  weight: number; // Importance weight for optimization

  @Column({ name: 'penalty_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  penaltyScore: number; // Penalty for violating this constraint

  @Column({ name: 'is_hard_constraint', type: 'boolean', default: false })
  isHardConstraint: boolean; // Must be satisfied vs. should be satisfied

  @Column({ name: 'is_flexible', type: 'boolean', default: true })
  isFlexible: boolean; // Can be relaxed under certain conditions

  @Column({ name: 'flexibility_threshold', type: 'decimal', precision: 5, scale: 2, nullable: true })
  flexibilityThreshold?: number; // Threshold for relaxing constraint

  @Column({ name: 'override_allowed', type: 'boolean', default: false })
  overrideAllowed: boolean;

  @Column({ name: 'override_requires_approval', type: 'boolean', default: true })
  overrideRequiresApproval: boolean;

  @Column({ name: 'override_approval_level', type: 'integer', default: 1 })
  overrideApprovalLevel: number;

  @Column({ name: 'effective_start_date', type: 'date', nullable: true })
  effectiveStartDate?: Date;

  @Column({ name: 'effective_end_date', type: 'date', nullable: true })
  effectiveEndDate?: Date;

  @Column({ name: 'effective_start_time', type: 'time', nullable: true })
  effectiveStartTime?: string;

  @Column({ name: 'effective_end_time', type: 'time', nullable: true })
  effectiveEndTime?: string;

  @Column({ 
    name: 'applicable_days',
    type: 'jsonb',
    default: [0, 1, 2, 3, 4, 5, 6]
  })
  applicableDays: number[]; // Days of week this constraint applies

  @Column({ 
    name: 'applicable_shift_types',
    type: 'jsonb',
    default: []
  })
  applicableShiftTypes: string[]; // Shift types this constraint applies to

  @Column({ 
    name: 'excluded_shift_types',
    type: 'jsonb',
    default: []
  })
  excludedShiftTypes: string[]; // Shift types this constraint doesn't apply to

  @Column({ name: 'applies_to_overtime', type: 'boolean', default: true })
  appliesToOvertime: boolean;

  @Column({ name: 'applies_to_holidays', type: 'boolean', default: true })
  appliesToHolidays: boolean;

  @Column({ name: 'applies_to_weekends', type: 'boolean', default: true })
  appliesToWeekends: boolean;

  @Column({ 
    name: 'target_values',
    type: 'jsonb',
    default: {}
  })
  targetValues: Record<string, any>; // Target values for optimization

  @Column({ 
    name: 'threshold_values',
    type: 'jsonb',
    default: {}
  })
  thresholdValues: Record<string, any>; // Threshold values for validation

  @Column({ 
    name: 'validation_rules',
    type: 'jsonb',
    default: []
  })
  validationRules: string[]; // Custom validation rules (JavaScript expressions)

  @Column({ 
    name: 'optimization_hints',
    type: 'jsonb',
    default: []
  })
  optimizationHints: string[]; // Hints for optimization algorithms

  @Column({ name: 'auto_enforce', type: 'boolean', default: true })
  autoEnforce: boolean; // Automatically enforce during scheduling

  @Column({ name: 'notification_enabled', type: 'boolean', default: true })
  notificationEnabled: boolean;

  @Column({ name: 'violation_count', type: 'integer', default: 0 })
  violationCount: number;

  @Column({ name: 'last_violation_date', type: 'timestamp', nullable: true })
  lastViolationDate?: Date;

  @Column({ name: 'compliance_rate', type: 'decimal', precision: 5, scale: 2, default: 100 })
  complianceRate: number;

  @Column({ name: 'average_satisfaction_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  averageSatisfactionScore?: number;

  @Column({ name: 'performance_impact', type: 'decimal', precision: 5, scale: 2, default: 0 })
  performanceImpact: number; // Impact on system performance (0-10)

  @Column({ name: 'cost_impact', type: 'decimal', precision: 10, scale: 2, default: 0 })
  costImpact: number; // Financial impact of this constraint

  @Column({ name: 'quality_impact', type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualityImpact: number; // Impact on service quality (0-10)

  @Column({ name: 'is_machine_learning_enabled', type: 'boolean', default: false })
  isMachineLearningEnabled: boolean; // Use ML to optimize this constraint

  @Column({ 
    name: 'ml_model_parameters',
    type: 'jsonb',
    default: {}
  })
  mlModelParameters: Record<string, any>; // Parameters for ML models

  @Column({ 
    name: 'historical_data',
    type: 'jsonb',
    default: {}
  })
  historicalData: Record<string, any>; // Historical performance data

  @Column({ 
    name: 'tags',
    type: 'jsonb',
    default: []
  })
  tags: string[]; // Tags for categorization and filtering

  @Column({ name: 'custom_code', type: 'text', nullable: true })
  customCode?: string; // Custom JavaScript code for complex constraints

  @Column({ name: 'test_cases', type: 'jsonb', default: [] })
  testCases: any[]; // Test cases for validation

  @Column({ name: 'documentation_url', type: 'varchar', length: 500, nullable: true })
  documentationUrl?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  @ManyToOne(() => Shift, shift => shift.constraints, { nullable: true })
  @JoinColumn({ name: 'shift_id' })
  shift?: Shift;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  // Audit fields
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}