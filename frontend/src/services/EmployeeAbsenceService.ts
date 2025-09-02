import { BaseService } from './BaseService';
import { EmployeeAbsences } from '../api/EmployeeAbsences';
import { 
  CreateEmployeeAbsenceDto, 
  UpdateEmployeeAbsenceDto, 
  EmployeeAbsenceResponseDto 
} from '../api/data-contracts';

/**
 * Service class for employee absence-related operations
 * Provides a clean interface between components and the API
 */
export class EmployeeAbsenceService extends BaseService {
  private employeeAbsencesApi: EmployeeAbsences;

  constructor() {
    super();
    this.employeeAbsencesApi = new EmployeeAbsences(this.getHttpClient());
  }

  /**
   * Get all employee absences with optional filters
   */
  async getAllAbsences(options?: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
    month?: string;
    year?: string;
  }): Promise<EmployeeAbsenceResponseDto[]> {
    const response = await this.employeeAbsencesApi.employeeAbsencesControllerFindAll(options);
    return response.data;
  }

  /**
   * Get absences for a specific month and year
   */
  async getAbsencesByMonth(year: string, month: string): Promise<EmployeeAbsenceResponseDto[]> {
    const response = await this.employeeAbsencesApi.employeeAbsencesControllerFindByMonth(year, month);
    return response.data;
  }

  /**
   * Get all absences for a specific employee
   */
  async getAbsencesByEmployee(employeeId: string): Promise<EmployeeAbsenceResponseDto[]> {
    const response = await this.employeeAbsencesApi.employeeAbsencesControllerFindByEmployee(employeeId);
    return response.data;
  }

  /**
   * Get a specific absence by ID
   */
  async getAbsenceById(id: string): Promise<EmployeeAbsenceResponseDto> {
    const response = await this.employeeAbsencesApi.employeeAbsencesControllerFindOne(id);
    return response.data;
  }

  /**
   * Create a new employee absence
   */
  async createAbsence(absenceData: CreateEmployeeAbsenceDto): Promise<EmployeeAbsenceResponseDto> {
    const response = await this.employeeAbsencesApi.employeeAbsencesControllerCreate(absenceData);
    return response.data;
  }

  /**
   * Update an existing employee absence
   */
  async updateAbsence(id: string, absenceData: UpdateEmployeeAbsenceDto): Promise<EmployeeAbsenceResponseDto> {
    const response = await this.employeeAbsencesApi.employeeAbsencesControllerUpdate(id, absenceData);
    return response.data;
  }

  /**
   * Delete an employee absence
   */
  async deleteAbsence(id: string): Promise<void> {
    await this.employeeAbsencesApi.employeeAbsencesControllerRemove(id);
  }
}