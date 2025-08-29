import { Injectable, Logger } from '@nestjs/common';
import { ConstraintValidationService } from './constraint-validation.service';
import { ShiftPlanningUtilityService } from './shift-planning-utility.service';
import { EmployeeSortingService } from '../../employees/services/employee-sorting.service';
import { EmployeeAvailabilityService, AvailabilityMap } from '../../employees/services/employee-availability.service';
import {Employee} from "@/database/entities/employee.entity";
import {DayShiftPlan, MonthlyShiftPlan, ShiftPlan} from "@/database/entities/shift-plan.entity";

export interface BacktrackingConfiguration {
  maxAttempts: number;
  relaxedMode: boolean;
  prioritizeShiftLeaders: boolean;
  allowOvertime: boolean;
  saturdayDistributionMode: 'fair' | 'strict' | 'flexible';
  consecutiveDaysLimit: number;
  weeklyHoursFlexibility: number;
}

export interface ShiftRequirement {
  validRoles: string[];
  count: number;
  priority: number;
}

export interface BacktrackingResult {
  success: boolean;
  assignedShifts: number;
  totalAttempts: number;
  violationsCount: number;
  failureReasons: string[];
  statistics: BacktrackingStatistics;
}

export interface BacktrackingStatistics {
  recursionDepth: number;
  backtrackCount: number;
  solutionsFound: number;
  timeElapsed: number;
  constraintChecks: number;
}

/**
 * Advanced backtracking algorithm service for complex shift assignment.
 * Implements sophisticated backtracking with constraint satisfaction and optimization.
 */
@Injectable()
export class BacktrackingAlgorithmService {
  private readonly logger = new Logger(BacktrackingAlgorithmService.name);

  constructor(
      private constraintValidationService: ConstraintValidationService,
    private shiftPlanningUtilityService: ShiftPlanningUtilityService,
    private employeeSortingService: EmployeeSortingService,
    private employeeAvailabilityService: EmployeeAvailabilityService,
  ) {}

  /**
   * Assign shifts for a specific day using enhanced backtracking algorithm
   * 
   * @param date The date to plan shifts for
   * @param employees Available employees
   * @param availabilityMap Current availability tracking
   * @param shiftPlan The monthly shift plan being built
   * @param config Backtracking configuration
   * @returns Success status of the assignment
   */
  async assignDayWithBacktracking(
    date: Date,
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    shiftPlan: MonthlyShiftPlan,
    config: BacktrackingConfiguration
  ): Promise<BacktrackingResult> {
    const dayKey = this.shiftPlanningUtilityService.formatDayKey(date);
    const isWeekend = this.shiftPlanningUtilityService.isWeekend(date);
    const isSaturday = this.shiftPlanningUtilityService.isSaturday(date);
    const isSunday = this.shiftPlanningUtilityService.isSunday(date);
    const dayOfWeek = this.shiftPlanningUtilityService.getDayOfWeek(date);
    const isLongDay = [1, 3, 5].includes(dayOfWeek); // Monday, Wednesday, Friday

    this.logger.debug(`Starting backtracking for ${dayKey} (${isLongDay ? 'long' : 'short'} day)`);

    const statistics: BacktrackingStatistics = {
      recursionDepth: 0,
      backtrackCount: 0,
      solutionsFound: 0,
      timeElapsed: 0,
      constraintChecks: 0
    };

    const startTime = Date.now();

    // Sunday handling - no shifts planned
    if (isSunday) {
      shiftPlan[dayKey] = null;
      return {
        success: true,
        assignedShifts: 0,
        totalAttempts: 0,
        violationsCount: 0,
        failureReasons: [],
        statistics
      };
    }

    // Initialize day plan
    shiftPlan[dayKey] = {};
    const dayPlan = shiftPlan[dayKey] as DayShiftPlan;

    let result: BacktrackingResult;

    // Special handling for Saturday
    if (isSaturday) {
      result = await this.assignSaturdayShifts(
        date, employees, availabilityMap, dayPlan, config, statistics
      );
    } else {
      // Regular day shift assignment
      result = await this.assignRegularDayShifts(
        date, employees, availabilityMap, dayPlan, isLongDay, config, statistics
      );
    }

    statistics.timeElapsed = Date.now() - startTime;

    if (!result.success) {
      shiftPlan[dayKey] = null;
      this.logger.warn(`Failed to assign shifts for ${dayKey}: ${result.failureReasons.join(', ')}`);
    } else {
      this.logger.debug(`Successfully assigned ${result.assignedShifts} shifts for ${dayKey}`);
    }

    return result;
  }

