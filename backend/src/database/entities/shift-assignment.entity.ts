import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { ShiftPlan } from './shift-plan.entity';

@Entity('shift_assignments')
export class ShiftAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_plan_id', type: 'uuid' })
  shiftPlanId: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ type: 'varchar', length: 20 })
  date: string; // Format: "DD.MM.YYYY"

  @Column({ name: 'shift_type', type: 'varchar', length: 10 })
  shiftType: string; // "F", "S", "FS", etc.

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hours: number;

  @Column({ name: 'start_time', type: 'varchar', length: 5, nullable: true })
  startTime?: string; // Format: "HH:MM"

  @Column({ name: 'end_time', type: 'varchar', length: 5, nullable: true })
  endTime?: string; // Format: "HH:MM"

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relationships
  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.assignments)
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan: ShiftPlan;

  @ManyToOne(() => Employee, employee => employee.shiftAssignments)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}