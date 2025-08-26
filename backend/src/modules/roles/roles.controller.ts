import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiNotFoundResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { Role } from '../../database/entities/role.entity';

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
  @ApiOperation({ summary: 'Neue Rolle erstellen' })
  @ApiResponse({ status: 201, description: 'Rolle erfolgreich erstellt', type: RoleResponseDto })
  async create(@Body() dto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.rolesService.create(dto);
    return this.mapToResponseDto(role);
  }

  @Get()
  @ApiOperation({ summary: 'Alle Rollen abrufen' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean, description: 'Verwandte Entitäten einbeziehen' })
  @ApiResponse({ status: 200, description: 'Liste aller Rollen', type: [RoleResponseDto] })
  async findAll(@Query('includeRelations') includeRelations: string = 'true'): Promise<RoleResponseDto[]> {
    const include = includeRelations === 'true';
    const roles = await this.rolesService.findAll(include);
    return roles.map(role => this.mapToResponseDto(role));
  }

  @Get('organization/:organizationId')
  @ApiOperation({ summary: 'Rollen nach Organisation abrufen' })
  @ApiParam({ name: 'organizationId', type: 'string', format: 'uuid', description: 'ID der Organisation' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean, description: 'Verwandte Entitäten einbeziehen' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Nur aktive Rollen' })
  @ApiResponse({ status: 200, description: 'Rollen der Organisation', type: [RoleResponseDto] })
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
  @ApiOperation({ summary: 'Anzahl Rollen pro Organisation' })
  @ApiParam({ name: 'organizationId', type: 'string', format: 'uuid', description: 'ID der Organisation' })
  @ApiResponse({ status: 200, description: 'Anzahl der Rollen', schema: { type: 'object', properties: { count: { type: 'number' } } } })
  async countByOrganization(@Param('organizationId') organizationId: string): Promise<{ count: number }> {
    const count = await this.rolesService.countByOrganization(organizationId);
    return { count };
  }

  @Get('organization/:organizationId/type/:type')
  @ApiOperation({ summary: 'Rollen nach Typ und Organisation' })
  @ApiParam({ name: 'organizationId', type: 'string', format: 'uuid', description: 'ID der Organisation' })
  @ApiParam({ name: 'type', type: 'string', description: 'Rolle-Typ' })
  @ApiResponse({ status: 200, description: 'Rollen des angegebenen Typs', type: [RoleResponseDto] })
  async findByType(
    @Param('organizationId') organizationId: string,
    @Param('type') type: string
  ): Promise<RoleResponseDto[]> {
    const roles = await this.rolesService.findByType(organizationId, type);
    return roles.map(role => this.mapToResponseDto(role));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Rolle nach ID abrufen' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'ID der Rolle' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean, description: 'Verwandte Entitäten einbeziehen' })
  @ApiResponse({ status: 200, description: 'Rolle gefunden', type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Rolle nicht gefunden' })
  async findOne(
    @Param('id') id: string, 
    @Query('includeRelations') includeRelations: string = 'true'
  ): Promise<RoleResponseDto> {
    const include = includeRelations === 'true';
    const role = await this.rolesService.findOne(id, include);
    return this.mapToResponseDto(role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Rolle aktualisieren' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'ID der Rolle' })
  @ApiResponse({ status: 200, description: 'Rolle erfolgreich aktualisiert', type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Rolle nicht gefunden' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.rolesService.update(id, dto);
    return this.mapToResponseDto(role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Rolle soft-löschen' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'ID der Rolle' })
  @ApiResponse({ status: 204, description: 'Rolle erfolgreich gelöscht' })
  @ApiNotFoundResponse({ description: 'Rolle nicht gefunden' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.rolesService.remove(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Rolle permanent löschen' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'ID der Rolle' })
  @ApiResponse({ status: 204, description: 'Rolle permanent gelöscht' })
  @ApiNotFoundResponse({ description: 'Rolle nicht gefunden' })
  async hardRemove(@Param('id') id: string): Promise<void> {
    await this.rolesService.hardRemove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Gelöschte Rolle wiederherstellen' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'ID der Rolle' })
  @ApiResponse({ status: 200, description: 'Rolle wiederhergestellt', type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Rolle nicht gefunden oder nicht gelöscht' })
  async restore(@Param('id') id: string): Promise<RoleResponseDto> {
    const role = await this.rolesService.restore(id);
    return this.mapToResponseDto(role);
  }
}