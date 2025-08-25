import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShiftPlan } from './shift-plan.entity';
import { Employee } from './employee.entity';

export enum ViolationType {
  HARD = 'hard',
  SOFT = 'soft',
}

export enum ConstraintStatus {
  OK = 'ok',
  WARNING = 'warning',
  VIOLATION = 'violation',
  INFO = 'info',
}

@Entity('constraint_violations')
export class ConstraintViolation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_plan_id', type: 'uuid' })
  shiftPlanId: string;

  @Column({
    type: 'enum',
    enum: ViolationType,
  })
  type: ViolationType;

  @Column({ type: 'varchar', length: 100 })
  rule: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: ConstraintStatus,
    default: ConstraintStatus.VIOLATION,
  })
  status: ConstraintStatus;

  @Column({ name: 'employee_id', type: 'uuid', nullable: true })
  employeeId?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  date?: string; // Format: "DD.MM.YYYY"

  @Column({ name: 'shift_type', type: 'varchar', length: 10, nullable: true })
  shiftType?: string;

  @Column({ type: 'integer', default: 1 })
  severity: number; // 1-5 scale

  @Column({ name: 'is_resolved', type: 'boolean', default: false })
  isResolved: boolean;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @Column({ name: 'resolved_by', type: 'uuid', nullable: true })
  resolvedBy?: string;

  // Relationships
  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.violations)
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan: ShiftPlan;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}