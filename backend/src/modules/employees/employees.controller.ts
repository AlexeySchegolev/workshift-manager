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
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';

@ApiTags('employees')
@ApiBearerAuth()
@Controller('api/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new employee',
    description: 'Creates a new employee with the provided information'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Employee created successfully',
    type: EmployeeResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or location not found'
  })
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all employees',
    description: 'Retrieves all employees with optional relation data'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include location and role relations'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all employees',
    type: [EmployeeResponseDto]
  })
  async findAll(
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<EmployeeResponseDto[]> {
    const include = includeRelations === 'true';
    return this.employeesService.findAll(include);
  }

  @Get('location/:locationId')
  @ApiOperation({
    summary: 'Get employees by location ID',
    description: 'Retrieves all employees for a specific location'
  })
  @ApiParam({
    name: 'locationId',
    type: 'string',
    format: 'uuid',
    description: 'Location UUID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include location and role relations'
  })
  @ApiResponse({
    status: 200,
    description: 'List of employees for the location',
    type: [EmployeeResponseDto]
  })
  @ApiNotFoundResponse({
    description: 'Location not found'
  })
  async findByLocation(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<EmployeeResponseDto[]> {
    const include = includeRelations === 'true';
    return this.employeesService.findByLocationId(locationId, include);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get employee by ID',
    description: 'Retrieves a specific employee by their UUID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Employee UUID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include location and role relations'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee found',
    type: EmployeeResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Employee not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<EmployeeResponseDto> {
    const include = includeRelations === 'true';
    return this.employeesService.findOne(id, include);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update employee',
    description: 'Updates an existing employee with the provided information'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Employee UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee updated successfully',
    type: EmployeeResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Employee not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or location not found'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete employee',
    description: 'Deletes an employee by their UUID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Employee UUID'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Employee deleted successfully'
  })
  @ApiNotFoundResponse({ 
    description: 'Employee not found'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.employeesService.remove(id);
  }
}