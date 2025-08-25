import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ShiftAssignment } from './shift-assignment.entity';
import { ConstraintViolation } from './constraint-violation.entity';

export interface DayShiftPlan {
  /** Shift name mapped to array of employee IDs */
  [shiftName: string]: string[];
}

export interface MonthlyShiftPlan {
  /** Date key in DD.MM.YYYY format mapped to day shift plan */
  [dateKey: string]: DayShiftPlan | null;
}

@Entity('shift_plans')
export class ShiftPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  year: number;

  @Column({ type: 'integer' })
  month: number;

  @Column({ 
    name: 'plan_data',
    type: 'jsonb',
    nullable: true
  })
  planData: MonthlyShiftPlan;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  // Relationships
  @OneToMany(() => ShiftAssignment, assignment => assignment.shiftPlan)
  assignments: ShiftAssignment[];

  @OneToMany(() => ConstraintViolation, violation => violation.shiftPlan)
  violations: ConstraintViolation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}