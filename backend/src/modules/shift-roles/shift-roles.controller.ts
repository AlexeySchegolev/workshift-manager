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
import { ShiftRolesService } from './shift-roles.service';
import { CreateShiftRoleDto } from './dto/create-shift-role.dto';
import { UpdateShiftRoleDto } from './dto/update-shift-role.dto';
import { ShiftRoleResponseDto } from './dto/shift-role-response.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('shift-roles')
@Controller('api/shift-roles')
export class ShiftRolesController {
  constructor(private readonly shiftRolesService: ShiftRolesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new shift role',
    description: 'Creates a new shift role with specified count of employees needed'
  })
  @ApiResponse({
    status: 201,
    description: 'Shift role created successfully',
    type: ShiftRoleResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or shift role already exists'
  })
  async create(@Body() createShiftRoleDto: CreateShiftRoleDto): Promise<ShiftRoleResponseDto> {
    return this.shiftRolesService.create(createShiftRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all shift roles',
    description: 'Retrieves all shift roles with optional filtering by shift or role'
  })
  @ApiQuery({
    name: 'shiftId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter by shift ID'
  })
  @ApiQuery({
    name: 'roleId',
    required: false,
    type: String,
    format: 'uuid',
    description: 'Filter by role ID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include related entities (shift, role)'
  })
  @ApiResponse({
    status: 200,
    description: 'List of shift roles',
    type: [ShiftRoleResponseDto]
  })
  async findAll(
    @Query('shiftId') shiftId?: string,
    @Query('roleId') roleId?: string,
    @Query('includeRelations') includeRelations?: string
  ): Promise<ShiftRoleResponseDto[]> {
    const options = {
      shiftId,
      roleId,
      includeRelations: includeRelations === 'true',
    };

    // Remove undefined values
    Object.keys(options).forEach(key => 
      options[key] === undefined && delete options[key]
    );

    return this.shiftRolesService.findAll(Object.keys(options).length > 0 ? options : undefined);
  }

  @Get('shift/:shiftId')
  @Public()
  @ApiOperation({
    summary: 'Get shift roles by shift ID',
    description: 'Retrieves all shift roles for a specific shift'
  })
  @ApiParam({
    name: 'shiftId',
    type: 'string',
    format: 'uuid',
    description: 'Shift UUID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include related entities (shift, role)'
  })
  @ApiResponse({
    status: 200,
    description: 'List of shift roles for the shift',
    type: [ShiftRoleResponseDto]
  })
  async findByShiftId(
    @Param('shiftId', ParseUUIDPipe) shiftId: string,
    @Query('includeRelations') includeRelations?: string
  ): Promise<ShiftRoleResponseDto[]> {
    return this.shiftRolesService.findByShiftId(shiftId, includeRelations === 'true');
  }

  @Get('role/:roleId')
  @Public()
  @ApiOperation({
    summary: 'Get shift roles by role ID',
    description: 'Retrieves all shift roles for a specific role'
  })
  @ApiParam({
    name: 'roleId',
    type: 'string',
    format: 'uuid',
    description: 'Role UUID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include related entities (shift, role)'
  })
  @ApiResponse({
    status: 200,
    description: 'List of shift roles for the role',
    type: [ShiftRoleResponseDto]
  })
  async findByRoleId(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Query('includeRelations') includeRelations?: string
  ): Promise<ShiftRoleResponseDto[]> {
    return this.shiftRolesService.findByRoleId(roleId, includeRelations === 'true');
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get shift role by ID',
    description: 'Retrieves a specific shift role by its UUID'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Shift role UUID'
  })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Include related entities (shift, role)'
  })
  @ApiResponse({
    status: 200,
    description: 'Shift role found',
    type: ShiftRoleResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Shift role not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations?: string
  ): Promise<ShiftRoleResponseDto> {
    return this.shiftRolesService.findOne(id, includeRelations === 'true');
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update shift role',
    description: 'Updates an existing shift role'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Shift role UUID'
  })
  @ApiResponse({
    status: 200,
    description: 'Shift role updated successfully',
    type: ShiftRoleResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Shift role not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or duplicate shift role'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShiftRoleDto: UpdateShiftRoleDto
  ): Promise<ShiftRoleResponseDto> {
    return this.shiftRolesService.update(id, updateShiftRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete shift role (soft delete)',
    description: 'Soft deletes a shift role by setting deletedAt timestamp'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Shift role UUID'
  })
  @ApiResponse({
    status: 204,
    description: 'Shift role deleted successfully'
  })
  @ApiNotFoundResponse({
    description: 'Shift role not found'
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.shiftRolesService.remove(id);
  }
}