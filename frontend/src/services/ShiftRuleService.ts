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
     * Get default shift rules
   */
  async getDefaultShiftRules(): Promise<ShiftRulesResponseDto[]> {
    const response = await this.shiftRulesApi.shiftRulesControllerFindAll({ activeOnly: true });
    return response.data;
  }
}