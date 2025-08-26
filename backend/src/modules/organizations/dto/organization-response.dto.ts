import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationStatus, OrganizationType } from '../../../database/entities/organization.entity';

export class OrganizationResponseDto {
  @ApiProperty({ description: 'Eindeutige ID der Organisation', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Name der Organisation', example: 'Dialyse Zentrum Berlin' })
  name: string;

  @ApiPropertyOptional({ description: 'Rechtlicher Name der Organisation', example: 'Dialyse Zentrum Berlin GmbH' })
  legalName?: string;

  @ApiPropertyOptional({ description: 'Steuernummer', example: 'DE123456789' })
  taxId?: string;

  @ApiPropertyOptional({ description: 'Registrierungsnummer', example: 'HRB 12345' })
  registrationNumber?: string;

  @ApiProperty({ description: 'Typ der Organisation', enum: OrganizationType, example: OrganizationType.MEDICAL_CENTER })
  type: OrganizationType;

  @ApiProperty({ description: 'Status der Organisation', enum: OrganizationStatus, example: OrganizationStatus.ACTIVE })
  status: OrganizationStatus;

  @ApiPropertyOptional({ description: 'Beschreibung', example: 'Führendes Dialysezentrum in Berlin' })
  description?: string;

  @ApiPropertyOptional({ description: 'Website', example: 'https://www.dialyse-berlin.de' })
  website?: string;

  @ApiPropertyOptional({ description: 'Haupt-E-Mail-Adresse', example: 'info@dialyse-berlin.de' })
  primaryEmail?: string;

  @ApiPropertyOptional({ description: 'Haupttelefonnummer', example: '+49 30 1234-0' })
  primaryPhone?: string;

  @ApiPropertyOptional({ description: 'Adresse des Hauptsitzes', example: 'Alexanderplatz 1' })
  headquartersAddress?: string;

  @ApiPropertyOptional({ description: 'Stadt des Hauptsitzes', example: 'Berlin' })
  headquartersCity?: string;

  @ApiPropertyOptional({ description: 'Postleitzahl des Hauptsitzes', example: '10178' })
  headquartersPostalCode?: string;

  @ApiPropertyOptional({ description: 'Land des Hauptsitzes', example: 'Deutschland' })
  headquartersCountry?: string;

  @ApiPropertyOptional({ description: 'Logo URL', example: 'https://example.com/logo.png' })
  logoUrl?: string;

  @ApiProperty({ description: 'Abonnement-Plan', example: 'basic' })
  subscriptionPlan: string;

  @ApiPropertyOptional({ description: 'Ablaufdatum des Abonnements', example: '2025-01-01T00:00:00Z' })
  subscriptionExpiresAt?: Date;

  @ApiProperty({ description: 'Maximale Anzahl Mitarbeiter', example: 50 })
  maxEmployees: number;

  @ApiProperty({ description: 'Maximale Anzahl Standorte', example: 5 })
  maxLocations: number;

  @ApiProperty({ description: 'Einstellungen', example: { timezone: 'Europe/Berlin' } })
  settings: Record<string, any>;

  @ApiProperty({ description: 'Aktivierte Features', example: ['shift-planning', 'reporting'] })
  features: string[];

  @ApiProperty({ description: 'Ist aktiv', example: true })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Erstellt am', example: '2024-01-01T12:00:00Z' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Aktualisiert am', example: '2024-02-01T12:00:00Z' })
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Gelöscht am', example: null })
  deletedAt?: Date;
}