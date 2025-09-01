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