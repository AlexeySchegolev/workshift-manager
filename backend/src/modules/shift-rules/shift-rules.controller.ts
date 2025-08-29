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
import { ShiftRulesService } from './shift-rules.service';
import { CreateShiftRulesDto } from './dto/create-shift-rules.dto';
import { UpdateShiftRulesDto } from './dto/update-shift-rules.dto';
import { ShiftRulesResponseDto } from './dto/shift-rules-response.dto';

@ApiTags('shift-rules')
@Controller('api/shift-rules')
export class ShiftRulesController {
  constructor(private readonly shiftRulesService: ShiftRulesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create new shift rules',
    description: 'Creates a new set of shift rules with validation constraints'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Shift rules created successfully',
    type: ShiftRulesResponseDto
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or rule validation failed'
  })
  async create(@Body() createShiftRulesDto: CreateShiftRulesDto): Promise<ShiftRulesResponseDto> {
    return this.shiftRulesService.create(createShiftRulesDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all shift rules',
    description: 'Retrieves all shift rules with optional filtering for active rules only'
  })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'Only return active shift rules'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of shift rules',
    type: [ShiftRulesResponseDto]
  })
  async findAll(
    @Query('activeOnly') activeOnly: string = 'false'
  ): Promise<ShiftRulesResponseDto[]> {
    const onlyActive = activeOnly === 'true';
    return this.shiftRulesService.findAll(onlyActive);
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get shift rules statistics',
    description: 'Retrieves statistics about shift rules including total, active, and inactive counts'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift rules statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        mostRecentActive: { $ref: '#/components/schemas/ShiftRules' }
      }
    }
  })
  async getStats() {
    return this.shiftRulesService.getRuleStats();
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Get active shift rules',
    description: 'Retrieves all currently active shift rules'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of active shift rules',
    type: [ShiftRulesResponseDto]
  })
  async findActive(): Promise<ShiftRulesResponseDto[]> {
    return this.shiftRulesService.findActive();
  }

  @Get('default')
  @ApiOperation({ 
    summary: 'Get default shift rules',
    description: 'Retrieves the default (most recent active) shift rules set'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Default shift rules',
    type: ShiftRulesResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'No active shift rules found'
  })
  async findDefault(): Promise<ShiftRulesResponseDto | null> {
    return this.shiftRulesService.findDefault();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get shift rules by ID',
    description: 'Retrieves a specific set of shift rules by their UUID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift rules UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift rules found',
    type: ShiftRulesResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift rules not found'
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftRulesResponseDto> {
    return this.shiftRulesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update shift rules',
    description: 'Updates an existing set of shift rules with validation'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift rules UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift rules updated successfully',
    type: ShiftRulesResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift rules not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or rule validation failed'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShiftRulesDto: UpdateShiftRulesDto
  ): Promise<ShiftRulesResponseDto> {
    return this.shiftRulesService.update(id, updateShiftRulesDto);
  }

  @Post(':id/activate')
  @ApiOperation({ 
    summary: 'Activate shift rules',
    description: 'Activates a set of shift rules, making them available for use'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift rules UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift rules activated successfully',
    type: ShiftRulesResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift rules not found'
  })
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftRulesResponseDto> {
    return this.shiftRulesService.activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ 
    summary: 'Deactivate shift rules',
    description: 'Deactivates a set of shift rules, making them unavailable for new shift plans'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift rules UUID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Shift rules deactivated successfully',
    type: ShiftRulesResponseDto
  })
  @ApiNotFoundResponse({ 
    description: 'Shift rules not found'
  })
  async deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<ShiftRulesResponseDto> {
    return this.shiftRulesService.deactivate(id);
  }

  @Post('validate-assignment')
  @ApiOperation({ 
    summary: 'Validate shift assignment',
    description: 'Validates whether a shift assignment complies with the given rules'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Validation result',
    schema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        violations: { type: 'array', items: { type: 'string' } },
        warnings: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid validation parameters'
  })
  async validateAssignment(@Body() validationData: {
    rulesId: string;
    employeeRole: string;
    shiftType: string;
    consecutiveShifts: number;
    saturdaysWorked: number;
    weeklyHours: number;
    restHoursSinceLastShift: number;
    consecutiveWorkingDays: number;
  }) {
    const rules = await this.shiftRulesService.findOne(validationData.rulesId);
    
    return this.shiftRulesService.validateShiftAssignment(
      rules,
      validationData.employeeRole,
      validationData.shiftType,
      validationData.consecutiveShifts,
      validationData.saturdaysWorked,
      validationData.weeklyHours,
      validationData.restHoursSinceLastShift,
      validationData.consecutiveWorkingDays
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete shift rules',
    description: 'Deletes a set of shift rules by their UUID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string',
    format: 'uuid',
    description: 'Shift rules UUID'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Shift rules deleted successfully'
  })
  @ApiNotFoundResponse({ 
    description: 'Shift rules not found'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.shiftRulesService.remove(id);
  }
}