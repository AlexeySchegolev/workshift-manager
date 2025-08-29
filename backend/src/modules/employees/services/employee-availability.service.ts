import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ShiftPlanningAvailability} from '@/database/entities/shift-planning-availability.entity';
import {Employee} from "@/database/entities/employee.entity";

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
}