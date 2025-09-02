import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional, IsBoolean, IsUUID, MinLength } from 'class-validator';
import {UserRole} from "@/database/entities/user.entity";

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
    description: 'Whether the user is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

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

  @ApiProperty({
    description: 'Organization ID to assign the user to',
    example: 'uuid-org-1'
  })
  @IsUUID()
  organizationId: string;
}