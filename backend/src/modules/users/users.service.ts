import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from "@/database/entities/user.entity";
import {Organization} from "@/database/entities/organization.entity";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user: ${createUserDto.email}`);

    // Check if user with email already exists
    const existingUser = await this.findByEmail(createUserDto.email, false);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    // Validate organization exists
    const organization = await this.organizationRepository.findOne({ where: { id: createUserDto.organizationId } });
    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    const user = this.userRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      passwordHash: hashedPassword,
      role: createUserDto.role,
      isActive: createUserDto.isActive ?? true,
      phoneNumber: createUserDto.phoneNumber,
      profilePictureUrl: createUserDto.profilePictureUrl,
      organizationId: createUserDto.organizationId,
    });

    const saved = await this.userRepository.save(user);
    this.logger.log(`User created successfully with ID: ${saved.id}`);
    return saved;
  }

  async findAll(includeRelations: boolean = true): Promise<User[]> {
    this.logger.log('Retrieving all users');
    const options = includeRelations ? { relations: ['organization'] } : {};
    return this.userRepository.find(options);
  }

  async findOne(id: string, includeRelations: boolean = true): Promise<User> {
    this.logger.log(`Retrieving user with ID: ${id}`);
    const options = includeRelations ? { where: { id }, relations: ['organization'] } : { where: { id } };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string, includeRelations: boolean = true): Promise<User | null> {
    this.logger.log(`Retrieving user with email: ${email}`);
    const options = includeRelations ? { where: { email }, relations: ['organization'] } : { where: { email } };
    return this.userRepository.findOne(options);
  }

  async updateLastLogin(id: string): Promise<void> {
    this.logger.log(`Updating last login for user with ID: ${id}`);
    await this.userRepository.update(id, { 
      lastLoginAt: new Date() 
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    const user = await this.findOne(id, false);

    if (updateUserDto.password) {
      const saltRounds = 12;
      (updateUserDto as any).passwordHash = await bcrypt.hash(updateUserDto.password, saltRounds);
      delete (updateUserDto as any).password;
    }

    if (updateUserDto.organizationId) {
      const organization = await this.organizationRepository.findOne({ where: { id: updateUserDto.organizationId } });
      if (!organization) {
        throw new BadRequestException('Organization not found');
      }
    }

    await this.userRepository.save({ ...user, ...updateUserDto });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`);
    const user = await this.findOne(id, false);
    await this.userRepository.remove(user);
    this.logger.log(`User with ID ${id} deleted successfully`);
  }
}
