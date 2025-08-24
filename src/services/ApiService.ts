import { 
  Employee, 
  MonthlyShiftPlan, 
  GenerateShiftPlanRequest,
  GenerateShiftPlanResponse,
  ApiResponse,
  PaginatedResponse,
  Location,
  ShiftRules
} from '../models/interfaces';

/**
 * API-Service für die Kommunikation mit dem Backend
 */
export class ApiService {
  private static readonly BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  
  /**
   * Allgemeine HTTP-Request-Methode
   */
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * GET-Request
   */
  private static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST-Request
   */
  private static async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT-Request
   */
  private static async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE-Request
   */
  private static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ===== MITARBEITER API =====

  /**
   * Alle Mitarbeiter abrufen
   */
  static async getEmployees(params?: {
    page?: number;
    limit?: number;
    role?: string;
    clinic?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Employee>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.clinic) queryParams.append('clinic', params.clinic);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const endpoint = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<PaginatedResponse<Employee>>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Mitarbeiter');
    }
    
    return response.data;
  }

  /**
   * Einzelnen Mitarbeiter abrufen
   */
  static async getEmployee(id: string): Promise<Employee> {
    const response = await this.get<Employee>(`/employees/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Mitarbeiter nicht gefunden');
    }
    
    return response.data;
  }

  /**
   * Neuen Mitarbeiter erstellen
   */
  static async createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    const response = await this.post<Employee>('/employees', employeeData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Erstellen des Mitarbeiters');
    }
    
    return response.data;
  }

  /**
   * Mitarbeiter aktualisieren
   */
  static async updateEmployee(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    const response = await this.put<Employee>(`/employees/${id}`, employeeData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Aktualisieren des Mitarbeiters');
    }
    
    return response.data;
  }

  /**
   * Mitarbeiter deaktivieren
   */
  static async deleteEmployee(id: string): Promise<void> {
    const response = await this.delete(`/employees/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Fehler beim Löschen des Mitarbeiters');
    }
  }

  /**
   * Mitarbeiter-Statistiken abrufen
   */
  static async getEmployeeStats(): Promise<any> {
    const response = await this.get<any>('/employees/stats');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Statistiken');
    }
    
    return response.data;
  }

  // ===== SCHICHTPLÄNE API =====

  /**
   * Schichtplan generieren
   */
  static async generateShiftPlan(request: GenerateShiftPlanRequest): Promise<GenerateShiftPlanResponse> {
    const response = await this.post<GenerateShiftPlanResponse>('/shift-plans/generate', request);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler bei der Schichtplan-Generierung');
    }
    
    return response.data;
  }

  /**
   * Schichtplan für bestimmten Monat abrufen
   */
  static async getShiftPlan(year: number, month: number): Promise<any> {
    const response = await this.get<any>(`/shift-plans/${year}/${month}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Schichtplan nicht gefunden');
    }
    
    return response.data;
  }

  /**
   * Alle Schichtpläne abrufen
   */
  static async getShiftPlans(params?: {
    page?: number;
    limit?: number;
    year?: number;
    month?: number;
    isFinalized?: boolean;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.isFinalized !== undefined) queryParams.append('isFinalized', params.isFinalized.toString());

    const endpoint = `/shift-plans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<PaginatedResponse<any>>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Schichtpläne');
    }
    
    return response.data;
  }

  /**
   * Schichtplan finalisieren
   */
  static async finalizeShiftPlan(id: string): Promise<void> {
    const response = await this.put(`/shift-plans/${id}/finalize`, {});
    
    if (!response.success) {
      throw new Error(response.error || 'Fehler beim Finalisieren des Schichtplans');
    }
  }

  /**
   * Schichtplan löschen
   */
  static async deleteShiftPlan(id: string): Promise<void> {
    const response = await this.delete(`/shift-plans/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Fehler beim Löschen des Schichtplans');
    }
  }

  /**
   * Schichtplan-Statistiken abrufen
   */
  static async getShiftPlanStats(): Promise<any> {
    const response = await this.get<any>('/shift-plans/stats');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Statistiken');
    }
    
    return response.data;
  }

  // ===== STANDORTE API =====

  /**
   * Alle Standorte abrufen
   */
  static async getLocations(params?: {
    page?: number;
    limit?: number;
    city?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Location>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.city) queryParams.append('city', params.city);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const endpoint = `/locations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<PaginatedResponse<Location>>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Standorte');
    }
    
    return response.data;
  }

  /**
   * Einzelnen Standort abrufen
   */
  static async getLocation(id: string): Promise<Location> {
    const response = await this.get<Location>(`/locations/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Standort nicht gefunden');
    }
    
    return response.data;
  }

  /**
   * Neuen Standort erstellen
   */
  static async createLocation(locationData: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
    const response = await this.post<Location>('/locations', locationData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Erstellen des Standorts');
    }
    
    return response.data;
  }

  /**
   * Standort aktualisieren
   */
  static async updateLocation(id: string, locationData: Partial<Location>): Promise<Location> {
    const response = await this.put<Location>(`/locations/${id}`, locationData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Aktualisieren des Standorts');
    }
    
    return response.data;
  }

  /**
   * Standort deaktivieren
   */
  static async deleteLocation(id: string): Promise<void> {
    const response = await this.delete(`/locations/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Fehler beim Löschen des Standorts');
    }
  }

  // ===== SCHICHTREGELN API =====

  /**
   * Aktuelle Schichtregeln abrufen
   */
  static async getShiftRules(): Promise<ShiftRules> {
    const response = await this.get<ShiftRules>('/shift-rules');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Schichtregeln');
    }
    
    return response.data;
  }

  /**
   * Schichtregeln aktualisieren
   */
  static async updateShiftRules(rulesData: Partial<ShiftRules>): Promise<ShiftRules> {
    const response = await this.put<ShiftRules>('/shift-rules', rulesData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Aktualisieren der Schichtregeln');
    }
    
    return response.data;
  }

  // ===== SYSTEM API =====

  /**
   * Health Check
   */
  static async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('Server nicht erreichbar');
    }
  }

  /**
   * API-Info abrufen
   */
  static async getApiInfo(): Promise<any> {
    const response = await this.get<any>('');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der API-Informationen');
    }
    
    return response.data;
  }
}

/**
 * Hook für React-Komponenten zur einfacheren API-Nutzung
 */
export const useApi = () => {
  return {
    // Mitarbeiter
    getEmployees: ApiService.getEmployees,
    getEmployee: ApiService.getEmployee,
    createEmployee: ApiService.createEmployee,
    updateEmployee: ApiService.updateEmployee,
    deleteEmployee: ApiService.deleteEmployee,
    getEmployeeStats: ApiService.getEmployeeStats,
    
    // Schichtpläne
    generateShiftPlan: ApiService.generateShiftPlan,
    getShiftPlan: ApiService.getShiftPlan,
    getShiftPlans: ApiService.getShiftPlans,
    finalizeShiftPlan: ApiService.finalizeShiftPlan,
    deleteShiftPlan: ApiService.deleteShiftPlan,
    getShiftPlanStats: ApiService.getShiftPlanStats,
    
    // Standorte
    getLocations: ApiService.getLocations,
    getLocation: ApiService.getLocation,
    createLocation: ApiService.createLocation,
    updateLocation: ApiService.updateLocation,
    deleteLocation: ApiService.deleteLocation,
    
    // Schichtregeln
    getShiftRules: ApiService.getShiftRules,
    updateShiftRules: ApiService.updateShiftRules,
    
    // System
    healthCheck: ApiService.healthCheck,
    getApiInfo: ApiService.getApiInfo,
  };
};

export default ApiService;