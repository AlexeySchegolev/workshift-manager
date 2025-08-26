import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Organization } from './organization.entity';
import { Employee } from './employee.entity';
import { Shift } from './shift.entity';

export enum RoleType {
  SPECIALIST = 'specialist',
  ASSISTANT = 'assistant',
  SHIFT_LEADER = 'shift_leader',
  NURSE = 'nurse',
  NURSE_MANAGER = 'nurse_manager',
  HELPER = 'helper',
  DOCTOR = 'doctor',
  TECHNICIAN = 'technician',
  ADMINISTRATOR = 'administrator',
  CLEANER = 'cleaner',
  SECURITY = 'security',
  OTHER = 'other'
}

export enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated'
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.OTHER,
  })
  type: RoleType;

  @Column({
    type: 'enum',
    enum: RoleStatus,
    default: RoleStatus.ACTIVE,
  })
  status: RoleStatus;

  @Column({ name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Column({ name: 'overtime_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  overtimeRate?: number;

  @Column({ name: 'min_experience_months', type: 'integer', default: 0 })
  minExperienceMonths: number;

  @Column({ 
    name: 'required_certifications',
    type: 'jsonb',
    default: []
  })
  requiredCertifications: string[];

  @Column({ 
    name: 'required_skills',
    type: 'jsonb',
    default: []
  })
  requiredSkills: string[];

  @Column({ 
    name: 'permissions',
    type: 'jsonb',
    default: []
  })
  permissions: string[];

  @Column({ name: 'can_work_nights', type: 'boolean', default: true })
  canWorkNights: boolean;

  @Column({ name: 'can_work_weekends', type: 'boolean', default: true })
  canWorkWeekends: boolean;

  @Column({ name: 'can_work_holidays', type: 'boolean', default: true })
  canWorkHolidays: boolean;

  @Column({ name: 'max_consecutive_days', type: 'integer', default: 6 })
  maxConsecutiveDays: number;

  @Column({ name: 'min_rest_hours', type: 'integer', default: 11 })
  minRestHours: number;

  @Column({ name: 'max_weekly_hours', type: 'decimal', precision: 5, scale: 2, default: 40.0 })
  maxWeeklyHours: number;

  @Column({ name: 'max_monthly_hours', type: 'decimal', precision: 5, scale: 2, default: 160.0 })
  maxMonthlyHours: number;

  @Column({ name: 'priority_level', type: 'integer', default: 1 })
  priorityLevel: number; // 1-10, higher = more important

  @Column({ name: 'color_code', type: 'varchar', length: 7, nullable: true })
  colorCode?: string; // Hex color for UI display

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Organization, organization => organization.roles)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToMany(() => Employee, employee => employee.roles)
  employees: Employee[];

  @ManyToMany(() => Shift, shift => shift.requiredRoles)
  shifts: Shift[];

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
  get isAvailable(): boolean {
    return this.status === RoleStatus.ACTIVE && this.isActive && !this.deletedAt;
  }

  get displayName(): string {
    return `${this.name} (${this.type})`;
  }
}