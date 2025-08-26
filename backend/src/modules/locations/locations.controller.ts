import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationResponseDto } from './dto/location-response.dto';

@ApiTags('locations')
@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new location',
    description: 'Creates a new location with the provided information including operating hours, services, and equipment'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Location created successfully',
    type: LocationResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data'
  })
  async create(@Body() createLocationDto: CreateLocationDto): Promise<LocationResponseDto> {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all locations',
    description: 'Retrieves all locations with optional employee data and filtering'
  })
  @ApiQuery({
    name: 'includeEmployees',
    required: false,
    type: Boolean,
    description: 'Include employee relationships in response'
  })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Only return active locations'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all locations',
    type: [LocationResponseDto]
  })
  async findAll(
    @Query('includeEmployees') includeEmployees: string = 'true',
    @Query('activeOnly') activeOnly: string = 'false'
  ): Promise<LocationResponseDto[]> {
    const include = includeEmployees === 'true';
    const onlyActive = activeOnly === 'true';
    
    if (onlyActive) {
      return this.locationsService.findActive(include);
    }
    
    return this.locationsService.findAll(include);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get location statistics',
    description: 'Retrieves comprehensive statistics about locations including capacity, utilization, and distribution'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Location statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        totalCapacity: { type: 'number' },
        totalEmployees: { type: 'number' },
        byCity: { type: 'object' },
        utilizationRate: { type: 'number' }
      }
    }
  })
  async getStats() {
    return this.locationsService.getLocationStats();
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Search locations',
    description: 'Search locations by name, city, or address'
  })
  @ApiQuery({ 
    name: 'q', 
    type: 'string',
    description: 'Search query for name, city, or address',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of matching locations',
    type: [LocationResponseDto]
  })
  async search(@Query('q') query: string): Promise<LocationResponseDto[]> {
    return this.locationsService.searchLocations(query);
  }

  @Get('by-city/:city')
  @ApiOperation({ 
    summary: 'Get locations by city',
    description: 'Retrieves all locations in a specific city'
  })
  @ApiParam({ 
    name: 'city', 
    type: 'string',
    description: 'City name'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of locations in the city',
    type: [LocationResponseDto]
  })
  async findByCity(@Param('city') city: string): Promise<LocationResponseDto[]> {
    return this.locationsService.findByCity(city);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get location by ID',
    description: 'Retrieves a specific location by its ID with optional employee data'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Location UUID'
  })
  @ApiQuery({
    name: 'includeEmployees',
    required: false,
    type: Boolean,
    description: 'Include employee relationships in response'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Location found',
    type: LocationResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Location not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeEmployees') includeEmployees: string = 'true'
  ): Promise<LocationResponseDto> {
    const include = includeEmployees === 'true';
    return this.locationsService.findOne(id, include);
  }

  @Get(':id/stats')
  @ApiOperation({ 
    summary: 'Get detailed location statistics',
    description: 'Retrieves detailed statistics for a specific location including utilization rates'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Location UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Detailed location statistics',
    schema: {
      type: 'object',
      allOf: [
        { $ref: '#/components/schemas/Location' },
        {
          type: 'object',
          properties: {
            employeeCount: { type: 'number' },
            utilizationRate: { type: 'number' },
            serviceCount: { type: 'number' },
            equipmentCount: { type: 'number' }
          }
        }
      ]
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Location not found'
  })
  async getLocationWithStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.locationsService.getLocationWithStats(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update location',
    description: 'Updates an existing location with the provided information'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Location UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Location updated successfully',
    type: LocationResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Location not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto
  ): Promise<LocationResponseDto> {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Post(':id/activate')
  @ApiOperation({ 
    summary: 'Activate location',
    description: 'Activates a location, making it available for operations'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Location UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Location activated successfully',
    type: LocationResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Location not found'
  })
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<LocationResponseDto> {
    return this.locationsService.activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ 
    summary: 'Deactivate location',
    description: 'Deactivates a location, making it unavailable for new operations'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Location UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Location deactivated successfully',
    type: LocationResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Location not found'
  })
  async deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<LocationResponseDto> {
    return this.locationsService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete location',
    description: 'Deletes a location by its ID. Location must not have assigned employees.'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Location UUID'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Location deleted successfully'
  })
  @ApiNotFoundResponse({ 
    description: 'Location not found or has assigned employees'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.locationsService.remove(id);
  }
}