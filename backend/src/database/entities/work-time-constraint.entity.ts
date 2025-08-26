import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { Role } from './role.entity';
import { Location } from './location.entity';

export enum ConstraintType {
  MAX_HOURS_PER_DAY = 'max_hours_per_day',
  MAX_HOURS_PER_WEEK = 'max_hours_per_week',
  MAX_HOURS_PER_MONTH = 'max_hours_per_month',
  MIN_REST_BETWEEN_SHIFTS = 'min_rest_between_shifts',
  MAX_CONSECUTIVE_DAYS = 'max_consecutive_days',
  MAX_OVERTIME_PER_WEEK = 'max_overtime_per_week',
  MAX_OVERTIME_PER_MONTH = 'max_overtime_per_month',
  MIN_HOURS_PER_SHIFT = 'min_hours_per_shift',
  MAX_HOURS_PER_SHIFT = 'max_hours_per_shift',
  MAX_NIGHT_SHIFTS_PER_WEEK = 'max_night_shifts_per_week',
  MAX_WEEKEND_SHIFTS_PER_MONTH = 'max_weekend_shifts_per_month',
  REQUIRED_DAYS_OFF_PER_WEEK = 'required_days_off_per_week',
  MAX_SPLIT_SHIFTS_PER_WEEK = 'max_split_shifts_per_week',
  MIN_NOTICE_PERIOD = 'min_notice_period',
  MAX_SHIFT_CHANGES_PER_MONTH = 'max_shift_changes_per_month'
}

export enum ConstraintScope {
  EMPLOYEE = 'employee',
  ROLE = 'role',
  LOCATION = 'location',
  ORGANIZATION = 'organization',
  LEGAL = 'legal'
}

export enum ConstraintSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum ConstraintStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired'
}

export enum TimeUnit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months'
}

export interface ConstraintRule {
  type: ConstraintType;
  value: number;
  unit: TimeUnit;
  description?: string;
  isFlexible?: boolean;
  overrideAllowed?: boolean;
  overrideRequiresApproval?: boolean;
}

export interface ConstraintViolationThreshold {
  warningThreshold: number;  // Percentage before warning
  errorThreshold: number;    // Percentage before error
  criticalThreshold: number; // Percentage before critical
}

