import { ShiftPlanDetails } from '../../api/ShiftPlanDetails';
import {
    CreateShiftPlanDetailDto,
    ShiftPlanDetailResponseDto,
    UpdateShiftPlanDetailDto,
} from '../../api/data-contracts';
import { BaseService } from '../BaseService';

/**
 * Service class for shift plan detail operations
 * Handles assignment of employees to shifts on specific days
 */
export class ShiftPlanDetailService extends BaseService {
  private shiftPlanDetailsApi: ShiftPlanDetails;

  constructor() {
    super();
    this.shiftPlanDetailsApi = new ShiftPlanDetails(this.getHttpClient());
  }

  /**
   * Create a new shift plan detail (assign employee to shift)
   */
  async createShiftPlanDetail(detailData: CreateShiftPlanDetailDto): Promise<ShiftPlanDetailResponseDto> {
    const response = await this.shiftPlanDetailsApi.shiftPlanDetailsControllerCreate(detailData);
    return response.data;
  }

  /**
   * Get all shift plan details with optional filters
   */
  async getAllShiftPlanDetails(filters?: {
    shiftPlanId?: string;
    employeeId?: string;
    shiftId?: string;
    day?: number;
    month?: number;
    year?: number;
  }): Promise<ShiftPlanDetailResponseDto[]> {
    const query = filters ? {
      shiftPlanId: filters.shiftPlanId,
      employeeId: filters.employeeId,
      shiftId: filters.shiftId,
      day: filters.day?.toString(),
      month: filters.month?.toString(),
      year: filters.year?.toString(),
    } : undefined;

    const response = await this.shiftPlanDetailsApi.shiftPlanDetailsControllerFindAll(query);
    return response.data;
  }

  /**
   * Get shift plan detail by ID
   */
  async getShiftPlanDetailById(id: string): Promise<ShiftPlanDetailResponseDto> {
    const response = await this.shiftPlanDetailsApi.shiftPlanDetailsControllerFindOne(id);
    return response.data;
  }

  /**
   * Get all details for a specific shift plan
   */
  async getDetailsByShiftPlan(shiftPlanId: string): Promise<ShiftPlanDetailResponseDto[]> {
    const response = await this.shiftPlanDetailsApi.shiftPlanDetailsControllerFindByShiftPlan(shiftPlanId);
    return response.data;
  }

  /**
   * Get all assignments for a specific employee
   */
  async getDetailsByEmployee(employeeId: string): Promise<ShiftPlanDetailResponseDto[]> {
    const response = await this.shiftPlanDetailsApi.shiftPlanDetailsControllerFindByEmployee(employeeId);
    return response.data;
  }

  /**
   * Get all assignments for a specific shift
   */
  async getDetailsByShift(shiftId: string): Promise<ShiftPlanDetailResponseDto[]> {
    const response = await this.shiftPlanDetailsApi.shiftPlanDetailsControllerFindByShift(shiftId);
    return response.data;
  }

  /**
   * Get all details for a specific month and year
   */
  async getDetailsByMonth(year: number, month: number): Promise<ShiftPlanDetailResponseDto[]> {
    const response = await this.shiftPlanDetailsApi.shiftPlanDetailsControllerFindByMonth(
      year.toString(),
      month.toString()
    );
    return response.data;
  }

  /**
   * Update an existing shift plan detail
   */
  async updateShiftPlanDetail(id: string, detailData: UpdateShiftPlanDetailDto): Promise<ShiftPlanDetailResponseDto> {
    const response = await this.shiftPlanDetailsApi.shiftPlanDetailsControllerUpdate(id, detailData);
    return response.data;
  }

  /**
   * Delete a shift plan detail (remove assignment)
   */
  async deleteShiftPlanDetail(id: string): Promise<void> {
    await this.shiftPlanDetailsApi.shiftPlanDetailsControllerRemove(id);
  }

  /**
   * Assign employee to shift on specific day
   * This is a convenience method that handles the logic for creating/updating assignments
   */
  async assignEmployeeToShift(
    shiftPlanId: string,
    employeeId: string,
    shiftId: string,
    day: number
  ): Promise<ShiftPlanDetailResponseDto> {
    // Check if there's already an assignment for this employee on this day
    const existingAssignments = await this.getAllShiftPlanDetails({
      shiftPlanId,
      employeeId,
      day,
    });

    if (existingAssignments.length > 0) {
      // Update existing assignment
      const existingAssignment = existingAssignments[0];
      return this.updateShiftPlanDetail(existingAssignment.id, {
        shiftId,
      });
    } else {
      // Create new assignment
      return this.createShiftPlanDetail({
        shiftPlanId,
        employeeId,
        shiftId,
        day,
      });
    }
  }

  /**
   * Remove employee assignment from specific day
   */
  async removeEmployeeAssignment(
    shiftPlanId: string,
    employeeId: string,
    day: number
  ): Promise<void> {
    const existingAssignments = await this.getAllShiftPlanDetails({
      shiftPlanId,
      employeeId,
      day,
    });

    for (const assignment of existingAssignments) {
      await this.deleteShiftPlanDetail(assignment.id);
    }
  }

  /**
   * Clear all assignments for a shift plan
   */
  async clearShiftPlan(shiftPlanId: string): Promise<void> {
    await this.shiftPlanDetailsApi.shiftPlanDetailsControllerClearShiftPlan(shiftPlanId);
  }
}

// Export singleton instance
export const shiftPlanDetailService = new ShiftPlanDetailService();