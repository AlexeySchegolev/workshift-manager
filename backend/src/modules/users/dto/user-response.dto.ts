import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {UserRole} from "@/database/entities/user.entity";

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique user ID',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.smith@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John'
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Smith'
  })
  lastName: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Smith'
  })
  fullName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.EMPLOYEE
  })
  role: UserRole;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1 555 123-4567'
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/profile/image.jpg'
  })
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Last login timestamp',
    example: '2023-12-01T10:30:00Z'
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'Organization ID',
    example: 'uuid-org-1'
  })
  organizationId: string;

  @ApiProperty({
    description: 'Is user active',
    example: true
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Creation date',
    example: '2023-01-15T08:00:00Z'
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Last update date',
    example: '2023-12-01T14:30:00Z'
  })
  updatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Deletion date (if deleted)',
    example: null
  })
  deletedAt?: Date;
}