import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

export enum AvailabilityType {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  PREFERRED = 'preferred',
  LIMITED = 'limited'
}

export enum AvailabilityStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum AbsenceReason {
  VACATION = 'vacation',
  SICK_LEAVE = 'sick_leave',
  PERSONAL_LEAVE = 'personal_leave',
  MATERNITY_LEAVE = 'maternity_leave',
  PATERNITY_LEAVE = 'paternity_leave',
  BEREAVEMENT = 'bereavement',
  JURY_DUTY = 'jury_duty',
  MILITARY_DUTY = 'military_duty',
  TRAINING = 'training',
  CONFERENCE = 'conference',
  UNPAID_LEAVE = 'unpaid_leave',
  SABBATICAL = 'sabbatical',
  MEDICAL_APPOINTMENT = 'medical_appointment',
  FAMILY_EMERGENCY = 'family_emergency',
  RELIGIOUS_OBSERVANCE = 'religious_observance',
  OTHER = 'other'
}

export enum RecurrencePattern {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface TimeSlotAvailability {
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  isAvailable: boolean;
  notes?: string;
}

export interface WeeklyAvailability {
  monday: TimeSlotAvailability[];
  tuesday: TimeSlotAvailability[];
  wednesday: TimeSlotAvailability[];
  thursday: TimeSlotAvailability[];
  friday: TimeSlotAvailability[];
  saturday: TimeSlotAvailability[];
  sunday: TimeSlotAvailability[];
}

@Entity('employee_availabilities')
export class EmployeeAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({
    type: 'enum',
    enum: AvailabilityType,
    default: AvailabilityType.AVAILABLE,
  })
  type: AvailabilityType;

  @Column({
    type: 'enum',
    enum: AvailabilityStatus,
    default: AvailabilityStatus.ACTIVE,
  })
  status: AvailabilityStatus;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime?: string; // For partial day availability

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime?: string; // For partial day availability

  @Column({ name: 'is_all_day', type: 'boolean', default: true })
  isAllDay: boolean;

  @Column({ name: 'is_recurring', type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({
    name: 'recurrence_pattern',
    type: 'enum',
    enum: RecurrencePattern,
    default: RecurrencePattern.NONE,
  })
  recurrencePattern: RecurrencePattern;

  @Column({ name: 'recurrence_interval', type: 'integer', default: 1 })
  recurrenceInterval: number; // Every X days/weeks/months

  @Column({ 
    name: 'recurrence_days',
    type: 'jsonb',
    default: []
  })
  recurrenceDays: number[]; // Days of week (0=Sunday, 1=Monday, etc.)

  @Column({ name: 'recurrence_end_date', type: 'date', nullable: true })
  recurrenceEndDate?: Date;

  @Column({
    name: 'absence_reason',
    type: 'enum',
    enum: AbsenceReason,
    nullable: true,
  })
  absenceReason?: AbsenceReason;

  @Column({ name: 'reason_description', type: 'text', nullable: true })
  reasonDescription?: string;

  @Column({ 
    name: 'weekly_availability',
    type: 'jsonb',
    nullable: true
  })
  weeklyAvailability?: WeeklyAvailability;

  @Column({ name: 'max_hours_per_day', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxHoursPerDay?: number;

  @Column({ name: 'max_hours_per_week', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxHoursPerWeek?: number;

  @Column({ name: 'preferred_shift_types', type: 'jsonb', default: [] })
  preferredShiftTypes: string[];

  @Column({ name: 'excluded_shift_types', type: 'jsonb', default: [] })
  excludedShiftTypes: string[];

  @Column({ name: 'preferred_locations', type: 'jsonb', default: [] })
  preferredLocations: string[]; // Location IDs

  @Column({ name: 'excluded_locations', type: 'jsonb', default: [] })
  excludedLocations: string[]; // Location IDs

  @Column({ name: 'priority_level', type: 'integer', default: 1 })
  priorityLevel: number; // 1-5, higher = more important

  @Column({ name: 'requires_approval', type: 'boolean', default: false })
  requiresApproval: boolean;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy?: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ name: 'rejected_by', type: 'uuid', nullable: true })
  rejectedBy?: string;

  @Column({ name: 'rejected_at', type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @Column({ name: 'is_emergency', type: 'boolean', default: false })
  isEmergency: boolean;

  @Column({ name: 'affects_payroll', type: 'boolean', default: false })
  affectsPayroll: boolean;

  @Column({ name: 'documentation_required', type: 'boolean', default: false })
  documentationRequired: boolean;

  @Column({ name: 'documentation_provided', type: 'boolean', default: false })
  documentationProvided: boolean;

  @Column({ 
    name: 'attached_documents',
    type: 'jsonb',
    default: []
  })
  attachedDocuments: string[]; // File URLs or IDs

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes?: string; // Only visible to managers

  @Column({ name: 'notification_sent', type: 'boolean', default: false })
  notificationSent: boolean;

  @Column({ name: 'reminder_sent', type: 'boolean', default: false })
  reminderSent: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.availabilities)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

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

  // Computed properties
  get isCurrentlyActive(): boolean {
    const now = new Date();
    const startDate = new Date(this.startDate);
    const endDate = this.endDate ? new Date(this.endDate) : null;
    
    return this.isActive && 
           this.status === AvailabilityStatus.ACTIVE &&
           startDate <= now &&
           (!endDate || endDate >= now);
  }

  get duration(): number {
    if (!this.endDate) return 1;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isExpired(): boolean {
    if (!this.endDate) return false;
    const now = new Date();
    const endDate = new Date(this.endDate);
    return endDate < now;
  }

  get isPending(): boolean {
    return this.requiresApproval && !this.approvedAt && !this.rejectedAt;
  }

  get needsApproval(): boolean {
    return this.requiresApproval && !this.approvedAt;
  }

  get isAbsence(): boolean {
    return this.type === AvailabilityType.UNAVAILABLE || 
           this.absenceReason !== null;
  }

  get displayReason(): string {
    if (this.absenceReason) {
      return this.absenceReason.replace(/_/g, ' ').toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    return this.type.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  get timeRange(): string {
    if (this.isAllDay) return 'All Day';
    if (!this.startTime || !this.endTime) return 'All Day';
    return `${this.startTime} - ${this.endTime}`;
  }

  get dateRange(): string {
    const startStr = this.startDate.toLocaleDateString('de-DE');
    if (!this.endDate) return startStr;
    const endStr = this.endDate.toLocaleDateString('de-DE');
    return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
  }
}