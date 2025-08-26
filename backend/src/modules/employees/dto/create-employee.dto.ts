import { IsString, IsEnum, IsNumber, IsOptional, Min, Max, IsEmail, IsUUID, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus, ContractType } from '../../../database/entities/employee.entity';

export class CreateEmployeeDto {
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

  @ApiProperty({
    description: 'Mitarbeiternummer',
    example: 'EMP001'
  })
  @IsString()
  employeeNumber: string;

  @ApiPropertyOptional({
    description: 'Telefonnummer',
    example: '+49 89 1234-001'
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Einstellungsdatum',
    example: '2020-01-15'
  })
  @IsDateString()
  hireDate: string;

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
    maximum: 200
  })
  @IsNumber()
  @Min(1)
  @Max(200)
  hoursPerMonth: number;

  @ApiPropertyOptional({
    description: 'Arbeitsstunden pro Woche',
    example: 40,
    minimum: 1,
    maximum: 50
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  hoursPerWeek?: number;

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
    description: 'Zertifizierungen',
    example: ['Krankenpflege-Ausbildung', 'Erste Hilfe']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({
    description: 'Fähigkeiten',
    example: ['Patientenbetreuung', 'Teamarbeit']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}