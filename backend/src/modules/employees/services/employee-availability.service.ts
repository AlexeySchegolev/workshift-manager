import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ShiftPlanningAvailability} from '@/database/entities/shift-planning-availability.entity';
import {Employee, ShiftPlan} from '@/database/entities';
import {ShiftPlanningUtilityService} from '../../shift-plans/services/shift-planning-utility.service';

export interface AvailabilityUpdateData {
  shiftHours: number;
  shiftType: string;
  dayKey: string;
  isSaturday?: boolean;
  isPreferredShift?: boolean;
}

export interface AvailabilityMap {
  [employeeId: string]: ShiftPlanningAvailability;
}

/**
 * Service for managing employee availability during shift planning.
 * Handles ShiftPlanningAvailability records and workload calculations.
 */
@Injectable()
export class EmployeeAvailabilityService {
  constructor(
    @InjectRepository(ShiftPlanningAvailability)
    private shiftPlanningAvailabilityRepository: Repository<ShiftPlanningAvailability>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(ShiftPlan)
    private shiftPlanRepository: Repository<ShiftPlan>,
    private shiftPlanningUtilityService: ShiftPlanningUtilityService,
  ) {}

  /**
   * Initialize availability records for all employees for a specific shift plan
   * 
   * @param employeeIds Array of employee IDs to initialize
   * @param shiftPlanId The shift plan ID
   * @param createdBy User ID who created the records
   * @returns Map of employee IDs to their availability records
   */
  async initializeAvailability(
    employeeIds: string[],
    shiftPlanId: string,
    createdBy?: string
  ): Promise<AvailabilityMap> {
    const availabilityMap: AvailabilityMap = {};

    // Clean up any existing availability records for this shift plan
    await this.shiftPlanningAvailabilityRepository.delete({ shiftPlanId });

    // Create new availability records for each employee
    for (const employeeId of employeeIds) {
      const availability = this.shiftPlanningAvailabilityRepository.create({
        employeeId,
        shiftPlanId,
        weeklyHoursAssigned: 0,
        totalHoursAssigned: 0,
        shiftsAssigned: [],
        lastShiftType: null,
        saturdaysWorked: 0,
        consecutiveDaysCount: 0,
        workloadPercentage: 0,
        preferredShiftsAssigned: 0,
        constraintViolations: 0,
        planningPriorityScore: 0,
        isAvailableForPlanning: true,
        createdBy,
      });

      availabilityMap[employeeId] = await this.shiftPlanningAvailabilityRepository.save(availability);
    }

    return availabilityMap;
  }

  /**
   * Get availability records for a specific shift plan
   * 
   * @param shiftPlanId The shift plan ID
   * @returns Map of employee IDs to their availability records
   */
  async getAvailabilityForShiftPlan(shiftPlanId: string): Promise<AvailabilityMap> {
    const availabilityRecords = await this.shiftPlanningAvailabilityRepository.find({
      where: { shiftPlanId },
      relations: ['employee']
    });

    const availabilityMap: AvailabilityMap = {};
    availabilityRecords.forEach(record => {
      availabilityMap[record.employeeId] = record;
    });

    return availabilityMap;
  }

  /**
   * Update availability after assigning a shift to an employee
   * 
   * @param employeeId The employee ID
   * @param updateData The shift assignment data
   * @returns Updated availability record
   */
  async updateAvailability(
    employeeId: string,
    updateData: AvailabilityUpdateData
  ): Promise<ShiftPlanningAvailability> {
    const availability = await this.shiftPlanningAvailabilityRepository.findOne({
      where: { employeeId },
      relations: ['employee']
    });

    if (!availability) {
      throw new NotFoundException(`Availability record not found for employee ${employeeId}`);
    }

    // Update availability using the entity method
    availability.updateAfterShiftAssignment(
      updateData.shiftHours,
      updateData.shiftType,
      updateData.dayKey,
      updateData.isSaturday
    );

    // Update preferred shifts counter if applicable
    if (updateData.isPreferredShift) {
      availability.preferredShiftsAssigned += 1;
    }

    // Recalculate workload percentage
    if (availability.employee) {
      availability.workloadPercentage = this.calculateWorkloadPercentage(
        availability.employee,
        availability
      );
    }

    // Update planning priority score
    availability.planningPriorityScore = this.calculatePlanningPriorityScore(availability);

    return await this.shiftPlanningAvailabilityRepository.save(availability);
  }

