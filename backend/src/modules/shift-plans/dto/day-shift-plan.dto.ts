import { ApiProperty } from '@nestjs/swagger';

/**
 * Schichtplan für einen Tag - Schichtname als Schlüssel, Array von Mitarbeiter-IDs als Wert
 * @example { "F": ["employee-uuid-1", "employee-uuid-2"], "S": ["employee-uuid-3"], "N": ["employee-uuid-4"] }
 */
export class DayShiftPlanDto {
  [shiftName: string]: string[];
}