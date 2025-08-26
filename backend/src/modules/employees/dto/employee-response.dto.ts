import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus, ContractType } from '../../../database/entities/employee.entity';

export class EmployeeResponseDto {
  @ApiProperty({
    description: 'Eindeutige ID des Mitarbeiters',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({
    description: 'Mitarbeiternummer',
    example: 'EMP001'
  })
  employeeNumber: string;

  @ApiProperty({
    description: 'Vorname des Mitarbeiters',
    example: 'Anna'
  })
  firstName: string;

  @ApiProperty({
    description: 'Nachname des Mitarbeiters',
    example: 'Schneider'
  })
  lastName: string;

  @ApiProperty({
    description: 'Vollständiger Name des Mitarbeiters',
    example: 'Anna Schneider'
  })
  fullName: string;

  @ApiProperty({
    description: 'E-Mail-Adresse des Mitarbeiters',
    example: 'anna.schneider@dialyse-praxis.de'
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Telefonnummer',
    example: '+49 89 1234-001'
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Einstellungsdatum',
    example: '2020-01-15'
  })
  hireDate: Date;

  @ApiPropertyOptional({
    description: 'Kündigungsdatum',
    example: '2023-12-31'
  })
  terminationDate?: Date;

  @ApiProperty({
    description: 'Status des Mitarbeiters',
    enum: EmployeeStatus,
    example: EmployeeStatus.ACTIVE
  })
  status: EmployeeStatus;

  @ApiProperty({
    description: 'Vertragstyp',
    enum: ContractType,
    example: ContractType.FULL_TIME
  })
  contractType: ContractType;

  @ApiProperty({
    description: 'Arbeitsstunden pro Monat',
    example: 160
  })
  hoursPerMonth: number;

  @ApiPropertyOptional({
    description: 'Arbeitsstunden pro Woche',
    example: 40
  })
  hoursPerWeek?: number;

  @ApiPropertyOptional({
    description: 'Stundenlohn',
    example: 28.50
  })
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'Überstundenlohn',
    example: 35.60
  })
  overtimeRate?: number;

  @ApiPropertyOptional({
    description: 'ID des Standorts',
    example: 'uuid-string'
  })
  locationId?: string;

  @ApiPropertyOptional({
    description: 'ID der Hauptrolle',
    example: 'uuid-string'
  })
  primaryRoleId?: string;

  @ApiPropertyOptional({
    description: 'ID des Vorgesetzten',
    example: 'uuid-string'
  })
  supervisorId?: string;

  @ApiProperty({
    description: 'Zertifizierungen',
    example: ['Krankenpflege-Ausbildung', 'Erste Hilfe']
  })
  certifications: string[];

  @ApiProperty({
    description: 'Fähigkeiten',
    example: ['Patientenbetreuung', 'Teamarbeit']
  })
  skills: string[];

  @ApiProperty({
    description: 'Sprachen',
    example: ['Deutsch', 'Englisch']
  })
  languages: string[];

  @ApiPropertyOptional({
    description: 'Notizen',
    example: 'Erfahrener Mitarbeiter mit Spezialisierung auf Dialyse'
  })
  notes?: string;

  @ApiProperty({
    description: 'Ist der Mitarbeiter aktiv',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Ist der Mitarbeiter verfügbar',
    example: true
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Jahre im Dienst',
    example: 3
  })
  yearsOfService: number;

  @ApiProperty({
    description: 'Erstellungsdatum',
    example: '2020-01-15T10:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Letztes Änderungsdatum',
    example: '2023-06-15T14:30:00Z'
  })
  updatedAt: Date;

  // Optional relations
  @ApiPropertyOptional({
    description: 'Standort-Informationen'
  })
  location?: any;

  @ApiPropertyOptional({
    description: 'Hauptrolle-Informationen'
  })
  primaryRole?: any;

  @ApiPropertyOptional({
    description: 'Alle Rollen des Mitarbeiters'
  })
  roles?: any[];

  @ApiPropertyOptional({
    description: 'Vorgesetzter-Informationen'
  })
  supervisor?: any;

  @ApiPropertyOptional({
    description: 'Untergebene Mitarbeiter'
  })
  subordinates?: any[];
}