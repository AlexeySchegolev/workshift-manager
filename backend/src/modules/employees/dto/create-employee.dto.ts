import { IsString, IsEnum, IsNumber, IsOptional, Min, Max, IsEmail, IsUUID, IsArray, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-string'
  })
  @IsUUID()
  organizationId: string;


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
    description: 'Whether the employee is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;






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
    description: 'Additional role IDs',
    example: ['uuid-string-1', 'uuid-string-2'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds?: string[];


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
    description: 'Monthly work hours',
    example: 160.5
  })
  @IsOptional()
  @IsNumber()
  monthlyWorkHours?: number;

}