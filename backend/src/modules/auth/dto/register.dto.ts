import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches, IsUUID } from 'class-validator';
import { UserRole } from '@/database/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ 
    example: 'user@example.com',
    description: 'User email address'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'John',
    description: 'User first name'
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'User last name'
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ 
    example: 'Password123!',
    description: 'User password (minimum 8 characters, must contain uppercase, lowercase, number, and special character)'
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  password: string;

  @ApiProperty({ 
    enum: UserRole,
    example: UserRole.EMPLOYEE,
    description: 'User role in the system',
    required: false
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ 
    example: '+1234567890',
    description: 'User phone number',
    required: false
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ 
    example: 'Dialyse Zentrum Berlin',
    description: 'Organization name to be created for the user'
  })
  @IsString()
  @MinLength(2)
  organizationName: string;
}