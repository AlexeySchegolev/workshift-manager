import { BaseService } from './BaseService';
import { ShiftPlans } from '../api/ShiftPlans';
import { 
  CreateShiftPlanDto, 
  UpdateShiftPlanDto, 
  ShiftPlanResponseDto,
  GenerateShiftPlanDto,
  ValidateShiftPlanDto
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
   * Get all shift plans
   */
  async getAllShiftPlans(options?: {
    includeRelations?: boolean;
  }): Promise<ShiftPlanResponseDto[]> {
    const response = await this.shiftPlansApi.shiftPlansControllerFindAll(options);
    return response.data;
  }

  /**
   * Get shift plan by ID
   */
  async getShiftPlanById(id: string): Promise<ShiftPlanResponseDto> {
    const response = await this.shiftPlansApi.shiftPlansControllerFindOne(id);
    return response.data;
  }

  /**
   * Create a new shift plan
   */
  async createShiftPlan(shiftPlanData: CreateShiftPlanDto): Promise<ShiftPlanResponseDto> {
    const response = await this.shiftPlansApi.shiftPlansControllerCreate(shiftPlanData);
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
   * Generate automatic shift plan
   */
  async generateShiftPlan(generateData: GenerateShiftPlanDto): Promise<any> {
    const response = await this.shiftPlansApi.shiftPlansControllerGenerate(generateData);
    return response.data;
  }

  /**
   * Validate shift plan
   */
  async validateShiftPlan(validateData: ValidateShiftPlanDto): Promise<{ 
    isValid: boolean; 
    violations: any[]; 
  }> {
    const response = await this.shiftPlansApi.shiftPlansControllerValidate(validateData);
    const data = response.data;
    return {
      isValid: data.isValid || false,
      violations: data.violations || []
    };
  }

  /**
   * Get shift plans by month and year
   */
  async getShiftPlansByMonthYear(year: number, month: number): Promise<ShiftPlanResponseDto> {
    const response = await this.shiftPlansApi.shiftPlansControllerFindByMonthYear(year, month);
    return response.data;
  }

  /**
   * Publish a shift plan
   */
  async publishShiftPlan(id: string): Promise<void> {
    await this.shiftPlansApi.shiftPlansControllerPublish(id);
  }

  /**
   * Unpublish a shift plan
   */
  async unpublishShiftPlan(id: string): Promise<void> {
    await this.shiftPlansApi.shiftPlansControllerUnpublish(id);
  }

  /**
   * Get shift plan statistics
   */
  async getShiftPlanStats(): Promise<{
    total?: number;
    byLocation?: object;
    byStatus?: object;
  }> {
    const response = await this.shiftPlansApi.shiftPlansControllerGetStats();
    return response.data;
  }
}