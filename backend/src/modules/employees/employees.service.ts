import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from '@/database/entities/employee.entity';
import { Location } from '@/database/entities/location.entity';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
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

    const employee = this.employeeRepository.create(createEmployeeDto);
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
        'roles', 
        'supervisor',
        'subordinates',
        'shiftAssignments',
        'availabilities',
        'shiftPreferences',
        'workTimeConstraints'
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
        'roles', 
        'supervisor',
        'subordinates',
        'shiftAssignments',
        'availabilities',
        'shiftPreferences',
        'workTimeConstraints'
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
    await this.findOne(id, false);

    // Validate location exists if provided
    if (updateEmployeeDto.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: updateEmployeeDto.locationId }
      });
      if (!location) {
        throw new BadRequestException(`Location with ID ${updateEmployeeDto.locationId} not found`);
      }
    }

    await this.employeeRepository.update(id, updateEmployeeDto);
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

  async findByLocation(locationId: string): Promise<Employee[]> {
    this.logger.log(`Retrieving employees for location ID: ${locationId}`);

    return this.employeeRepository.find({
      where: { locationId },
      relations: ['location']
    });
  }

  async findByRole(roleName: string): Promise<Employee[]> {
    this.logger.log(`Retrieving employees with role: ${roleName}`);

    return this.employeeRepository.find({
      where: {
        roles: {
          name: roleName
        }
      },
      relations: ['location', 'roles']
    });
  }

  async getEmployeeStats(): Promise<{
    total: number;
    byRole: Record<string, number>;
    byLocation: Record<string, number>;
  }> {
    this.logger.log('Generating employee statistics');

    const employees = await this.employeeRepository.find({ relations: ['location', 'roles'] });
    
    const stats = {
      total: employees.length,
      byRole: {} as Record<string, number>,
      byLocation: {} as Record<string, number>
    };

    employees.forEach(employee => {
      // Count by role - handle multiple roles per employee
      if (employee.roles && employee.roles.length > 0) {
        employee.roles.forEach(role => {
          stats.byRole[role.name] = (stats.byRole[role.name] || 0) + 1;
        });
      } else {
        stats.byRole['Unassigned'] = (stats.byRole['Unassigned'] || 0) + 1;
      }
      
      // Count by location
      const locationName = employee.location?.name || 'Unassigned';
      stats.byLocation[locationName] = (stats.byLocation[locationName] || 0) + 1;
    });

    return stats;
  }
}