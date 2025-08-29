import { IsString, IsEnum, IsNumber, IsOptional, Min, Max, IsEmail, IsUUID, IsArray, IsDateString, IsDecimal } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus, ContractType } from '../../../database/entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-string'
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Employee number',
    example: 'EMP001'
  })
  @IsString()
  employeeNumber: string;

  @ApiProperty({
    description: 'Employee first name',
    example: 'Anna'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Employee last name',
    example: 'Schneider'
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'anna.schneider@dialyse-praxis.de'
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+49 89 1234-001'
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1985-03-15'
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Hire date',
    example: '2020-01-15'
  })
  @IsDateString()
  hireDate: string;

  @ApiPropertyOptional({
    description: 'Termination date',
    example: '2023-12-31'
  })
  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @ApiPropertyOptional({
    description: 'Employee status',
    enum: EmployeeStatus,
    example: EmployeeStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiPropertyOptional({
    description: 'Contract type',
    enum: ContractType,
    example: ContractType.FULL_TIME
  })
  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @ApiProperty({
    description: 'Working hours per month',
    example: 160,
    minimum: 1,
    maximum: 400
  })
  @IsNumber()
  @Min(1)
  @Max(400)
  hoursPerMonth: number;

  @ApiPropertyOptional({
    description: 'Working hours per week',
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
    description: 'Hourly rate',
    example: 25.50
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'Overtime rate',
    example: 32.50
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  overtimeRate?: number;

  @ApiPropertyOptional({
    description: 'Location ID',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({
    description: 'Primary role ID',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsUUID()
  primaryRoleId?: string;

  @ApiPropertyOptional({
    description: 'Supervisor ID',
    example: 'uuid-string'
  })
  @IsOptional()
  @IsUUID()
  supervisorId?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact name',
    example: 'Maria Schneider'
  })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact phone',
    example: '+49 89 1234-002'
  })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: 'Musterstraße 123'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'München'
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '80331'
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Deutschland'
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Certifications',
    example: ['Nursing Training', 'First Aid'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @ApiPropertyOptional({
    description: 'Skills',
    example: ['Patient Care', 'Teamwork'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({
    description: 'Languages',
    example: ['German', 'English'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/profile.jpg'
  })
  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Notes about the employee',
    example: 'Experienced employee specialized in dialysis'
  })
  @IsOptional()
  @IsString()
  notes?: string;
}