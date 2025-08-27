import { DayShiftPlanDto } from './day-shift-plan.dto';

/**
 * Monatlicher Schichtplan - Datums-Schlüssel (DD.MM.YYYY) als Schlüssel, Tagesschichtplan oder null als Wert
 * @example { "01.01.2024": { "F": ["employee-uuid-1"], "S": ["employee-uuid-2"] }, "02.01.2024": null }
 */
export class MonthlyShiftPlanDto {
  [dateKey: string]: DayShiftPlanDto | null;
}