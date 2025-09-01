import { BaseService } from './BaseService';
import { Organizations } from '../api/Organizations';
import { 
  CreateOrganizationDto, 
  UpdateOrganizationDto, 
  OrganizationResponseDto 
} from '../api/data-contracts';

/**
 * Service class for organization-related operations
 * Provides a clean interface between components and the API
 */
export class OrganizationsService extends BaseService {
  private organizationsApi: Organizations;

  constructor() {
    super();
    this.organizationsApi = new Organizations(this.getHttpClient());
  }

  /**
   * Get all organizations
   */
  async getAllOrganizations(options?: {
    includeRelations?: boolean;
  }): Promise<OrganizationResponseDto[]> {
    const response = await this.organizationsApi.organizationsControllerFindAll(options);
    return response.data;
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(id: string, options?: {
    includeRelations?: boolean;
  }): Promise<OrganizationResponseDto> {
    const response = await this.organizationsApi.organizationsControllerFindOne(id, options);
    return response.data;
  }

  /**
   * Create a new organization
   */
  async createOrganization(organizationData: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    const response = await this.organizationsApi.organizationsControllerCreate(organizationData);
    return response.data;
  }

  /**
   * Update an existing organization
   */
  async updateOrganization(id: string, organizationData: UpdateOrganizationDto): Promise<OrganizationResponseDto> {
    const response = await this.organizationsApi.organizationsControllerUpdate(id, organizationData);
    return response.data;
  }

  /**
   * Delete an organization
   */
  async deleteOrganization(id: string): Promise<void> {
    await this.organizationsApi.organizationsControllerRemove(id);
  }
}