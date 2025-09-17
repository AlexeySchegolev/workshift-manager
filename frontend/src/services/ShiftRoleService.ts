import { BaseService } from './BaseService';
import { ShiftRoles } from '@/api/ShiftRoles';
import { CreateShiftRoleDto, UpdateShiftRoleDto, ShiftRoleResponseDto } from '@/api/data-contracts';

export class ShiftRoleService extends BaseService {
  private shiftRolesApi: ShiftRoles;

  constructor() {
    super();
    this.shiftRolesApi = new ShiftRoles(this.getHttpClient());
  }

  async getByShiftId(shiftId: string, includeRelations = true): Promise<ShiftRoleResponseDto[]> {
    try {
      const response = await this.shiftRolesApi.shiftRolesControllerFindByShiftId(
        shiftId,
        { includeRelations }
      );
      return response.data;
    } catch (error) {
      console.error('Fehler beim Laden der Schichtrollen:', error);
      throw error;
    }
  }

  async create(data: CreateShiftRoleDto): Promise<ShiftRoleResponseDto> {
    try {
      const response = await this.shiftRolesApi.shiftRolesControllerCreate(data);
      return response.data;
    } catch (error) {
      console.error('Fehler beim Erstellen der Schichtrolle:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateShiftRoleDto): Promise<ShiftRoleResponseDto> {
    try {
      const response = await this.shiftRolesApi.shiftRolesControllerUpdate(id, data);
      return response.data;
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Schichtrolle:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.shiftRolesApi.shiftRolesControllerRemove(id);
    } catch (error) {
      console.error('Fehler beim Löschen der Schichtrolle:', error);
      throw error;
    }
  }

  async getAll(options?: {
    shiftId?: string;
    roleId?: string;
    includeRelations?: boolean;
  }): Promise<ShiftRoleResponseDto[]> {
    try {
      const response = await this.shiftRolesApi.shiftRolesControllerFindAll(options);
      return response.data;
    } catch (error) {
      console.error('Fehler beim Laden der Schichtrollen:', error);
      throw error;
    }
  }
}

export const shiftRoleService = new ShiftRoleService();