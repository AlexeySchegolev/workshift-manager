import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsObject, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../../../database/entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'E-Mail-Adresse des Benutzers',
    example: 'max.mustermann@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Vorname des Benutzers',
    example: 'Max'
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Nachname des Benutzers',
    example: 'Mustermann'
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Neues Passwort des Benutzers (mindestens 8 Zeichen)',
    example: 'NewSecurePassword123!'
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({
    description: 'Rolle des Benutzers',
    enum: UserRole,
    example: UserRole.EMPLOYEE
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Status des Benutzers',
    enum: UserStatus,
    example: UserStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'Telefonnummer',
    example: '+49 89 1234-567'
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'URL zum Profilbild',
    example: 'https://example.com/profile/image.jpg'
  })
  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'E-Mail-Adresse wurde verifiziert',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Zwei-Faktor-Authentifizierung aktiviert',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Benutzereinstellungen',
    example: { theme: 'dark', language: 'de' }
  })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Benutzerberechtigungen',
    example: ['read:shifts', 'write:shifts', 'manage:users']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiPropertyOptional({
    description: 'IDs der Organisationen, denen der Benutzer zugewiesen werden soll',
    type: 'array',
    items: { type: 'string' },
    example: ['uuid-org-1', 'uuid-org-2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  organizationIds?: string[];
}