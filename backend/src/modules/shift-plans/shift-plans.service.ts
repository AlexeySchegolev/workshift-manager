import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateShiftPlanDto} from './dto/create-shift-plan.dto';
import {UpdateShiftPlanDto} from './dto/update-shift-plan.dto';
import {ShiftPlan} from "@/database/entities/shift-plan.entity";
import {Employee} from "@/database/entities/employee.entity";
import {Organization} from "@/database/entities/organization.entity";
import {Location} from "@/database/entities/location.entity";

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
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
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
    this.logger.log(`Creating new shift plan for location ${createShiftPlanDto.locationId} - ${createShiftPlanDto.month}/${createShiftPlanDto.year}`);

    // Validate location exists
    const location = await this.locationRepository.findOne({
      where: { id: createShiftPlanDto.locationId, isActive: true }
    });
    
    if (!location) {
      throw new BadRequestException(`Location with ID ${createShiftPlanDto.locationId} not found or inactive`);
    }

    // Check if shift plan already exists for this location/month/year
    const existingPlan = await this.findByLocationMonthYear(
      createShiftPlanDto.locationId,
      createShiftPlanDto.year,
      createShiftPlanDto.month,
      false
    );
    
    if (existingPlan) {
      throw new BadRequestException(
        `Shift plan for location ${location.name} - ${createShiftPlanDto.month}/${createShiftPlanDto.year} already exists`
      );
    }

    const shiftPlan = this.shiftPlanRepository.create({
      ...createShiftPlanDto,
      planningPeriodStart: new Date(createShiftPlanDto.planningPeriodStart),
      planningPeriodEnd: new Date(createShiftPlanDto.planningPeriodEnd)
    });

    const savedPlan = await this.shiftPlanRepository.save(shiftPlan);
    
    this.logger.log(`Shift plan created successfully with ID: ${savedPlan.id}`);
    return savedPlan;
  }

  async findAll(includeRelations: boolean = true): Promise<ShiftPlan[]> {
    this.logger.log('Retrieving all shift plans');
    
    const options: any = {
      order: { year: 'DESC', month: 'DESC' }
    };

    if (includeRelations) {
      options.relations = ['location', 'organization'];
    }

    return this.shiftPlanRepository.find(options);
  }

  async findByLocation(locationId: string, includeRelations: boolean = true): Promise<ShiftPlan[]> {
    this.logger.log(`Retrieving shift plans for location: ${locationId}`);
    
    const options: any = {
      where: { locationId },
      order: { year: 'DESC', month: 'DESC' }
    };

    if (includeRelations) {
      options.relations = ['location', 'organization'];
    }

    return this.shiftPlanRepository.find(options);
  }

  async findOne(id: string, includeRelations: boolean = true): Promise<ShiftPlan> {
    this.logger.log(`Retrieving shift plan with ID: ${id}`);

    const options: any = { where: { id } };

    if (includeRelations) {
      options.relations = ['location', 'organization'];
    }

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
      where: { year, month },
      relations: ['location', 'organization']
    });
    
    if (!shiftPlan && throwIfNotFound) {
      this.logger.warn(`Shift plan for ${month}/${year} not found`);
      throw new NotFoundException(`Shift plan for ${month}/${year} not found`);
    }
    
    return shiftPlan;
  }

  async findByLocationMonthYear(locationId: string, year: number, month: number, throwIfNotFound: boolean = true): Promise<ShiftPlan | null> {
    this.logger.log(`Retrieving shift plan for location ${locationId} - ${month}/${year}`);

    const shiftPlan = await this.shiftPlanRepository.findOne({
      where: { locationId, year, month },
      relations: ['location', 'organization']
    });
    
    if (!shiftPlan && throwIfNotFound) {
      this.logger.warn(`Shift plan for location ${locationId} - ${month}/${year} not found`);
      throw new NotFoundException(`Shift plan for location ${locationId} - ${month}/${year} not found`);
    }
    
    return shiftPlan;
  }

  async update(id: string, updateShiftPlanDto: UpdateShiftPlanDto): Promise<ShiftPlan> {
    this.logger.log(`Updating shift plan with ID: ${id}`);

    // Validate shift plan exists
    await this.findOne(id, false);

    // If locationId is being updated, validate the new location
    if (updateShiftPlanDto.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: updateShiftPlanDto.locationId, isActive: true }
      });
      
      if (!location) {
        throw new BadRequestException(`Location with ID ${updateShiftPlanDto.locationId} not found or inactive`);
      }
    }

    // Convert date strings to Date objects if provided
    const updateData = { ...updateShiftPlanDto };
    if (updateData.planningPeriodStart) {
      updateData.planningPeriodStart = new Date(updateData.planningPeriodStart) as any;
    }
    if (updateData.planningPeriodEnd) {
      updateData.planningPeriodEnd = new Date(updateData.planningPeriodEnd) as any;
    }

    await this.shiftPlanRepository.update(id, updateData);
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

}