import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShiftPlanDetailDto } from './dto/create-shift-plan-detail.dto';
import { ShiftPlanDetailResponseDto } from './dto/shift-plan-detail-response.dto';
import { UpdateShiftPlanDetailDto } from './dto/update-shift-plan-detail.dto';
import { ShiftPlanDetailsService } from './shift-plan-details.service';

@ApiTags('shift-plan-details')
@Controller('shift-plan-details')
export class ShiftPlanDetailsController {
  constructor(private readonly shiftPlanDetailsService: ShiftPlanDetailsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shift plan detail' })
  @ApiBody({ type: CreateShiftPlanDetailDto })
  @ApiResponse({ status: 201, description: 'Shift plan detail created successfully', type: ShiftPlanDetailResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or duplicate assignment' })
  @ApiResponse({ status: 404, description: 'Shift plan, employee, or shift not found' })
  async create(@Body() createDto: CreateShiftPlanDetailDto): Promise<ShiftPlanDetailResponseDto> {
    return this.shiftPlanDetailsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shift plan details with optional filters' })
  @ApiQuery({ name: 'shiftPlanId', required: false, description: 'Filter by shift plan ID' })
  @ApiQuery({ name: 'employeeId', required: false, description: 'Filter by employee ID' })
  @ApiQuery({ name: 'shiftId', required: false, description: 'Filter by shift ID' })
  @ApiQuery({ name: 'day', required: false, description: 'Filter by day (1-31)' })
  @ApiQuery({ name: 'month', required: false, description: 'Filter by month (1-12)' })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiResponse({ status: 200, description: 'List of shift plan details', type: [ShiftPlanDetailResponseDto] })
  async findAll(
    @Query('shiftPlanId') shiftPlanId?: string,
    @Query('employeeId') employeeId?: string,
    @Query('shiftId') shiftId?: string,
    @Query('day') day?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ): Promise<ShiftPlanDetailResponseDto[]> {
    const filters: any = {};

    if (shiftPlanId) filters.shiftPlanId = shiftPlanId;
    if (employeeId) filters.employeeId = employeeId;
    if (shiftId) filters.shiftId = shiftId;
    if (day) filters.day = parseInt(day);
    if (month) filters.month = parseInt(month);
    if (year) filters.year = parseInt(year);

    return this.shiftPlanDetailsService.findAll(filters);
  }

  @Get('shift-plan/:shiftPlanId')
  @ApiOperation({ summary: 'Get all details for a specific shift plan' })
  @ApiParam({ name: 'shiftPlanId', description: 'Shift plan UUID' })
  @ApiResponse({ status: 200, description: 'List of shift plan details', type: [ShiftPlanDetailResponseDto] })
  @ApiResponse({ status: 404, description: 'Shift plan not found' })
  async findByShiftPlan(
    @Param('shiftPlanId', ParseUUIDPipe) shiftPlanId: string
  ): Promise<ShiftPlanDetailResponseDto[]> {
    return this.shiftPlanDetailsService.getByShiftPlan(shiftPlanId);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get all shift assignments for a specific employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee UUID' })
  @ApiResponse({ status: 200, description: 'List of employee shift assignments', type: [ShiftPlanDetailResponseDto] })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async findByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string
  ): Promise<ShiftPlanDetailResponseDto[]> {
    return this.shiftPlanDetailsService.getByEmployee(employeeId);
  }

  @Get('shift/:shiftId')
  @ApiOperation({ summary: 'Get all assignments for a specific shift' })
  @ApiParam({ name: 'shiftId', description: 'Shift UUID' })
  @ApiResponse({ status: 200, description: 'List of shift assignments', type: [ShiftPlanDetailResponseDto] })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  async findByShift(
    @Param('shiftId', ParseUUIDPipe) shiftId: string
  ): Promise<ShiftPlanDetailResponseDto[]> {
    return this.shiftPlanDetailsService.getByShift(shiftId);
  }

  @Get('month/:year/:month')
  @ApiOperation({ summary: 'Get all shift plan details for a specific month and year' })
  @ApiParam({ name: 'year', description: 'Year (e.g., 2025)' })
  @ApiParam({ name: 'month', description: 'Month (1-12)' })
  @ApiResponse({ status: 200, description: 'List of shift plan details for the specified month', type: [ShiftPlanDetailResponseDto] })
  async findByMonth(
    @Param('year') year: string,
    @Param('month') month: string
  ): Promise<ShiftPlanDetailResponseDto[]> {
    return this.shiftPlanDetailsService.getByMonth(parseInt(month), parseInt(year));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific shift plan detail by ID' })
  @ApiParam({ name: 'id', description: 'Shift plan detail UUID' })
  @ApiResponse({ status: 200, description: 'Shift plan detail details', type: ShiftPlanDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Shift plan detail not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftPlanDetailResponseDto> {
    return this.shiftPlanDetailsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shift plan detail' })
  @ApiParam({ name: 'id', description: 'Shift plan detail UUID' })
  @ApiBody({ type: UpdateShiftPlanDetailDto })
  @ApiResponse({ status: 200, description: 'Shift plan detail updated successfully', type: ShiftPlanDetailResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Shift plan detail not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateShiftPlanDetailDto
  ): Promise<ShiftPlanDetailResponseDto> {
    return this.shiftPlanDetailsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shift plan detail' })
  @ApiParam({ name: 'id', description: 'Shift plan detail UUID' })
  @ApiResponse({ status: 204, description: 'Shift plan detail deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shift plan detail not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.shiftPlanDetailsService.remove(id);
  }
}