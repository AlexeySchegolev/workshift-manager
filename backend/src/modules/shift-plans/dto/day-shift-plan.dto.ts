/**
 * Shift plan for one day - shift name as key, array of employee IDs as value
 * @example { "F": ["employee-uuid-1", "employee-uuid-2"], "S": ["employee-uuid-3"], "N": ["employee-uuid-4"] }
 */
export class DayShiftPlanDto {
  [shiftName: string]: string[];
}