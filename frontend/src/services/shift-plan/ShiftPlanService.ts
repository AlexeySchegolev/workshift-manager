import { ShiftPlans } from '../../api/ShiftPlans';
import {
    CreateShiftPlanDto,
    ExcelExportRequestDto,
    ExcelExportResultDto,
    ShiftPlanResponseDto,
    UpdateShiftPlanDto
} from '../../api/data-contracts';
import { BaseService } from '../BaseService';

/**
 * Service class for shift plan operations
 * Provides a clean interface between components and the API
 */
export class ShiftPlanService extends BaseService {
  private shiftPlansApi: ShiftPlans;

  constructor() {
    super();
    this.shiftPlansApi = new ShiftPlans(this.getHttpClient());
  }

  /**
   * Create a new shift plan
   */
  async createShiftPlan(shiftPlanData: CreateShiftPlanDto): Promise<ShiftPlanResponseDto> {
    const response = await this.shiftPlansApi.shiftPlansControllerCreate(shiftPlanData);
    return response.data;
  }

  /**
   * Get all shift plans with optional relation data
   */
  async getAllShiftPlans(options?: {
    includeRelations?: boolean;
  }): Promise<ShiftPlanResponseDto[]> {
    const response = await this.shiftPlansApi.shiftPlansControllerFindAll(options);
    return response.data;
  }

  /**
   * Get a specific shift plan by ID
   */
  async getShiftPlanById(id: string, options?: {
    includeRelations?: boolean;
  }): Promise<ShiftPlanResponseDto> {
    const response = await this.shiftPlansApi.shiftPlansControllerFindOne(id, options);
    return response.data;
  }

  /**
   * Get a specific shift plan by location, year and month
   */
  async getShiftPlanByLocationMonthYear(
    locationId: string,
    year: number,
    month: number
  ): Promise<ShiftPlanResponseDto | null> {
    try {
      const response = await this.shiftPlansApi.shiftPlansControllerFindByLocationMonthYear(
        locationId,
        year,
        month
      );
      return response.data;
    } catch (error: any) {
      // Return null if shift plan not found (404), otherwise rethrow
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get shift plan with details by location, year and month
   */
  async getShiftPlanWithDetailsByLocationMonthYear(
    locationId: string,
    year: number,
    month: number
  ): Promise<{ shiftPlan: ShiftPlanResponseDto; details: any } | null> {
    try {
      const shiftPlan = await this.getShiftPlanByLocationMonthYear(locationId, year, month);
      if (!shiftPlan) {
        return null;
      }

      // Load details using ShiftPlanDetailService
      const { ShiftPlanDetailService } = await import('./ShiftPlanDetailService');
      const detailService = new ShiftPlanDetailService();
      const details = await detailService.getDetailsByShiftPlan(shiftPlan.id);

      return { shiftPlan, details };
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Update an existing shift plan
   */
  async updateShiftPlan(id: string, shiftPlanData: UpdateShiftPlanDto): Promise<ShiftPlanResponseDto> {
    const response = await this.shiftPlansApi.shiftPlansControllerUpdate(id, shiftPlanData);
    return response.data;
  }

  /**
   * Delete a shift plan
   */
  async deleteShiftPlan(id: string): Promise<void> {
    await this.shiftPlansApi.shiftPlansControllerRemove(id);
  }

  /**
   * Export shift plan to Excel
   */
  async exportToExcel(id: string, exportRequest: ExcelExportRequestDto): Promise<ExcelExportResultDto> {
    const response = await this.shiftPlansApi.shiftPlansControllerExportToExcel(id, exportRequest);
    return response.data;
  }
}