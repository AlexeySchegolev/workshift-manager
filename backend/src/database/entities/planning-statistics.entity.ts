import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShiftPlan } from './shift-plan.entity';
import { User } from './user.entity';

/**
 * Entity for storing detailed statistics about shift planning results.
 * This entity tracks planning performance, coverage metrics, employee utilization,
 * constraint violations, and optimization scores.
 */
@Entity('planning_statistics')
export class PlanningStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shift_plan_id', type: 'uuid' })
  shiftPlanId: string;

  @Column({ name: 'calculation_timestamp', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  calculationTimestamp: Date;

  @Column({ name: 'total_shifts_planned', type: 'integer', default: 0 })
  totalShiftsPlanned: number;

  @Column({ name: 'total_hours_planned', type: 'decimal', precision: 8, scale: 2, default: 0 })
  totalHoursPlanned: number;

  @Column({ name: 'total_employees_involved', type: 'integer', default: 0 })
  totalEmployeesInvolved: number;

  @Column({ name: 'coverage_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  coveragePercentage: number;

  @Column({ name: 'planning_success_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  planningSuccessRate: number;

  @Column({
    name: 'employee_utilization',
    type: 'jsonb',
    default: {}
  })
  employeeUtilization: Record<string, any>;

  @Column({
    name: 'shift_distribution',
    type: 'jsonb',
    default: {}
  })
  shiftDistribution: Record<string, any>;

  @Column({
    name: 'role_distribution',
    type: 'jsonb',
    default: {}
  })
  roleDistribution: Record<string, any>;

  @Column({
    name: 'location_distribution',
    type: 'jsonb',
    default: {}
  })
  locationDistribution: Record<string, any>;

  @Column({ name: 'constraint_violations_count', type: 'integer', default: 0 })
  constraintViolationsCount: number;

  @Column({ name: 'hard_violations_count', type: 'integer', default: 0 })
  hardViolationsCount: number;

  @Column({ name: 'soft_violations_count', type: 'integer', default: 0 })
  softViolationsCount: number;

  @Column({ name: 'warning_violations_count', type: 'integer', default: 0 })
  warningViolationsCount: number;

  @Column({
    name: 'violation_categories',
    type: 'jsonb',
    default: {}
  })
  violationCategories: Record<string, number>;

  @Column({ name: 'optimization_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  optimizationScore: number;

  @Column({ name: 'workload_balance_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  workloadBalanceScore: number;

  @Column({ name: 'preference_satisfaction_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  preferenceSatisfactionScore: number;

  @Column({ name: 'constraint_compliance_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
  constraintComplianceScore: number;

  @Column({ name: 'average_hours_per_employee', type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageHoursPerEmployee: number;

  @Column({ name: 'standard_deviation_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
  standardDeviationHours: number;

  @Column({ name: 'min_employee_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
  minEmployeeHours: number;

  @Column({ name: 'max_employee_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
  maxEmployeeHours: number;

  @Column({ name: 'saturday_coverage_count', type: 'integer', default: 0 })
  saturdayCoverageCount: number;

  @Column({ name: 'sunday_coverage_count', type: 'integer', default: 0 })
  sundayCoverageCount: number;

  @Column({ name: 'peak_shift_coverage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  peakShiftCoverage: number;

  @Column({ name: 'off_peak_shift_coverage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  offPeakShiftCoverage: number;

  @Column({ name: 'algorithm_used', type: 'varchar', length: 100, nullable: true })
  algorithmUsed?: string;

  @Column({ name: 'planning_duration_ms', type: 'integer', default: 0 })
  planningDurationMs: number;

  @Column({ name: 'iterations_count', type: 'integer', default: 0 })
  iterationsCount: number;

  @Column({ name: 'backtracking_attempts', type: 'integer', default: 0 })
  backtrackingAttempts: number;

  @Column({
    name: 'algorithm_parameters',
    type: 'jsonb',
    default: {}
  })
  algorithmParameters: Record<string, any>;

  @Column({
    name: 'performance_metrics',
    type: 'jsonb',
    default: {}
  })
  performanceMetrics: Record<string, any>;

  @Column({
    name: 'quality_indicators',
    type: 'jsonb',
    default: {}
  })
  qualityIndicators: Record<string, any>;

  @Column({
    name: 'recommendations',
    type: 'jsonb',
    default: []
  })
  recommendations: string[];

  @Column({ name: 'calculation_version', type: 'varchar', length: 50, default: '1.0' })
  calculationVersion: string;

  @Column({ name: 'is_final', type: 'boolean', default: false })
  isFinal: boolean;

  @Column({ name: 'calculated_by', type: 'uuid', nullable: true })
  calculatedBy?: string;

  // Relationships
  @ManyToOne(() => ShiftPlan, shiftPlan => shiftPlan.planningStatistics)
  @JoinColumn({ name: 'shift_plan_id' })
  shiftPlan: ShiftPlan;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'calculated_by' })
  calculatedByUser?: User;

  // Audit fields
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Virtual fields
  get overallQualityScore(): number {
    // Weighted combination of various quality metrics
    const weights = {
      optimization: 0.3,
      workloadBalance: 0.25,
      preferenceSatisfaction: 0.2,
      constraintCompliance: 0.25
    };

    return (
      this.optimizationScore * weights.optimization +
      this.workloadBalanceScore * weights.workloadBalance +
      this.preferenceSatisfactionScore * weights.preferenceSatisfaction +
      this.constraintComplianceScore * weights.constraintCompliance
    );
  }

  get planningEfficiency(): number {
    if (this.planningDurationMs === 0) return 0;
    // Higher score for faster planning with good results
    const timeScore = Math.max(0, 100 - (this.planningDurationMs / 1000)); // Penalize time > 100s
    return (timeScore + this.overallQualityScore) / 2;
  }

  get workloadVariance(): number {
    return Math.pow(this.standardDeviationHours, 2);
  }

  get hoursDistributionRange(): number {
    return this.maxEmployeeHours - this.minEmployeeHours;
  }

  get violationSeverityScore(): number {
    // Weight violations by severity
    const hardPenalty = this.hardViolationsCount * 10;
    const softPenalty = this.softViolationsCount * 3;
    const warningPenalty = this.warningViolationsCount * 1;
    
    const totalPenalty = hardPenalty + softPenalty + warningPenalty;
    return Math.max(0, 100 - totalPenalty);
  }

  get isHighQuality(): boolean {
    return this.overallQualityScore >= 80 && 
           this.hardViolationsCount === 0 && 
           this.coveragePercentage >= 95;
  }

  get needsImprovement(): boolean {
    return this.overallQualityScore < 60 || 
           this.hardViolationsCount > 0 || 
           this.coveragePercentage < 85;
  }

  /**
   * Generate summary report of planning statistics
   */
  generateSummaryReport(): Record<string, any> {
    return {
      overallScore: this.overallQualityScore,
      coverage: this.coveragePercentage,
      violations: {
        total: this.constraintViolationsCount,
        hard: this.hardViolationsCount,
        soft: this.softViolationsCount,
        warnings: this.warningViolationsCount
      },
      workload: {
        average: this.averageHoursPerEmployee,
        variance: this.workloadVariance,
        range: this.hoursDistributionRange
      },
      performance: {
        duration: this.planningDurationMs,
        iterations: this.iterationsCount,
        efficiency: this.planningEfficiency
      },
      quality: {
        optimization: this.optimizationScore,
        balance: this.workloadBalanceScore,
        preferences: this.preferenceSatisfactionScore,
        compliance: this.constraintComplianceScore
      },
      recommendations: this.recommendations
    };
  }

  /**
   * Compare with another planning statistics
   */
  compareWith(other: PlanningStatistics): Record<string, number> {
    return {
      qualityDifference: this.overallQualityScore - other.overallQualityScore,
      coverageDifference: this.coveragePercentage - other.coveragePercentage,
      violationDifference: this.constraintViolationsCount - other.constraintViolationsCount,
      durationDifference: this.planningDurationMs - other.planningDurationMs,
      workloadBalanceDifference: this.workloadBalanceScore - other.workloadBalanceScore
    };
  }
}