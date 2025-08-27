import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '@/database/entities';
import { ShiftPlan, MonthlyShiftPlan } from '@/database/entities';
import { ShiftPlanningRule } from '@/database/entities/shift-planning-rule.entity';
import { ConstraintViolation } from '@/database/entities';
import { ShiftPlanningAvailability } from '@/database/entities/shift-planning-availability.entity';
import { AvailabilityMap } from '../../employees/services/employee-availability.service';
import { ShiftPlanningUtilityService } from './shift-planning-utility.service';

export interface ConstraintCheckResult {
  isValid: boolean;
  hardViolations: ConstraintViolationInfo[];
  softViolations: ConstraintViolationInfo[];
  warnings: ConstraintViolationInfo[];
  overallScore: number;
  recommendations: string[];
}

export interface ConstraintViolationInfo {
  ruleCode: string;
  ruleName: string;
  message: string;
  severity: number;
  employeeId?: string;
  shiftType?: string;
  dayKey?: string;
  suggestedAction?: string;
}

export interface AssignmentContext {
  employee: Employee;
  shiftType: string;
  dayKey: string;
  shiftHours: number;
  availability: ShiftPlanningAvailability;
  isWeekend: boolean;
  isSaturday: boolean;
  isSunday: boolean;
  weekNumber: number;
  dayOfWeek: number;
}

/**
 * Service for validating shift planning constraints and rules.
 * Implements comprehensive constraint checking for employees, shifts, and planning rules.
 */
