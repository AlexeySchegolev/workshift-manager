import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType, RoleStatus } from '../../../database/entities/role.entity';

export class RoleResponseDto {
  @ApiProperty({ 
    description: 'Eindeutige ID der Rolle', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  id: string;

  @ApiProperty({ 
    description: 'ID der Organisation', 
    example: '123e4567-e89b-12d3-a456-426614174001' 
  })
  organizationId: string;

  @ApiProperty({ 
    description: 'Name der Rolle', 
    example: 'Fachkraft Dialyse' 
  })
  name: string;

  @ApiPropertyOptional({ 
    description: 'Beschreibung der Rolle', 
    example: 'Qualifizierte Fachkraft für die Durchführung von Dialysebehandlungen' 
  })
  description?: string;

  @ApiProperty({ 
    description: 'Typ der Rolle', 
    enum: RoleType, 
    example: RoleType.SPECIALIST 
  })
  type: RoleType;

  @ApiProperty({ 
    description: 'Status der Rolle', 
    enum: RoleStatus, 
    example: RoleStatus.ACTIVE 
  })
  status: RoleStatus;

  @ApiPropertyOptional({ 
    description: 'Stundensatz in Euro', 
    example: 25.50 
  })
  hourlyRate?: number;

  @ApiPropertyOptional({ 
    description: 'Überstundensatz in Euro', 
    example: 31.88 
  })
  overtimeRate?: number;

  @ApiProperty({ 
    description: 'Mindest-Berufserfahrung in Monaten', 
    example: 12 
  })
  minExperienceMonths: number;

  @ApiProperty({ 
    description: 'Erforderliche Zertifizierungen', 
    example: ['Dialyse-Grundkurs', 'Hygiene-Schulung'] 
  })
  requiredCertifications: string[];

  @ApiProperty({ 
    description: 'Erforderliche Fähigkeiten', 
    example: ['Patientenbetreuung', 'Maschinenbedienung'] 
  })
  requiredSkills: string[];

  @ApiProperty({ 
    description: 'Berechtigungen', 
    example: ['view_patient_data', 'manage_dialysis_machines'] 
  })
  permissions: string[];

  @ApiProperty({ 
    description: 'Kann Nachtschichten arbeiten', 
    example: true 
  })
  canWorkNights: boolean;

  @ApiProperty({ 
    description: 'Kann Wochenendschichten arbeiten', 
    example: true 
  })
  canWorkWeekends: boolean;

  @ApiProperty({ 
    description: 'Kann an Feiertagen arbeiten', 
    example: false 
  })
  canWorkHolidays: boolean;

  @ApiProperty({ 
    description: 'Maximale aufeinanderfolgende Arbeitstage', 
    example: 6 
  })
  maxConsecutiveDays: number;

  @ApiProperty({ 
    description: 'Mindest-Ruhezeit zwischen Schichten in Stunden', 
    example: 11 
  })
  minRestHours: number;

  @ApiProperty({ 
    description: 'Maximale wöchentliche Arbeitszeit', 
    example: 40.0 
  })
  maxWeeklyHours: number;

  @ApiProperty({ 
    description: 'Maximale monatliche Arbeitszeit', 
    example: 160.0 
  })
  maxMonthlyHours: number;

  @ApiProperty({ 
    description: 'Prioritätslevel der Rolle (1-10, höher = wichtiger)', 
    example: 1 
  })
  priorityLevel: number;

  @ApiPropertyOptional({ 
    description: 'Farbcode für UI-Anzeige (Hex)', 
    example: '#1976d2' 
  })
  colorCode?: string;

  @ApiProperty({ 
    description: 'Rolle ist aktiv', 
    example: true 
  })
  isActive: boolean;

  @ApiPropertyOptional({ 
    description: 'Erstellt von (Benutzer-ID)', 
    example: '123e4567-e89b-12d3-a456-426614174002' 
  })
  createdBy?: string;

  @ApiPropertyOptional({ 
    description: 'Aktualisiert von (Benutzer-ID)', 
    example: '123e4567-e89b-12d3-a456-426614174003' 
  })
  updatedBy?: string;

  @ApiProperty({ 
    description: 'Erstellt am', 
    example: '2024-01-01T12:00:00Z' 
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Aktualisiert am', 
    example: '2024-02-01T12:00:00Z' 
  })
  updatedAt: Date;

  @ApiPropertyOptional({ 
    description: 'Gelöscht am', 
    example: null 
  })
  deletedAt?: Date;

  @ApiProperty({ 
    description: 'Rolle ist verfügbar (berechnet)', 
    example: true 
  })
  isAvailable: boolean;

  @ApiProperty({ 
    description: 'Anzeigename der Rolle (berechnet)', 
    example: 'Fachkraft Dialyse (specialist)' 
  })
  displayName: string;
}