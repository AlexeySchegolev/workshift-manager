import { DayShiftPlanDto } from './day-shift-plan.dto';

/**
 * Monthly shift plan - date key (DD.MM.YYYY) as key, day shift plan or null as value
 * @example { "01.01.2024": { "F": ["employee-uuid-1"], "S": ["employee-uuid-2"] }, "02.01.2024": null }
 */
export class MonthlyShiftPlanDto {
  [dateKey: string]: DayShiftPlanDto | null;
}