import {BaseService} from './BaseService';
import {AdvancedPlanningOptionsDto, EmployeeAvailabilityResponseDto, MonthlyShiftPlanDto} from '../api/data-contracts';

type ShiftPlanningOptions = AdvancedPlanningOptionsDto;
import {ShiftPlans} from '../api/ShiftPlans';
import {
    GenerateShiftPlanDto,
    ValidateShiftPlanDto
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
     * @returns Generated shift plan
     */
    async generateOptimalPlan(
        options: ShiftPlanningOptions,
        employees: any[],
    ): Promise<MonthlyShiftPlanDto> {
        try {
            // Convert frontend options to backend format
            const generateDto: GenerateShiftPlanDto = {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                employeeIds: employees.map(emp => emp.id),
                useRelaxedRules: options.optimizationLevel === 'basic'
            };

            const response = await this.shiftPlansApi.shiftPlansControllerGenerate(generateDto);

            // Convert backend response to frontend format
            if (response.data && response.data.shiftPlan) {
                return response.data.shiftPlan as MonthlyShiftPlanDto;
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
    async validatePlan(plan: MonthlyShiftPlanDto, constraints: string[]): Promise<any[]> {
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
     * Extract employee IDs from a shift plan
     * @param plan - The shift plan
     * @returns Array of employee IDs
     */
    private extractEmployeeIdsFromPlan(plan: MonthlyShiftPlanDto): string[] {
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
}