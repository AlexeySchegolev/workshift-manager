import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShiftPlan } from './shift-plan.entity';
import { Employee } from './employee.entity';
import { Shift } from './shift.entity';
import { User } from './user.entity';

export enum ViolationType {
  HARD = 'hard',
  SOFT = 'soft',
  WARNING = 'warning',
  INFO = 'info'
}

export enum ConstraintStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  IGNORED = 'ignored',
  PENDING = 'pending'
}

export enum ConstraintCategory {
  STAFFING = 'staffing',
  SCHEDULING = 'scheduling',
  WORKTIME = 'worktime',
  SKILLS = 'skills',
  AVAILABILITY = 'availability',
  LEGAL = 'legal',
  PREFERENCE = 'preference',
  BUSINESS_RULE = 'business_rule',
  OVERTIME = 'overtime',
  REST_PERIOD = 'rest_period',
  CONSECUTIVE_DAYS = 'consecutive_days',
  ROLE_REQUIREMENT = 'role_requirement',
  LOCATION = 'location',
  OTHER = 'other'
}

@Entity('constraint_violations')
export class ConstraintViolation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_plan_id', type: 'uuid', nullable: true })
  shiftPlanId?: string;

  @Column({ name: 'shift_id', type: 'uuid', nullable: true })
  shiftId?: string;

  @Column({ name: 'employee_id', type: 'uuid', nullable: true })
  employeeId?: string;

  @Column({
    type: 'enum',
    enum: ViolationType,
  })
  type: ViolationType;

  @Column({
    type: 'enum',
    enum: ConstraintCategory,
    default: ConstraintCategory.OTHER,
  })
  category: ConstraintCategory;

  @Column({
    type: 'enum',
    enum: ConstraintStatus,
    default: ConstraintStatus.ACTIVE,
  })
  status: ConstraintStatus;

  @Column({ name: 'rule_code', type: 'varchar', length: 100 })
  ruleCode: string; // Unique identifier for the rule

  @Column({ name: 'rule_name', type: 'varchar', length: 255 })
  ruleName: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'detailed_message', type: 'text', nullable: true })
  detailedMessage?: string;

  @Column({ name: 'suggested_action', type: 'text', nullable: true })
  suggestedAction?: string;

  @Column({ type: 'integer', default: 1 })
  severity: number; // 1-5 scale (1=info, 2=low, 3=medium, 4=high, 5=critical)

  @Column({ name: 'priority_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  priorityScore: number; // Calculated priority for resolution order

  @Column({ name: 'violation_date', type: 'date', nullable: true })
  violationDate?: Date;

  @Column({ name: 'violation_time', type: 'time', nullable: true })
  violationTime?: string;

  @Column({ name: 'shift_type', type: 'varchar', length: 50, nullable: true })
  shiftType?: string;

  @Column({
    name: 'context_data',
    type: 'jsonb',
    default: {}
  })
  contextData: Record<string, any>; // Additional context for the violation

  @Column({
    name: 'affected_entities',
    type: 'jsonb',
    default: []
  })
  affectedEntities: string[]; // IDs of other affected entities

  @Column({ name: 'auto_resolvable', type: 'boolean', default: false })
  autoResolvable: boolean;

  @Column({ name: 'resolution_attempts', type: 'integer', default: 0 })
  resolutionAttempts: number;

  @Column({ name: 'last_resolution_attempt', type: 'timestamp', nullable: true })
  lastResolutionAttempt?: Date;

  @Column({ name: 'is_resolved', type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @Column({ name: 'resolved_by', type: 'uuid', nullable: true })
  resolvedBy?: string;

  @Column({ name: 'resolution_method', type: 'varchar', length: 100, nullable: true })
  resolutionMethod?: string; // 'manual', 'automatic', 'ignored'

  @Column({ name: 'resolution_notes', type: 'text', nullable: true })
  resolutionNotes?: string;

  @Column({ name: 'ignored_reason', type: 'text', nullable: true })
  ignoredReason?: string;

  @Column({ name: 'ignored_by', type: 'uuid', nullable: true })
  ignoredBy?: string;

  @Column({ name: 'ignored_at', type: 'timestamp', nullable: true })
  ignoredAt?: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date; // When this violation becomes irrelevant

  @Column({ name: 'notification_sent', type: 'boolean', default: false })
  notificationSent: boolean;

  @Column({ name: 'notification_sent_at', type: 'timestamp', nullable: true })
  notificationSentAt?: Date;

  @Column({
    name: 'tags',
    type: 'jsonb',
    default: []
  })
  tags: string[]; // For categorization and filtering

  // Relationships
  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.violations, { nullable: true })
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan?: ShiftPlan;

  @ManyToOne(() => Shift, { nullable: true })
  @JoinColumn({ name: 'shift_id' })
  shift?: Shift;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  @ManyToOne(() => User, user => user.resolvedViolations, { nullable: true })
  @JoinColumn({ name: 'resolved_by' })
  resolvedByUser?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ignored_by' })
  ignoredByUser?: User;

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
  get isActive(): boolean {
    return this.status === ConstraintStatus.ACTIVE && !this.isResolved && !this.deletedAt;
  }

  get isCritical(): boolean {
    return this.severity >= 4 || this.type === ViolationType.HARD;
  }

  get isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  get ageInHours(): number {
    return (new Date().getTime() - this.createdAt.getTime()) / (1000 * 60 * 60);
  }

  get severityLabel(): string {
    const labels = ['', 'Info', 'Low', 'Medium', 'High', 'Critical'];
    return labels[this.severity] || 'Unknown';
  }

  get displayMessage(): string {
    return this.detailedMessage || this.message;
  }
}