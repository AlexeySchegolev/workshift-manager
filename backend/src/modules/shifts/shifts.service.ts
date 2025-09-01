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
      recurrenceEndDate: createShiftDto.recurrenceEndDate ? 
        new Date(createShiftDto.recurrenceEndDate) : undefined,
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
      queryBuilder.leftJoinAndSelect('shift.assignments', 'assignments');
      queryBuilder.leftJoinAndSelect('assignments.employee', 'employee');
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
      recurrenceEndDate: updateShiftDto.recurrenceEndDate ? 
        new Date(updateShiftDto.recurrenceEndDate) : shift.recurrenceEndDate,
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
   * Hard delete a shift (permanent)
   */
  async hardRemove(id: string): Promise<void> {
    const result = await this.shiftRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
  }

  /**
   * Restore a soft-deleted shift
   */
  async restore(id: string): Promise<ShiftResponseDto> {
    const shift = await this.shiftRepository.findOne({ 
      where: { id },
      withDeleted: true 
    });

    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    if (!shift.deletedAt) {
      throw new BadRequestException('Shift is not deleted');
    }

    shift.deletedAt = undefined;
    shift.isActive = true;
    const savedShift = await this.shiftRepository.save(shift);
    
    return this.mapToResponseDto(savedShift);
  }

  /**
   * Get shifts by date range
   */
  async findByDateRange(
    startDate: string,
    endDate: string,
    organizationId?: string,
    locationId?: string
  ): Promise<ShiftResponseDto[]> {
    const queryBuilder = this.shiftRepository.createQueryBuilder('shift')
      .where('shift.shiftDate >= :startDate', { startDate })
      .andWhere('shift.shiftDate <= :endDate', { endDate })
      .andWhere('shift.isActive = true')
      .andWhere('shift.deletedAt IS NULL');

    if (organizationId) {
      queryBuilder.andWhere('shift.organizationId = :organizationId', {
        organizationId
      });
    }

    if (locationId) {
      queryBuilder.andWhere('shift.locationId = :locationId', {
        locationId
      });
    }

    queryBuilder.orderBy('shift.shiftDate', 'ASC')
              .addOrderBy('shift.startTime', 'ASC');

    const shifts = await queryBuilder.getMany();
    return shifts.map(shift => this.mapToResponseDto(shift));
  }

  /**
   * Get shift statistics
   */
  async getShiftStats(organizationId?: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    averageStaffing: number;
  }> {
    const queryBuilder = this.shiftRepository.createQueryBuilder('shift');

    if (organizationId) {
      queryBuilder.where('shift.organizationId = :organizationId', {
        organizationId
      });
    }

    const shifts = await queryBuilder.getMany();

    const total = shifts.length;
    const active = shifts.filter(s => s.isActive && !s.deletedAt).length;
    const inactive = total - active;

    const byType = shifts.reduce((acc, shift) => {
      acc[shift.type] = (acc[shift.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = shifts.reduce((acc, shift) => {
      acc[shift.status] = (acc[shift.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalStaffingPercentage = shifts.reduce((sum, shift) => {
      return sum + (shift.minEmployees > 0 ? (shift.currentEmployees / shift.minEmployees) * 100 : 0);
    }, 0);

    const averageStaffing = shifts.length > 0 ? totalStaffingPercentage / shifts.length : 0;

    return {
      total,
      active,
      inactive,
      byType,
      byStatus,
      averageStaffing: Math.round(averageStaffing * 100) / 100
    };
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
      status: shift.status,
      priority: shift.priority,
      shiftDate: toDateString(shift.shiftDate),
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakDuration: shift.breakDuration,
      totalHours: shift.totalHours,
      minEmployees: shift.minEmployees,
      maxEmployees: shift.maxEmployees,
      currentEmployees: shift.currentEmployees,
      roleRequirements: shift.roleRequirements,
      requiredSkills: shift.requiredSkills,
      requiredCertifications: shift.requiredCertifications,
      isOvertime: shift.isOvertime,
      overtimeRate: shift.overtimeRate,
      isHoliday: shift.isHoliday,
      holidayRate: shift.holidayRate,
      isWeekend: shift.isWeekend,
      weekendRate: shift.weekendRate,
      colorCode: shift.colorCode,
      notes: shift.notes,
      isRecurring: shift.isRecurring,
      recurrencePattern: shift.recurrencePattern,
      recurrenceEndDate: shift.recurrenceEndDate ? toDateString(shift.recurrenceEndDate) : undefined,
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
      isFullyStaffed: shift.isFullyStaffed,
      isOverStaffed: shift.isOverStaffed,
      staffingPercentage: shift.staffingPercentage,
      duration: shift.duration,
      effectiveHours: shift.effectiveHours,
      isAvailable: shift.isAvailable,
    };
  }
}