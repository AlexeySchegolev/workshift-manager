import { BaseService } from './BaseService';
import { Roles } from '../api/Roles';
import { 
  CreateRoleDto, 
  UpdateRoleDto, 
  RoleResponseDto 
} from '../api/data-contracts';

/**
 * Service class for role-related operations
 * Provides a clean interface between components and the API
 */
export class RoleService extends BaseService {
  private rolesApi: Roles;

  constructor() {
    super();
    this.rolesApi = new Roles(this.getHttpClient());
  }

  /**
   * Get all roles
   */
  async getAllRoles(options?: {
    includeRelations?: boolean;
  }): Promise<RoleResponseDto[]> {
    const response = await this.rolesApi.rolesControllerFindAll(options);
    return response.data;
  }
    /**
     * Create a new role
   */
  async createRole(roleData: CreateRoleDto): Promise<RoleResponseDto> {
    const response = await this.rolesApi.rolesControllerCreate(roleData);
    return response.data;
  }

  /**
   * Update an existing role
   */
  async updateRole(id: string, roleData: UpdateRoleDto): Promise<RoleResponseDto> {
    const response = await this.rolesApi.rolesControllerUpdate(id, roleData);
    return response.data;
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string): Promise<void> {
    await this.rolesApi.rolesControllerRemove(id);
  }
    /**
     * Get roles by organization
   */
  async getRolesByOrganization(
    organizationId: string, 
    options?: {
      includeRelations?: boolean;
      activeOnly?: boolean;
    }
  ): Promise<RoleResponseDto[]> {
    const response = await this.rolesApi.rolesControllerFindByOrganization(
      organizationId, 
      options
    );
    return response.data;
  }


}