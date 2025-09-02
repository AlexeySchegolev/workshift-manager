import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, AuthUserDto, RegisterResponseDto } from './dto/auth-response.dto';
import { User, UserStatus, UserRole } from '../../database/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.log(`Validating user: ${email}`);
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      return null;
    }

    if (!user.isActive) {
      this.logger.warn(`User account not active: ${email}`);
      throw new UnauthorizedException('User account is not active');
    }

    return user;
  }

  async login(user: User): Promise<AuthResponseDto> {
    this.logger.log(`User login: ${user.email}`);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationIds: user.organizations?.map(org => org.id) || [],
    };

    // Update last login timestamp
    await this.usersService.updateLastLogin(user.id);

    const authUser: AuthUserDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profilePictureUrl: user.profilePictureUrl,
      organizations: user.organizations?.map(org => ({
        id: org.id,
        name: org.name,
      })),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: authUser,
    };
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    this.logger.log(`User registration: ${registerDto.email}`);

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create user with default values for registration
    const userData = {
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: registerDto.password,
      role: registerDto.role || UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE, // Set as active since no email verification
      phoneNumber: registerDto.phoneNumber,
      organizationIds: registerDto.organizationIds,
      emailVerified: true, // Set as verified since no email verification process
      twoFactorEnabled: false,
      preferences: {},
      permissions: [],
    };

    const user = await this.usersService.create(userData);

    const authUser: AuthUserDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profilePictureUrl: user.profilePictureUrl,
      organizations: user.organizations?.map(org => ({
        id: org.id,
        name: org.name,
      })),
    };

    this.logger.log(`User registered successfully: ${user.email}`);

    return {
      message: 'User registered successfully',
      user: authUser,
    };
  }

  async getCurrentUser(userId: string): Promise<AuthUserDto> {
    this.logger.log(`Getting current user: ${userId}`);
    
    const user = await this.usersService.findOne(userId);
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profilePictureUrl: user.profilePictureUrl,
      organizations: user.organizations?.map(org => ({
        id: org.id,
        name: org.name,
      })),
    };
  }
}