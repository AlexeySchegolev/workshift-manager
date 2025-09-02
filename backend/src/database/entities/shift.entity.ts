import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Organization } from './organization.entity';
import { Location } from './location.entity';
import { Role } from './role.entity';
import { ShiftPlan } from './shift-plan.entity';

export enum ShiftType {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night',
  FULL_DAY = 'full_day',
  SPLIT = 'split',
  ON_CALL = 'on_call',
  OVERTIME = 'overtime'
}

export enum ShiftStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ShiftPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  CRITICAL = 4,
  EMERGENCY = 5
}

export interface ShiftRoleRequirement {
  roleId: string;
  requiredCount: number;
  minCount: number;
  maxCount: number;
  priority: number;
}

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ name: 'location_id', type: 'uuid' })
  locationId: string;

  @Column({ name: 'shift_plan_id', type: 'uuid', nullable: true })
  shiftPlanId?: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ShiftType,
    default: ShiftType.MORNING,
  })
  type: ShiftType;

  @Column({
    type: 'enum',
    enum: ShiftStatus,
    default: ShiftStatus.DRAFT,
  })
  status: ShiftStatus;

  @Column({
    type: 'enum',
    enum: ShiftPriority,
    default: ShiftPriority.NORMAL,
  })
  priority: ShiftPriority;

  @Column({ name: 'shift_date', type: 'date' })
  shiftDate: Date;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'break_duration', type: 'integer', default: 30 })
  breakDuration: number; // in minutes

  @Column({ name: 'total_hours', type: 'decimal', precision: 5, scale: 2 })
  totalHours: number;

  @Column({ name: 'min_employees', type: 'integer', default: 1 })
  minEmployees: number;

  @Column({ name: 'max_employees', type: 'integer', default: 10 })
  maxEmployees: number;

  @Column({ name: 'current_employees', type: 'integer', default: 0 })
  currentEmployees: number;

  @Column({ 
    name: 'role_requirements',
    type: 'jsonb',
    default: []
  })
  roleRequirements: ShiftRoleRequirement[];

  @Column({ 
    name: 'required_skills',
    type: 'jsonb',
    default: []
  })
  requiredSkills: string[];

  @Column({ 
    name: 'required_certifications',
    type: 'jsonb',
    default: []
  })
  requiredCertifications: string[];

  @Column({ name: 'is_overtime', type: 'boolean', default: false })
  isOvertime: boolean;

  @Column({ name: 'overtime_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  overtimeRate?: number;

  @Column({ name: 'is_holiday', type: 'boolean', default: false })
  isHoliday: boolean;

  @Column({ name: 'holiday_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  holidayRate?: number;

  @Column({ name: 'is_weekend', type: 'boolean', default: false })
  isWeekend: boolean;

  @Column({ name: 'weekend_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  weekendRate?: number;

  @Column({ name: 'color_code', type: 'varchar', length: 7, nullable: true })
  colorCode?: string; // Hex color for UI display

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'is_recurring', type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurrence_pattern', type: 'varchar', length: 100, nullable: true })
  recurrencePattern?: string; // e.g., "weekly", "monthly", "daily"

  @Column({ name: 'recurrence_end_date', type: 'date', nullable: true })
  recurrenceEndDate?: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Location, location => location.shifts)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.shifts, { nullable: true })
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan?: ShiftPlan;

  @ManyToMany(() => Role, role => role.shifts)
  @JoinTable({
    name: 'shift_required_roles',
    joinColumn: { name: 'shift_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  requiredRoles: Role[];


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
  get isFullyStaffed(): boolean {
    return this.currentEmployees >= this.minEmployees;
  }

  get isOverStaffed(): boolean {
    return this.currentEmployees > this.maxEmployees;
  }

  get staffingPercentage(): number {
    return this.minEmployees > 0 ? (this.currentEmployees / this.minEmployees) * 100 : 0;
  }

  get duration(): number {
    // Calculate duration in hours
    const start = new Date(`2000-01-01T${this.startTime}`);
    const end = new Date(`2000-01-01T${this.endTime}`);
    
    // Handle overnight shifts
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  get effectiveHours(): number {
    return this.totalHours - (this.breakDuration / 60);
  }

  get isAvailable(): boolean {
    return this.status === ShiftStatus.PUBLISHED && this.isActive && !this.deletedAt;
  }
}