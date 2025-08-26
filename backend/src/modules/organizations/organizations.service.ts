import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Organization } from '@/database/entities';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    this.logger.log(`Creating new organization: ${dto.name}`);
    const org = this.organizationRepository.create(dto as DeepPartial<Organization>);
    const saved = await this.organizationRepository.save(org);
    this.logger.log(`Organization created successfully with ID: ${saved.id}`);
    return saved;
  }

  async findAll(includeRelations: boolean = true): Promise<Organization[]> {
    this.logger.log('Retrieving all organizations');
    const options = includeRelations ? {
      relations: ['users', 'employees', 'locations', 'shiftPlans', 'roles']
    } : {};
    return this.organizationRepository.find(options);
  }

  async findOne(id: string, includeRelations: boolean = true): Promise<Organization> {
    this.logger.log(`Retrieving organization with ID: ${id}`);
    const options = includeRelations ? {
      where: { id },
      relations: ['users', 'employees', 'locations', 'shiftPlans', 'roles']
    } : { where: { id } };

    const org = await this.organizationRepository.findOne(options);
    if (!org) {
      this.logger.warn(`Organization with ID ${id} not found`);
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    this.logger.log(`Updating organization with ID: ${id}`);
    const org = await this.findOne(id, false);
    await this.organizationRepository.save({ ...org, ...(dto as any) });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting organization with ID: ${id}`);
    const org = await this.findOne(id, false);
    await this.organizationRepository.remove(org);
    this.logger.log(`Organization with ID ${id} deleted successfully`);
  }
}
