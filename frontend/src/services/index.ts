// Service layer exports
// Centralized API services with environment-based configuration

export { AuthService } from './AuthService';
export { BaseService } from './BaseService';
export { EmployeeAbsenceService } from './EmployeeAbsenceService';
export { EmployeeService } from './EmployeeService';
export { LocationService } from './LocationService';
export { OrganizationsService } from './OrganizationsService';
export { RoleService } from './RoleService';
export { ShiftPlanAbsenceManager } from './shift-plan/ShiftPlanAbsenceManager';
export { ShiftPlanCalculationService, shiftPlanCalculationService } from './shift-plan/ShiftPlanCalculationService';
export { ShiftPlanDataLoader } from './shift-plan/ShiftPlanDataLoader';
export { ShiftPlanDetailService } from './shift-plan/ShiftPlanDetailService';
export { ExcelExportService } from './shift-plan/ShiftPlanExcelExportService';
export { ShiftPlanOccupancyCalculator } from './shift-plan/ShiftPlanOccupancyCalculator';
export { ShiftPlanService } from './shift-plan/ShiftPlanService';
export { ShiftPlanTimeUtils } from './shift-plan/ShiftPlanTimeUtils';
export * from './shift-plan/ShiftPlanTypes';
export { ShiftService } from './ShiftService';
export { ShiftWeekdaysService } from './ShiftWeekdaysService';
export { UserService } from './UserService';

// Service instances for direct use
// These instances use the centralized base URL configuration from env.local
import { AuthService } from './AuthService';
import { EmployeeAbsenceService } from './EmployeeAbsenceService';
import { EmployeeService } from './EmployeeService';
import { LocationService } from './LocationService';
import { OrganizationsService } from './OrganizationsService';
import { RoleService } from './RoleService';
import { ShiftPlanDetailService } from './shift-plan/ShiftPlanDetailService';
import { ExcelExportService } from './shift-plan/ShiftPlanExcelExportService';
import { ShiftPlanService } from './shift-plan/ShiftPlanService';
import { ShiftService } from './ShiftService';
import { ShiftWeekdaysService } from './ShiftWeekdaysService';
import { UserService } from './UserService';

export const locationService = new LocationService();
export const employeeService = new EmployeeService();
export const employeeAbsenceService = new EmployeeAbsenceService();
export const roleService = new RoleService();
export const shiftService = new ShiftService();
export const shiftPlanService = new ShiftPlanService();
export const shiftPlanDetailService = new ShiftPlanDetailService();
export const excelExportService = new ExcelExportService();
export const organizationsService = new OrganizationsService();
export const userService = new UserService();
export const authService = new AuthService();
export const shiftWeekdaysService = new ShiftWeekdaysService();