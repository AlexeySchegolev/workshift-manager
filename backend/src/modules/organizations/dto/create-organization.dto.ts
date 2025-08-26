import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsEmail, IsUrl, IsNumber, IsBoolean, IsArray, IsObject } from 'class-validator';
import { OrganizationType, OrganizationStatus } from '../../../database/entities/organization.entity';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Name der Organisation',
    example: 'Dialyse Zentrum Berlin'
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Rechtlicher Name der Organisation',
    example: 'Dialyse Zentrum Berlin GmbH'
  })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({
    description: 'Steuernummer',
    example: 'DE123456789'
  })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Registrierungsnummer',
    example: 'HRB 12345'
  })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional({
    description: 'Typ der Organisation',
    enum: OrganizationType,
    example: OrganizationType.MEDICAL_CENTER
  })
  @IsOptional()
  @IsEnum(OrganizationType)
  type?: OrganizationType;

  @ApiPropertyOptional({
    description: 'Status der Organisation',
    enum: OrganizationStatus,
    example: OrganizationStatus.TRIAL
  })
  @IsOptional()
  @IsEnum(OrganizationStatus)
  status?: OrganizationStatus;

  @ApiPropertyOptional({
    description: 'Beschreibung der Organisation',
    example: 'Führendes Dialysezentrum in Berlin mit modernen Geräten'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Website der Organisation',
    example: 'https://www.dialyse-berlin.de'
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Haupt-E-Mail-Adresse',
    example: 'info@dialyse-berlin.de'
  })
  @IsOptional()
  @IsEmail()
  primaryEmail?: string;

  @ApiPropertyOptional({
    description: 'Haupttelefonnummer',
    example: '+49 30 1234-0'
  })
  @IsOptional()
  @IsString()
  primaryPhone?: string;

  @ApiPropertyOptional({
    description: 'Hauptsitz-Adresse',
    example: 'Alexanderplatz 1'
  })
  @IsOptional()
  @IsString()
  headquartersAddress?: string;

  @ApiPropertyOptional({
    description: 'Hauptsitz-Stadt',
    example: 'Berlin'
  })
  @IsOptional()
  @IsString()
  headquartersCity?: string;

  @ApiPropertyOptional({
    description: 'Hauptsitz-Postleitzahl',
    example: '10178'
  })
  @IsOptional()
  @IsString()
  headquartersPostalCode?: string;

  @ApiPropertyOptional({
    description: 'Hauptsitz-Land',
    example: 'Deutschland'
  })
  @IsOptional()
  @IsString()
  headquartersCountry?: string;

  @ApiPropertyOptional({
    description: 'URL zum Logo',
    example: 'https://example.com/logo.png'
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Abonnement-Plan',
    example: 'basic'
  })
  @IsOptional()
  @IsString()
  subscriptionPlan?: string;

  @ApiPropertyOptional({
    description: 'Maximale Anzahl Mitarbeiter',
    example: 50
  })
  @IsOptional()
  @IsNumber()
  maxEmployees?: number;

  @ApiPropertyOptional({
    description: 'Maximale Anzahl Standorte',
    example: 5
  })
  @IsOptional()
  @IsNumber()
  maxLocations?: number;

  @ApiPropertyOptional({
    description: 'Organisationseinstellungen',
    example: { timezone: 'Europe/Berlin', currency: 'EUR' }
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Aktivierte Features',
    example: ['shift-planning', 'reporting']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({
    description: 'Organisation ist aktiv',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}