  /**
   * Assign shifts recursively using backtracking for a list of shifts
   */
  async assignShiftsRecursively(
    shifts: string[],
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    shiftPlan: MonthlyShiftPlan,
    dayKey: string,
    config: BacktrackingConfiguration,
    statistics: BacktrackingStatistics
  ): Promise<boolean> {
    if (shifts.length === 0) {
      statistics.solutionsFound++;
      return true; // All shifts assigned successfully
    }

    const [currentShift, ...remainingShifts] = shifts;
    const dayPlan = shiftPlan[dayKey] as DayShiftPlan;

    // Get shift requirements
    const shiftRequirements = this.getShiftRequirements(currentShift);
    const sortedRequirements = this.prioritizeShiftRequirements(shiftRequirements, config);

    // Initialize shift assignment array
    dayPlan[currentShift] = [];

    // Try to assign all required roles for this shift
    const success = await this.assignRolesForShift(
      currentShift,
      sortedRequirements,
      employees,
      availabilityMap,
      dayKey,
      dayPlan,
      config,
      statistics
    );

    if (success) {
      // Continue with remaining shifts
      const remainingSuccess = await this.assignShiftsRecursively(
        remainingShifts,
        employees,
        availabilityMap,
        shiftPlan,
        dayKey,
        config,
        statistics
      );

      if (remainingSuccess) {
        return true;
      }
    }

    // Backtrack: remove assignments for this shift
    statistics.backtrackCount++;
    this.revertShiftAssignments(dayPlan[currentShift], availabilityMap, dayKey, currentShift);
    dayPlan[currentShift] = [];

    return false;
  }

  /**
   * Find employees suitable for a specific role and shift
   */
  async findSuitableEmployees(
    role: string,
    shiftName: string,
    dayKey: string,
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    config: BacktrackingConfiguration
  ): Promise<Employee[]> {
    // Filter employees by role
    const roleEmployees = this.employeeSortingService.filterByRole(employees, role);

    // Filter by availability
    const availableEmployees = this.employeeSortingService.filterAvailableEmployees(
      roleEmployees,
      availabilityMap
    );

    // Sort by priority for fair assignment
    const prioritizedEmployees = this.employeeSortingService.sortAndShuffleByRole(
      availableEmployees,
      availabilityMap,
      shiftName
    );

    // Filter by constraints
    const suitableEmployees: Employee[] = [];
    for (const employee of prioritizedEmployees) {
      const availability = availabilityMap[employee.id];
      const canAssign = await this.constraintValidationService.canAssignEmployeeToShift(
        employee,
        shiftName,
        dayKey,
        availability,
        !config.relaxedMode
      );

      if (canAssign) {
        suitableEmployees.push(employee);
      }
    }

    return suitableEmployees;
  }

  /**
   * Prioritize shifts for assignment order
   */
  prioritizeShifts(shifts: string[], isLongDay: boolean, isSaturday: boolean): string[] {
    const priorityMap = {
      'F': 1,  // Morning shift has highest priority
      'S': 2,  // Evening shift has second priority
      'FS': 3  // Split shift has lower priority
    };

    return shifts.sort((a, b) => {
      const priorityA = priorityMap[a] || 999;
      const priorityB = priorityMap[b] || 999;
      return priorityA - priorityB;
    });
  }

