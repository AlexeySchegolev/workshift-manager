import {Injectable, Logger} from '@nestjs/common';
import {BacktrackingAlgorithmService, BacktrackingConfiguration} from './backtracking-algorithm.service';
import {ConstraintValidationService, ConstraintCheckResult} from './constraint-validation.service';
import {ShiftPlanningUtilityService} from './shift-planning-utility.service';
import {EmployeeSortingService} from '../../employees/services/employee-sorting.service';
import {EmployeeAvailabilityService, AvailabilityMap} from '../../employees/services/employee-availability.service';
import {Employee} from "@/database/entities/employee.entity";
import {DayShiftPlan, MonthlyShiftPlan} from "@/database/entities/shift-plan.entity";

export interface ShiftPlanResult {
    shiftPlan: MonthlyShiftPlan;
    employeeAvailability: AvailabilityMap;
    statistics: PlanningResultStatistics;
    constraintValidation: ConstraintCheckResult;
    success: boolean;
    messages: string[];
}

export interface PlanningResultStatistics {
    totalShiftsPlanned: number;
    totalHoursPlanned: number;
    totalEmployeesInvolved: number;
    coveragePercentage: number;
    planningDurationMs: number;
    algorithmUsed: string;
    iterationsCount: number;
    backtrackingAttempts: number;
    successfulDays: number;
    failedDays: number;
    saturdayCoverage: number;
}

export interface PlanningOptions {
    algorithm: 'enhanced_backtracking' | 'constraint_satisfaction' | 'mixed';
    optimizationLevel: 'basic' | 'standard' | 'advanced';
    strictMode: boolean;
    maxPlanningAttempts: number;
    employeeSortingStrategy: 'role_priority' | 'workload_balancing' | 'rotation_based';
    saturdayDistributionMode: 'fair' | 'strict' | 'flexible';
    constraintWeights: Record<string, number>;
    allowOvertime: boolean;
    weeklyHoursFlexibility: number;
    consecutiveDaysLimit: number;
}

export interface OptimizationResult {
    originalScore: number;
    optimizedScore: number;
    improvements: string[];
    modifications: number;
    success: boolean;
}

/**
 * Main service for advanced shift planning algorithms.
 * Orchestrates all planning services and implements comprehensive shift planning logic.
 */
@Injectable()
export class ShiftPlanningAlgorithmService {
    private readonly logger = new Logger(ShiftPlanningAlgorithmService.name);

    constructor(
        private backtrackingAlgorithmService: BacktrackingAlgorithmService,
        private constraintValidationService: ConstraintValidationService,
        private shiftPlanningUtilityService: ShiftPlanningUtilityService,
        private employeeSortingService: EmployeeSortingService,
        private employeeAvailabilityService: EmployeeAvailabilityService,
    ) {
    }

