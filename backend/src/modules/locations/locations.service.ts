import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../../database/entities/location.entity';
import { Employee } from '../../database/entities/employee.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    this.logger.log(`Creating new location: ${createLocationDto.name}`);

    // Set default operating hours if not provided
    const operatingHours = createLocationDto.operatingHours || {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    const location = this.locationRepository.create({
      ...createLocationDto,
      operatingHours,
      services: createLocationDto.services || [],
      equipment: createLocationDto.equipment || [],
      isActive: createLocationDto.isActive !== undefined ? createLocationDto.isActive : true
    });

    const savedLocation = await this.locationRepository.save(location);
    
    this.logger.log(`Location created successfully with ID: ${savedLocation.id}`);
    return savedLocation;
  }

  async findAll(includeEmployees: boolean = true): Promise<Location[]> {
    this.logger.log('Retrieving all locations');
    
    const options = includeEmployees ? {
      relations: ['employees'],
      order: { name: 'ASC' } as any
    } : {
      order: { name: 'ASC' } as any
    };

    return this.locationRepository.find(options);
  }

  async findActive(includeEmployees: boolean = true): Promise<Location[]> {
    this.logger.log('Retrieving all active locations');
    
    const options = includeEmployees ? {
      where: { isActive: true },
      relations: ['employees'],
      order: { name: 'ASC' } as any
    } : {
      where: { isActive: true },
      order: { name: 'ASC' } as any
    };

    return this.locationRepository.find(options);
  }

  async findOne(id: string, includeEmployees: boolean = true): Promise<Location> {
    this.logger.log(`Retrieving location with ID: ${id}`);

    const options = includeEmployees ? {
      where: { id },
      relations: ['employees']
    } : { where: { id } };

    const location = await this.locationRepository.findOne(options);
    
    if (!location) {
      this.logger.warn(`Location with ID ${id} not found`);
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    this.logger.log(`Updating location with ID: ${id}`);

    // Validate location exists
    await this.findOne(id, false);

    await this.locationRepository.update(id, updateLocationDto);
    const updatedLocation = await this.findOne(id);
    
    this.logger.log(`Location with ID ${id} updated successfully`);
    return updatedLocation;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting location with ID: ${id}`);

    const location = await this.findOne(id, true);
    
    // Check if location has employees
    if (location.employees && location.employees.length > 0) {
      this.logger.warn(`Cannot delete location with ID ${id} - has ${location.employees.length} assigned employees`);
      throw new NotFoundException(
        `Cannot delete location with ${location.employees.length} assigned employees. Please reassign employees first.`
      );
    }

    await this.locationRepository.remove(location);
    
    this.logger.log(`Location with ID ${id} deleted successfully`);
  }

  async activate(id: string): Promise<Location> {
    this.logger.log(`Activating location with ID: ${id}`);
    
    await this.locationRepository.update(id, { isActive: true });
    return this.findOne(id);
  }

  async deactivate(id: string): Promise<Location> {
    this.logger.log(`Deactivating location with ID: ${id}`);
    
    await this.locationRepository.update(id, { isActive: false });
    return this.findOne(id);
  }

  async findByCity(city: string): Promise<Location[]> {
    this.logger.log(`Retrieving locations in city: ${city}`);

    return this.locationRepository.find({
      where: { city },
      relations: ['employees'],
      order: { name: 'ASC' } as any
    });
  }

  async getLocationStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    totalCapacity: number;
    totalEmployees: number;
    byCity: Record<string, number>;
    utilizationRate: number;
  }> {
    this.logger.log('Generating location statistics');

    const locations = await this.locationRepository.find({ relations: ['employees'] });
    
    const stats = {
      total: locations.length,
      active: locations.filter(l => l.isActive).length,
      inactive: locations.filter(l => !l.isActive).length,
      totalCapacity: locations.reduce((sum, l) => sum + l.maxCapacity, 0),
      totalEmployees: locations.reduce((sum, l) => sum + (l.employees?.length || 0), 0),
      byCity: {} as Record<string, number>,
      utilizationRate: 0
    };

    // Calculate by city
    locations.forEach(location => {
      stats.byCity[location.city] = (stats.byCity[location.city] || 0) + 1;
    });

    // Calculate utilization rate (employees / capacity * 100)
    if (stats.totalCapacity > 0) {
      stats.utilizationRate = Math.round((stats.totalEmployees / stats.totalCapacity) * 100);
    }

    return stats;
  }

  async getLocationWithStats(id: string): Promise<Location & {
    employeeCount: number;
    utilizationRate: number;
    serviceCount: number;
    equipmentCount: number;
  }> {
    this.logger.log(`Retrieving location with stats for ID: ${id}`);

    const location = await this.findOne(id, true);
    
    const employeeCount = location.employees?.length || 0;
    const utilizationRate = location.maxCapacity > 0 ?
      Math.round((employeeCount / location.maxCapacity) * 100) : 0;

    return Object.assign(location, {
      employeeCount,
      utilizationRate,
      serviceCount: location.services?.length || 0,
      equipmentCount: location.equipment?.length || 0,
    });
  }

  async searchLocations(query: string): Promise<Location[]> {
    this.logger.log(`Searching locations with query: ${query}`);

    return this.locationRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.employees', 'employees')
      .where('LOWER(location.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(location.city) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(location.address) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy('location.name', 'ASC')
      .getMany();
  }
}