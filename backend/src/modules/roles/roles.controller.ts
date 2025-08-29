import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiNotFoundResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import {Role} from "../../database/entities/role.entity";

@ApiTags('roles')
@Controller('api/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  private mapToResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      organizationId: role.organizationId,
      name: role.name,
      description: role.description,
      type: role.type,
      status: role.status,
      hourlyRate: role.hourlyRate,
      overtimeRate: role.overtimeRate,
      minExperienceMonths: role.minExperienceMonths,
      requiredCertifications: role.requiredCertifications,
      requiredSkills: role.requiredSkills,
      permissions: role.permissions,
      canWorkNights: role.canWorkNights,
      canWorkWeekends: role.canWorkWeekends,
      canWorkHolidays: role.canWorkHolidays,
      maxConsecutiveDays: role.maxConsecutiveDays,
      minRestHours: role.minRestHours,
      maxWeeklyHours: role.maxWeeklyHours,
      maxMonthlyHours: role.maxMonthlyHours,
      priorityLevel: role.priorityLevel,
      colorCode: role.colorCode,
      isActive: role.isActive,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      deletedAt: role.deletedAt,
      isAvailable: role.isAvailable,
      displayName: role.displayName,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({ status: 201, description: 'Role successfully created', type: RoleResponseDto })
  async create(@Body() dto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.rolesService.create(dto);
    return this.mapToResponseDto(role);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean, description: 'Include related entities' })
  @ApiResponse({ status: 200, description: 'List of all roles', type: [RoleResponseDto] })
  async findAll(@Query('includeRelations') includeRelations: string = 'true'): Promise<RoleResponseDto[]> {
    const include = includeRelations === 'true';
    const roles = await this.rolesService.findAll(include);
    return roles.map(role => this.mapToResponseDto(role));
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Get roles by organization' })
  @ApiParam({ name: 'organizationId', type: 'string', format: 'uuid', description: 'Organization ID' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean, description: 'Include related entities' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Only active roles' })
  @ApiResponse({ status: 200, description: 'Organization roles', type: [RoleResponseDto] })
  async findByOrganization(
    @Param('organizationId') organizationId: string,
    @Query('includeRelations') includeRelations: string = 'true',
    @Query('activeOnly') activeOnly: string = 'false'
  ): Promise<RoleResponseDto[]> {
    const include = includeRelations === 'true';
    const onlyActive = activeOnly === 'true';

    const roles = onlyActive 
      ? await this.rolesService.findActiveByOrganization(organizationId)
      : await this.rolesService.findByOrganization(organizationId, include);

    return roles.map(role => this.mapToResponseDto(role));
  }

  @Get('organization/:organizationId/count')
  @ApiOperation({ summary: 'Count roles by organization' })
  @ApiParam({ name: 'organizationId', type: 'string', format: 'uuid', description: 'Organization ID' })
  @ApiResponse({ status: 200, description: 'Number of roles', schema: { type: 'object', properties: { count: { type: 'number' } } } })
  async countByOrganization(@Param('organizationId') organizationId: string): Promise<{ count: number }> {
    const count = await this.rolesService.countByOrganization(organizationId);
    return { count };
  }

  @Get('organization/:organizationId/type/:type')
  @ApiOperation({ summary: 'Get roles by type and organization' })
  @ApiParam({ name: 'organizationId', type: 'string', format: 'uuid', description: 'Organization ID' })
  @ApiParam({ name: 'type', type: 'string', description: 'Role type' })
  @ApiResponse({ status: 200, description: 'Roles of the specified type', type: [RoleResponseDto] })
  async findByType(
    @Param('organizationId') organizationId: string,
    @Param('type') type: string
  ): Promise<RoleResponseDto[]> {
    const roles = await this.rolesService.findByType(organizationId, type);
    return roles.map(role => this.mapToResponseDto(role));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Role ID' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean, description: 'Include related entities' })
  @ApiResponse({ status: 200, description: 'Role found', type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async findOne(
    @Param('id') id: string, 
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<RoleResponseDto> {
    const include = includeRelations === 'true';
    const role = await this.rolesService.findOne(id, include);
    return this.mapToResponseDto(role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role successfully updated', type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.rolesService.update(id, dto);
    return this.mapToResponseDto(role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Role ID' })
  @ApiResponse({ status: 204, description: 'Role successfully deleted' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.rolesService.remove(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Permanently delete role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Role ID' })
  @ApiResponse({ status: 204, description: 'Role permanently deleted' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async hardRemove(@Param('id') id: string): Promise<void> {
    await this.rolesService.hardRemove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore deleted role' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role restored', type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Role not found or not deleted' })
  async restore(@Param('id') id: string): Promise<RoleResponseDto> {
    const role = await this.rolesService.restore(id);
    return this.mapToResponseDto(role);
  }
}