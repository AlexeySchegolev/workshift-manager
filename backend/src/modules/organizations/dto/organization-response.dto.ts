import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationStatus, OrganizationType } from '../../../database/entities/organization.entity';

export class OrganizationResponseDto {
  @ApiProperty({ description: 'Unique organization ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Organization name', example: 'Dialyse Zentrum Berlin' })
  name: string;

  @ApiPropertyOptional({ description: 'Legal organization name', example: 'Dialyse Zentrum Berlin GmbH' })
  legalName?: string;

  @ApiPropertyOptional({ description: 'Tax ID', example: 'DE123456789' })
  taxId?: string;

  @ApiPropertyOptional({ description: 'Registration number', example: 'HRB 12345' })
  registrationNumber?: string;

  @ApiProperty({ description: 'Organization type', enum: OrganizationType, example: OrganizationType.MEDICAL_CENTER })
  type: OrganizationType;

  @ApiProperty({ description: 'Organization status', enum: OrganizationStatus, example: OrganizationStatus.ACTIVE })
  status: OrganizationStatus;

  @ApiPropertyOptional({ description: 'Description', example: 'Leading dialysis center in Berlin' })
  description?: string;

  @ApiPropertyOptional({ description: 'Website', example: 'https://www.dialyse-berlin.de' })
  website?: string;

  @ApiPropertyOptional({ description: 'Primary email address', example: 'info@dialyse-berlin.de' })
  primaryEmail?: string;

  @ApiPropertyOptional({ description: 'Primary phone number', example: '+49 30 1234-0' })
  primaryPhone?: string;

  @ApiPropertyOptional({ description: 'Headquarters address', example: 'Alexanderplatz 1' })
  headquartersAddress?: string;

  @ApiPropertyOptional({ description: 'Headquarters city', example: 'Berlin' })
  headquartersCity?: string;

  @ApiPropertyOptional({ description: 'Headquarters postal code', example: '10178' })
  headquartersPostalCode?: string;

  @ApiPropertyOptional({ description: 'Headquarters country', example: 'Germany' })
  headquartersCountry?: string;

  @ApiPropertyOptional({ description: 'Logo URL', example: 'https://example.com/logo.png' })
  logoUrl?: string;

  @ApiProperty({ description: 'Subscription plan', example: 'basic' })
  subscriptionPlan: string;

  @ApiPropertyOptional({ description: 'Subscription expiration date', example: '2025-01-01T00:00:00Z' })
  subscriptionExpiresAt?: Date;

  @ApiProperty({ description: 'Maximum number of employees', example: 50 })
  maxEmployees: number;

  @ApiProperty({ description: 'Maximum number of locations', example: 5 })
  maxLocations: number;

  @ApiProperty({ description: 'Settings', example: { timezone: 'Europe/Berlin' } })
  settings: Record<string, any>;

  @ApiProperty({ description: 'Enabled features', example: ['shift-planning', 'reporting'] })
  features: string[];

  @ApiProperty({ description: 'Is active', example: true })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Created at', example: '2024-01-01T12:00:00Z' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Updated at', example: '2024-02-01T12:00:00Z' })
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Deleted at', example: null })
  deletedAt?: Date;
}