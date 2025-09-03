import {BaseService} from './BaseService';
import {EmployeeResponseDto, MonthlyShiftPlanDto} from '../api/data-contracts';

/**
 * Service for shift planning algorithms and optimization
 * Note: Backend shift planning endpoints are not yet implemented, using mock data
 */
export class ShiftPlanningService extends BaseService {
    constructor() {
        super();
    }

    /**
     * Generate an optimized shift plan (mock implementation)
     * @param employees - Available employees
     * @returns Generated shift plan
     */
    async generateOptimalPlan(
        employees: EmployeeResponseDto[],
    ): Promise<MonthlyShiftPlanDto> {
        try {
            // Mock implementation - generate simple shift assignments
            const plan: MonthlyShiftPlanDto = {} as Record<string, Record<string, string[]> | null>;
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            const shifts = ['F', 'S', 'S0', 'S1'];
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${day.toString().padStart(2, '0')}.${(month + 1).toString().padStart(2, '0')}.${year}`;
                const dayPlan: Record<string, string[]> = {};
                
                shifts.forEach((shift, shiftIndex) => {
                    const assignedEmployees = employees
                        .filter((_, empIndex) => (empIndex + day + shiftIndex) % 3 === 0)
                        .map(emp => emp.id)
                        .slice(0, 2); // Max 2 employees per shift
                        
                    if (assignedEmployees.length > 0) {
                        dayPlan[shift] = assignedEmployees;
                    }
                });
                
                (plan as any)[dateKey] = dayPlan;
            }
            
            return plan;
        } catch (error) {
            console.error('Error generating optimal shift plan:', error);
            throw new Error(`Failed to generate shift plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}