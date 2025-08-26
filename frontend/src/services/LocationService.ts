import { BaseService } from './BaseService';
import { Locations } from '../api/Locations';
import { 
  CreateLocationDto, 
  UpdateLocationDto, 
  LocationResponseDto 
} from '../api/data-contracts';

/**
 * Service class for location-related operations
 * Provides a clean interface between components and the API
 */
export class LocationService extends BaseService {
  private locationsApi: Locations;

  constructor() {
    super();
    this.locationsApi = new Locations(this.getHttpClient());
  }

  /**
   * Get all locations
   */
  async getAllLocations(options?: {
    activeOnly?: boolean;
    includeEmployees?: boolean;
  }): Promise<LocationResponseDto[]> {
    const response = await this.locationsApi.locationsControllerFindAll(options);
    return response.data;
  }

  /**
   * Get location by ID
   */
  async getLocationById(id: string, options?: {
    includeEmployees?: boolean;
  }): Promise<LocationResponseDto> {
    const response = await this.locationsApi.locationsControllerFindOne(id, options);
    return response.data;
  }

  /**
   * Create a new location
   */
  async createLocation(locationData: CreateLocationDto): Promise<LocationResponseDto> {
    const response = await this.locationsApi.locationsControllerCreate(locationData);
    return response.data;
  }

  /**
   * Update an existing location
   */
  async updateLocation(id: string, locationData: UpdateLocationDto): Promise<LocationResponseDto> {
    const response = await this.locationsApi.locationsControllerUpdate(id, locationData);
    return response.data;
  }

  /**
   * Delete a location
   */
  async deleteLocation(id: string): Promise<void> {
    await this.locationsApi.locationsControllerRemove(id);
  }

  /**
   * Activate a location
   */
  async activateLocation(id: string): Promise<LocationResponseDto> {
    const response = await this.locationsApi.locationsControllerActivate(id);
    return response.data;
  }

  /**
   * Deactivate a location
   */
  async deactivateLocation(id: string): Promise<LocationResponseDto> {
    const response = await this.locationsApi.locationsControllerDeactivate(id);
    return response.data;
  }

  /**
   * Get locations by city
   */
  async getLocationsByCity(city: string): Promise<LocationResponseDto[]> {
    const response = await this.locationsApi.locationsControllerFindByCity(city);
    return response.data;
  }

  /**
   * Get location statistics
   */
  async getLocationStats(): Promise<{
    active?: number;
    inactive?: number;
    total?: number;
    byCity?: object;
  }> {
    const response = await this.locationsApi.locationsControllerGetStats();
    return response.data;
  }

  /**
   * Get detailed location statistics
   */
  async getLocationDetailedStats(id: string): Promise<{
    employeeCount?: number;
    equipmentCount?: number;
    serviceCount?: number;
    utilizationRate?: number;
  }> {
    const response = await this.locationsApi.locationsControllerGetLocationWithStats(id);
    return response.data;
  }
}