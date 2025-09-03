import { BaseService } from './BaseService';
import { ShiftPlans } from '../api/ShiftPlans';
import { 
  ShiftPlanResponseDto,
  UpdateShiftPlanDto,
  ExcelExportRequestDto,
  ExcelExportResultDto
} from '../api/data-contracts';

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