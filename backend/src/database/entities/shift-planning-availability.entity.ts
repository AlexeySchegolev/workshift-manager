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

  // Virtual fields
  get isOverWorked(): boolean {
    return this.workloadPercentage > 110; // More than 110% of target hours
  }

  get isUnderWorked(): boolean {
    return this.workloadPercentage < 80; // Less than 80% of target hours
  }

  get hasBalancedWorkload(): boolean {
    return this.workloadPercentage >= 80 && this.workloadPercentage <= 110;
  }

  get averageHoursPerShift(): number {
    return this.shiftsAssigned.length > 0 ? this.totalHoursAssigned / this.shiftsAssigned.length : 0;
  }

  get saturdayRatio(): number {
    return this.shiftsAssigned.length > 0 ? this.saturdaysWorked / this.shiftsAssigned.length : 0;
  }

  get planningEfficiencyScore(): number {
    // Calculate efficiency based on workload balance, constraint violations, and preferences
    let score = 100;
    
    // Penalize for imbalanced workload
    if (!this.hasBalancedWorkload) {
      score -= Math.abs(this.workloadPercentage - 100) * 0.5;
    }
    
    // Penalize for constraint violations
    score -= this.constraintViolations * 10;
    
    // Bonus for preferred shift assignments
    const preferenceRatio = this.shiftsAssigned.length > 0 ? 
      this.preferredShiftsAssigned / this.shiftsAssigned.length : 0;
    score += preferenceRatio * 20;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Reset weekly counters (called at the start of each planning week)
   */
  resetWeeklyCounters(): void {
    this.weeklyHoursAssigned = 0;
    this.lastShiftType = null;
  }

  /**
   * Update availability after assigning a shift
   */
  updateAfterShiftAssignment(
    shiftHours: number, 
    shiftType: string, 
    dayKey: string, 
    isSaturday: boolean = false
  ): void {
    this.weeklyHoursAssigned += shiftHours;
    this.totalHoursAssigned += shiftHours;
    this.shiftsAssigned.push(dayKey);
    this.lastShiftType = shiftType;
    this.lastAssignmentDate = new Date(dayKey.split('.').reverse().join('-'));
    
    if (isSaturday) {
      this.saturdaysWorked += 1;
    }
    
    // Update consecutive days if applicable
    this.updateConsecutiveDaysCount(dayKey);
  }

  /**
   * Calculate and update consecutive days worked
   */
  private updateConsecutiveDaysCount(dayKey: string): void {
    // This would need more complex logic to calculate consecutive days
    // For now, just increment if there was a shift yesterday
    // Implementation would depend on the specific date format and logic needed
    // This is a placeholder for the actual consecutive days calculation
  }
}