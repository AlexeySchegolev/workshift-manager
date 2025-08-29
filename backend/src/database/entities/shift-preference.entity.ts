import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { Shift } from './shift.entity';
import { Location } from './location.entity';
import { Role } from './role.entity';

export enum PreferenceType {
  PREFERRED = 'preferred',
  NOT_PREFERRED = 'not_preferred',
  UNAVAILABLE = 'unavailable',
  NEUTRAL = 'neutral'
}

export enum PreferenceCategory {
  SHIFT_TIME = 'shift_time',
  SHIFT_TYPE = 'shift_type',
  LOCATION = 'location',
  ROLE = 'role',
  DAY_OF_WEEK = 'day_of_week',
  DATE_SPECIFIC = 'date_specific',
  COLLEAGUE = 'colleague',
  WORKLOAD = 'workload',
  OVERTIME = 'overtime',
  WEEKEND = 'weekend',
  HOLIDAY = 'holiday',
  CONSECUTIVE_DAYS = 'consecutive_days',
  GENERAL = 'general'
}

export enum PreferenceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export interface TimePreference {
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  preference: PreferenceType;
  weight: number;    // 1-10 scale
}

export interface DayOfWeekPreference {
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  preference: PreferenceType;
  weight: number;
  timeSlots?: TimePreference[];
}

@Entity('shift_preferences')
export class ShiftPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'shift_id', type: 'uuid', nullable: true })
  shiftId?: string; // For specific shift preferences

  @Column({ name: 'location_id', type: 'uuid', nullable: true })
  locationId?: string; // For location preferences

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId?: string; // For role preferences

  @Column({
    type: 'enum',
    enum: PreferenceType,
    default: PreferenceType.NEUTRAL,
  })
  preference: PreferenceType;

  @Column({
    type: 'enum',
    enum: PreferenceCategory,
    default: PreferenceCategory.GENERAL,
  })
  category: PreferenceCategory;

  @Column({
    type: 'enum',
    enum: PreferenceStatus,
    default: PreferenceStatus.ACTIVE,
  })
  status: PreferenceStatus;

  @Column({ name: 'preference_name', type: 'varchar', length: 255 })
  preferenceName: string;

  @Column({ name: 'preference_description', type: 'text', nullable: true })
  preferenceDescription?: string;

  @Column({ name: 'weight', type: 'integer', default: 5 })
  weight: number; // 1-10 scale, higher = more important

  @Column({ name: 'priority_level', type: 'integer', default: 1 })
  priorityLevel: number; // 1-5, higher = more critical

  @Column({ name: 'is_flexible', type: 'boolean', default: true })
  isFlexible: boolean; // Can this preference be overridden if necessary?

  @Column({ name: 'is_hard_constraint', type: 'boolean', default: false })
  isHardConstraint: boolean; // Must this preference be respected?

  @Column({ name: 'effective_start_date', type: 'date', nullable: true })
  effectiveStartDate?: Date;

  @Column({ name: 'effective_end_date', type: 'date', nullable: true })
  effectiveEndDate?: Date;

  @Column({ name: 'specific_date', type: 'date', nullable: true })
  specificDate?: Date; // For date-specific preferences

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime?: string; // For time-based preferences

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime?: string; // For time-based preferences

  @Column({ 
    name: 'days_of_week',
    type: 'jsonb',
    default: []
  })
  daysOfWeek: number[]; // 0=Sunday, 1=Monday, etc.

  @Column({ 
    name: 'shift_types',
    type: 'jsonb',
    default: []
  })
  shiftTypes: string[]; // Preferred/excluded shift types

  @Column({ 
    name: 'time_preferences',
    type: 'jsonb',
    default: []
  })
  timePreferences: TimePreference[];

  @Column({ 
    name: 'day_preferences',
    type: 'jsonb',
    default: []
  })
  dayPreferences: DayOfWeekPreference[];

  @Column({ name: 'max_hours_per_day', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxHoursPerDay?: number;

  @Column({ name: 'max_hours_per_week', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxHoursPerWeek?: number;

  @Column({ name: 'max_consecutive_days', type: 'integer', nullable: true })
  maxConsecutiveDays?: number;

  @Column({ name: 'min_rest_hours', type: 'integer', nullable: true })
  minRestHours?: number;

  @Column({ name: 'prefers_overtime', type: 'boolean', nullable: true })
  prefersOvertime?: boolean;

  @Column({ name: 'prefers_weekends', type: 'boolean', nullable: true })
  prefersWeekends?: boolean;

  @Column({ name: 'prefers_holidays', type: 'boolean', nullable: true })
  prefersHolidays?: boolean;

  @Column({ name: 'prefers_night_shifts', type: 'boolean', nullable: true })
  prefersNightShifts?: boolean;

  @Column({ 
    name: 'preferred_colleagues',
    type: 'jsonb',
    default: []
  })
  preferredColleagues: string[]; // Employee IDs

  @Column({ 
    name: 'avoided_colleagues',
    type: 'jsonb',
    default: []
  })
  avoidedColleagues: string[]; // Employee IDs

  @Column({ 
    name: 'preferred_locations',
    type: 'jsonb',
    default: []
  })
  preferredLocations: string[]; // Location IDs

  @Column({ 
    name: 'avoided_locations',
    type: 'jsonb',
    default: []
  })
  avoidedLocations: string[]; // Location IDs

  @Column({ 
    name: 'preferred_roles',
    type: 'jsonb',
    default: []
  })
  preferredRoles: string[]; // Role IDs

  @Column({ 
    name: 'avoided_roles',
    type: 'jsonb',
    default: []
  })
  avoidedRoles: string[]; // Role IDs

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason?: string; // Why this preference exists

  @Column({ name: 'is_temporary', type: 'boolean', default: false })
  isTemporary: boolean;

  @Column({ name: 'is_recurring', type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurrence_pattern', type: 'varchar', length: 100, nullable: true })
  recurrencePattern?: string; // e.g., "weekly", "monthly"

  @Column({ name: 'auto_generated', type: 'boolean', default: false })
  autoGenerated: boolean; // Generated by system based on patterns

  @Column({ name: 'learning_weight', type: 'decimal', precision: 5, scale: 2, default: 1.0 })
  learningWeight: number; // Adjusted by ML algorithms

  @Column({ name: 'satisfaction_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  satisfactionScore?: number; // How well this preference is being met

  @Column({ name: 'violation_count', type: 'integer', default: 0 })
  violationCount: number; // How many times this preference was violated

  @Column({ name: 'last_violation_date', type: 'date', nullable: true })
  lastViolationDate?: Date;

  @Column({ name: 'fulfillment_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  fulfillmentRate: number; // Percentage of time this preference is met

  @Column({ 
    name: 'tags',
    type: 'jsonb',
    default: []
  })
  tags: string[]; // For categorization and filtering

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.shiftPreferences)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Shift, { nullable: true })
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