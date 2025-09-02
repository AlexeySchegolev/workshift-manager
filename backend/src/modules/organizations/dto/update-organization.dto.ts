import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsUrl, IsNumber, IsBoolean, IsArray, IsObject } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'Organization name', example: 'Dialyse Zentrum Berlin' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Legal organization name', example: 'Dialyse Zentrum Berlin GmbH' })
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({ description: 'Tax ID', example: 'DE123456789' })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ description: 'Registration number', example: 'HRB 12345' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;


  @ApiPropertyOptional({ description: 'Organization description', example: 'Leading dialysis center in Berlin' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Organization website', example: 'https://www.dialyse-berlin.de' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Primary email address', example: 'info@dialyse-berlin.de' })
  @IsOptional()
  @IsEmail()
  primaryEmail?: string;

  @ApiPropertyOptional({ description: 'Primary phone number', example: '+49 30 1234-0' })
  @IsOptional()
  @IsString()
  primaryPhone?: string;

  @ApiPropertyOptional({ description: 'Headquarters address', example: 'Alexanderplatz 1' })
  @IsOptional()
  @IsString()
  headquartersAddress?: string;

  @ApiPropertyOptional({ description: 'Headquarters city', example: 'Berlin' })
  @IsOptional()
  @IsString()
  headquartersCity?: string;

  @ApiPropertyOptional({ description: 'Headquarters postal code', example: '10178' })
  @IsOptional()
  @IsString()
  headquartersPostalCode?: string;

  @ApiPropertyOptional({ description: 'Headquarters country', example: 'Germany' })
  @IsOptional()
  @IsString()
  headquartersCountry?: string;

  @ApiPropertyOptional({ description: 'Logo URL', example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Subscription plan', example: 'pro' })
  @IsOptional()
  @IsString()
  subscriptionPlan?: string;

  @ApiPropertyOptional({ description: 'Maximum number of employees', example: 200 })
  @IsOptional()
  @IsNumber()
  maxEmployees?: number;

  @ApiPropertyOptional({ description: 'Maximum number of locations', example: 20 })
  @IsOptional()
  @IsNumber()
  maxLocations?: number;

  @ApiPropertyOptional({ description: 'Organization settings', example: { timezone: 'Europe/Berlin' } })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Enabled features', example: ['shift-planning', 'reporting'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ description: 'Organization is active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