@Injectable()
export class ConstraintValidationService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(ShiftPlan)
    private shiftPlanRepository: Repository<ShiftPlan>,
    @InjectRepository(ShiftPlanningRule)
    private shiftPlanningRuleRepository: Repository<ShiftPlanningRule>,
    @InjectRepository(ConstraintViolation)
    private constraintViolationRepository: Repository<ConstraintViolation>,
    private shiftPlanningUtilityService: ShiftPlanningUtilityService,
  ) {}

  /**
   * Validate complete shift plan against all rules and constraints
   * 
   * @param shiftPlan The monthly shift plan to validate
   * @param employees Array of employees involved in planning
   * @param availabilityMap Current availability map
   * @param organizationId Organization context
   * @returns Comprehensive validation result
   */
  async validateShiftPlan(
    shiftPlan: MonthlyShiftPlan,
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    organizationId: string
  ): Promise<ConstraintCheckResult> {
    const result: ConstraintCheckResult = {
      isValid: true,
      hardViolations: [],
      softViolations: [],
      warnings: [],
      overallScore: 100,
      recommendations: []
    };

    // Get active rules for this organization
    const activeRules = await this.getActiveRules(organizationId);

    // Validate each day in the shift plan
    for (const dayKey in shiftPlan) {
      const dayPlan = shiftPlan[dayKey];
      if (dayPlan === null) continue;

      const date = this.shiftPlanningUtilityService.parseDayKey(dayKey);
      const isWeekend = this.shiftPlanningUtilityService.isWeekend(date);
      const isSaturday = this.shiftPlanningUtilityService.isSaturday(date);
      const isSunday = this.shiftPlanningUtilityService.isSunday(date);
      const weekNumber = this.shiftPlanningUtilityService.getWeekNumber(date);
      const dayOfWeek = this.shiftPlanningUtilityService.getDayOfWeek(date);

      // Validate each shift in the day
      for (const shiftType in dayPlan) {
        const employeeIds = dayPlan[shiftType];
        
        // Validate shift staffing levels
        await this.validateShiftStaffing(
          shiftType, employeeIds, employees, dayKey, result, activeRules
        );

        // Validate each employee assignment
        for (const employeeId of employeeIds) {
          const employee = employees.find(e => e.id === employeeId);
          const availability = availabilityMap[employeeId];
          
          if (employee && availability) {
            const context: AssignmentContext = {
              employee,
              shiftType,
              dayKey,
              shiftHours: this.calculateShiftHours(shiftType),
              availability,
              isWeekend,
              isSaturday,
              isSunday,
              weekNumber,
              dayOfWeek
            };

            await this.validateEmployeeAssignment(context, result, activeRules);
          }
        }
      }
    }

    // Calculate overall scores and validity
    result.overallScore = this.calculateOverallScore(result);
    result.isValid = result.hardViolations.length === 0;
    result.recommendations = this.generateRecommendations(result);

    return result;
  }

  /**
   * Check if an employee can be assigned to a specific shift
   * 
   * @param employee The employee to check
   * @param shiftType The shift type
   * @param dayKey The day key
   * @param availability Employee's current availability
   * @param strictMode Whether to apply strict constraints
   * @returns True if assignment is allowed
   */
  async canAssignEmployeeToShift(
    employee: Employee,
    shiftType: string,
    dayKey: string,
    availability: ShiftPlanningAvailability,
    strictMode: boolean = true
  ): Promise<boolean> {
    const date = this.shiftPlanningUtilityService.parseDayKey(dayKey);
    const shiftHours = this.calculateShiftHours(shiftType);
    
    const context: AssignmentContext = {
      employee,
      shiftType,
      dayKey,
      shiftHours,
      availability,
      isWeekend: this.shiftPlanningUtilityService.isWeekend(date),
      isSaturday: this.shiftPlanningUtilityService.isSaturday(date),
      isSunday: this.shiftPlanningUtilityService.isSunday(date),
      weekNumber: this.shiftPlanningUtilityService.getWeekNumber(date),
      dayOfWeek: this.shiftPlanningUtilityService.getDayOfWeek(date)
    };

    // Check hard constraints
    const hardConstraintChecks = await this.checkHardConstraints(context);
    if (hardConstraintChecks.length > 0) {
      return false;
    }

    // In non-strict mode, allow soft constraint violations
    if (!strictMode) {
      return true;
    }

    // In strict mode, also check soft constraints
    const softConstraintChecks = await this.checkSoftConstraints(context);
    return softConstraintChecks.length === 0;
  }

  /**
   * Check hard constraints for an employee assignment
   */
  private async checkHardConstraints(context: AssignmentContext): Promise<ConstraintViolationInfo[]> {
    const violations: ConstraintViolationInfo[] = [];

    // 1. Role compatibility check
    if (!this.isRoleCompatibleWithShift(context.employee, context.shiftType)) {
      violations.push({
        ruleCode: 'ROLE_INCOMPATIBLE',
        ruleName: 'Role Incompatibility',
        message: `Employee role ${context.employee.primaryRole?.type} is not compatible with shift ${context.shiftType}`,
        severity: 5,
        employeeId: context.employee.id,
        shiftType: context.shiftType,
        dayKey: context.dayKey,
        suggestedAction: 'Assign employee to compatible shift type'
      });
    }

    // 2. Already assigned to same day check
    if (this.isAlreadyAssignedToDay(context.availability, context.dayKey)) {
      violations.push({
        ruleCode: 'DOUBLE_ASSIGNMENT',
        ruleName: 'Double Assignment',
        message: `Employee is already assigned to a shift on ${context.dayKey}`,
        severity: 5,
        employeeId: context.employee.id,
        dayKey: context.dayKey,
        suggestedAction: 'Remove existing assignment or assign to different day'
      });
    }

    // 3. Maximum consecutive days check
    if (this.exceedsMaxConsecutiveDays(context)) {
      violations.push({
        ruleCode: 'MAX_CONSECUTIVE_DAYS',
        ruleName: 'Maximum Consecutive Days Exceeded',
        message: `Assignment would exceed maximum consecutive days limit (${context.employee.maxConsecutiveDays})`,
        severity: 4,
        employeeId: context.employee.id,
        dayKey: context.dayKey,
        suggestedAction: 'Allow rest day before this assignment'
      });
    }

    // 4. Monthly hours limit check (hard limit with small tolerance)
    if (this.exceedsHardHoursLimit(context)) {
      violations.push({
        ruleCode: 'MONTHLY_HOURS_EXCEEDED',
        ruleName: 'Monthly Hours Limit Exceeded',
        message: `Assignment would exceed monthly hours limit`,
        severity: 5,
        employeeId: context.employee.id,
        suggestedAction: 'Reduce workload or distribute hours to other employees'
      });
    }

    // 5. Sunday work availability check
    if (context.isSunday && !context.employee.sundayAvailability) {
      violations.push({
        ruleCode: 'SUNDAY_UNAVAILABLE',
        ruleName: 'Sunday Unavailability',
        message: `Employee is not available for Sunday work`,
        severity: 4,
        employeeId: context.employee.id,
        dayKey: context.dayKey,
        suggestedAction: 'Assign different employee or change employee availability'
      });
    }

    return violations;
  }

  /**
   * Check soft constraints for an employee assignment
   */
  private async checkSoftConstraints(context: AssignmentContext): Promise<ConstraintViolationInfo[]> {
    const violations: ConstraintViolationInfo[] = [];

    // 1. Weekly hours balance check
    if (this.exceedsWeeklyHoursTarget(context)) {
      violations.push({
        ruleCode: 'WEEKLY_HOURS_IMBALANCE',
        ruleName: 'Weekly Hours Imbalance',
        message: `Assignment may create weekly hours imbalance`,
        severity: 2,
        employeeId: context.employee.id,
        suggestedAction: 'Balance weekly hours across employees'
      });
    }

    // 2. Same shift type consecutive days check
    if (this.hasSameShiftTypeConsecutive(context)) {
      violations.push({
        ruleCode: 'CONSECUTIVE_SAME_SHIFT',
        ruleName: 'Consecutive Same Shift Type',
        message: `Employee worked same shift type on consecutive day`,
        severity: 2,
        employeeId: context.employee.id,
        shiftType: context.shiftType,
        suggestedAction: 'Vary shift types for better work-life balance'
      });
    }

    // 3. Saturday work frequency check
    if (context.isSaturday && this.exceedsSaturdayFrequency(context)) {
      violations.push({
        ruleCode: 'SATURDAY_FREQUENCY',
        ruleName: 'Saturday Work Frequency',
        message: `Employee has worked many Saturdays this month`,
        severity: 2,
        employeeId: context.employee.id,
        dayKey: context.dayKey,
        suggestedAction: 'Distribute Saturday work more evenly'
      });
    }

    // 4. Workload balance check
    if (this.hasWorkloadImbalance(context)) {
      violations.push({
        ruleCode: 'WORKLOAD_IMBALANCE',
        ruleName: 'Workload Imbalance',
        message: `Employee workload significantly higher than others`,
        severity: 2,
        employeeId: context.employee.id,
        suggestedAction: 'Balance workload across team members'
      });
    }

    return violations;
  }

  /**
   * Validate shift staffing levels against requirements
   */
  private async validateShiftStaffing(
    shiftType: string,
    employeeIds: string[],
    employees: Employee[],
    dayKey: string,
    result: ConstraintCheckResult,
    rules: ShiftPlanningRule[]
  ): Promise<void> {
    const assignedEmployees = employees.filter(e => employeeIds.includes(e.id));
    
    // Check minimum staffing
    const minStaffing = this.getMinStaffingForShift(shiftType);
    if (assignedEmployees.length < minStaffing) {
      result.hardViolations.push({
        ruleCode: 'UNDERSTAFFED',
        ruleName: 'Understaffed Shift',
        message: `Shift ${shiftType} on ${dayKey} has ${assignedEmployees.length} employees but requires minimum ${minStaffing}`,
        severity: 5,
        shiftType,
        dayKey,
        suggestedAction: 'Add more employees to this shift'
      });
    }

    // Check role requirements
    const roleRequirements = this.getRoleRequirementsForShift(shiftType);
    for (const requirement of roleRequirements) {
      const roleCount = assignedEmployees.filter(e => e.primaryRole?.type === requirement.roleType).length;
      if (roleCount < requirement.minCount) {
        result.hardViolations.push({
          ruleCode: 'ROLE_REQUIREMENT',
          ruleName: 'Role Requirement Not Met',
          message: `Shift ${shiftType} on ${dayKey} requires ${requirement.minCount} ${requirement.roleType} but has ${roleCount}`,
          severity: 4,
          shiftType,
          dayKey,
          suggestedAction: `Add more employees with role ${requirement.roleType}`
        });
      }
    }
  }

  /**
   * Validate individual employee assignment against rules
   */
  private async validateEmployeeAssignment(
    context: AssignmentContext,
    result: ConstraintCheckResult,
    rules: ShiftPlanningRule[]
  ): Promise<void> {
    const hardViolations = await this.checkHardConstraints(context);
    const softViolations = await this.checkSoftConstraints(context);
    
    result.hardViolations.push(...hardViolations);
    result.softViolations.push(...softViolations);
  }

  // Helper methods for constraint checking

  private isRoleCompatibleWithShift(employee: Employee, shiftType: string): boolean {
    // All roles are compatible with F and S shifts
    const compatibleShifts = ['F', 'S', 'FS'];
    return compatibleShifts.includes(shiftType) && 
           employee.primaryRole && 
           ['shift_leader', 'specialist', 'assistant'].includes(employee.primaryRole.type);
  }

  private isAlreadyAssignedToDay(availability: ShiftPlanningAvailability, dayKey: string): boolean {
    return availability.shiftsAssigned.includes(dayKey);
  }

  private exceedsMaxConsecutiveDays(context: AssignmentContext): boolean {
    return context.availability.consecutiveDaysCount >= context.employee.maxConsecutiveDays;
  }

  private exceedsHardHoursLimit(context: AssignmentContext): boolean {
    const monthlyLimit = context.employee.hoursPerMonth * 1.2; // 20% overtime allowed
    const projectedHours = context.availability.totalHoursAssigned + context.shiftHours;
    return projectedHours > monthlyLimit;
  }

  private exceedsWeeklyHoursTarget(context: AssignmentContext): boolean {
    const weeklyTarget = context.employee.hoursPerMonth / 4.33;
    const weeklyLimit = weeklyTarget * 1.3; // 30% weekly overtime tolerance
    const projectedWeeklyHours = context.availability.weeklyHoursAssigned + context.shiftHours;
    return projectedWeeklyHours > weeklyLimit;
  }

  private hasSameShiftTypeConsecutive(context: AssignmentContext): boolean {
    return context.availability.lastShiftType === context.shiftType;
  }

  private exceedsSaturdayFrequency(context: AssignmentContext): boolean {
    const maxSaturdaysPerMonth = 2; // Configurable rule
    return context.availability.saturdaysWorked >= maxSaturdaysPerMonth;
  }

  private hasWorkloadImbalance(context: AssignmentContext): boolean {
    // Simple check - more sophisticated balancing would compare with other employees
    return context.availability.workloadPercentage > 120; // More than 120% of target
  }

  private calculateShiftHours(shiftType: string): number {
    // Standard shift hours - could be made configurable
    const shiftHours = {
      'F': 8,
      'S': 8,
      'FS': 6
    };
    return shiftHours[shiftType] || 8;
  }

  private getMinStaffingForShift(shiftType: string): number {
    // Minimum staffing requirements - could be made configurable
    const minStaffing = {
      'F': 6, // 1 shift leader + 4 specialists + 1 assistant
      'S': 6, // 1 shift leader + 4 specialists + 1 assistant
      'FS': 4
    };
    return minStaffing[shiftType] || 4;
  }

  private getRoleRequirementsForShift(shiftType: string): { roleType: string; minCount: number }[] {
    // Role requirements per shift - could be made configurable
    const requirements = {
      'F': [
        { roleType: 'shift_leader', minCount: 1 },
        { roleType: 'specialist', minCount: 4 },
        { roleType: 'assistant', minCount: 1 }
      ],
      'S': [
        { roleType: 'shift_leader', minCount: 1 },
        { roleType: 'specialist', minCount: 4 },
        { roleType: 'assistant', minCount: 1 }
      ],
      'FS': [
        { roleType: 'shift_leader', minCount: 1 },
        { roleType: 'specialist', minCount: 2 },
        { roleType: 'assistant', minCount: 1 }
      ]
    };
    return requirements[shiftType] || [];
  }

  private async getActiveRules(organizationId: string): Promise<ShiftPlanningRule[]> {
    return await this.shiftPlanningRuleRepository.find({
      where: [
        { organizationId, isActive: true },
        { organizationId: null, isActive: true } // Global rules
      ]
    });
  }

  private calculateOverallScore(result: ConstraintCheckResult): number {
    let score = 100;
    
    // Deduct points for violations
    result.hardViolations.forEach(violation => {
      score -= violation.severity * 10; // Hard violations are heavily penalized
    });
    
    result.softViolations.forEach(violation => {
      score -= violation.severity * 3; // Soft violations are moderately penalized
    });
    
    result.warnings.forEach(violation => {
      score -= violation.severity * 1; // Warnings are lightly penalized
    });
    
    return Math.max(0, score);
  }

  private generateRecommendations(result: ConstraintCheckResult): string[] {
    const recommendations: string[] = [];
    
    if (result.hardViolations.length > 0) {
      recommendations.push('Address hard constraint violations to make the plan valid');
    }
    
    if (result.softViolations.length > 5) {
      recommendations.push('Consider relaxing soft constraints or adjusting employee assignments');
    }
    
    const understaffedShifts = result.hardViolations.filter(v => v.ruleCode === 'UNDERSTAFFED');
    if (understaffedShifts.length > 0) {
      recommendations.push('Increase staffing levels for understaffed shifts');
    }
    
    const workloadIssues = result.softViolations.filter(v => v.ruleCode === 'WORKLOAD_IMBALANCE');
    if (workloadIssues.length > 0) {
      recommendations.push('Balance workload more evenly across employees');
    }
    
    return recommendations;
  }
}