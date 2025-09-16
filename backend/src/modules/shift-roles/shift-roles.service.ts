import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftRole } from '@/database/entities/shift-role.entity';
import { CreateShiftRoleDto } from './dto/create-shift-role.dto';
import { UpdateShiftRoleDto } from './dto/update-shift-role.dto';
import { ShiftRoleResponseDto } from './dto/shift-role-response.dto';
import { toISOString } from '@/common/utils/date.utils';

@Injectable()
export class ShiftRolesService {
  constructor(
    @InjectRepository(ShiftRole)
    private readonly shiftRoleRepository: Repository<ShiftRole>,
  ) {}

  /**
   * Create a new shift role
   */
  async create(createShiftRoleDto: CreateShiftRoleDto): Promise<ShiftRoleResponseDto> {
    // Check if shift role already exists
    const existingShiftRole = await this.shiftRoleRepository.findOne({
      where: {
        shiftId: createShiftRoleDto.shiftId,
        roleId: createShiftRoleDto.roleId
      }
    });

    if (existingShiftRole) {
      throw new BadRequestException('Shift role already exists for this shift and role combination');
    }

    const shiftRole = this.shiftRoleRepository.create(createShiftRoleDto);
    const savedShiftRole = await this.shiftRoleRepository.save(shiftRole);
    
    // Load with relations
    const shiftRoleWithRelations = await this.shiftRoleRepository.findOne({
      where: { id: savedShiftRole.id },
      relations: ['shift', 'role'],
    });
    
    return this.mapToResponseDto(shiftRoleWithRelations);
  }

  /**
   * Get all shift roles with optional filtering
   */
  async findAll(options?: {
    shiftId?: string;
    roleId?: string;
    includeRelations?: boolean;
  }): Promise<ShiftRoleResponseDto[]> {
    const queryBuilder = this.shiftRoleRepository.createQueryBuilder('shiftRole');

    if (options?.shiftId) {
      queryBuilder.andWhere('shiftRole.shiftId = :shiftId', {
        shiftId: options.shiftId
      });
    }

    if (options?.roleId) {
      queryBuilder.andWhere('shiftRole.roleId = :roleId', {
        roleId: options.roleId
      });
    }

    if (options?.includeRelations) {
      queryBuilder.leftJoinAndSelect('shiftRole.shift', 'shift');
      queryBuilder.leftJoinAndSelect('shiftRole.role', 'role');
    }

    queryBuilder.orderBy('shiftRole.createdAt', 'DESC');

    const shiftRoles = await queryBuilder.getMany();
    return shiftRoles.map(shiftRole => this.mapToResponseDto(shiftRole));
  }

  /**
   * Get shift role by ID
   */
  async findOne(id: string, includeRelations = false): Promise<ShiftRoleResponseDto> {
    const queryBuilder = this.shiftRoleRepository.createQueryBuilder('shiftRole')
      .where('shiftRole.id = :id', { id });

    if (includeRelations) {
      queryBuilder.leftJoinAndSelect('shiftRole.shift', 'shift');
      queryBuilder.leftJoinAndSelect('shiftRole.role', 'role');
    }

    const shiftRole = await queryBuilder.getOne();

    if (!shiftRole) {
      throw new NotFoundException(`Shift role with ID ${id} not found`);
    }

    return this.mapToResponseDto(shiftRole);
  }

  /**
   * Update an existing shift role
   */
  async update(id: string, updateShiftRoleDto: UpdateShiftRoleDto): Promise<ShiftRoleResponseDto> {
    const shiftRole = await this.shiftRoleRepository.findOne({
      where: { id }
    });

    if (!shiftRole) {
      throw new NotFoundException(`Shift role with ID ${id} not found`);
    }

    // Check for duplicate if shiftId or roleId is being updated
    if (updateShiftRoleDto.shiftId || updateShiftRoleDto.roleId) {
      const existingShiftRole = await this.shiftRoleRepository.findOne({
        where: {
          shiftId: updateShiftRoleDto.shiftId || shiftRole.shiftId,
          roleId: updateShiftRoleDto.roleId || shiftRole.roleId
        }
      });

      if (existingShiftRole && existingShiftRole.id !== id) {
        throw new BadRequestException('Shift role already exists for this shift and role combination');
      }
    }

    Object.assign(shiftRole, {
      ...updateShiftRoleDto,
      updatedAt: new Date(),
    });

    const savedShiftRole = await this.shiftRoleRepository.save(shiftRole);
    
    // Load with relations
    const shiftRoleWithRelations = await this.shiftRoleRepository.findOne({
      where: { id: savedShiftRole.id },
      relations: ['shift', 'role'],
    });
    
    return this.mapToResponseDto(shiftRoleWithRelations);
  }

  /**
   * Soft delete a shift role
   */
  async remove(id: string): Promise<void> {
    const result = await this.shiftRoleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Shift role with ID ${id} not found`);
    }
  }

  /**
   * Get shift roles by shift ID
   */
  async findByShiftId(shiftId: string, includeRelations = false): Promise<ShiftRoleResponseDto[]> {
    const queryBuilder = this.shiftRoleRepository.createQueryBuilder('shiftRole')
      .where('shiftRole.shiftId = :shiftId', { shiftId });

    if (includeRelations) {
      queryBuilder.leftJoinAndSelect('shiftRole.shift', 'shift');
      queryBuilder.leftJoinAndSelect('shiftRole.role', 'role');
    }

    queryBuilder.orderBy('shiftRole.createdAt', 'DESC');

    const shiftRoles = await queryBuilder.getMany();
    return shiftRoles.map(shiftRole => this.mapToResponseDto(shiftRole));
  }

  /**
   * Get shift roles by role ID
   */
  async findByRoleId(roleId: string, includeRelations = false): Promise<ShiftRoleResponseDto[]> {
    const queryBuilder = this.shiftRoleRepository.createQueryBuilder('shiftRole')
      .where('shiftRole.roleId = :roleId', { roleId });

    if (includeRelations) {
      queryBuilder.leftJoinAndSelect('shiftRole.shift', 'shift');
      queryBuilder.leftJoinAndSelect('shiftRole.role', 'role');
    }

    queryBuilder.orderBy('shiftRole.createdAt', 'DESC');

    const shiftRoles = await queryBuilder.getMany();
    return shiftRoles.map(shiftRole => this.mapToResponseDto(shiftRole));
  }

  /**
   * Map ShiftRole entity to ShiftRoleResponseDto
   */
  private mapToResponseDto(shiftRole: ShiftRole): ShiftRoleResponseDto {
    return {
      id: shiftRole.id,
      shiftId: shiftRole.shiftId,
      roleId: shiftRole.roleId,
      count: shiftRole.count,
      shift: shiftRole.shift,
      role: shiftRole.role,
      createdAt: toISOString(shiftRole.createdAt),
      updatedAt: toISOString(shiftRole.updatedAt),
    };
  }
}