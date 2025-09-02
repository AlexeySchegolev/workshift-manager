import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({ description: 'Unique organization ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Organization name', example: 'Dialyse Zentrum Berlin' })
  name: string;


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


  @ApiProperty({ description: 'Is active', example: true })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Created at', example: '2024-01-01T12:00:00Z' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Updated at', example: '2024-02-01T12:00:00Z' })
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Deleted at', example: null })
  deletedAt?: Date;
}