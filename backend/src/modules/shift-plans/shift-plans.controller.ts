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
  ParseIntPipe,
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
import { ShiftPlansService } from './shift-plans.service';
import { CreateShiftPlanDto, GenerateShiftPlanDto, ValidateShiftPlanDto } from './dto/create-shift-plan.dto';
import { UpdateShiftPlanDto } from './dto/update-shift-plan.dto';
import { ShiftPlan } from '../../database/entities/shift-plan.entity';

@ApiTags('shift-plans')
@Controller('api/shift-plans')
export class ShiftPlansController {
  constructor(private readonly shiftPlansService: ShiftPlansService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new shift plan',
    description: 'Creates a new shift plan for a specific month and year'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Shift plan created successfully',
    type: ShiftPlan
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or shift plan already exists for this period'
  })
  async create(@Body() createShiftPlanDto: CreateShiftPlanDto): Promise<ShiftPlan> {
    return this.shiftPlansService.create(createShiftPlanDto);
  }

  @Post('generate')
  @ApiOperation({ 
    summary: 'Generate a shift plan automatically',
    description: 'Automatically generates a shift plan using algorithms and shift rules'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Shift plan generated successfully',
    schema: {
      type: 'object',
      properties: {
        shiftPlan: { $ref: '#/components/schemas/ShiftPlan' },
        statistics: { type: 'object' },
        violations: { type: 'array', items: { $ref: '#/components/schemas/ConstraintViolation' } }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid generation parameters or no active shift rules found'
  })
  async generate(@Body() generateShiftPlanDto: GenerateShiftPlanDto) {
    return this.shiftPlansService.generateShiftPlan(generateShiftPlanDto);
  }

  @Post('validate')
  @ApiOperation({ 
    summary: 'Validate a shift plan',
    description: 'Validates a shift plan against current shift rules and constraints'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Validation completed',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        violations: { type: 'array', items: { $ref: '#/components/schemas/ConstraintViolation' } },
        statistics: { type: 'object' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid validation parameters'
  })
  async validate(@Body() validateShiftPlanDto: ValidateShiftPlanDto) {
    return this.shiftPlansService.validateShiftPlan(validateShiftPlanDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all shift plans',
    description: 'Retrieves all shift plans with optional relation data'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include assignments and violations in response'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all shift plans',
    type: [ShiftPlan]
  })
  async findAll(
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<ShiftPlan[]> {
    const include = includeRelations === 'true';
    return this.shiftPlansService.findAll(include);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get shift plan statistics',
    description: 'Retrieves statistics about shift plans including counts and current/next month plans'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        published: { type: 'number' },
        unpublished: { type: 'number' },
        currentMonth: { $ref: '#/components/schemas/ShiftPlan' },
        nextMonth: { $ref: '#/components/schemas/ShiftPlan' }
      }
    }
  })
  async getStats() {
    return this.shiftPlansService.getShiftPlanStats();
  }

  @Get('by-month/:year/:month')
  @ApiOperation({ 
    summary: 'Get shift plan by month and year',
    description: 'Retrieves a specific shift plan for a given month and year'
  })
  @ApiParam({ 
    name: 'year', 
    type: 'number',
    description: 'Year (e.g., 2024)'
  })
  @ApiParam({ 
    name: 'month', 
    type: 'number',
    description: 'Month (1-12)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan found',
    type: ShiftPlan
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found for the specified period'
  })
  async findByMonthYear(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number
  ): Promise<ShiftPlan> {
    return this.shiftPlansService.findByMonthYear(year, month);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get shift plan by ID',
    description: 'Retrieves a specific shift plan by its UUID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include assignments and violations in response'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan found',
    type: ShiftPlan
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<ShiftPlan> {
    const include = includeRelations === 'true';
    return this.shiftPlansService.findOne(id, include);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update shift plan',
    description: 'Updates an existing shift plan with new data'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan updated successfully',
    type: ShiftPlan
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShiftPlanDto: UpdateShiftPlanDto
  ): Promise<ShiftPlan> {
    return this.shiftPlansService.update(id, updateShiftPlanDto);
  }

  @Post(':id/publish')
  @ApiOperation({ 
    summary: 'Publish shift plan',
    description: 'Publishes a shift plan, making it active and visible to employees'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan published successfully',
    type: ShiftPlan
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Cannot publish empty shift plan'
  })
  async publish(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftPlan> {
    return this.shiftPlansService.publish(id);
  }

  @Post(':id/unpublish')
  @ApiOperation({ 
    summary: 'Unpublish shift plan',
    description: 'Unpublishes a shift plan, making it inactive'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift plan unpublished successfully',
    type: ShiftPlan
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  async unpublish(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftPlan> {
    return this.shiftPlansService.unpublish(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete shift plan',
    description: 'Deletes a shift plan by its UUID. Only unpublished plans can be deleted.'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift plan UUID'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Shift plan deleted successfully'
  })
  @ApiNotFoundResponse({ 
    description: 'Shift plan not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Cannot delete published shift plan'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.shiftPlansService.remove(id);
  }
}