@Entity('work_time_constraints')
export class WorkTimeConstraint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid', nullable: true })
  employeeId?: string;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId?: string;

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId?: string;

  @Column({
    type: 'enum',
    enum: ConstraintType,
  })
  constraintType: ConstraintType;

  @Column({
    type: 'enum',
    enum: ConstraintScope,
    default: ConstraintScope.EMPLOYEE,
  })
  scope: ConstraintScope;

  @Column({
    type: 'enum',
    enum: ConstraintSeverity,
    default: ConstraintSeverity.ERROR,
  })
  severity: ConstraintSeverity;

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

  @Column({ name: 'constraint_value', type: 'decimal', precision: 10, scale: 2 })
  constraintValue: number;

  @Column({
    name: 'value_unit',
    type: 'enum',
    enum: TimeUnit,
    default: TimeUnit.HOURS,
  })
  valueUnit: TimeUnit;

  @Column({ name: 'min_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  minValue?: number; // For range constraints

  @Column({ name: 'max_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxValue?: number; // For range constraints

  @Column({ name: 'tolerance_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  tolerancePercentage: number; // Allowed deviation percentage

  @Column({ name: 'is_flexible', type: 'boolean', default: false })
  isFlexible: boolean; // Can be bent under certain circumstances

  @Column({ name: 'is_hard_constraint', type: 'boolean', default: true })
  isHardConstraint: boolean; // Must be respected vs. should be respected

  @Column({ name: 'override_allowed', type: 'boolean', default: false })
  overrideAllowed: boolean;

  @Column({ name: 'override_requires_approval', type: 'boolean', default: true })
  overrideRequiresApproval: boolean;

  @Column({ name: 'override_approval_level', type: 'integer', default: 1 })
  overrideApprovalLevel: number; // 1=supervisor, 2=manager, 3=admin

  @Column({ name: 'effective_start_date', type: 'date', nullable: true })
  effectiveStartDate?: Date;

  @Column({ name: 'effective_end_date', type: 'date', nullable: true })
  effectiveEndDate?: Date;

  @Column({ 
    name: 'applicable_days',
    type: 'jsonb',
    default: [0, 1, 2, 3, 4, 5, 6] // All days by default
  })
  applicableDays: number[]; // 0=Sunday, 1=Monday, etc.

  @Column({ name: 'applies_to_overtime', type: 'boolean', default: true })
  appliesToOvertime: boolean;

  @Column({ name: 'applies_to_holidays', type: 'boolean', default: true })
  appliesToHolidays: boolean;

  @Column({ name: 'applies_to_weekends', type: 'boolean', default: true })
  appliesToWeekends: boolean;

  @Column({ 
    name: 'excluded_shift_types',
    type: 'jsonb',
    default: []
  })
  excludedShiftTypes: string[]; // Shift types this constraint doesn't apply to

  @Column({ 
    name: 'violation_thresholds',
    type: 'jsonb',
    nullable: true
  })
  violationThresholds?: ConstraintViolationThreshold;

  @Column({ name: 'priority_level', type: 'integer', default: 1 })
  priorityLevel: number; // 1-5, higher = more important

  @Column({ name: 'weight', type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  weight: number; // For constraint optimization algorithms

  @Column({ name: 'legal_requirement', type: 'boolean', default: false })
  legalRequirement: boolean; // Required by law/regulation

  @Column({ name: 'regulation_reference', type: 'varchar', length: 255, nullable: true })
  regulationReference?: string; // Reference to specific law/regulation

  @Column({ name: 'union_requirement', type: 'boolean', default: false })
  unionRequirement: boolean; // Required by union agreement

  @Column({ name: 'contract_requirement', type: 'boolean', default: false })
  contractRequirement: boolean; // Required by employment contract

  @Column({ name: 'violation_count', type: 'integer', default: 0 })
  violationCount: number;

  @Column({ name: 'last_violation_date', type: 'timestamp', nullable: true })
  lastViolationDate?: Date;

  @Column({ name: 'compliance_rate', type: 'decimal', precision: 5, scale: 2, default: 100 })
  complianceRate: number; // Percentage compliance

  @Column({ name: 'auto_enforce', type: 'boolean', default: true })
  autoEnforce: boolean; // Automatically prevent violations

  @Column({ name: 'notification_enabled', type: 'boolean', default: true })
  notificationEnabled: boolean;

  @Column({ name: 'notification_threshold', type: 'decimal', precision: 5, scale: 2, default: 80 })
  notificationThreshold: number; // Notify when X% of limit reached

  @Column({ 
    name: 'custom_rules',
    type: 'jsonb',
    default: []
  })
  customRules: ConstraintRule[]; // Additional custom rules

  @Column({ 
    name: 'exception_conditions',
    type: 'jsonb',
    default: []
  })
  exceptionConditions: string[]; // Conditions under which constraint can be ignored

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.workTimeConstraints, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

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

  // Virtual fields
  get isCurrentlyActive(): boolean {
    const now = new Date();
    
    if (this.effectiveStartDate && this.effectiveStartDate > now) return false;
    if (this.effectiveEndDate && this.effectiveEndDate < now) return false;
    
    return this.status === ConstraintStatus.ACTIVE && this.isActive && !this.deletedAt;
  }

  get isExpired(): boolean {
    if (!this.effectiveEndDate) return false;
    return this.effectiveEndDate < new Date();
  }

  get effectiveValue(): number {
    // Apply tolerance if flexible
    if (this.isFlexible && this.tolerancePercentage > 0) {
      return this.constraintValue * (1 + this.tolerancePercentage / 100);
    }
    return this.constraintValue;
  }

  get warningThreshold(): number {
    return this.violationThresholds?.warningThreshold || this.notificationThreshold;
  }

  get displayName(): string {
    return this.constraintName || this.constraintType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get constraintLabel(): string {
    const typeLabel = this.constraintType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${typeLabel}: ${this.constraintValue} ${this.valueUnit}`;
  }

  get scopeLabel(): string {
    return this.scope.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get severityLabel(): string {
    return this.severity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get isCritical(): boolean {
    return this.severity === ConstraintSeverity.CRITICAL || 
           this.legalRequirement || 
           this.isHardConstraint;
  }

  get isEnforceable(): boolean {
    return this.autoEnforce && this.isCurrentlyActive;
  }

  get complianceStatus(): string {
    if (this.complianceRate >= 95) return 'Excellent';
    if (this.complianceRate >= 85) return 'Good';
    if (this.complianceRate >= 70) return 'Fair';
    return 'Poor';
  }

  get needsAttention(): boolean {
    return this.complianceRate < 80 || this.violationCount > 10;
  }

  // Helper methods
  isApplicableToDay(dayOfWeek: number): boolean {
    return this.applicableDays.includes(dayOfWeek);
  }

  isApplicableToShiftType(shiftType: string): boolean {
    return !this.excludedShiftTypes.includes(shiftType);
  }

  calculateViolationSeverity(actualValue: number): ConstraintSeverity {
    const percentage = (actualValue / this.constraintValue) * 100;
    
    if (!this.violationThresholds) return this.severity;
    
    if (percentage >= this.violationThresholds.criticalThreshold) {
      return ConstraintSeverity.CRITICAL;
    } else if (percentage >= this.violationThresholds.errorThreshold) {
      return ConstraintSeverity.ERROR;
    } else if (percentage >= this.violationThresholds.warningThreshold) {
      return ConstraintSeverity.WARNING;
    }
    
    return ConstraintSeverity.INFO;
  }
}