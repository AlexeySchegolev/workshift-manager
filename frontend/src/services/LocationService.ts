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
}