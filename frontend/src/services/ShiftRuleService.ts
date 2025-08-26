import { BaseService } from './BaseService';
import { ShiftRules } from '../api/ShiftRules';
import { 
  CreateShiftRulesDto, 
  UpdateShiftRulesDto, 
  ShiftRulesResponseDto 
} from '../api/data-contracts';

/**
 * Service class for shift rule operations
 * Provides a clean interface between components and the API
 */
export class ShiftRuleService extends BaseService {
  private shiftRulesApi: ShiftRules;

  constructor() {
    super();
    this.shiftRulesApi = new ShiftRules(this.getHttpClient());
  }

  /**
   * Get all shift rules
   */
  async getAllShiftRules(options?: {
    activeOnly?: boolean;
  }): Promise<ShiftRulesResponseDto[]> {
    const response = await this.shiftRulesApi.shiftRulesControllerFindAll(options);
    return response.data;
  }

  /**
   * Get shift rule by ID
   */
  async getShiftRuleById(id: string): Promise<ShiftRulesResponseDto> {
    const response = await this.shiftRulesApi.shiftRulesControllerFindOne(id);
    return response.data;
  }

  /**
   * Create new shift rules
   */
  async createShiftRule(shiftRuleData: CreateShiftRulesDto): Promise<ShiftRulesResponseDto> {
    const response = await this.shiftRulesApi.shiftRulesControllerCreate(shiftRuleData);
    return response.data;
  }

  /**
   * Update existing shift rules
   */
  async updateShiftRule(id: string, shiftRuleData: UpdateShiftRulesDto): Promise<ShiftRulesResponseDto> {
    const response = await this.shiftRulesApi.shiftRulesControllerUpdate(id, shiftRuleData);
    return response.data;
  }

  /**
   * Delete shift rules
   */
  async deleteShiftRule(id: string): Promise<void> {
    await this.shiftRulesApi.shiftRulesControllerRemove(id);
  }

  /**
   * Get shift rules by location (returns all rules since location filtering is not available)
   */
  async getShiftRulesByLocation(locationId: number): Promise<ShiftRulesResponseDto[]> {
    // Since locationId property doesn't exist in ShiftRulesResponseDto,
    // return all rules for now
    return await this.getAllShiftRules();
  }

  /**
   * Get default shift rules
   */
  async getDefaultShiftRules(): Promise<ShiftRulesResponseDto[]> {
    const response = await this.shiftRulesApi.shiftRulesControllerFindAll({ activeOnly: true });
    return response.data;
  }

  /**
   * Validate shift rules (client-side basic validation)
   */
  async validateShiftRules(shiftRuleData: CreateShiftRulesDto | UpdateShiftRulesDto): Promise<any> {
    // Basic client-side validation since API validation endpoint is not available
    const errors: string[] = [];
    
    if ('minNursesPerShift' in shiftRuleData && shiftRuleData.minNursesPerShift != null && shiftRuleData.minNursesPerShift < 1) {
      errors.push('Minimum nurses per shift must be at least 1');
    }
    
    if ('maxConsecutiveWorkingDays' in shiftRuleData && shiftRuleData.maxConsecutiveWorkingDays != null && shiftRuleData.maxConsecutiveWorkingDays < 1) {
      errors.push('Maximum consecutive working days must be at least 1');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get shift rule statistics
   */
  async getShiftRuleStats(): Promise<{
    total?: number;
    byLocation?: object;
    byType?: object;
  }> {
    const response = await this.shiftRulesApi.shiftRulesControllerGetStats();
    return response.data;
  }
}