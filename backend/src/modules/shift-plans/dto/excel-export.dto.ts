import { IsBoolean, IsOptional, IsString, IsObject, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @ApiProperty({
    description: 'Start date for export',
    example: '2024-12-01T00:00:00Z',
    type: 'string',
    format: 'date-time'
  })
  @IsString()
  start: string;

  @ApiProperty({
    description: 'End date for export',
    example: '2024-12-31T23:59:59Z',
    type: 'string',
    format: 'date-time'
  })
  @IsString()
  end: string;
}

export class AdditionalColumnDto {
  @ApiProperty({
    description: 'Column key',
    example: 'overtime_hours'
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Column header',
    example: 'Overtime Hours'
  })
  @IsString()
  header: string;

  @ApiPropertyOptional({
    description: 'Column width in Excel',
    example: 15,
    minimum: 5,
    maximum: 50
  })
  @IsOptional()
  width?: number;
}

export class ExcelExportOptionsDto {
  @ApiPropertyOptional({
    description: 'Include statistics in export',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  includeStatistics?: boolean;


  @ApiPropertyOptional({
    description: 'Include detailed employee information',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  includeEmployeeDetails?: boolean;

  @ApiPropertyOptional({
    description: 'Custom title for export',
    example: 'Shift Plan December 2024 - Berlin Location'
  })
  @IsOptional()
  @IsString()
  customTitle?: string;

  @ApiPropertyOptional({
    description: 'Company logo URL for export',
    example: 'https://example.com/logo.png'
  })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiPropertyOptional({
    description: 'Additional columns for export',
    type: [AdditionalColumnDto],
    example: [
      { key: 'overtime', header: 'Overtime Hours', width: 12 },
      { key: 'vacation_days', header: 'Vacation Days', width: 15 }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalColumnDto)
  additionalColumns?: AdditionalColumnDto[];

  @ApiPropertyOptional({
    description: 'Date range for export (overrides default monthly range)',
    type: DateRangeDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;

  @ApiPropertyOptional({
    description: 'Additional metadata for export',
    type: 'object',
    additionalProperties: true,
    example: { department: 'Nursing', location: 'Berlin' }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ExcelExportRequestDto {
  @ApiProperty({
    description: 'ID of shift plan to export',
    example: 'uuid-string'
  })
  @IsString()
  shiftPlanId: string;

  @ApiPropertyOptional({
    description: 'Export options and customizations',
    type: ExcelExportOptionsDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExcelExportOptionsDto)
  options?: ExcelExportOptionsDto;
}
export class ExcelExportMetadataDto {
  @ApiProperty({
    description: 'Total number of planning days',
    example: 31
  })
  totalDays: number;

  @ApiProperty({
    description: 'Export options used',
    type: ExcelExportOptionsDto
  })
  exportOptions: ExcelExportOptionsDto;
}

export class ExcelExportResultDto {
  @ApiProperty({
    description: 'Filename of generated Excel file',
    example: 'shift-plan-2024-12-20241227-1830.xlsx'
  })
  filename: string;

  @ApiProperty({
    description: 'MIME type of file',
    example: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 45120
  })
  size: number;

  @ApiProperty({
    description: 'Generation timestamp',
    example: '2024-12-27T18:30:45Z',
    type: 'string',
    format: 'date-time'
  })
  generatedAt: string;

  @ApiProperty({
    description: 'Metadata about the export',
    type: ExcelExportMetadataDto
  })
  metadata: ExcelExportMetadataDto;
}