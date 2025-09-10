import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationResponseDto } from '../../locations/dto/location-response.dto';
import { RoleResponseDto } from '../../roles/dto/role-response.dto';

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


}