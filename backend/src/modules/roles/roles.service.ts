import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {Role} from "../../database/entities/role.entity";

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    this.logger.log(`Creating new role: ${dto.name}`);
    const role = this.roleRepository.create(dto as DeepPartial<Role>);
    const saved = await this.roleRepository.save(role);
    this.logger.log(`Role created successfully with ID: ${saved.id}`);
    return saved;
  }

  async findAll(includeRelations: boolean = true): Promise<Role[]> {
    this.logger.log('Retrieving all roles');
    const options = includeRelations ? {
      relations: ['organization', 'employees', 'shifts'],
      where: { deletedAt: null }
    } : {
      where: { deletedAt: null }
    };
    return this.roleRepository.find(options);
  }

  async findByOrganization(organizationId: string, includeRelations: boolean = true): Promise<Role[]> {
    this.logger.log(`Retrieving roles for organization: ${organizationId}`);
    const options = includeRelations ? {
      where: { organizationId, deletedAt: null },
      relations: ['organization', 'employees', 'shifts']
    } : {
      where: { organizationId, deletedAt: null }
    };
    return this.roleRepository.find(options);
  }

  async findActiveByOrganization(organizationId: string): Promise<Role[]> {
    this.logger.log(`Retrieving active roles for organization: ${organizationId}`);
    return this.roleRepository.find({
      where: { 
        organizationId, 
        isActive: true, 
        deletedAt: null 
      }
    });
  }

  async findOne(id: string, includeRelations: boolean = true): Promise<Role> {
    this.logger.log(`Retrieving role with ID: ${id}`);
    const options = includeRelations ? {
      where: { id, deletedAt: null },
      relations: ['organization', 'employees', 'shifts']
    } : { 
      where: { id, deletedAt: null } 
    };

    const role = await this.roleRepository.findOne(options);
    if (!role) {
      this.logger.warn(`Role with ID ${id} not found`);
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    this.logger.log(`Updating role with ID: ${id}`);
    const role = await this.findOne(id, false);
    
    // Set updatedBy if provided in DTO
    const updateData = { ...dto };
    if (dto.updatedBy) {
      updateData.updatedBy = dto.updatedBy;
    }
    
    await this.roleRepository.save({ ...role, ...updateData });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Soft deleting role with ID: ${id}`);
    const role = await this.findOne(id, false);
    
    // Soft delete by setting deletedAt timestamp
    await this.roleRepository.save({ 
      ...role, 
      deletedAt: new Date(), 
      isActive: false 
    });
    
    this.logger.log(`Role with ID ${id} soft deleted successfully`);
  }

  async hardRemove(id: string): Promise<void> {
    this.logger.log(`Hard deleting role with ID: ${id}`);
    const role = await this.findOne(id, false);
    await this.roleRepository.remove(role);
    this.logger.log(`Role with ID ${id} hard deleted successfully`);
  }

  async restore(id: string): Promise<Role> {
    this.logger.log(`Restoring role with ID: ${id}`);
    
    // Find role including soft deleted ones
    const role = await this.roleRepository.findOne({ 
      where: { id } 
    });
    
    if (!role) {
      this.logger.warn(`Role with ID ${id} not found`);
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (!role.deletedAt) {
      this.logger.warn(`Role with ID ${id} is not deleted`);
      throw new NotFoundException(`Role with ID ${id} is not deleted`);
    }

    // Restore by removing deletedAt timestamp
    await this.roleRepository.save({ 
      ...role, 
      deletedAt: null, 
      isActive: true 
    });
    
    this.logger.log(`Role with ID ${id} restored successfully`);
    return this.findOne(id);
  }

  async countByOrganization(organizationId: string): Promise<number> {
    this.logger.log(`Counting roles for organization: ${organizationId}`);
    return this.roleRepository.count({
      where: { organizationId, deletedAt: null }
    });
  }

  async findByType(organizationId: string, type: string): Promise<Role[]> {
    this.logger.log(`Finding roles by type ${type} for organization: ${organizationId}`);
    return this.roleRepository.find({
      where: { 
        organizationId, 
        type: type as any, 
        deletedAt: null 
      }
    });
  }
}