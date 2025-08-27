import { BaseService } from './BaseService';
import { ShiftPlanningOptions, EmployeeAvailability, MonthlyShiftPlan } from '../types';
import { ShiftPlans } from '../api/ShiftPlans';
import {
  GenerateShiftPlanDto,
  ValidateShiftPlanDto,
  OptimizationCriteriaDto,
  ShiftPlanStatisticsDto,
  ConstraintValidationResultDto
} from '../api/data-contracts';

/**
 * Service for shift planning algorithms and optimization using backend API endpoints
 */
export class ShiftPlanningService extends BaseService {
  private shiftPlansApi: ShiftPlans;

  constructor() {
    super();
    this.shiftPlansApi = new ShiftPlans(this.httpClient);
  }

  /**
   * Generate an optimized shift plan using backend API
   * @param options - Planning options and constraints
   * @param employees - Available employees
   * @param availability - Employee availability data
   * @returns Generated shift plan
   */
  async generateOptimalPlan(
    options: ShiftPlanningOptions,
    employees: any[],
    availability: EmployeeAvailability[]
  ): Promise<MonthlyShiftPlan> {
    try {
      // Convert frontend options to backend format
      const generateDto: GenerateShiftPlanDto = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        employeeIds: employees.map(emp => emp.id),
        useRelaxedRules: options.algorithm === 'basic'
      };

      const response = await this.shiftPlansApi.shiftPlansControllerGenerate(generateDto);
      
      // Convert backend response to frontend format
      if (response.data && response.data.shiftPlan) {
        return response.data.shiftPlan as MonthlyShiftPlan;
      }

      // Return empty plan if no data
      return {};
    } catch (error) {
      console.error('Error generating optimal shift plan:', error);
      throw new Error(`Failed to generate shift plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate a shift plan against constraints using backend API
   * @param plan - The shift plan to validate
   * @param constraints - Validation constraints
   * @returns Validation results
   */
  async validatePlan(plan: MonthlyShiftPlan, constraints: string[]): Promise<any[]> {
    try {
      const validateDto: ValidateShiftPlanDto = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        planData: plan,
        employeeIds: this.extractEmployeeIdsFromPlan(plan)
      };

      const response = await this.shiftPlansApi.shiftPlansControllerValidate(validateDto);
      
      // Convert backend response to frontend format
      if (response.data && response.data.violations) {
        return response.data.violations;
      }

      return [];
    } catch (error) {
      console.error('Error validating shift plan:', error);
      throw new Error(`Failed to validate shift plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Optimize an existing shift plan using backend API
   * @param shiftPlanId - The shift plan ID to optimize
   * @param criteria - Optimization criteria
   * @returns Optimized shift plan
   */
  async optimizePlan(shiftPlanId: string, criteria: OptimizationCriteriaDto): Promise<MonthlyShiftPlan> {
    try {
      const response = await this.shiftPlansApi.shiftPlansControllerOptimizeShiftPlan(
        shiftPlanId,
        criteria
      );
      
      // The optimize endpoint typically returns void, so we need to fetch the updated plan
      const updatedPlan = await this.shiftPlansApi.shiftPlansControllerFindOne(shiftPlanId);
      
      if (updatedPlan.data && updatedPlan.data.planData) {
        return updatedPlan.data.planData as MonthlyShiftPlan;
      }

      throw new Error('Failed to retrieve optimized plan');
    } catch (error) {
      console.error('Error optimizing shift plan:', error);
      throw new Error(`Failed to optimize shift plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate plan statistics using backend API
   * @param shiftPlanId - The shift plan ID
   * @returns Plan statistics
   */
  async calculatePlanStats(shiftPlanId: string): Promise<ShiftPlanStatisticsDto> {
    try {
      const response = await this.shiftPlansApi.shiftPlansControllerGetShiftPlanStatistics(shiftPlanId);
      
      if (response.data) {
        return response.data;
      }

      throw new Error('No statistics data received');
    } catch (error) {
      console.error('Error calculating plan statistics:', error);
      throw new Error(`Failed to calculate statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate shift plan constraints using backend API
   * @param shiftPlanId - The shift plan ID to validate
   * @returns Constraint validation results
   */
  async validateShiftPlanConstraints(shiftPlanId: string): Promise<ConstraintValidationResultDto> {
    try {
      const response = await this.shiftPlansApi.shiftPlansControllerValidateShiftPlanConstraints(
        shiftPlanId,
        {} // Use default validation config
      );
      
      if (response.data) {
        return response.data;
      }

      throw new Error('No validation data received');
    } catch (error) {
      console.error('Error validating shift plan constraints:', error);
      throw new Error(`Failed to validate constraints: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract employee IDs from a shift plan
   * @param plan - The shift plan
   * @returns Array of employee IDs
   */
  private extractEmployeeIdsFromPlan(plan: MonthlyShiftPlan): string[] {
    const employeeIds = new Set<string>();
    
    Object.values(plan).forEach(dayPlan => {
      if (dayPlan) {
        Object.values(dayPlan).forEach(shiftEmployees => {
          if (Array.isArray(shiftEmployees)) {
            shiftEmployees.forEach(empId => employeeIds.add(empId));
          }
        });
      }
    });
    
    return Array.from(employeeIds);
  }

  /**
   * Get available planning algorithms
   * @returns List of available algorithms
   */
  getAvailableAlgorithms(): string[] {
    // TODO: Return actual available algorithms
    return ['basic', 'advanced', 'ai'];
  }

  /**
   * Get default planning constraints
   * @returns Default constraints
   */
  getDefaultConstraints(): string[] {
    // TODO: Return actual default constraints
    return [
      'max_hours_per_week',
      'min_rest_time',
      'skill_requirements',
      'availability'
    ];
  }
}