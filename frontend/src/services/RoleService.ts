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
   * Get role by ID
   */
  async getRoleById(id: string, options?: {
    includeRelations?: boolean;
  }): Promise<RoleResponseDto> {
    const response = await this.rolesApi.rolesControllerFindOne(id, options);
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
   * Hard delete a role (permanent)
   */
  async hardDeleteRole(id: string): Promise<void> {
    await this.rolesApi.rolesControllerHardRemove(id);
  }

  /**
   * Restore a deleted role
   */
  async restoreRole(id: string): Promise<RoleResponseDto> {
    const response = await this.rolesApi.rolesControllerRestore(id);
    return response.data;
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

  /**
   * Get roles by type and organization
   */
  async getRolesByType(organizationId: string, type: string): Promise<RoleResponseDto[]> {
    const response = await this.rolesApi.rolesControllerFindByType(organizationId, type);
    return response.data;
  }

  /**
   * Get role count by organization
   */
  async getRoleCountByOrganization(organizationId: string): Promise<{ count: number }> {
    const response = await this.rolesApi.rolesControllerCountByOrganization(organizationId);
    // TODO: Ensure API response always includes count property
    return { count: response.data?.count ?? 0 };
  }

  /**
   * Extract unique permissions from existing roles
   */
  extractAvailablePermissions(roles: RoleResponseDto[]): string[] {
    const allPermissions = new Set<string>();
    roles.forEach(role => {
      role.permissions.forEach(permission => allPermissions.add(permission));
    });
    return Array.from(allPermissions);
  }

  /**
   * Extract unique certifications from existing roles
   */
  extractAvailableCertifications(roles: RoleResponseDto[]): string[] {
    const allCertifications = new Set<string>();
    roles.forEach(role => {
      role.requiredCertifications.forEach(cert => allCertifications.add(cert));
    });
    return Array.from(allCertifications);
  }

  /**
   * Extract unique skills from existing roles
   */
  extractAvailableSkills(roles: RoleResponseDto[]): string[] {
    const allSkills = new Set<string>();
    roles.forEach(role => {
      role.requiredSkills.forEach(skill => allSkills.add(skill));
    });
    return Array.from(allSkills);
  }
}