    /**
     * Generate comprehensive shift plan for a specific month
     *
     * @param employees List of employees to include in planning
     * @param year The year to plan for
     * @param month The month to plan for (1-12)
     * @param options Planning options and configuration
     * @returns Complete shift plan result with statistics and validation
     */
    async generateShiftPlan(
        employees: Employee[],
        year: number,
        month: number,
        options: PlanningOptions
    ): Promise<ShiftPlanResult> {
        const startTime = Date.now();
        this.logger.log(`Starting shift plan generation for ${year}-${month.toString().padStart(2, '0')} with ${employees.length} employees`);

        const statistics: PlanningResultStatistics = {
            totalShiftsPlanned: 0,
            totalHoursPlanned: 0,
            totalEmployeesInvolved: 0,
            coveragePercentage: 0,
            planningDurationMs: 0,
            algorithmUsed: options.algorithm,
            iterationsCount: 0,
            backtrackingAttempts: 0,
            successfulDays: 0,
            failedDays: 0,
            saturdayCoverage: 0
        };

        const messages: string[] = [];

        try {
            // Initialize employee availability tracking
            const tempShiftPlanId = 'temp-' + Date.now();
            await this.employeeAvailabilityService.initializeAvailability(
                employees.map(e => e.id),
                tempShiftPlanId
            );
            // Separate employees by location for different planning strategies
            const primaryLocationEmployees = employees.filter(emp => emp.locationId === "1" || !emp.locationId);
            const secondaryLocationEmployees = employees.filter(emp => emp.locationId === "2");
            const allEmployeesForSaturdays = [...primaryLocationEmployees, ...secondaryLocationEmployees];

            // Plan for primary location (main clinic)
            const primaryPlanResult = await this.generatePlanForClinic(
                primaryLocationEmployees,
                allEmployeesForSaturdays,
                year,
                month,
                options,
                statistics,
                messages
            );

            // Plan for secondary location if applicable
            let secondaryPlanResult: { shiftPlan: MonthlyShiftPlan; statistics: any } | null = null;
            if (secondaryLocationEmployees.length > 0) {
                secondaryPlanResult = await this.generatePlanForSecondaryLocation(
                    secondaryLocationEmployees,
                    year,
                    month,
                    options,
                    statistics,
                    messages
                );
            }

            // Merge plans from both locations
            const combinedShiftPlan = this.mergePlans(primaryPlanResult.shiftPlan, secondaryPlanResult?.shiftPlan);

            // Update final availability map with all assignments
            const finalAvailabilityMap = await this.employeeAvailabilityService.getAvailabilityForShiftPlan(tempShiftPlanId);

            // Calculate final statistics
            this.calculateFinalStatistics(combinedShiftPlan, finalAvailabilityMap, statistics);

            // Validate the complete plan
            const constraintValidation = await this.constraintValidationService.validateShiftPlan(
                combinedShiftPlan,
                employees,
                finalAvailabilityMap,
                employees[0]?.organizationId || ''
            );

            statistics.planningDurationMs = Date.now() - startTime;

            const result: ShiftPlanResult = {
                shiftPlan: combinedShiftPlan,
                employeeAvailability: finalAvailabilityMap,
                statistics,
                constraintValidation,
                success: constraintValidation.hardViolations.length === 0,
                messages
            };

            this.logger.log(`Shift plan generation completed in ${statistics.planningDurationMs}ms. Success: ${result.success}`);
            return result;

        } catch (error) {
            this.logger.error(`Shift plan generation failed: ${error.message}`, error.stack);
            statistics.planningDurationMs = Date.now() - startTime;

            return {
                shiftPlan: {},
                employeeAvailability: {},
                statistics,
                constraintValidation: {
                    isValid: false,
                    hardViolations: [{
                        ruleCode: 'PLANNING_ERROR',
                        ruleName: 'Planning Error',
                        message: error.message,
                        severity: 5
                    }],
                    softViolations: [],
                    warnings: [],
                    overallScore: 0,
                    recommendations: ['Review planning parameters and try again']
                },
                success: false,
                messages: [`Planning failed: ${error.message}`]
            };
        }
    }

    /**
     * Generate shift plan specifically for clinic location
     */
    async generatePlanForClinic(
        employees: Employee[],
        allEmployeesForSaturdays: Employee[],
        year: number,
        month: number,
        options: PlanningOptions,
        statistics: PlanningResultStatistics,
        messages: string[]
    ): Promise<{ shiftPlan: MonthlyShiftPlan; statistics: any }> {
        this.logger.debug(`Planning for clinic with ${employees.length} employees`);

        const shiftPlan: MonthlyShiftPlan = {};
        const daysInMonth = this.shiftPlanningUtilityService.getDaysInMonth(year, month);
        this.shiftPlanningUtilityService.getMonthDates(year, month);
        // Get availability map for all employees (including those from other locations for Saturdays)
        const tempShiftPlanId = 'clinic-temp-' + Date.now();
        const availabilityMap = await this.employeeAvailabilityService.initializeAvailability(
            allEmployeesForSaturdays.map(e => e.id),
            tempShiftPlanId
        );

        // Group days by weeks for weekly processing
        const weeks = this.shiftPlanningUtilityService.groupDaysByWeek(year, month, daysInMonth);

        // Configure backtracking algorithm
        const backtrackingConfig: BacktrackingConfiguration = {
            maxAttempts: options.maxPlanningAttempts,
            relaxedMode: !options.strictMode,
            prioritizeShiftLeaders: true,
            allowOvertime: options.allowOvertime,
            saturdayDistributionMode: options.saturdayDistributionMode,
            consecutiveDaysLimit: options.consecutiveDaysLimit,
            weeklyHoursFlexibility: options.weeklyHoursFlexibility
        };

        let successfulDays = 0;
        let failedDays = 0;
        let totalBacktrackingAttempts = 0;

        // Process each week
        for (const [weekNumber, weekDates] of Object.entries(weeks)) {
            this.logger.debug(`Processing week ${weekNumber} with ${weekDates.length} days`);

            // Reset weekly counters
            await this.employeeAvailabilityService.resetWeeklyCounters(availabilityMap);

            // Sort employees for this week based on strategy
            const weekEmployees = this.sortEmployeesForWeek(
                employees,
                availabilityMap,
                options.employeeSortingStrategy
            );

            // Process each day in the week
            for (const date of weekDates) {
                const dayOfWeek = this.shiftPlanningUtilityService.getDayOfWeek(date);
                const isSunday = dayOfWeek === 7;
                const isSaturday = dayOfWeek === 6;

                // Skip Sundays
                if (isSunday) {
                    const dayKey = this.shiftPlanningUtilityService.formatDayKey(date);
                    shiftPlan[dayKey] = null;
                    continue;
                }

                // Use all employees for Saturday planning (fair distribution)
                const employeesForDay = isSaturday ? allEmployeesForSaturdays : weekEmployees;

                // Plan this day using backtracking
                const dayResult = await this.backtrackingAlgorithmService.assignDayWithBacktracking(
                    date,
                    employeesForDay,
                    availabilityMap,
                    shiftPlan,
                    backtrackingConfig
                );

                totalBacktrackingAttempts += dayResult.totalAttempts;

                if (dayResult.success) {
                    successfulDays++;
                    if (isSaturday) {
                        statistics.saturdayCoverage++;
                    }
                } else {
                    failedDays++;
                    messages.push(`Failed to plan ${this.shiftPlanningUtilityService.formatDayKey(date)}: ${dayResult.failureReasons.join(', ')}`);

                    // Try with relaxed constraints if strict mode failed
                    if (options.strictMode && options.maxPlanningAttempts > 1) {
                        this.logger.debug(`Retrying ${this.shiftPlanningUtilityService.formatDayKey(date)} with relaxed constraints`);

                        const relaxedConfig = {...backtrackingConfig, relaxedMode: true};
                        const retryResult = await this.backtrackingAlgorithmService.assignDayWithBacktracking(
                            date,
                            employeesForDay,
                            availabilityMap,
                            shiftPlan,
                            relaxedConfig
                        );

                        if (retryResult.success) {
                            successfulDays++;
                            failedDays--;
                            messages.push(`Successfully planned ${this.shiftPlanningUtilityService.formatDayKey(date)} with relaxed constraints`);
                        }
                    }
                }

                statistics.iterationsCount++;
            }
        }

        statistics.successfulDays = successfulDays;
        statistics.failedDays = failedDays;
        statistics.backtrackingAttempts = totalBacktrackingAttempts;

        messages.push(`Clinic planning completed: ${successfulDays} successful days, ${failedDays} failed days`);

        return {
            shiftPlan,
            statistics: {
                successfulDays,
                failedDays,
                backtrackingAttempts: totalBacktrackingAttempts
            }
        };
    }

