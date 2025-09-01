// Service layer exports
// Centralized API services with environment-based configuration

export { BaseService } from './BaseService';
export { LocationService } from './LocationService';
export { EmployeeService } from './EmployeeService';
export { RoleService } from './RoleService';
export { ShiftRuleService } from './ShiftRuleService';
export { ShiftService } from './ShiftService';
export { ExcelExportService } from './ExcelExportService';
export { ShiftPlanningService } from './ShiftPlanningService';

// Service instances for direct use
// These instances use the centralized base URL configuration from env.local
import { LocationService } from './LocationService';
import { EmployeeService } from './EmployeeService';
import { RoleService } from './RoleService';
import { ShiftRuleService } from './ShiftRuleService';
import { ShiftService } from './ShiftService';
import { ExcelExportService } from './ExcelExportService';
import { ShiftPlanningService } from './ShiftPlanningService';

export const locationService = new LocationService();
export const employeeService = new EmployeeService();
export const roleService = new RoleService();
export const shiftRuleService = new ShiftRuleService();
export const shiftService = new ShiftService();
export const excelExportService = new ExcelExportService();
export const shiftPlanningService = new ShiftPlanningService();