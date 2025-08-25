import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('shift_rules')
export class ShiftRules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'min_nurses_per_shift', type: 'integer', default: 2 })
  minNursesPerShift: number;

  @Column({ name: 'min_nurse_managers_per_shift', type: 'integer', default: 1 })
  minNurseManagersPerShift: number;

  @Column({ name: 'min_helpers', type: 'integer', default: 1 })
  minHelpers: number;

  @Column({ name: 'max_saturdays_per_month', type: 'integer', default: 2 })
  maxSaturdaysPerMonth: number;

  @Column({ name: 'max_consecutive_same_shifts', type: 'integer', default: 3 })
  maxConsecutiveSameShifts: number;

  @Column({ 
    name: 'weekly_hours_overflow_tolerance', 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    default: 5.0 
  })
  weeklyHoursOverflowTolerance: number;

  @Column({ name: 'min_rest_hours_between_shifts', type: 'integer', default: 11 })
  minRestHoursBetweenShifts: number;

  @Column({ name: 'max_consecutive_working_days', type: 'integer', default: 6 })
  maxConsecutiveWorkingDays: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}