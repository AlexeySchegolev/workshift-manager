import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ShiftPlanDetail } from '@/database/entities/shift-plan-detail.entity';
import { ShiftPlan } from '@/database/entities/shift-plan.entity';
import { Employee } from '@/database/entities/employee.entity';
import { Shift } from '@/database/entities/shift.entity';
import { CreateShiftPlanDetailDto } from './dto/create-shift-plan-detail.dto';
import { UpdateShiftPlanDetailDto } from './dto/update-shift-plan-detail.dto';
import { ShiftPlanDetailResponseDto } from './dto/shift-plan-detail-response.dto';

@Injectable()
export class ShiftPlanDetailsService {
  constructor(
    @InjectRepository(ShiftPlanDetail)
    private readonly shiftPlanDetailRepository: Repository<ShiftPlanDetail>,
    @InjectRepository(ShiftPlan)
    private readonly shiftPlanRepository: Repository<ShiftPlan>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async create(createDto: CreateShiftPlanDetailDto): Promise<ShiftPlanDetailResponseDto> {
    // Validate shift plan exists
    const shiftPlan = await this.shiftPlanRepository.findOne({
      where: { id: createDto.shiftPlanId }
    });

    if (!shiftPlan) {
      throw new NotFoundException(`Shift plan with ID ${createDto.shiftPlanId} not found`);
    }

    // Validate employee exists
    const employee = await this.employeeRepository.findOne({
      where: { id: createDto.employeeId }
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${createDto.employeeId} not found`);
    }

    // Validate shift exists
    const shift = await this.shiftRepository.findOne({
      where: { id: createDto.shiftId }
    });

    if (!shift) {
      throw new NotFoundException(`Shift with ID ${createDto.shiftId} not found`);
    }

    // Validate day is within the shift plan's month
    const daysInMonth = new Date(shiftPlan.year, shiftPlan.month, 0).getDate();
    if (createDto.day > daysInMonth) {
      throw new BadRequestException(`Day ${createDto.day} is invalid for ${shiftPlan.year}-${shiftPlan.month.toString().padStart(2, '0')}`);
    }

    // Check for existing assignment on the same day for the same employee
    const existingAssignment = await this.shiftPlanDetailRepository.findOne({
      where: {
        shiftPlanId: createDto.shiftPlanId,
        employeeId: createDto.employeeId,
        day: createDto.day,
        deletedAt: null
      }
    });

    if (existingAssignment) {
      throw new BadRequestException(`Employee is already assigned to a shift on day ${createDto.day} in this shift plan`);
    }

    const shiftPlanDetail = this.shiftPlanDetailRepository.create(createDto);
    const savedDetail = await this.shiftPlanDetailRepository.save(shiftPlanDetail);

    return this.mapToResponseDto(savedDetail);
  }

  async findAll(filters?: {
    shiftPlanId?: string;
    employeeId?: string;
    shiftId?: string;
    day?: number;
    month?: number;
    year?: number;
  }): Promise<ShiftPlanDetailResponseDto[]> {
    const where: FindOptionsWhere<ShiftPlanDetail> = {};

    if (filters?.shiftPlanId) {
      where.shiftPlanId = filters.shiftPlanId;
    }

    if (filters?.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters?.shiftId) {
      where.shiftId = filters.shiftId;
    }

    if (filters?.day) {
      where.day = filters.day;
    }

    const queryBuilder = this.shiftPlanDetailRepository.createQueryBuilder('spd')
      .leftJoinAndSelect('spd.shiftPlan', 'sp')
      .leftJoinAndSelect('spd.employee', 'e')
      .leftJoinAndSelect('spd.shift', 's')
      .where('spd.deletedAt IS NULL');

    if (filters?.shiftPlanId) {
      queryBuilder.andWhere('spd.shiftPlanId = :shiftPlanId', { shiftPlanId: filters.shiftPlanId });
    }

    if (filters?.employeeId) {
      queryBuilder.andWhere('spd.employeeId = :employeeId', { employeeId: filters.employeeId });
    }

    if (filters?.shiftId) {
      queryBuilder.andWhere('spd.shiftId = :shiftId', { shiftId: filters.shiftId });
    }

    if (filters?.day) {
      queryBuilder.andWhere('spd.day = :day', { day: filters.day });
    }

    if (filters?.month && filters?.year) {
      queryBuilder.andWhere('sp.month = :month AND sp.year = :year', { 
        month: filters.month, 
        year: filters.year 
      });
    }

    queryBuilder.orderBy('spd.day', 'ASC')
      .addOrderBy('s.startTime', 'ASC');

    const details = await queryBuilder.getMany();
    return details.map(detail => this.mapToResponseDto(detail));
  }

  async findOne(id: string): Promise<ShiftPlanDetailResponseDto> {
    const detail = await this.shiftPlanDetailRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['shiftPlan', 'employee', 'shift']
    });

    if (!detail) {
      throw new NotFoundException(`Shift plan detail with ID ${id} not found`);
    }

    return this.mapToResponseDto(detail);
  }

  async update(id: string, updateDto: UpdateShiftPlanDetailDto): Promise<ShiftPlanDetailResponseDto> {
    const detail = await this.shiftPlanDetailRepository.findOne({
      where: { id, deletedAt: null }
    });

    if (!detail) {
      throw new NotFoundException(`Shift plan detail with ID ${id} not found`);
    }

    // Validate references if they are being updated
    if (updateDto.shiftPlanId && updateDto.shiftPlanId !== detail.shiftPlanId) {
      const shiftPlan = await this.shiftPlanRepository.findOne({
        where: { id: updateDto.shiftPlanId }
      });
      if (!shiftPlan) {
        throw new NotFoundException(`Shift plan with ID ${updateDto.shiftPlanId} not found`);
      }
    }

    if (updateDto.employeeId && updateDto.employeeId !== detail.employeeId) {
      const employee = await this.employeeRepository.findOne({
        where: { id: updateDto.employeeId }
      });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${updateDto.employeeId} not found`);
      }
    }

    if (updateDto.shiftId && updateDto.shiftId !== detail.shiftId) {
      const shift = await this.shiftRepository.findOne({
        where: { id: updateDto.shiftId }
      });
      if (!shift) {
        throw new NotFoundException(`Shift with ID ${updateDto.shiftId} not found`);
      }
    }

    Object.assign(detail, updateDto);
    const updatedDetail = await this.shiftPlanDetailRepository.save(detail);

    return this.mapToResponseDto(updatedDetail);
  }

