import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateShiftPlanDto} from './dto/create-shift-plan.dto';
import {UpdateShiftPlanDto} from './dto/update-shift-plan.dto';
import {ShiftPlan} from "@/database/entities/shift-plan.entity";
import {Employee} from "@/database/entities/employee.entity";
import {Organization} from "@/database/entities/organization.entity";
import { toDateString } from '@/common/utils/date.utils';

@Injectable()
export class ShiftPlansService {
  private readonly logger = new Logger(ShiftPlansService.name);

  constructor(
    @InjectRepository(ShiftPlan)
    private readonly shiftPlanRepository: Repository<ShiftPlan>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  private async getDefaultOrganization(): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { isActive: true },
      order: { createdAt: 'ASC' }
    });
    
    if (!organization) {
      throw new BadRequestException('No active organization found. Please ensure the database is properly seeded.');
    }
    
    return organization;
  }

  async create(createShiftPlanDto: CreateShiftPlanDto): Promise<ShiftPlan> {
    this.logger.log(`Creating new shift plan for ${createShiftPlanDto.month}/${createShiftPlanDto.year}`);

    // Check if shift plan already exists for this month/year
    const existingPlan = await this.findByMonthYear(
      createShiftPlanDto.year,
      createShiftPlanDto.month,
      false
    );
    
    if (existingPlan) {
      throw new BadRequestException(
        `Shift plan for ${createShiftPlanDto.month}/${createShiftPlanDto.year} already exists`
      );
    }

    const shiftPlan = this.shiftPlanRepository.create({
      ...createShiftPlanDto,
      isPublished: createShiftPlanDto.isPublished || false
    });

    const savedPlan = await this.shiftPlanRepository.save(shiftPlan);
    
    this.logger.log(`Shift plan created successfully with ID: ${savedPlan.id}`);
    return savedPlan;
  }

  async findAll(includeRelations: boolean = true): Promise<ShiftPlan[]> {
    this.logger.log('Retrieving all shift plans');
    
    const options = {
      order: { year: 'DESC', month: 'DESC' } as any
    };

    return this.shiftPlanRepository.find(options);
  }

  async findOne(id: string, includeRelations: boolean = true): Promise<ShiftPlan> {
    this.logger.log(`Retrieving shift plan with ID: ${id}`);

    const options = { where: { id } };

    const shiftPlan = await this.shiftPlanRepository.findOne(options);
    
    if (!shiftPlan) {
      this.logger.warn(`Shift plan with ID ${id} not found`);
      throw new NotFoundException(`Shift plan with ID ${id} not found`);
    }
    
    return shiftPlan;
  }

  async findByMonthYear(year: number, month: number, throwIfNotFound: boolean = true): Promise<ShiftPlan | null> {
    this.logger.log(`Retrieving shift plan for ${month}/${year}`);

    const shiftPlan = await this.shiftPlanRepository.findOne({
      where: { year, month }
    });
    
    if (!shiftPlan && throwIfNotFound) {
      this.logger.warn(`Shift plan for ${month}/${year} not found`);
      throw new NotFoundException(`Shift plan for ${month}/${year} not found`);
    }
    
    return shiftPlan;
  }

  async update(id: string, updateShiftPlanDto: UpdateShiftPlanDto): Promise<ShiftPlan> {
    this.logger.log(`Updating shift plan with ID: ${id}`);

    // Validate shift plan exists
    await this.findOne(id, false);

    await this.shiftPlanRepository.update(id, updateShiftPlanDto);
    const updatedPlan = await this.findOne(id);
    
    this.logger.log(`Shift plan with ID ${id} updated successfully`);
    return updatedPlan;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing shift plan with ID: ${id}`);
    
    // Validate shift plan exists
    await this.findOne(id, false);

    await this.shiftPlanRepository.delete(id);
    
    this.logger.log(`Shift plan with ID ${id} removed successfully`);
  }

  async publish(id: string): Promise<ShiftPlan> {
    this.logger.log(`Publishing shift plan with ID: ${id}`);
    
    const shiftPlan = await this.findOne(id);
    
    // Validate the plan before publishing
    if (!shiftPlan.planData || Object.keys(shiftPlan.planData).length === 0) {
      throw new BadRequestException('Cannot publish empty shift plan');
    }

    await this.shiftPlanRepository.update(id, { isPublished: true });
    return this.findOne(id);
  }
}