import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Shift } from './shift.entity';

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

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'integer' })
  year: number;

  @Column({ type: 'integer' })
  month: number;

  @Column({ name: 'planning_period_start', type: 'date' })
  planningPeriodStart: Date;

  @Column({ name: 'planning_period_end', type: 'date' })
  planningPeriodEnd: Date;


  @Column({
    name: 'plan_data',
    type: 'jsonb',
    nullable: true
  })
  planData: MonthlyShiftPlan;

  @Column({ name: 'total_shifts', type: 'integer', default: 0 })
  totalShifts: number;

  @Column({ name: 'total_hours', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalHours: number;

  @Column({ name: 'total_employees', type: 'integer', default: 0 })
  totalEmployees: number;

  @Column({ name: 'coverage_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  coveragePercentage: number;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;

  // Relationships
  @ManyToOne(() => Organization, organization => organization.shiftPlans)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User, user => user.createdShiftPlans, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: User;


  @OneToMany(() => Shift, shift => shift.shiftPlan)
  shifts: Shift[];


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