  async remove(id: string): Promise<void> {
    const detail = await this.shiftPlanDetailRepository.findOne({
      where: { id, deletedAt: null }
    });

    if (!detail) {
      throw new NotFoundException(`Shift plan detail with ID ${id} not found`);
    }

    await this.shiftPlanDetailRepository.remove(detail);
  }

  async getByShiftPlan(shiftPlanId: string): Promise<ShiftPlanDetailResponseDto[]> {
    return this.findAll({ shiftPlanId });
  }

  async getByEmployee(employeeId: string): Promise<ShiftPlanDetailResponseDto[]> {
    return this.findAll({ employeeId });
  }

  async getByShift(shiftId: string): Promise<ShiftPlanDetailResponseDto[]> {
    return this.findAll({ shiftId });
  }

  async getByMonth(month: number, year: number): Promise<ShiftPlanDetailResponseDto[]> {
    return this.findAll({ month, year });
  }

  private mapToResponseDto(detail: ShiftPlanDetail): ShiftPlanDetailResponseDto {
    const dto = new ShiftPlanDetailResponseDto();
    
    dto.id = detail.id;
    dto.shiftPlanId = detail.shiftPlanId;
    dto.employeeId = detail.employeeId;
    dto.shiftId = detail.shiftId;
    dto.day = detail.day;
    dto.createdBy = detail.createdBy;
    dto.updatedBy = detail.updatedBy;
    dto.createdAt = detail.createdAt;
    dto.updatedAt = detail.updatedAt;
    dto.deletedAt = detail.deletedAt;
    dto.isActive = detail.isActive;

    // Related data
    if (detail.shiftPlan) {
      dto.shiftPlan = {
        id: detail.shiftPlan.id,
        name: detail.shiftPlan.name,
        year: detail.shiftPlan.year,
        month: detail.shiftPlan.month,
      };
    }

    if (detail.employee) {
      dto.employee = {
        id: detail.employee.id,
        firstName: detail.employee.firstName,
        lastName: detail.employee.lastName,
        email: detail.employee.email,
        fullName: detail.employee.fullName,
      };
    }

    if (detail.shift) {
      dto.shift = {
        id: detail.shift.id,
        name: detail.shift.name,
        type: detail.shift.type,
        startTime: detail.shift.startTime,
        endTime: detail.shift.endTime,
        duration: detail.shift.duration,
      };
    }

    return dto;
  }
}