  /**
   * Assign Saturday shifts with special fair distribution logic
   */
  private async assignSaturdayShifts(
    date: Date,
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    dayPlan: DayShiftPlan,
    config: BacktrackingConfiguration,
    statistics: BacktrackingStatistics
  ): Promise<BacktrackingResult> {
    const dayKey = this.shiftPlanningUtilityService.formatDayKey(date);
    const result: BacktrackingResult = {
      success: false,
      assignedShifts: 0,
      totalAttempts: 0,
      violationsCount: 0,
      failureReasons: [],
      statistics
    };

    this.logger.debug(`Assigning Saturday shifts for ${dayKey}`);

    // Saturday only has F shift
    const shiftName = 'F';
    dayPlan[shiftName] = [];

    // Get employees sorted for fair Saturday distribution
    const sortedEmployees = this.employeeSortingService.sortEmployeesForSaturday(
      employees,
      availabilityMap
    );

    // Saturday requirements: 1 shift leader + 4 specialists + 1 assistant
    const saturdayRequirements: ShiftRequirement[] = [
      { validRoles: ['shift_leader'], count: 1, priority: 1 },
      { validRoles: ['specialist'], count: 4, priority: 2 },
      { validRoles: ['assistant'], count: 1, priority: 3 }
    ];

    let totalAssigned = 0;

    // Assign each role type
    for (const requirement of saturdayRequirements) {
      const assigned = await this.assignRoleToSaturdayShift(
        shiftName,
        requirement,
        sortedEmployees,
        availabilityMap,
        dayKey,
        dayPlan,
        config,
        statistics
      );

      totalAssigned += assigned;

      if (assigned < requirement.count) {
        result.failureReasons.push(
          `Could not assign required ${requirement.count} ${requirement.validRoles.join('/')} employees (only ${assigned} assigned)`
        );
      }
    }

    // Check if minimum requirements are met
    const minRequired = saturdayRequirements.reduce((sum, req) => sum + req.count, 0);
    result.success = totalAssigned >= minRequired && result.failureReasons.length === 0;
    result.assignedShifts = totalAssigned;

    return result;
  }

  /**
   * Assign regular day shifts (Monday-Friday)
   */
  private async assignRegularDayShifts(
    date: Date,
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    dayPlan: DayShiftPlan,
    isLongDay: boolean,
    config: BacktrackingConfiguration,
    statistics: BacktrackingStatistics
  ): Promise<BacktrackingResult> {
    const dayKey = this.shiftPlanningUtilityService.formatDayKey(date);
    const shifts = isLongDay ? ['F', 'S'] : ['F', 'S']; // Both long and short days have F and S
    const prioritizedShifts = this.prioritizeShifts(shifts, isLongDay, false);

    this.logger.debug(`Assigning regular shifts for ${dayKey}: ${prioritizedShifts.join(', ')}`);

    const success = await this.assignShiftsRecursively(
      prioritizedShifts,
      employees,
      availabilityMap,
      {},
      dayKey,
      config,
      statistics
    );

    let totalAssigned = 0;
    for (const shiftName in dayPlan) {
      totalAssigned += dayPlan[shiftName].length;
    }

    return {
      success,
      assignedShifts: totalAssigned,
      totalAttempts: statistics.backtrackCount + 1,
      violationsCount: 0, // This would need to be calculated
      failureReasons: success ? [] : ['Could not satisfy all shift requirements'],
      statistics
    };
  }

  /**
   * Assign roles for a specific shift using backtracking
   */
  private async assignRolesForShift(
    shiftName: string,
    requirements: ShiftRequirement[],
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    dayKey: string,
    dayPlan: DayShiftPlan,
    config: BacktrackingConfiguration,
    statistics: BacktrackingStatistics
  ): Promise<boolean> {
    statistics.recursionDepth++;

    if (requirements.length === 0) {
      statistics.recursionDepth--;
      return true; // All requirements satisfied
    }

    const [currentRequirement, ...remainingRequirements] = requirements;

    // Try to assign employees for this requirement
    const success = await this.assignEmployeesForRequirement(
      shiftName,
      currentRequirement,
      employees,
      availabilityMap,
      dayKey,
      dayPlan,
      config,
      statistics
    );

    if (success) {
      // Continue with remaining requirements
      const remainingSuccess = await this.assignRolesForShift(
        shiftName,
        remainingRequirements,
        employees,
        availabilityMap,
        dayKey,
        dayPlan,
        config,
        statistics
      );

      if (remainingSuccess) {
        statistics.recursionDepth--;
        return true;
      }
    }

    // Backtrack: this path didn't work
    statistics.recursionDepth--;
    return false;
  }

