import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsObject, MinLength } from 'class-validator';
import {UserRole, UserStatus} from "@/database/entities/user.entity";

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.smith@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Smith'
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePassword123!'
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.EMPLOYEE
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.PENDING
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1 555 123-4567'
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/profile/image.jpg'
  })
  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Email address verified',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Two-factor authentication enabled',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'User preferences',
    example: { theme: 'light', language: 'en' }
  })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'User permissions',
    example: ['read:shifts', 'write:shifts']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiPropertyOptional({
    description: 'Organization IDs to assign the user to',
    type: 'array',
    items: { type: 'string' },
    example: ['uuid-org-1', 'uuid-org-2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  organizationIds?: string[];
}