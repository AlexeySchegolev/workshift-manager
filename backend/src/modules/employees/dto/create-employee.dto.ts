import { IsString, IsEnum, IsNumber, IsOptional, Min, Max, IsEmail, IsUUID, IsArray, IsDateString, IsDecimal } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus, ContractType } from '../../../database/entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'ID der Organisation',
    example: 'uuid-string'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Mitarbeiternummer',
    example: 'EMP001'
  })
  @IsString()
  employeeNumber: string;

  @ApiProperty({
    description: 'Vorname des Mitarbeiters',
    example: 'Anna'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Nachname des Mitarbeiters',
    example: 'Schneider'
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'E-Mail-Adresse des Mitarbeiters',
    example: 'anna.schneider@dialyse-praxis.de'
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Telefonnummer',
    example: '+49 89 1234-001'
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Geburtsdatum',
    example: '1985-03-15'
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Einstellungsdatum',
    example: '2020-01-15'
  })
  @IsDateString()
  hireDate: string;

  @ApiPropertyOptional({
    description: 'Kündigungsdatum',
    example: '2023-12-31'
  })
  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @ApiPropertyOptional({
    description: 'Status des Mitarbeiters',
    enum: EmployeeStatus,
    example: EmployeeStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiPropertyOptional({
    description: 'Vertragstyp',
    enum: ContractType,
    example: ContractType.FULL_TIME
  })
  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @ApiProperty({
    description: 'Arbeitsstunden pro Monat',
    example: 160,
    minimum: 1,
    maximum: 400
  })
  @IsNumber()
  @Min(1)
  @Max(400)
  hoursPerMonth: number;

  @ApiPropertyOptional({
    description: 'Arbeitsstunden pro Woche',
    example: 40,
    minimum: 1,
    maximum: 60
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  hoursPerWeek?: number;

  @ApiPropertyOptional({
    description: 'Stundenlohn',
    example: 25.50
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'Überstundenlohn',
    example: 32.50
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  overtimeRate?: number;

  @ApiPropertyOptional({
    description: 'ID des Standorts',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({
    description: 'ID der Hauptrolle',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsUUID()
  primaryRoleId?: string;

  @ApiPropertyOptional({
    description: 'ID des Vorgesetzten',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @ApiPropertyOptional({
    description: 'Name des Notfallkontakts',
    example: 'Maria Schneider'
  })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({
    description: 'Telefonnummer des Notfallkontakts',
    example: '+49 89 1234-002'
  })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({
    description: 'Adresse',
    example: 'Musterstraße 123'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Stadt',
    example: 'München'
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Postleitzahl',
    example: '80331'
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Land',
    example: 'Deutschland'
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Zertifizierungen',
    example: ['Krankenpflege-Ausbildung', 'Erste Hilfe'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({
    description: 'Fähigkeiten',
    example: ['Patientenbetreuung', 'Teamarbeit'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({
    description: 'Sprachen',
    example: ['Deutsch', 'Englisch'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({
    description: 'URL des Profilbilds',
    example: 'https://example.com/profile.jpg'
  })
  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Notizen zum Mitarbeiter',
    example: 'Erfahrener Mitarbeiter mit Spezialisierung auf Dialyse'
  })
  @IsOptional()
  @IsString()
  notes?: string;
}