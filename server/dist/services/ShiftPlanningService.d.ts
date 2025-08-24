import { GenerateShiftPlanRequest, GenerateShiftPlanResponse } from '@/types/interfaces';
export declare class ShiftPlanningService {
    static generateShiftPlan(request: GenerateShiftPlanRequest): Promise<GenerateShiftPlanResponse>;
    private static loadEmployees;
    private static loadShiftRules;
    private static generateBasicShiftPlan;
    private static planDayShifts;
    private static assignEmployeesToShift;
    private static validateShiftPlan;
    private static calculateStatistics;
    private static saveShiftPlan;
    private static saveConstraintViolations;
    private static formatDateKey;
    private static countSaturdaysUpToDate;
    private static countSundays;
}
//# sourceMappingURL=ShiftPlanningService.d.ts.map