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
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftResponseDto } from './dto/shift-response.dto';

@ApiTags('shifts')
@Controller('api/shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new shift',
    description: 'Creates a new shift with validation for time ranges and staffing requirements'
  })
  @ApiResponse({
    status: 201,
    description: 'Shift created successfully',
    type: ShiftResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation failed'
  })
  async create(@Body() createShiftDto: CreateShiftDto): Promise<ShiftResponseDto> {
    return this.shiftsService.create(createShiftDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all shifts',
    description: 'Retrieves all shifts with optional filtering by organization, location, or active status'
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter by organization ID'
  })
  @ApiQuery({
    name: 'locationId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter by location ID'
  })
  @ApiQuery({
    name: 'shiftPlanId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter by shift plan ID'
  })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Only return active shifts'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include related entities (organization, location, roles)'
  })
  @ApiResponse({
    status: 200,
    description: 'List of shifts',
    type: [ShiftResponseDto]
  })
  async findAll(
    @Query('organizationId') organizationId?: string,
    @Query('locationId') locationId?: string,
    @Query('shiftPlanId') shiftPlanId?: string,
    @Query('activeOnly') activeOnly?: string,
    @Query('includeRelations') includeRelations?: string
  ): Promise<ShiftResponseDto[]> {
    const options = {
      organizationId,
      locationId,
      shiftPlanId,
      activeOnly: activeOnly === 'true',
      includeRelations: includeRelations === 'true',
    };

    // Remove undefined values
    Object.keys(options).forEach(key => 
      options[key] === undefined && delete options[key]
    );

    return this.shiftsService.findAll(Object.keys(options).length > 0 ? options : undefined);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get shift by ID',
    description: 'Retrieves a specific shift by its UUID'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Shift UUID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include related entities and assignments'
  })
  @ApiResponse({
    status: 200,
    description: 'Shift found',
    type: ShiftResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Shift not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations?: string
  ): Promise<ShiftResponseDto> {
    return this.shiftsService.findOne(id, includeRelations === 'true');
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update shift',
    description: 'Updates an existing shift with validation'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Shift UUID'
  })
  @ApiResponse({
    status: 200,
    description: 'Shift updated successfully',
    type: ShiftResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Shift not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation failed'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShiftDto: UpdateShiftDto
  ): Promise<ShiftResponseDto> {
    return this.shiftsService.update(id, updateShiftDto);
  }

  @Post(':id/restore')
  @ApiOperation({
    summary: 'Restore deleted shift',
    description: 'Restores a soft-deleted shift'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Shift UUID'
  })
  @ApiResponse({
    status: 200,
    description: 'Shift restored successfully',
    type: ShiftResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Shift not found'
  })
  @ApiBadRequestResponse({
    description: 'Shift is not deleted'
  })
  async restore(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftResponseDto> {
    return this.shiftsService.restore(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete shift (soft delete)',
    description: 'Soft deletes a shift by marking it as inactive and setting deletedAt timestamp'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Shift UUID'
  })
  @ApiResponse({
    status: 204,
    description: 'Shift deleted successfully'
  })
  @ApiNotFoundResponse({
    description: 'Shift not found'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.shiftsService.remove(id);
  }
}