    /**
     * Generate shift plan for secondary location with simplified logic
     */
    async generatePlanForSecondaryLocation(
        employees: Employee[],
        year: number,
        month: number,
        options: PlanningOptions,
        statistics: PlanningResultStatistics,
        messages: string[]
    ): Promise<{ shiftPlan: MonthlyShiftPlan; statistics: any }> {
        this.logger.debug(`Planning for secondary location with ${employees.length} employees`);

        const shiftPlan: MonthlyShiftPlan = {};
        const monthDates = this.shiftPlanningUtilityService.getMonthDates(year, month);
        const workingDates = this.shiftPlanningUtilityService.filterOutSundays(monthDates);

        // Initialize availability for secondary location employees
        const tempShiftPlanId = 'secondary-temp-' + Date.now();
        const availabilityMap = await this.employeeAvailabilityService.initializeAvailability(
            employees.map(e => e.id),
            tempShiftPlanId
        );

        let secondarySuccessfulDays = 0;
        let secondaryFailedDays = 0;

        // Simplified planning for secondary location (example: alternating assignments)
        for (const date of workingDates) {
            const dayKey = this.shiftPlanningUtilityService.formatDayKey(date);
            const dayOfWeek = this.shiftPlanningUtilityService.getDayOfWeek(date);

            // Skip Saturdays for secondary location (primary location handles Saturdays)
            if (dayOfWeek === 6) {
                continue;
            }

            // Simple assignment logic for secondary location
            const assignmentSuccess = await this.assignSimplifiedShift(
                date,
                employees,
                availabilityMap,
                shiftPlan
            );

            if (assignmentSuccess) {
                secondarySuccessfulDays++;
            } else {
                secondaryFailedDays++;
                messages.push(`Failed to plan secondary location shift for ${dayKey}`);
            }
        }

        messages.push(`Secondary location planning completed: ${secondarySuccessfulDays} successful days, ${secondaryFailedDays} failed days`);

        return {
            shiftPlan,
            statistics: {
                successfulDays: secondarySuccessfulDays,
                failedDays: secondaryFailedDays,
                backtrackingAttempts: 0
            }
        };
    }
    /**
     * Optimize existing shift plan distribution
     */
    async optimizeShiftDistribution(
        shiftPlan: MonthlyShiftPlan,
        employees: Employee[],
        availabilityMap: AvailabilityMap
    ): Promise<OptimizationResult> {
        const originalValidation = await this.constraintValidationService.validateShiftPlan(
            shiftPlan,
            employees,
            availabilityMap,
            employees[0]?.organizationId || ''
        );

        const originalScore = originalValidation.overallScore;
        const improvements: string[] = [];
        let modifications = 0;

        // Optimization logic would go here
        // This is a placeholder for actual optimization algorithms

        const optimizedScore = originalScore; // Placeholder

        return {
            originalScore,
            optimizedScore,
            improvements,
            modifications,
            success: optimizedScore > originalScore
        };
    }

