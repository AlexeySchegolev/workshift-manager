import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus, ContractType } from '../../../database/entities/employee.entity';
import { LocationResponseDto } from '../../locations/dto/location-response.dto';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

export class EmployeeResponseDto {
  @ApiProperty({
    description: 'Eindeutige ID des Mitarbeiters',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({
    description: 'ID der Organisation',
    example: 'uuid-string'
  })
  organizationId: string;

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

  @ApiPropertyOptional({
    description: 'Geburtsdatum',
    example: '1985-03-15'
  })
  dateOfBirth?: Date;

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

  @ApiPropertyOptional({
    description: 'Name des Notfallkontakts',
    example: 'Maria Schneider'
  })
  emergencyContactName?: string;

  @ApiPropertyOptional({
    description: 'Telefonnummer des Notfallkontakts',
    example: '+49 89 1234-002'
  })
  emergencyContactPhone?: string;

  @ApiPropertyOptional({
    description: 'Adresse',
    example: 'Musterstraße 123'
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Stadt',
    example: 'München'
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'Postleitzahl',
    example: '80331'
  })
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Land',
    example: 'Deutschland'
  })
  country?: string;

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
    description: 'URL des Profilbilds',
    example: 'https://example.com/profile.jpg'
  })
  profilePictureUrl?: string;

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

  @ApiPropertyOptional({
    description: 'ID des Benutzers der den Eintrag erstellt hat',
    example: 'uuid-string'
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'ID des Benutzers der den Eintrag zuletzt geändert hat',
    example: 'uuid-string'
  })
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Löschzeitpunkt (Soft Delete)',
    example: '2023-12-31T23:59:59Z'
  })
  deletedAt?: Date;

  // Optional relations
  @ApiPropertyOptional({
    description: 'Standort-Informationen',
    type: () => LocationResponseDto
  })
  location?: LocationResponseDto;

  @ApiPropertyOptional({
    description: 'Hauptrolle-Informationen',
    type: () => RoleResponseDto
  })
  primaryRole?: RoleResponseDto;

  @ApiPropertyOptional({
    description: 'Alle Rollen des Mitarbeiters',
    type: () => [RoleResponseDto]
  })
  roles?: RoleResponseDto[];

  @ApiPropertyOptional({
    description: 'Vorgesetzter-Informationen',
    type: () => EmployeeResponseDto
  })
  supervisor?: EmployeeResponseDto;

  @ApiPropertyOptional({
    description: 'Untergebene Mitarbeiter',
    type: () => [EmployeeResponseDto]
  })
  subordinates?: EmployeeResponseDto[];
}