  /**
   * Assign employees for a specific requirement (recursive for multiple employees)
   */
  private async assignEmployeesForRequirement(
    shiftName: string,
    requirement: ShiftRequirement,
    employees: Employee[],
    availabilityMap: AvailabilityMap,
    dayKey: string,
    dayPlan: DayShiftPlan,
    config: BacktrackingConfiguration,
    statistics: BacktrackingStatistics,
    assignedCount: number = 0
  ): Promise<boolean> {
    if (assignedCount >= requirement.count) {
      return true; // Requirement satisfied
    }

    // Get suitable employees for this role
    const suitableEmployees = await this.findSuitableEmployees(
      requirement.validRoles[0], // Take first valid role for simplicity
      shiftName,
      dayKey,
      employees,
      availabilityMap,
      config
    );

    // Try each suitable employee
    for (const employee of suitableEmployees) {
      // Skip if already assigned
      if (dayPlan[shiftName].includes(employee.id)) {
        continue;
      }

      // Try assigning this employee
      const assigned = await this.tryAssignEmployee(
        employee,
        shiftName,
        dayKey,
        availabilityMap,
        dayPlan,
        statistics
      );

      if (assigned) {
        // Continue assigning remaining employees for this requirement
        const remainingSuccess = await this.assignEmployeesForRequirement(
          shiftName,
          requirement,
          employees,
          availabilityMap,
          dayKey,
          dayPlan,
          config,
          statistics,
          assignedCount + 1
        );

        if (remainingSuccess) {
          return true;
        }

        // Backtrack: remove this assignment
        await this.revertEmployeeAssignment(employee.id, shiftName, dayKey, availabilityMap, dayPlan);
        statistics.backtrackCount++;
      }
    }

    return false; // Could not satisfy this requirement
  }

  /**
   * Assign role to Saturday shift with special logic
   */
  private async assignRoleToSaturdayShift(
    shiftName: string,
    requirement: ShiftRequirement,
    sortedEmployees: Employee[],
    availabilityMap: AvailabilityMap,
    dayKey: string,
    dayPlan: DayShiftPlan,
    config: BacktrackingConfiguration,
    statistics: BacktrackingStatistics
  ): Promise<number> {
    let assignedCount = 0;
    const targetRole = requirement.validRoles[0];

    // Filter employees by role
    const roleEmployees = sortedEmployees.filter(emp => 
      emp.primaryRole?.type === targetRole
    );

    for (const employee of roleEmployees) {
      if (assignedCount >= requirement.count) break;

      // Check if already assigned
      if (dayPlan[shiftName].includes(employee.id)) continue;

      // Try to assign
      const assigned = await this.tryAssignEmployee(
        employee,
        shiftName,
        dayKey,
        availabilityMap,
        dayPlan,
        statistics
      );

      if (assigned) {
        assignedCount++;
        this.logger.debug(
          `Saturday ${dayKey}: Assigned ${employee.lastName} (${targetRole}) to ${shiftName} shift (${assignedCount}/${requirement.count})`
        );
      }
    }

    return assignedCount;
  }

  /**
   * Try to assign a specific employee to a shift
   */
  private async tryAssignEmployee(
    employee: Employee,
    shiftName: string,
    dayKey: string,
    availabilityMap: AvailabilityMap,
    dayPlan: DayShiftPlan,
    statistics: BacktrackingStatistics
  ): Promise<boolean> {
    const availability = availabilityMap[employee.id];
    if (!availability) return false;

    statistics.constraintChecks++;

    // Check if assignment is valid
    const canAssign = await this.constraintValidationService.canAssignEmployeeToShift(
      employee,
      shiftName,
      dayKey,
      availability,
      true
    );

    if (canAssign) {
      // Assign employee
      dayPlan[shiftName].push(employee.id);

      // Update availability
      const shiftHours = this.getShiftHours(shiftName);
      const date = this.shiftPlanningUtilityService.parseDayKey(dayKey);
      const isSaturday = this.shiftPlanningUtilityService.isSaturday(date);

      await this.employeeAvailabilityService.updateAvailability(employee.id, {
        shiftHours,
        shiftType: shiftName,
        dayKey,
        isSaturday
      });

      return true;
    }

    return false;
  }