    // Private helper methods

    /**
     * Sort employees for a week based on strategy
     */
    private sortEmployeesForWeek(
        employees: Employee[],
        availabilityMap: AvailabilityMap,
        strategy: string
    ): Employee[] {
        switch (strategy) {
            case 'workload_balancing':
                return this.employeeSortingService.sortByWorkload(employees, availabilityMap);
            case 'rotation_based':
                return this.employeeSortingService.rotateEmployeesForBalance(employees, Date.now() % 7);
            default:
                return this.employeeSortingService.sortEmployeesByRole(employees);
        }
    }

    /**
     * Simplified shift assignment for secondary locations
     */
    private async assignSimplifiedShift(
        date: Date,
        employees: Employee[],
        availabilityMap: AvailabilityMap,
        shiftPlan: MonthlyShiftPlan
    ): Promise<boolean> {
        const dayKey = this.shiftPlanningUtilityService.formatDayKey(date);

        // Simple assignment logic - assign available employees in rotation
        const availableEmployees = employees.filter(emp => {
            const availability = availabilityMap[emp.id];
            return availability && availability.isAvailableForPlanning;
        });

        if (availableEmployees.length === 0) {
            return false;
        }

        // Create simple shift assignment
        shiftPlan[dayKey] = {
            'SecondaryShift': [availableEmployees[0].id] // Simplified assignment
        };

        // Update availability
        const shiftHours = 8; // Standard shift hours
        await this.employeeAvailabilityService.updateAvailability(availableEmployees[0].id, {
            shiftHours,
            shiftType: 'SecondaryShift',
            dayKey,
            isSaturday: false
        });

        return true;
    }

    /**
     * Merge shift plans from multiple locations
     */
    private mergePlans(primary: MonthlyShiftPlan, secondary?: MonthlyShiftPlan): MonthlyShiftPlan {
        const merged = {...primary};

        if (secondary) {
            for (const dayKey in secondary) {
                if (!merged[dayKey] || merged[dayKey] === null) {
                    merged[dayKey] = secondary[dayKey];
                } else {
                    // Merge day plans
                    const primaryDay = merged[dayKey] as DayShiftPlan;
                    const secondaryDay = secondary[dayKey] as DayShiftPlan;

                    if (secondaryDay) {
                        for (const shiftName in secondaryDay) {
                            primaryDay[shiftName] = secondaryDay[shiftName];
                        }
                    }
                }
            }
        }

        return merged;
    }

    /**
     * Calculate final statistics from completed plan
     */
    private calculateFinalStatistics(
        shiftPlan: MonthlyShiftPlan,
        availabilityMap: AvailabilityMap,
        statistics: PlanningResultStatistics
    ): void {
        let totalShifts = 0;
        let totalHours = 0;

        for (const dayKey in shiftPlan) {
            const dayPlan = shiftPlan[dayKey];
            if (dayPlan === null) continue;

            for (const shiftName in dayPlan) {
                const employeeIds = dayPlan[shiftName];
                const shiftHours = this.getShiftHours(shiftName);

                totalShifts += employeeIds.length;
                totalHours += employeeIds.length * shiftHours;
            }
        }

        statistics.totalShiftsPlanned = totalShifts;
        statistics.totalHoursPlanned = totalHours;
        statistics.totalEmployeesInvolved = Object.keys(availabilityMap).length;
        statistics.coveragePercentage = this.calculateCoveragePercentage(shiftPlan);
    }

    /**
     * Calculate coverage percentage
     */
    private calculateCoveragePercentage(shiftPlan: MonthlyShiftPlan): number {
        let totalDays = 0;
        let coveredDays = 0;

        for (const dayKey in shiftPlan) {
            totalDays++;
            if (shiftPlan[dayKey] !== null) {
                coveredDays++;
            }
        }

        return totalDays > 0 ? (coveredDays / totalDays) * 100 : 0;
    }

    /**
     * Get standard hours for a shift type
     */
    private getShiftHours(shiftName: string): number {
        const shiftHours = {
            'F': 8,
            'S': 8,
            'FS': 6,
            'SecondaryShift': 8
        };
        return shiftHours[shiftName] || 8;
    }
}