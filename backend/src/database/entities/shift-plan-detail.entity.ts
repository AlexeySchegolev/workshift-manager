import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShiftPlan } from './shift-plan.entity';
import { User } from './user.entity';
import { Shift } from './shift.entity';

@Entity('shift_plan_details')
export class ShiftPlanDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_plan_id', type: 'uuid' })
  shiftPlanId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'shift_id', type: 'uuid' })
  shiftId: string;

  @Column({ type: 'integer', comment: 'Day of the month (1-31)' })
  day: number;

  // Relationships
  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.shiftPlanDetails)
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan: ShiftPlan;

  @ManyToOne(() => User, user => user.shiftPlanDetails)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Shift, shift => shift.shiftPlanDetails)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

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
    return !this.deletedAt;
  }
}