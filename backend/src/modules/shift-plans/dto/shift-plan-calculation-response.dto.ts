import { ApiProperty } from '@nestjs/swagger';

export class ReducedEmployeeDto {
  @ApiProperty({ description: 'Employee ID' })
  id: string;

  @ApiProperty({ description: 'Employee name' })
  name: string;

  @ApiProperty({ description: 'Employee role' })
  role: string;

  @ApiProperty({ description: 'Role ID', required: false })
  roleId?: string;

  @ApiProperty({ description: 'Location name' })
  location: string;

  @ApiProperty({ description: 'Monthly work hours', required: false })
  monthlyWorkHours?: number;

  @ApiProperty({ description: 'Calculated monthly hours' })
  calculatedMonthlyHours: number;
}

export class EmployeeDayStatusDto {
  @ApiProperty({ type: ReducedEmployeeDto })
  employee: ReducedEmployeeDto;

  @ApiProperty({ description: 'Assigned shift short name' })
  assignedShift: string;

  @ApiProperty({ description: 'Shift ID' })
  shiftId: string;

  @ApiProperty({ description: 'Full shift name' })
  shiftName: string;

  @ApiProperty({ description: 'Absence type' })
  absenceType: string;

  @ApiProperty({ description: 'Absence reason' })
  absenceReason: string;

  @ApiProperty({ description: 'Is empty (no shift, no absence)' })
  isEmpty: boolean;
}

export class RoleOccupancyDto {
  @ApiProperty({ description: 'Role ID', required: false })
  roleId?: string;

  @ApiProperty({ description: 'Role name' })
  roleName: string;

  @ApiProperty({ description: 'Required count' })
  required: number;

  @ApiProperty({ description: 'Assigned count' })
  assigned: number;

  @ApiProperty({ description: 'Assigned employee names', type: [String] })
  assignedEmployees: string[];

  @ApiProperty({ description: 'Minimum required', required: false })
  minRequired?: number;

  @ApiProperty({ description: 'Maximum allowed', required: false })
  maxAllowed?: number;

  @ApiProperty({ description: 'Priority (1-5)', required: false })
  priority?: number;
}

export class ShiftOccupancyDto {
  @ApiProperty({ description: 'Shift ID' })
  shiftId: string;

  @ApiProperty({ description: 'Shift name' })
  shiftName: string;

  @ApiProperty({ description: 'Short name' })
  shortName: string;

  @ApiProperty({ description: 'Start time' })
  startTime: string;

  @ApiProperty({ description: 'End time' })
  endTime: string;

  @ApiProperty({ description: 'Required count' })
  requiredCount: number;

  @ApiProperty({ description: 'Assigned count' })
  assignedCount: number;

  @ApiProperty({ description: 'Assigned employee names', type: [String] })
  assignedEmployees: string[];

  @ApiProperty({ description: 'Role occupancy', type: [RoleOccupancyDto] })
  roleOccupancy: RoleOccupancyDto[];

  @ApiProperty({ description: 'Is under staffed' })
  isUnderStaffed: boolean;

  @ApiProperty({ description: 'Is correctly staffed' })
  isCorrectlyStaffed: boolean;
}

export class ShiftPlanDayDto {
  @ApiProperty({ description: 'Date', type: Date })
  date: Date;

  @ApiProperty({ description: 'Day key (DD.MM.YYYY)' })
  dayKey: string;

  @ApiProperty({ description: 'Day number' })
  dayNumber: number;

  @ApiProperty({ description: 'Is weekend' })
  isWeekend: boolean;

  @ApiProperty({ description: 'Is today' })
  isToday: boolean;

  @ApiProperty({ description: 'Employee day status', type: [EmployeeDayStatusDto] })
  employees: EmployeeDayStatusDto[];

  @ApiProperty({ description: 'Shift occupancy', type: [ShiftOccupancyDto] })
  shiftOccupancy: ShiftOccupancyDto[];
}

export class OptimizationModelDto {
  @ApiProperty({ description: 'Optimizer name' })
  optimizer: string;

  @ApiProperty({ description: 'Status' })
  status: string;

  @ApiProperty({ description: 'Message' })
  message: string;

  @ApiProperty({ description: 'Assignments count' })
  assignmentsCount: number;

  @ApiProperty({ description: 'Iterations' })
  iterations: number;
}

export class ShiftPlanCalculationResponseDto {
  @ApiProperty({ description: 'Calculated shift plan days', type: [ShiftPlanDayDto] })
  days: ShiftPlanDayDto[];

  @ApiProperty({ description: 'Optimization model info', type: OptimizationModelDto })
  model: OptimizationModelDto;

  @ApiProperty({ description: 'Year' })
  year: number;

  @ApiProperty({ description: 'Month' })
  month: number;

  @ApiProperty({ description: 'Location ID' })
  locationId: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId: string;
}