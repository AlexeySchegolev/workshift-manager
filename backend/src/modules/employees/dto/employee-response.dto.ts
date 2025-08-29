import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus, ContractType } from '@/database/entities';
import { LocationResponseDto } from '../../locations/dto/location-response.dto';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';
import { EmployeeAvailabilityResponseDto } from './employee-availability-response.dto';

export class EmployeeResponseDto {
  @ApiProperty({
    description: 'Unique ID of the employee',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-string'
  })
  organizationId: string;

  @ApiProperty({
    description: 'Employee number',
    example: 'EMP001'
  })
  employeeNumber: string;

  @ApiProperty({
    description: 'Employee first name',
    example: 'Anna'
  })
  firstName: string;

  @ApiProperty({
    description: 'Employee last name',
    example: 'Schneider'
  })
  lastName: string;

  @ApiProperty({
    description: 'Full name of the employee',
    example: 'Anna Schneider'
  })
  fullName: string;

  @ApiPropertyOptional({
    description: 'Display name for UI (alias for fullName)',
    example: 'Anna Schneider'
  })
  displayName?: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'anna.schneider@dialyse-praxis.de'
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+49 89 1234-001'
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1985-03-15'
  })
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Hire date',
    example: '2020-01-15'
  })
  hireDate: Date;

  @ApiPropertyOptional({
    description: 'Termination date',
    example: '2023-12-31'
  })
  terminationDate?: Date;

  @ApiProperty({
    description: 'Employee status',
    enum: EmployeeStatus,
    example: EmployeeStatus.ACTIVE
  })
  status: EmployeeStatus;

  @ApiProperty({
    description: 'Contract type',
    enum: ContractType,
    example: ContractType.FULL_TIME
  })
  contractType: ContractType;

  @ApiProperty({
    description: 'Working hours per month',
    example: 160
  })
  hoursPerMonth: number;

  @ApiPropertyOptional({
    description: 'Working hours per week',
    example: 40
  })
  hoursPerWeek?: number;

  @ApiPropertyOptional({
    description: 'Hourly rate',
    example: 28.50
  })
  hourlyRate?: number;

  @ApiPropertyOptional({
    description: 'Overtime rate',
    example: 35.60
  })
  overtimeRate?: number;

  @ApiPropertyOptional({
    description: 'Location ID',
    example: 'uuid-string'
  })
  locationId?: string;

  @ApiPropertyOptional({
    description: 'Primary role ID',
    example: 'uuid-string'
  })
  primaryRoleId?: string;

  @ApiPropertyOptional({
    description: 'Supervisor ID',
    example: 'uuid-string'
  })
  supervisorId?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact name',
    example: 'Maria Schneider'
  })
  emergencyContactName?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact phone',
    example: '+49 89 1234-002'
  })
  emergencyContactPhone?: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: 'Musterstraße 123'
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'München'
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '80331'
  })
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Deutschland'
  })
  country?: string;

  @ApiProperty({
    description: 'Certifications',
    example: ['Nursing Training', 'First Aid']
  })
  certifications: string[];

  @ApiProperty({
    description: 'Skills',
    example: ['Patient Care', 'Teamwork']
  })
  skills: string[];

  @ApiProperty({
    description: 'Languages',
    example: ['German', 'English']
  })
  languages: string[];

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/profile.jpg'
  })
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Notes',
    example: 'Experienced employee specialized in dialysis'
  })
  notes?: string;

  @ApiProperty({
    description: 'Is the employee active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Is the employee available',
    example: true
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Years of service',
    example: 3
  })
  yearsOfService: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2020-01-15T10:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-06-15T14:30:00Z'
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'ID of the user who created the entry',
    example: 'uuid-string'
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'ID of the user who last updated the entry',
    example: 'uuid-string'
  })
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Deletion timestamp (Soft Delete)',
    example: '2023-12-31T23:59:59Z'
  })
  deletedAt?: Date;

  // Optional relations
  @ApiPropertyOptional({
    description: 'Location information',
    type: () => LocationResponseDto
  })
  location?: LocationResponseDto;

  @ApiPropertyOptional({
    description: 'Primary role information',
    type: () => RoleResponseDto
  })
  primaryRole?: RoleResponseDto;

  @ApiPropertyOptional({
    description: 'All roles of the employee',
    type: () => [RoleResponseDto]
  })
  roles?: RoleResponseDto[];

  @ApiPropertyOptional({
    description: 'Supervisor information',
    type: () => EmployeeResponseDto
  })
  supervisor?: EmployeeResponseDto;

  @ApiPropertyOptional({
    description: 'Subordinate employees',
    type: () => [EmployeeResponseDto]
  })
  subordinates?: EmployeeResponseDto[];

  @ApiPropertyOptional({
    description: 'Employee availability information',
    type: () => [EmployeeAvailabilityResponseDto]
  })
  availabilities?: EmployeeAvailabilityResponseDto[];
}