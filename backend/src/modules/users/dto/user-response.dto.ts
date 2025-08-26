import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../../database/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    description: 'Eindeutige ID des Benutzers',
    example: 'uuid-string'
  })
  id: string;

  @ApiProperty({
    description: 'E-Mail-Adresse des Benutzers',
    example: 'max.mustermann@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'Vorname des Benutzers',
    example: 'Max'
  })
  firstName: string;

  @ApiProperty({
    description: 'Nachname des Benutzers',
    example: 'Mustermann'
  })
  lastName: string;

  @ApiProperty({
    description: 'Vollständiger Name des Benutzers',
    example: 'Max Mustermann'
  })
  fullName: string;

  @ApiProperty({
    description: 'Rolle des Benutzers',
    enum: UserRole,
    example: UserRole.EMPLOYEE
  })
  role: UserRole;

  @ApiProperty({
    description: 'Status des Benutzers',
    enum: UserStatus,
    example: UserStatus.ACTIVE
  })
  status: UserStatus;

  @ApiPropertyOptional({
    description: 'Telefonnummer',
    example: '+49 89 1234-567'
  })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'URL zum Profilbild',
    example: 'https://example.com/profile/image.jpg'
  })
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Letzter Login-Zeitpunkt',
    example: '2023-12-01T10:30:00Z'
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'E-Mail-Adresse wurde verifiziert',
    example: true
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Zwei-Faktor-Authentifizierung aktiviert',
    example: false
  })
  twoFactorEnabled: boolean;

  @ApiProperty({
    description: 'Benutzereinstellungen',
    example: { theme: 'dark', language: 'de' }
  })
  preferences: Record<string, any>;

  @ApiProperty({
    description: 'Benutzerberechtigungen',
    example: ['read:shifts', 'write:shifts']
  })
  permissions: string[];

  @ApiProperty({
    description: 'Liste der Organisationen des Benutzers',
    type: 'array',
    items: { type: 'string' },
    example: ['uuid-org-1', 'uuid-org-2']
  })
  organizationIds: string[];

  @ApiProperty({
    description: 'Ist der Benutzer aktiv',
    example: true
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Erstellungsdatum',
    example: '2023-01-15T08:00:00Z'
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Datum der letzten Aktualisierung',
    example: '2023-12-01T14:30:00Z'
  })
  updatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Löschdatum (falls gelöscht)',
    example: null
  })
  deletedAt?: Date;
}