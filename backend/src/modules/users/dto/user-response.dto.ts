import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@/database/entities';

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

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE
  })
  status: UserStatus;

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
    description: 'Email address verified',
    example: true
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Two-factor authentication enabled',
    example: false
  })
  twoFactorEnabled: boolean;

  @ApiProperty({
    description: 'User preferences',
    example: { theme: 'dark', language: 'en' }
  })
  preferences: Record<string, any>;

  @ApiProperty({
    description: 'User permissions',
    example: ['read:shifts', 'write:shifts']
  })
  permissions: string[];

  @ApiProperty({
    description: 'User organization IDs list',
    type: 'array',
    items: { type: 'string' },
    example: ['uuid-org-1', 'uuid-org-2']
  })
  organizationIds: string[];

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