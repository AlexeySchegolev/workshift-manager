import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'Organization name', example: 'Dialyse Zentrum Berlin' })
  @IsOptional()
  @IsString()
  name?: string;


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


  @ApiPropertyOptional({ description: 'Organization is active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