  /**
   * Reset weekly counters for all employees (called at the start of each planning week)
   * 
   * @param availabilityMap Current availability map
   * @returns Updated availability map
   */
  async resetWeeklyCounters(availabilityMap: AvailabilityMap): Promise<AvailabilityMap> {
    const updates = Object.values(availabilityMap).map(async (availability) => {
      availability.resetWeeklyCounters();
      return await this.shiftPlanningAvailabilityRepository.save(availability);
    });

    const updatedAvailabilities = await Promise.all(updates);
    
    const updatedMap: AvailabilityMap = {};
    updatedAvailabilities.forEach(availability => {
      updatedMap[availability.employeeId] = availability;
    });

    return updatedMap;
  }

  /**
   * Calculate workload percentage for an employee
   * 
   * @param employee The employee
   * @param availability The availability record
   * @returns Workload percentage (0-200+)
   */
  calculateWorkloadPercentage(
    employee: Employee,
    availability: ShiftPlanningAvailability
  ): number {
    if (employee.hoursPerMonth === 0) {
      return 0;
    }

    return (availability.totalHoursAssigned / employee.hoursPerMonth) * 100;
  }

  /**
   * Calculate planning priority score for fair distribution
   * 
   * @param availability The availability record
   * @returns Priority score (higher = higher priority for assignments)
   */
  calculatePlanningPriorityScore(availability: ShiftPlanningAvailability): number {
    let score = 100;

    // Lower score for employees with more hours (to balance workload)
    score -= availability.workloadPercentage * 0.5;

    // Lower score for employees who worked more Saturdays
    score -= availability.saturdaysWorked * 10;

    // Lower score for employees with more consecutive days
    score -= availability.consecutiveDaysCount * 5;

    // Higher score for employees with fewer constraint violations
    score -= availability.constraintViolations * 15;

    // Bonus for employees with fewer preferred shifts assigned
    const totalShifts = availability.shiftsAssigned.length || 1;
    const preferenceRatio = availability.preferredShiftsAssigned / totalShifts;
    if (preferenceRatio < 0.5) {
      score += 10;
    }

    return Math.max(0, score);
  }

  /**
   * Get employees sorted by planning priority (for fair assignment)
   * 
   * @param availabilityMap Current availability map
   * @param roleFilter Optional role filter
   * @returns Array of employee IDs sorted by priority (highest first)
   */
  getEmployeesSortedByPriority(
    availabilityMap: AvailabilityMap,
    roleFilter?: string
  ): string[] {
    let availabilityRecords = Object.values(availabilityMap);

    // Filter by role if specified
    if (roleFilter) {
      availabilityRecords = availabilityRecords.filter(
        record => record.employee?.primaryRole?.type === roleFilter
      );
    }

    // Filter out unavailable employees
    availabilityRecords = availabilityRecords.filter(
      record => record.isAvailableForPlanning
    );

    // Sort by priority score (descending)
    availabilityRecords.sort((a, b) => b.planningPriorityScore - a.planningPriorityScore);

    return availabilityRecords.map(record => record.employeeId);
  }

  /**
   * Check if an employee can work more shifts without exceeding limits
   * 
   * @param availability The availability record
   * @param employee The employee
   * @param additionalHours Hours to be added
   * @returns True if employee can work more shifts
   */
  canWorkMoreShifts(
    availability: ShiftPlanningAvailability,
    employee: Employee,
    additionalHours: number = 8
  ): boolean {
    // Check weekly hours limit
    const proposedWeeklyHours = availability.weeklyHoursAssigned + additionalHours;
    const maxWeeklyHours = (employee.hoursPerMonth / 4.33) * 1.2; // 20% overtime allowance
    
    if (proposedWeeklyHours > maxWeeklyHours) {
      return false;
    }

    // Check monthly hours limit
    const proposedMonthlyHours = availability.totalHoursAssigned + additionalHours;
    const maxMonthlyHours = employee.hoursPerMonth * 1.15; // 15% overtime allowance
    
    if (proposedMonthlyHours > maxMonthlyHours) {
      return false;
    }

    // Check consecutive days limit
    return availability.consecutiveDaysCount < employee.maxConsecutiveDays;


  }

