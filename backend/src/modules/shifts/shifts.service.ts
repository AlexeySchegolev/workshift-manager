import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '@/database/entities/shift.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftResponseDto } from './dto/shift-response.dto';
import { toDateString, toISOString } from '@/common/utils/date.utils';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  /**
   * Create a new shift
   */
  async create(createShiftDto: CreateShiftDto): Promise<ShiftResponseDto> {
    // Validate that end time is after start time
    const startTime = new Date(`2000-01-01T${createShiftDto.startTime}`);
    const endTime = new Date(`2000-01-01T${createShiftDto.endTime}`);
    
    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }

    // Create shift entity
    const shift = this.shiftRepository.create({
      ...createShiftDto,
      shiftDate: new Date(createShiftDto.shiftDate),
    });

    const savedShift = await this.shiftRepository.save(shift);
    return this.mapToResponseDto(savedShift);
  }

  /**
   * Get all shifts with optional filtering
   */
  async findAll(options?: {
    organizationId?: string;
    locationId?: string;
    shiftPlanId?: string;
    activeOnly?: boolean;
    includeRelations?: boolean;
  }): Promise<ShiftResponseDto[]> {
    const queryBuilder = this.shiftRepository.createQueryBuilder('shift');

    if (options?.organizationId) {
      queryBuilder.andWhere('shift.organizationId = :organizationId', {
        organizationId: options.organizationId
      });
    }

    if (options?.locationId) {
      queryBuilder.andWhere('shift.locationId = :locationId', {
        locationId: options.locationId
      });
    }

    if (options?.shiftPlanId) {
      queryBuilder.andWhere('shift.shiftPlanId = :shiftPlanId', {
        shiftPlanId: options.shiftPlanId
      });
    }

    if (options?.activeOnly) {
      queryBuilder.andWhere('shift.isActive = true');
      queryBuilder.andWhere('shift.deletedAt IS NULL');
    }

    if (options?.includeRelations) {
      queryBuilder.leftJoinAndSelect('shift.organization', 'organization');
      queryBuilder.leftJoinAndSelect('shift.location', 'location');
      queryBuilder.leftJoinAndSelect('shift.requiredRoles', 'requiredRoles');
    }

    queryBuilder.orderBy('shift.shiftDate', 'ASC')
              .addOrderBy('shift.startTime', 'ASC');

    const shifts = await queryBuilder.getMany();
    return shifts.map(shift => this.mapToResponseDto(shift));
  }

  /**
   * Get shift by ID
   */
  async findOne(id: string, includeRelations = false): Promise<ShiftResponseDto> {
    const queryBuilder = this.shiftRepository.createQueryBuilder('shift')
      .where('shift.id = :id', { id });

    if (includeRelations) {
      queryBuilder.leftJoinAndSelect('shift.organization', 'organization');
      queryBuilder.leftJoinAndSelect('shift.location', 'location');
      queryBuilder.leftJoinAndSelect('shift.requiredRoles', 'requiredRoles');
    }

    const shift = await queryBuilder.getOne();

    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    return this.mapToResponseDto(shift);
  }

  /**
   * Update an existing shift
   */
  async update(id: string, updateShiftDto: UpdateShiftDto): Promise<ShiftResponseDto> {
    const shift = await this.shiftRepository.findOne({ where: { id } });

    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    // Validate time changes if provided
    if (updateShiftDto.startTime || updateShiftDto.endTime) {
      const startTime = new Date(`2000-01-01T${updateShiftDto.startTime || shift.startTime}`);
      const endTime = new Date(`2000-01-01T${updateShiftDto.endTime || shift.endTime}`);
      
      if (endTime <= startTime) {
        throw new BadRequestException('End time must be after start time');
      }
    }

    // Update shift
    Object.assign(shift, {
      ...updateShiftDto,
      shiftDate: updateShiftDto.shiftDate ? new Date(updateShiftDto.shiftDate) : shift.shiftDate,
      updatedAt: new Date(),
    });

    const savedShift = await this.shiftRepository.save(shift);
    return this.mapToResponseDto(savedShift);
  }

  /**
   * Soft delete a shift
   */
  async remove(id: string): Promise<void> {
    const shift = await this.shiftRepository.findOne({ where: { id } });

    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    shift.deletedAt = new Date();
    shift.isActive = false;
    await this.shiftRepository.save(shift);
  }
    /**
     * Map Shift entity to ShiftResponseDto
   */
  private mapToResponseDto(shift: Shift): ShiftResponseDto {
    return {
      id: shift.id,
      organizationId: shift.organizationId,
      locationId: shift.locationId,
      shiftPlanId: shift.shiftPlanId,
      name: shift.name,
      description: shift.description,
      type: shift.type,
      shiftDate: toDateString(shift.shiftDate),
      startTime: shift.startTime,
      endTime: shift.endTime,
      isActive: shift.isActive,
      organization: shift.organization,
      location: shift.location,
      requiredRoles: shift.requiredRoles,
      createdBy: shift.createdBy,
      updatedBy: shift.updatedBy,
      createdAt: toISOString(shift.createdAt),
      updatedAt: toISOString(shift.updatedAt),
      deletedAt: shift.deletedAt ? toISOString(shift.deletedAt) : undefined,
      // Virtual fields
      duration: shift.duration,
      isAvailable: shift.isAvailable,
    };
  }
}