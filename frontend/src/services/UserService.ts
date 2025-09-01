import { BaseService } from './BaseService';
import { Users } from '../api/Users';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  UserResponseDto 
} from '../api/data-contracts';

/**
 * Service class for user-related operations
 * Provides a clean interface between components and the API
 */
export class UserService extends BaseService {
  private usersApi: Users;

  constructor() {
    super();
    this.usersApi = new Users(this.getHttpClient());
  }

  /**
   * Get all users
   */
  async getAllUsers(options?: {
    includeRelations?: boolean;
  }): Promise<UserResponseDto[]> {
    const response = await this.usersApi.usersControllerFindAll(options);
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string, options?: {
    includeRelations?: boolean;
  }): Promise<UserResponseDto> {
    const response = await this.usersApi.usersControllerFindOne(id, options);
    return response.data;
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const response = await this.usersApi.usersControllerCreate(userData);
    return response.data;
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponseDto> {
    const response = await this.usersApi.usersControllerUpdate(id, userData);
    return response.data;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    await this.usersApi.usersControllerRemove(id);
  }
}