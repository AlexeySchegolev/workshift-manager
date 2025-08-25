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
import { ShiftRulesConfiguration } from '../models/shiftRuleInterfaces';

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
  }): Promise<Location[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.city) queryParams.append('city', params.city);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const endpoint = `/locations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<Location[]>(endpoint);
    
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

  // ===== ROLLEN API =====

  /**
   * Alle Rollen abrufen
   */
  static async getRoles(params?: {
    isActive?: boolean;
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const endpoint = `/roles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<any[]>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Rollen');
    }
    
    return response.data;
  }

  /**
   * Einzelne Rolle abrufen
   */
  static async getRole(id: string): Promise<any> {
    const response = await this.get<any>(`/roles/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Rolle nicht gefunden');
    }
    
    return response.data;
  }

  /**
   * Neue Rolle erstellen
   */
  static async createRole(roleData: any): Promise<any> {
    const response = await this.post<any>('/roles', roleData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Erstellen der Rolle');
    }
    
    return response.data;
  }

  /**
   * Rolle aktualisieren
   */
  static async updateRole(id: string, roleData: any): Promise<any> {
    const response = await this.put<any>(`/roles/${id}`, roleData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Aktualisieren der Rolle');
    }
    
    return response.data;
  }

  /**
   * Rolle deaktivieren
   */
  static async deleteRole(id: string): Promise<void> {
    const response = await this.delete(`/roles/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Fehler beim Löschen der Rolle');
    }
  }

  /**
   * Alle verfügbaren Berechtigungen abrufen
   */
  static async getPermissions(): Promise<any[]> {
    const response = await this.get<any[]>('/roles/permissions');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Berechtigungen');
    }
    
    return response.data;
  }

  /**
   * Alle verfügbaren Anforderungen abrufen
   */
  static async getRequirements(): Promise<any[]> {
    const response = await this.get<any[]>('/roles/requirements');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Anforderungen');
    }
    
    return response.data;
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

  // ===== SCHICHTREGELN-KONFIGURATION API =====

  /**
   * Alle Schichtregeln-Konfigurationen abrufen
   */
  static async getShiftRulesConfigurations(params?: {
    isActive?: boolean;
  }): Promise<ShiftRulesConfiguration[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const endpoint = `/shift-rules/configurations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.get<ShiftRulesConfiguration[]>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Laden der Schichtregeln-Konfigurationen');
    }
    
    return response.data;
  }

  /**
   * Einzelne Schichtregeln-Konfiguration abrufen
   */
  static async getShiftRulesConfiguration(id: string): Promise<ShiftRulesConfiguration> {
    const response = await this.get<ShiftRulesConfiguration>(`/shift-rules/configurations/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Schichtregeln-Konfiguration nicht gefunden');
    }
    
    return response.data;
  }

  /**
   * Standard-Schichtregeln-Konfiguration abrufen
   */
  static async getDefaultShiftRulesConfiguration(): Promise<ShiftRulesConfiguration> {
    const response = await this.get<ShiftRulesConfiguration>('/shift-configurations');
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Standard-Schichtregeln-Konfiguration nicht gefunden');
    }
    
    return response.data;
  }

  /**
   * Neue Schichtregeln-Konfiguration erstellen
   */
  static async createShiftRulesConfiguration(configData: Omit<ShiftRulesConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShiftRulesConfiguration> {
    const response = await this.post<ShiftRulesConfiguration>('/shift-rules/configurations', configData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Fehler beim Erstellen der Schichtregeln-Konfiguration');
    }
    
    return response.data;
  }

  /**
   * Schichtregeln-Konfiguration aktualisieren
   */
  static async updateShiftRulesConfiguration(id: string, configData: Partial<ShiftRulesConfiguration>): Promise<void> {
    const response = await this.put(`/shift-rules/configurations/${id}`, configData);
    
    if (!response.success) {
      throw new Error(response.error || 'Fehler beim Aktualisieren der Schichtregeln-Konfiguration');
    }
  }

  /**
   * Schichtregeln-Konfiguration deaktivieren
   */
  static async deleteShiftRulesConfiguration(id: string): Promise<void> {
    const response = await this.delete(`/shift-rules/configurations/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Fehler beim Löschen der Schichtregeln-Konfiguration');
    }
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
    
    // Rollen
    getRoles: ApiService.getRoles,
    getRole: ApiService.getRole,
    createRole: ApiService.createRole,
    updateRole: ApiService.updateRole,
    deleteRole: ApiService.deleteRole,
    getPermissions: ApiService.getPermissions,
    getRequirements: ApiService.getRequirements,
    
    // Schichtregeln
    getShiftRules: ApiService.getShiftRules,
    updateShiftRules: ApiService.updateShiftRules,
    
    // Schichtregeln-Konfigurationen
    getShiftRulesConfigurations: ApiService.getShiftRulesConfigurations,
    getShiftRulesConfiguration: ApiService.getShiftRulesConfiguration,
    getDefaultShiftRulesConfiguration: ApiService.getDefaultShiftRulesConfiguration,
    createShiftRulesConfiguration: ApiService.createShiftRulesConfiguration,
    updateShiftRulesConfiguration: ApiService.updateShiftRulesConfiguration,
    deleteShiftRulesConfiguration: ApiService.deleteShiftRulesConfiguration,
    
    // System
    healthCheck: ApiService.healthCheck,
    getApiInfo: ApiService.getApiInfo,
  };
};

export default ApiService;