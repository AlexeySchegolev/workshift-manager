import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { Shift } from './shift.entity';
import { ShiftPlan } from './shift-plan.entity';
import { Role } from './role.entity';

export enum AssignmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

export enum AssignmentType {
  REGULAR = 'regular',
  OVERTIME = 'overtime',
  REPLACEMENT = 'replacement',
  VOLUNTARY = 'voluntary',
  MANDATORY = 'mandatory'
}

@Entity('shift_assignments')
export class ShiftAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_id', type: 'uuid' })
  shiftId: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'shift_plan_id', type: 'uuid', nullable: true })
  shiftPlanId?: string;

  @Column({ name: 'role_id', type: 'uuid', nullable: true })
  roleId?: string;

  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.PENDING,
  })
  status: AssignmentStatus;

  @Column({
    name: 'assignment_type',
    type: 'enum',
    enum: AssignmentType,
    default: AssignmentType.REGULAR,
  })
  assignmentType: AssignmentType;

  @Column({ name: 'assignment_date', type: 'date' })
  assignmentDate: Date;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'break_duration', type: 'integer', default: 30 })
  breakDuration: number; // in minutes

  @Column({ name: 'scheduled_hours', type: 'decimal', precision: 5, scale: 2 })
  scheduledHours: number;

  @Column({ name: 'actual_hours', type: 'decimal', precision: 5, scale: 2, nullable: true })
  actualHours?: number;

  @Column({ name: 'overtime_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Column({ name: 'overtime_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  overtimeRate?: number;

  @Column({ name: 'total_pay', type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPay?: number;

  @Column({ name: 'check_in_time', type: 'timestamp', nullable: true })
  checkInTime?: Date;

  @Column({ name: 'check_out_time', type: 'timestamp', nullable: true })
  checkOutTime?: Date;

  @Column({ name: 'is_overtime', type: 'boolean', default: false })
  isOvertime: boolean;

  @Column({ name: 'is_holiday', type: 'boolean', default: false })
  isHoliday: boolean;

  @Column({ name: 'is_weekend', type: 'boolean', default: false })
  isWeekend: boolean;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ name: 'declined_at', type: 'timestamp', nullable: true })
  declinedAt?: Date;

  @Column({ name: 'decline_reason', type: 'text', nullable: true })
  declineReason?: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ name: 'replacement_requested', type: 'boolean', default: false })
  replacementRequested: boolean;

  @Column({ name: 'replacement_found', type: 'boolean', default: false })
  replacementFound: boolean;

  @Column({ name: 'replacement_employee_id', type: 'uuid', nullable: true })
  replacementEmployeeId?: string;

  @Column({ name: 'auto_assigned', type: 'boolean', default: false })
  autoAssigned: boolean;

  @Column({ name: 'assignment_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  assignmentScore?: number; // Algorithm score for assignment quality

  @Column({ name: 'priority_level', type: 'integer', default: 1 })
  priorityLevel: number; // 1-5, higher = more important

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes?: string; // Only visible to managers

  // Relationships
  @ManyToOne(() => Shift, shift => shift.assignments)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @ManyToOne(() => Employee, employee => employee.shiftAssignments)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.assignments, { nullable: true })
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan?: ShiftPlan;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'replacement_employee_id' })
  replacementEmployee?: Employee;

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

  get isActive(): boolean {
    return [AssignmentStatus.PENDING, AssignmentStatus.CONFIRMED].includes(this.status) && !this.deletedAt;
  }
}