  /**
   * Revert employee assignment (backtrack)
   */
  private async revertEmployeeAssignment(
    employeeId: string,
    shiftName: string,
    dayKey: string,
    availabilityMap: AvailabilityMap,
    dayPlan: DayShiftPlan
  ): Promise<void> {
    // Remove from shift assignment
    const index = dayPlan[shiftName].indexOf(employeeId);
    if (index > -1) {
      dayPlan[shiftName].splice(index, 1);
    }

    // Revert availability changes (this would need more sophisticated logic)
    const availability = availabilityMap[employeeId];
    if (availability) {
      const shiftHours = this.getShiftHours(shiftName);
      const date = this.shiftPlanningUtilityService.parseDayKey(dayKey);
      const isSaturday = this.shiftPlanningUtilityService.isSaturday(date);

      // This is a simplified revert - in practice, we'd need to track changes more carefully
      availability.weeklyHoursAssigned -= shiftHours;
      availability.totalHoursAssigned -= shiftHours;
      
      // Remove from shifts assigned
      const shiftIndex = availability.shiftsAssigned.indexOf(dayKey);
      if (shiftIndex > -1) {
        availability.shiftsAssigned.splice(shiftIndex, 1);
      }

      if (isSaturday) {
        availability.saturdaysWorked -= 1;
      }

      availability.lastShiftType = null; // Simplified - would need proper tracking
    }
  }

  /**
   * Revert all assignments for a shift (backtrack)
   */
  private revertShiftAssignments(
    employeeIds: string[],
    availabilityMap: AvailabilityMap,
    dayKey: string,
    shiftName: string
  ): void {
    for (const employeeId of employeeIds) {
      // This is simplified - in practice we'd have better state management
      const availability = availabilityMap[employeeId];
      if (availability) {
        const shiftHours = this.getShiftHours(shiftName);
        availability.weeklyHoursAssigned -= shiftHours;
        availability.totalHoursAssigned -= shiftHours;
        
        const shiftIndex = availability.shiftsAssigned.indexOf(dayKey);
        if (shiftIndex > -1) {
          availability.shiftsAssigned.splice(shiftIndex, 1);
        }
      }
    }
  }

  /**
   * Get shift requirements based on shift type
   */
  private getShiftRequirements(shiftName: string): ShiftRequirement[] {
    const requirements = {
      'F': [
        { validRoles: ['shift_leader'], count: 1, priority: 1 },
        { validRoles: ['specialist'], count: 4, priority: 2 },
        { validRoles: ['assistant'], count: 1, priority: 3 }
      ],
      'S': [
        { validRoles: ['shift_leader'], count: 1, priority: 1 },
        { validRoles: ['specialist'], count: 4, priority: 2 },
        { validRoles: ['assistant'], count: 1, priority: 3 }
      ],
      'FS': [
        { validRoles: ['shift_leader'], count: 1, priority: 1 },
        { validRoles: ['specialist'], count: 2, priority: 2 },
        { validRoles: ['assistant'], count: 1, priority: 3 }
      ]
    };

    return requirements[shiftName] || [];
  }

  /**
   * Prioritize shift requirements based on configuration
   */
  private prioritizeShiftRequirements(
    requirements: ShiftRequirement[],
    config: BacktrackingConfiguration
  ): ShiftRequirement[] {
    if (config.prioritizeShiftLeaders) {
      return [...requirements].sort((a, b) => a.priority - b.priority);
    }
    return requirements;
  }

  /**
   * Get standard hours for a shift type
   */
  private getShiftHours(shiftName: string): number {
    const shiftHours = {
      'F': 8,
      'S': 8,
      'FS': 6
    };
    return shiftHours[shiftName] || 8;
  }
}