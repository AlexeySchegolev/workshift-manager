import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from '@/database/entities/employee.entity';
import { Location } from '@/database/entities/location.entity';
import {Role} from "@/database/entities/role.entity";

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    this.logger.log(`Creating new employee: ${createEmployeeDto.firstName} ${createEmployeeDto.lastName}`);

    // Validate location exists if provided
    if (createEmployeeDto.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: createEmployeeDto.locationId }
      });
      if (!location) {
        throw new BadRequestException(`Location with ID ${createEmployeeDto.locationId} not found`);
      }
    }

    // Validate and load roles if provided
    let roles: Role[] = [];
    if (createEmployeeDto.roleIds && createEmployeeDto.roleIds.length > 0) {
      roles = await this.roleRepository.findByIds(createEmployeeDto.roleIds);
      if (roles.length !== createEmployeeDto.roleIds.length) {
        const foundIds = roles.map(role => role.id);
        const missingIds = createEmployeeDto.roleIds.filter(id => !foundIds.includes(id));
        throw new BadRequestException(`Roles with IDs ${missingIds.join(', ')} not found`);
      }
    }

    const { roleIds, ...employeeData } = createEmployeeDto;
    const employee = this.employeeRepository.create({
      ...employeeData,
      roles
    });

    const savedEmployee = await this.employeeRepository.save(employee);
    
    this.logger.log(`Employee created successfully with ID: ${savedEmployee.id}`);
    return savedEmployee;
  }

  async findAll(includeRelations: boolean = true): Promise<Employee[]> {
    this.logger.log('Retrieving all employees');
    
    const options = includeRelations ? {
      relations: [
        'organization',
        'location', 
        'primaryRole',
        'roles'
      ]
    } : {};

    return this.employeeRepository.find(options);
  }

  async findOne(id: string, includeRelations: boolean = true): Promise<Employee> {
    this.logger.log(`Retrieving employee with ID: ${id}`);

    const options = includeRelations ? {
      where: { id },
      relations: [
        'organization',
        'location', 
        'primaryRole',
        'roles'
      ]
    } : { where: { id } };

    const employee = await this.employeeRepository.findOne(options);
    
    if (!employee) {
      this.logger.warn(`Employee with ID ${id} not found`);
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    this.logger.log(`Updating employee with ID: ${id}`);

    // Validate employee exists
    const employee = await this.findOne(id, true);

    // Validate location exists if provided
    if (updateEmployeeDto.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: updateEmployeeDto.locationId }
      });
      if (!location) {
        throw new BadRequestException(`Location with ID ${updateEmployeeDto.locationId} not found`);
      }
    }

    // Handle role updates if provided
    if (updateEmployeeDto.roleIds !== undefined) {
      let roles: Role[] = [];
      if (updateEmployeeDto.roleIds.length > 0) {
        roles = await this.roleRepository.findByIds(updateEmployeeDto.roleIds);
        if (roles.length !== updateEmployeeDto.roleIds.length) {
          const foundIds = roles.map(role => role.id);
          const missingIds = updateEmployeeDto.roleIds.filter(id => !foundIds.includes(id));
          throw new BadRequestException(`Roles with IDs ${missingIds.join(', ')} not found`);
        }
      }
      employee.roles = roles;
      await this.employeeRepository.save(employee);
    }

    const { roleIds, ...employeeData } = updateEmployeeDto;
    await this.employeeRepository.update(id, employeeData);
    const updatedEmployee = await this.findOne(id);
    
    this.logger.log(`Employee with ID ${id} updated successfully`);
    return updatedEmployee;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting employee with ID: ${id}`);

    const employee = await this.findOne(id, false);
    await this.employeeRepository.remove(employee);
    
    this.logger.log(`Employee with ID ${id} deleted successfully`);
  }
}