  /**
   * Mark employee as unavailable for planning (e.g., due to constraints)
   * 
   * @param employeeId The employee ID
   * @param reason Optional reason for unavailability
   */
  async markAsUnavailable(employeeId: string, reason?: string): Promise<void> {
    await this.shiftPlanningAvailabilityRepository.update(
      { employeeId },
      {
        isAvailableForPlanning: false,
        planningMetadata: { unavailableReason: reason } as any
      }
    );
  }

  /**
   * Mark employee as available for planning
   * 
   * @param employeeId The employee ID
   */
  async markAsAvailable(employeeId: string): Promise<void> {
    await this.shiftPlanningAvailabilityRepository.update(
      { employeeId },
      {
        isAvailableForPlanning: true,
        planningMetadata: {}
      }
    );
  }

  /**
   * Increment constraint violations for an employee
   * 
   * @param employeeId The employee ID
   * @param violationType Type of violation
   */
  async incrementConstraintViolations(
    employeeId: string,
    violationType: string
  ): Promise<void> {
    const availability = await this.shiftPlanningAvailabilityRepository.findOne({
      where: { employeeId }
    });

    if (availability) {
      availability.constraintViolations += 1;
      availability.planningMetadata = {
        ...availability.planningMetadata,
        lastViolationType: violationType,
        lastViolationTime: new Date().toISOString()
      };

      // Recalculate priority score
      availability.planningPriorityScore = this.calculatePlanningPriorityScore(availability);

      await this.shiftPlanningAvailabilityRepository.save(availability);
    }
  }

  /**
   * Get availability statistics for a shift plan
   * 
   * @param shiftPlanId The shift plan ID
   * @returns Availability statistics
   */
  async getAvailabilityStatistics(shiftPlanId: string): Promise<{
    totalEmployees: number;
    availableEmployees: number;
    averageWorkload: number;
    averageHours: number;
    totalConstraintViolations: number;
    saturdayWorkDistribution: Record<string, number>;
  }> {
    const availabilityRecords = await this.shiftPlanningAvailabilityRepository.find({
      where: { shiftPlanId },
      relations: ['employee']
    });

    const totalEmployees = availabilityRecords.length;
    const availableEmployees = availabilityRecords.filter(r => r.isAvailableForPlanning).length;
    
    const totalWorkload = availabilityRecords.reduce((sum, r) => sum + r.workloadPercentage, 0);
    const averageWorkload = totalEmployees > 0 ? totalWorkload / totalEmployees : 0;
    
    const totalHours = availabilityRecords.reduce((sum, r) => sum + r.totalHoursAssigned, 0);
    const averageHours = totalEmployees > 0 ? totalHours / totalEmployees : 0;
    
    const totalConstraintViolations = availabilityRecords.reduce((sum, r) => sum + r.constraintViolations, 0);
    
    const saturdayWorkDistribution: Record<string, number> = {};
    availabilityRecords.forEach(record => {
      const saturdays = record.saturdaysWorked;
      saturdayWorkDistribution[saturdays.toString()] = (saturdayWorkDistribution[saturdays.toString()] || 0) + 1;
    });

    return {
      totalEmployees,
      availableEmployees,
      averageWorkload,
      averageHours,
      totalConstraintViolations,
      saturdayWorkDistribution
    };
  }

  /**
   * Delete all availability records for a shift plan
   * 
   * @param shiftPlanId The shift plan ID
   */
  async deleteAvailabilityForShiftPlan(shiftPlanId: string): Promise<void> {
    await this.shiftPlanningAvailabilityRepository.delete({ shiftPlanId });
  }
}