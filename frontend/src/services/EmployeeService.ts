import { BaseService } from './BaseService';
import { Employees } from '../api/Employees';
import { 
  CreateEmployeeDto, 
  UpdateEmployeeDto, 
  EmployeeResponseDto 
} from '../api/data-contracts';

/**
 * Service class for employee-related operations
 * Provides a clean interface between components and the API
 */
export class EmployeeService extends BaseService {
  private employeesApi: Employees;

  constructor() {
    super();
    this.employeesApi = new Employees(this.getHttpClient());
  }

  /**
   * Get all employees
   */
  async getAllEmployees(options?: {
    includeRelations?: boolean;
  }): Promise<EmployeeResponseDto[]> {
    const response = await this.employeesApi.employeesControllerFindAll(options);
    return response.data;
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string, options?: {
    includeRelations?: boolean;
  }): Promise<EmployeeResponseDto> {
    const response = await this.employeesApi.employeesControllerFindOne(id, options);
    return response.data;
  }

  /**
   * Create a new employee
   */
  async createEmployee(employeeData: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const response = await this.employeesApi.employeesControllerCreate(employeeData);
    return response.data;
  }

  /**
   * Update an existing employee
   */
  async updateEmployee(id: string, employeeData: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    const response = await this.employeesApi.employeesControllerUpdate(id, employeeData);
    return response.data;
  }

  /**
   * Delete an employee
   */
  async deleteEmployee(id: string): Promise<void> {
    await this.employeesApi.employeesControllerRemove(id);
  }

  /**
   * Get employees by location
   */
  async getEmployeesByLocation(locationId: string): Promise<EmployeeResponseDto[]> {
    const response = await this.employeesApi.employeesControllerFindByLocation(locationId);
    return response.data;
  }

  /**
   * Get employees by role
   */
  async getEmployeesByRole(role: string): Promise<EmployeeResponseDto[]> {
    const response = await this.employeesApi.employeesControllerFindByRole(role);
    return response.data;
  }

  /**
   * Get employee statistics
   */
  async getEmployeeStats(): Promise<{
    total?: number;
    byRole?: object;
    byLocation?: object;
  }> {
    const response = await this.employeesApi.employeesControllerGetStats();
    return response.data;
  }
}