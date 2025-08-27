import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsDate, IsBoolean, IsOptional, IsArray, IsNumber, Min, Max, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';
import { AvailabilityType, AvailabilityStatus, AbsenceReason, RecurrencePattern, WeeklyAvailability } from '../../../database/entities/employee-availability.entity';

export class CreateEmployeeAvailabilityDto {
  @ApiProperty({
    description: 'ID des Mitarbeiters',
    example: 'uuid-string'
  })
  @IsString()
  employeeId: string;

  @ApiProperty({
    description: 'Art der Verfügbarkeit',
    enum: AvailabilityType,
    example: AvailabilityType.AVAILABLE
  })
  @IsEnum(AvailabilityType)
  type: AvailabilityType;

  @ApiPropertyOptional({
    description: 'Status der Verfügbarkeit',
    enum: AvailabilityStatus,
    example: AvailabilityStatus.ACTIVE,
    default: AvailabilityStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(AvailabilityStatus)
  status?: AvailabilityStatus;

  @ApiProperty({
    description: 'Startdatum des Verfügbarkeitszeitraums',
    type: 'string',
    format: 'date',
    example: '2024-01-15'
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({
    description: 'Enddatum des Verfügbarkeitszeitraums',
    type: 'string',
    format: 'date',
    example: '2024-01-20'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Startzeit für teilweise Tagesverfügbarkeit (HH:MM)',
    example: '09:00'
  })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'Endzeit für teilweise Tagesverfügbarkeit (HH:MM)',
    example: '17:00'
  })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Ganztägige Verfügbarkeit',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;

  @ApiPropertyOptional({
    description: 'Wiederkehrende Verfügbarkeit',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({
    description: 'Wiederholungsmuster',
    enum: RecurrencePattern,
    example: RecurrencePattern.NONE,
    default: RecurrencePattern.NONE
  })
  @IsOptional()
  @IsEnum(RecurrencePattern)
  recurrencePattern?: RecurrencePattern;

  @ApiPropertyOptional({
    description: 'Wiederholungsintervall (z.B. alle 2 Wochen)',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  recurrenceInterval?: number;

  @ApiPropertyOptional({
    description: 'Wiederholungstage (0=Sonntag, 1=Montag, usw.)',
    type: [Number],
    example: [1, 2, 3, 4, 5]
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  recurrenceDays?: number[];

  @ApiPropertyOptional({
    description: 'Enddatum der Wiederholung',
    type: 'string',
    format: 'date',
    example: '2024-12-31'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  recurrenceEndDate?: Date;

  @ApiPropertyOptional({
    description: 'Grund für Abwesenheit',
    enum: AbsenceReason,
    example: AbsenceReason.VACATION
  })
  @IsOptional()
  @IsEnum(AbsenceReason)
  absenceReason?: AbsenceReason;

  @ApiPropertyOptional({
    description: 'Detaillierte Begründung',
    example: 'Arzttermin am Vormittag'
  })
  @IsOptional()
  @IsString()
  reasonDescription?: string;

  @ApiPropertyOptional({
    description: 'Wöchentliche Verfügbarkeitszeiten',
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  @IsJSON()
  weeklyAvailability?: WeeklyAvailability;

  @ApiPropertyOptional({
    description: 'Maximale Stunden pro Tag',
    example: 8.0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHoursPerDay?: number;

  @ApiPropertyOptional({
    description: 'Maximale Stunden pro Woche',
    example: 40.0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxHoursPerWeek?: number;

  @ApiPropertyOptional({
    description: 'Bevorzugte Schichtarten',
    type: [String],
    example: ['F', 'S'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredShiftTypes?: string[];

  @ApiPropertyOptional({
    description: 'Ausgeschlossene Schichtarten',
    type: [String],
    example: ['N'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedShiftTypes?: string[];

  @ApiPropertyOptional({
    description: 'Bevorzugte Standorte',
    type: [String],
    example: ['location-uuid-1', 'location-uuid-2'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLocations?: string[];

  @ApiPropertyOptional({
    description: 'Ausgeschlossene Standorte',
    type: [String],
    example: ['location-uuid-3'],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedLocations?: string[];

  @ApiPropertyOptional({
    description: 'Prioritätsstufe (1-5, höher = wichtiger)',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priorityLevel?: number;

  @ApiPropertyOptional({
    description: 'Benötigt Genehmigung',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiPropertyOptional({
    description: 'Notfall',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;

  @ApiPropertyOptional({
    description: 'Betrifft Lohnabrechnung',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  affectsPayroll?: boolean;

  @ApiPropertyOptional({
    description: 'Dokumentation erforderlich',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  documentationRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Dokumentation bereitgestellt',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  documentationProvided?: boolean;

  @ApiPropertyOptional({
    description: 'Angehängte Dokumente (URLs oder IDs)',
    type: [String],
    example: [],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachedDocuments?: string[];

  @ApiPropertyOptional({
    description: 'Notizen',
    example: 'Zusätzliche Informationen'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Interne Notizen (nur für Manager sichtbar)',
    example: 'Interne Bemerkungen'
  })
  @IsOptional()
  @IsString()
  internalNotes?: string;
}