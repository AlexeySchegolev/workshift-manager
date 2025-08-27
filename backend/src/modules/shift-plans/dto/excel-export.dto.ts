import { IsBoolean, IsOptional, IsString, IsObject, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @ApiProperty({
    description: 'Startdatum für den Export',
    example: '2024-12-01T00:00:00Z',
    type: 'string',
    format: 'date-time'
  })
  @IsString()
  start: string;

  @ApiProperty({
    description: 'Enddatum für den Export',
    example: '2024-12-31T23:59:59Z',
    type: 'string',
    format: 'date-time'
  })
  @IsString()
  end: string;
}

export class AdditionalColumnDto {
  @ApiProperty({
    description: 'Spalten-Schlüssel',
    example: 'overtime_hours'
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Spalten-Überschrift',
    example: 'Überstunden'
  })
  @IsString()
  header: string;

  @ApiPropertyOptional({
    description: 'Spaltenbreite in Excel',
    example: 15,
    minimum: 5,
    maximum: 50
  })
  @IsOptional()
  width?: number;
}

export class ExcelExportOptionsDto {
  @ApiPropertyOptional({
    description: 'Statistiken in den Export einbeziehen',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  includeStatistics?: boolean;

  @ApiPropertyOptional({
    description: 'Constraint-Verletzungen in den Export einbeziehen',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  includeConstraintViolations?: boolean;

  @ApiPropertyOptional({
    description: 'Detaillierte Mitarbeiterinformationen einbeziehen',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  includeEmployeeDetails?: boolean;

  @ApiPropertyOptional({
    description: 'Benutzerdefinierter Titel für den Export',
    example: 'Schichtplan Dezember 2024 - Standort Berlin'
  })
  @IsOptional()
  @IsString()
  customTitle?: string;

  @ApiPropertyOptional({
    description: 'URL zum Firmenlogo für den Export',
    example: 'https://example.com/logo.png'
  })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiPropertyOptional({
    description: 'Zusätzliche Spalten für den Export',
    type: [AdditionalColumnDto],
    example: [
      { key: 'overtime', header: 'Überstunden', width: 12 },
      { key: 'vacation_days', header: 'Urlaubstage', width: 15 }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalColumnDto)
  additionalColumns?: AdditionalColumnDto[];

  @ApiPropertyOptional({
    description: 'Datumsbereich für den Export (überschreibt Standard-Monatsbereich)',
    type: DateRangeDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;

  @ApiPropertyOptional({
    description: 'Zusätzliche Metadaten für den Export',
    type: 'object',
    additionalProperties: true,
    example: { department: 'Pflege', location: 'Berlin' }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ExcelExportRequestDto {
  @ApiProperty({
    description: 'ID des zu exportierenden Schichtplans',
    example: 'uuid-string'
  })
  @IsString()
  shiftPlanId: string;

  @ApiPropertyOptional({
    description: 'Export-Optionen und Anpassungen',
    type: ExcelExportOptionsDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExcelExportOptionsDto)
  options?: ExcelExportOptionsDto;
}

export class MultipleExcelExportRequestDto {
  @ApiProperty({
    description: 'Liste der zu exportierenden Schichtplan-IDs',
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  shiftPlanIds: string[];

  @ApiPropertyOptional({
    description: 'Export-Optionen für alle Schichtpläne',
    type: ExcelExportOptionsDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExcelExportOptionsDto)
  options?: ExcelExportOptionsDto;
}

export class ExcelExportMetadataDto {
  @ApiProperty({
    description: 'Gesamtanzahl der Schichten im Export',
    example: 456
  })
  totalShifts: number;

  @ApiProperty({
    description: 'Gesamtanzahl der Mitarbeiter im Export',
    example: 25
  })
  totalEmployees: number;

  @ApiProperty({
    description: 'Gesamtanzahl der Planungstage',
    example: 31
  })
  totalDays: number;

  @ApiProperty({
    description: 'Verwendete Export-Optionen',
    type: ExcelExportOptionsDto
  })
  exportOptions: ExcelExportOptionsDto;
}

export class ExcelExportResultDto {
  @ApiProperty({
    description: 'Dateiname der generierten Excel-Datei',
    example: 'schichtplan-2024-12-20241227-1830.xlsx'
  })
  filename: string;

  @ApiProperty({
    description: 'MIME-Type der Datei',
    example: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  mimeType: string;

  @ApiProperty({
    description: 'Dateigröße in Bytes',
    example: 45120
  })
  size: number;

  @ApiProperty({
    description: 'Zeitpunkt der Generierung',
    example: '2024-12-27T18:30:45Z',
    type: 'string',
    format: 'date-time'
  })
  generatedAt: string;

  @ApiProperty({
    description: 'Metadaten über den Export',
    type: ExcelExportMetadataDto
  })
  metadata: ExcelExportMetadataDto;
}