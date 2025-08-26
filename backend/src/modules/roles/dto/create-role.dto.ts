import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsArray, IsUUID, Min, Max, Length } from 'class-validator';
import { RoleType, RoleStatus } from '../../../database/entities/role.entity';

export class CreateRoleDto {
  @ApiProperty({
    description: 'ID der Organisation',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Name der Rolle',
    example: 'Fachkraft Dialyse'
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Beschreibung der Rolle',
    example: 'Qualifizierte Fachkraft für die Durchführung von Dialysebehandlungen'
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({
    description: 'Typ der Rolle',
    enum: RoleType,
    example: RoleType.SPECIALIST
  })
  @IsEnum(RoleType)
  type: RoleType;

  @ApiPropertyOptional({
    description: 'Status der Rolle',
    enum: RoleStatus,
    example: RoleStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(RoleStatus)
  status?: RoleStatus;

  @ApiPropertyOptional({
    description: 'Stundensatz in Euro',
    example: 25.50
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'Überstundensatz in Euro',
    example: 31.88
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  overtimeRate?: number;

  @ApiPropertyOptional({
    description: 'Mindest-Berufserfahrung in Monaten',
    example: 12
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minExperienceMonths?: number;

  @ApiPropertyOptional({
    description: 'Erforderliche Zertifizierungen',
    example: ['Dialyse-Grundkurs', 'Hygiene-Schulung']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredCertifications?: string[];

  @ApiPropertyOptional({
    description: 'Erforderliche Fähigkeiten',
    example: ['Patientenbetreuung', 'Maschinenbedienung']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiPropertyOptional({
    description: 'Berechtigungen',
    example: ['view_patient_data', 'manage_dialysis_machines']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiPropertyOptional({
    description: 'Kann Nachtschichten arbeiten',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  canWorkNights?: boolean;

  @ApiPropertyOptional({
    description: 'Kann Wochenendschichten arbeiten',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  canWorkWeekends?: boolean;

  @ApiPropertyOptional({
    description: 'Kann an Feiertagen arbeiten',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  canWorkHolidays?: boolean;

  @ApiPropertyOptional({
    description: 'Maximale aufeinanderfolgende Arbeitstage',
    example: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(14)
  maxConsecutiveDays?: number;

  @ApiPropertyOptional({
    description: 'Mindest-Ruhezeit zwischen Schichten in Stunden',
    example: 11
  })
  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(24)
  minRestHours?: number;

  @ApiPropertyOptional({
    description: 'Maximale wöchentliche Arbeitszeit',
    example: 40.0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(60)
  maxWeeklyHours?: number;

  @ApiPropertyOptional({
    description: 'Maximale monatliche Arbeitszeit',
    example: 160.0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(250)
  maxMonthlyHours?: number;

  @ApiPropertyOptional({
    description: 'Prioritätslevel der Rolle (1-10, höher = wichtiger)',
    example: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priorityLevel?: number;

  @ApiPropertyOptional({
    description: 'Farbcode für UI-Anzeige (Hex)',
    example: '#1976d2'
  })
  @IsOptional()
  @IsString()
  @Length(7, 7)
  colorCode?: string;

  @ApiPropertyOptional({
    description: 'Rolle ist aktiv',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Erstellt von (Benutzer-ID)',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}