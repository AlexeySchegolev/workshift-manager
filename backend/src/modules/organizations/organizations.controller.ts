import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiNotFoundResponse } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { Organization } from '@/database/entities';

@ApiTags('organizations')
@Controller('api/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  private mapToResponseDto(org: Organization): OrganizationResponseDto {
    return {
      id: org.id,
      name: org.name,
      legalName: org.legalName,
      taxId: org.taxId,
      registrationNumber: org.registrationNumber,
      type: org.type,
      status: org.status,
      description: org.description,
      website: org.website,
      primaryEmail: org.primaryEmail,
      primaryPhone: org.primaryPhone,
      headquartersAddress: org.headquartersAddress,
      headquartersCity: org.headquartersCity,
      headquartersPostalCode: org.headquartersPostalCode,
      headquartersCountry: org.headquartersCountry,
      logoUrl: org.logoUrl,
      subscriptionPlan: org.subscriptionPlan,
      subscriptionExpiresAt: org.subscriptionExpiresAt,
      maxEmployees: org.maxEmployees,
      maxLocations: org.maxLocations,
      settings: org.settings,
      features: org.features,
      isActive: org.isActive,
      createdAt: (org as any).createdAt,
      updatedAt: (org as any).updatedAt,
      deletedAt: (org as any).deletedAt,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created', type: OrganizationResponseDto })
  async create(@Body() dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    const org = await this.organizationsService.create(dto);
    return this.mapToResponseDto(org);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean, description: 'Include related entities' })
  @ApiResponse({ status: 200, description: 'List of organizations', type: [OrganizationResponseDto] })
  async findAll(@Query('includeRelations') includeRelations: string = 'true'): Promise<OrganizationResponseDto[]> {
    const include = includeRelations === 'true';
    const list = await this.organizationsService.findAll(include);
    return list.map(o => this.mapToResponseDto(o));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'includeRelations', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Organization found', type: OrganizationResponseDto })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  async findOne(@Param('id') id: string, @Query('includeRelations') includeRelations: string = 'true'): Promise<OrganizationResponseDto> {
    const include = includeRelations === 'true';
    const org = await this.organizationsService.findOne(id, include);
    return this.mapToResponseDto(org);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Organization updated', type: OrganizationResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto): Promise<OrganizationResponseDto> {
    const org = await this.organizationsService.update(id, dto);
    return this.mapToResponseDto(org);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Organization deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.organizationsService.remove(id);
  }
}
