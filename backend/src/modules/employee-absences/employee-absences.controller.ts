import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { EmployeeAbsencesService } from './employee-absences.service';
import { CreateEmployeeAbsenceDto } from './dto/create-employee-absence.dto';
import { UpdateEmployeeAbsenceDto } from './dto/update-employee-absence.dto';
import { EmployeeAbsenceResponseDto } from './dto/employee-absence-response.dto';

@ApiTags('employee-absences')
@Controller('employee-absences')
export class EmployeeAbsencesController {
    constructor(private readonly employeeAbsencesService: EmployeeAbsencesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new employee absence' })
    @ApiBody({ type: CreateEmployeeAbsenceDto })
    @ApiResponse({ status: 201, description: 'Employee absence created successfully', type: EmployeeAbsenceResponseDto })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 404, description: 'Employee not found' })
    async create(@Body() createDto: CreateEmployeeAbsenceDto): Promise<EmployeeAbsenceResponseDto> {
        return this.employeeAbsencesService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all employee absences with optional filters' })
    @ApiQuery({ name: 'employeeId', required: false, description: 'Filter by employee ID' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'month', required: false, description: 'Filter by month (1-12)' })
    @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
    @ApiResponse({ status: 200, description: 'List of employee absences', type: [EmployeeAbsenceResponseDto] })
    async findAll(
        @Query('employeeId') employeeId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('month') month?: string,
        @Query('year') year?: string,
    ): Promise<EmployeeAbsenceResponseDto[]> {
        const filters: any = {};

        if (employeeId) filters.employeeId = employeeId;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (month) filters.month = parseInt(month);
        if (year) filters.year = parseInt(year);

        return this.employeeAbsencesService.findAll(filters);
    }

    @Get('employee/:employeeId')
    @ApiOperation({ summary: 'Get all absences for a specific employee' })
    @ApiParam({ name: 'employeeId', description: 'Employee UUID' })
    @ApiResponse({ status: 200, description: 'List of employee absences', type: [EmployeeAbsenceResponseDto] })
    @ApiResponse({ status: 404, description: 'Employee not found' })
    async findByEmployee(
        @Param('employeeId', ParseUUIDPipe) employeeId: string
    ): Promise<EmployeeAbsenceResponseDto[]> {
        return this.employeeAbsencesService.getAbsencesByEmployee(employeeId);
    }

    @Get('month/:year/:month')
    @ApiOperation({ summary: 'Get all absences for a specific month and year' })
    @ApiParam({ name: 'year', description: 'Year (e.g., 2025)' })
    @ApiParam({ name: 'month', description: 'Month (1-12)' })
    @ApiResponse({ status: 200, description: 'List of employee absences for the specified month', type: [EmployeeAbsenceResponseDto] })
    async findByMonth(
        @Param('year') year: string,
        @Param('month') month: string
    ): Promise<EmployeeAbsenceResponseDto[]> {
        return this.employeeAbsencesService.getAbsencesByMonth(parseInt(month), parseInt(year));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific employee absence by ID' })
    @ApiParam({ name: 'id', description: 'Employee absence UUID' })
    @ApiResponse({ status: 200, description: 'Employee absence details', type: EmployeeAbsenceResponseDto })
    @ApiResponse({ status: 404, description: 'Employee absence not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EmployeeAbsenceResponseDto> {
        return this.employeeAbsencesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an employee absence' })
    @ApiParam({ name: 'id', description: 'Employee absence UUID' })
    @ApiBody({ type: UpdateEmployeeAbsenceDto })
    @ApiResponse({ status: 200, description: 'Employee absence updated successfully', type: EmployeeAbsenceResponseDto })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 404, description: 'Employee absence not found' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateEmployeeAbsenceDto
    ): Promise<EmployeeAbsenceResponseDto> {
        return this.employeeAbsencesService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an employee absence' })
    @ApiParam({ name: 'id', description: 'Employee absence UUID' })
    @ApiResponse({ status: 204, description: 'Employee absence deleted successfully' })
    @ApiResponse({ status: 404, description: 'Employee absence not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.employeeAbsencesService.remove(id);
    }
}