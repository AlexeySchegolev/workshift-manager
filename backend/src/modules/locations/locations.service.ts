import {Injectable, NotFoundException, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateLocationDto} from './dto/create-location.dto';
import {UpdateLocationDto} from './dto/update-location.dto';
import {Location} from '@/database/entities/location.entity';

@Injectable()
export class LocationsService {
    private readonly logger = new Logger(LocationsService.name);

    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
    ) {
    }

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
            order: {name: 'ASC'} as any
        } : {
            order: {name: 'ASC'} as any
        };

        return this.locationRepository.find(options);
    }

    async findActive(includeEmployees: boolean = true): Promise<Location[]> {
        this.logger.log('Retrieving all active locations');

        const options = includeEmployees ? {
            where: {isActive: true},
            relations: ['employees'],
            order: {name: 'ASC'} as any
        } : {
            where: {isActive: true},
            order: {name: 'ASC'} as any
        };

        return this.locationRepository.find(options);
    }

    async findOne(id: string, includeEmployees: boolean = true): Promise<Location> {
        this.logger.log(`Retrieving location with ID: ${id}`);

        const options = includeEmployees ? {
            where: {id},
            relations: ['employees']
        } : {where: {id}};

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
}