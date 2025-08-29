import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { ShiftPlan } from './shift-plan.entity';

/**
 * Entity for tracking employee availability and workload during shift planning algorithm execution.
 * This is different from EmployeeAvailability which handles general availability patterns.
 * This entity tracks real-time state during shift planning calculations.
 */
@Entity('shift_planning_availability')
export class ShiftPlanningAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'shift_plan_id', type: 'uuid' })
  shiftPlanId: string;

  @Column({ name: 'weekly_hours_assigned', type: 'decimal', precision: 5, scale: 2, default: 0 })
  weeklyHoursAssigned: number;

  @Column({ name: 'total_hours_assigned', type: 'decimal', precision: 5, scale: 2, default: 0 })
  totalHoursAssigned: number;

  @Column({ name: 'shifts_assigned', type: 'jsonb', default: [] })
  shiftsAssigned: string[];

  @Column({ name: 'last_shift_type', type: 'varchar', length: 50, nullable: true })
  lastShiftType?: string;

  @Column({ name: 'saturdays_worked', type: 'integer', default: 0 })
  saturdaysWorked: number;

  @Column({ name: 'consecutive_days_count', type: 'integer', default: 0 })
  consecutiveDaysCount: number;

  @Column({ name: 'workload_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  workloadPercentage: number;

  @Column({ name: 'current_week_number', type: 'integer', nullable: true })
  currentWeekNumber?: number;

  @Column({ name: 'last_assignment_date', type: 'date', nullable: true })
  lastAssignmentDate?: Date;

  @Column({ name: 'preferred_shifts_assigned', type: 'integer', default: 0 })
  preferredShiftsAssigned: number;

  @Column({ name: 'constraint_violations', type: 'integer', default: 0 })
  constraintViolations: number;

  @Column({ name: 'planning_priority_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  planningPriorityScore: number;

  @Column({ name: 'is_available_for_planning', type: 'boolean', default: true })
  isAvailableForPlanning: boolean;

  @Column({
    name: 'planning_metadata',
    type: 'jsonb',
    default: {}
  })
  planningMetadata: Record<string, any>;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.shiftPlanningAvailabilities)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.shiftPlanningAvailabilities)
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan: ShiftPlan;

  // Audit fields
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Business logic methods
  updateAfterShiftAssignment(shiftHours: number, shiftType: string, dayKey: string, isSaturday?: boolean): void {
    // Add day key to assigned shifts (using dayKey as identifier)
    if (!this.shiftsAssigned.includes(dayKey)) {
      this.shiftsAssigned.push(dayKey);
    }
    
    // Update hours
    this.totalHoursAssigned = Number((this.totalHoursAssigned + shiftHours).toFixed(2));
    this.weeklyHoursAssigned = Number((this.weeklyHoursAssigned + shiftHours).toFixed(2));
    
    // Update last shift info
    this.lastShiftType = shiftType;
    this.lastAssignmentDate = new Date(); // Set to current date for now
    
    // Update consecutive days count (simplified logic)
    this.consecutiveDaysCount++;
    
    // Update Saturday count if specified
    if (isSaturday) {
      this.saturdaysWorked++;
    }
  }

  resetWeeklyCounters(): void {
    this.weeklyHoursAssigned = 0;
    this.currentWeekNumber = null;
    this.consecutiveDaysCount = 0;
  }

  private getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const daysDiff = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    return Math.ceil((daysDiff + startOfYear.getDay() + 1) / 7);
  }
}