// Service layer exports
// Centralized API services with environment-based configuration

export { BaseService } from './BaseService';
export { LocationService } from './LocationService';
export { EmployeeService } from './EmployeeService';
export { RoleService } from './RoleService';
export { ShiftPlanService } from './ShiftPlanService';
export { ShiftRuleService } from './ShiftRuleService';

// Service instances for direct use
// These instances use the centralized base URL configuration from env.local
import { LocationService } from './LocationService';
import { EmployeeService } from './EmployeeService';
import { RoleService } from './RoleService';
import { ShiftPlanService } from './ShiftPlanService';
import { ShiftRuleService } from './ShiftRuleService';

export const locationService = new LocationService();
export const employeeService = new EmployeeService();
export const roleService = new RoleService();
export const shiftPlanService = new ShiftPlanService();
export const shiftRuleService = new ShiftRuleService();