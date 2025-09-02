// Service layer exports
// Centralized API services with environment-based configuration

export { BaseService } from './BaseService';
export { LocationService } from './LocationService';
export { EmployeeService } from './EmployeeService';
export { EmployeeAbsenceService } from './EmployeeAbsenceService';
export { RoleService } from './RoleService';
export { ShiftRuleService } from './ShiftRuleService';
export { ShiftService } from './ShiftService';
export { ExcelExportService } from './ExcelExportService';
export { ShiftPlanningService } from './ShiftPlanningService';
export { OrganizationsService } from './OrganizationsService';
export { UserService } from './UserService';
export { AuthService } from './AuthService';

// Service instances for direct use
// These instances use the centralized base URL configuration from env.local
import { LocationService } from './LocationService';
import { EmployeeService } from './EmployeeService';
import { EmployeeAbsenceService } from './EmployeeAbsenceService';
import { RoleService } from './RoleService';
import { ShiftRuleService } from './ShiftRuleService';
import { ShiftService } from './ShiftService';
import { ExcelExportService } from './ExcelExportService';
import { ShiftPlanningService } from './ShiftPlanningService';
import { OrganizationsService } from './OrganizationsService';
import { UserService } from './UserService';
import { AuthService } from './AuthService';

export const locationService = new LocationService();
export const employeeService = new EmployeeService();
export const employeeAbsenceService = new EmployeeAbsenceService();
export const roleService = new RoleService();
export const shiftRuleService = new ShiftRuleService();
export const shiftService = new ShiftService();
export const excelExportService = new ExcelExportService();
export const shiftPlanningService = new ShiftPlanningService();
export const organizationsService = new OrganizationsService();
export const userService = new UserService();
export const authService = new AuthService();