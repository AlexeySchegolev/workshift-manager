import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/database/entities/user.entity';

export class AuthUserDto {
  @ApiProperty({ 
    example: 'uuid-123',
    description: 'User unique identifier'
  })
  id: string;

  @ApiProperty({ 
    example: 'user@example.com',
    description: 'User email address'
  })
  email: string;

  @ApiProperty({ 
    example: 'John',
    description: 'User first name'
  })
  firstName: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'User last name'
  })
  lastName: string;

  @ApiProperty({ 
    enum: UserRole,
    example: UserRole.EMPLOYEE,
    description: 'User role in the system'
  })
  role: UserRole;

  @ApiProperty({ 
    example: '+1234567890',
    description: 'User phone number'
  })
  phoneNumber?: string;

  @ApiProperty({ 
    example: 'https://example.com/profile.jpg',
    description: 'User profile picture URL'
  })
  profilePictureUrl?: string;

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Organization ID' },
      name: { type: 'string', description: 'Organization name' }
    },
    description: 'User organization (simplified)',
    example: { id: 'org-uuid-1', name: 'Hospital Berlin' }
  })
  organization?: {
    id: string;
    name: string;
  };
}

export class AuthResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token'
  })
  access_token: string;

  @ApiProperty({ 
    type: AuthUserDto,
    description: 'Authenticated user information'
  })
  user: AuthUserDto;
}

export class RegisterResponseDto {
  @ApiProperty({ 
    example: 'User registered successfully',
    description: 'Success message'
  })
  message: string;

  @ApiProperty({ 
    type: AuthUserDto,
    description: 'Created user information'
  })
  user: AuthUserDto;
}