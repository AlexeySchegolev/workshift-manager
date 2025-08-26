import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    const user = this.userRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      // NOTE: In production, hash the password properly (e.g., bcrypt)
      passwordHash: createUserDto.password,
      role: createUserDto.role,
      status: createUserDto.status,
      phoneNumber: createUserDto.phoneNumber,
      profilePictureUrl: createUserDto.profilePictureUrl,
      emailVerified: createUserDto.emailVerified ?? false,
      twoFactorEnabled: createUserDto.twoFactorEnabled ?? false,
      preferences: createUserDto.preferences ?? {},
      permissions: createUserDto.permissions ?? [],
    });

    // Assign organizations if provided
    if (createUserDto.organizationIds && createUserDto.organizationIds.length > 0) {
      const organizations = await this.organizationRepository.find({ where: { id: In(createUserDto.organizationIds) } });
      if (organizations.length !== createUserDto.organizationIds.length) {
        throw new BadRequestException('One or more organizations not found');
      }
      user.organizations = organizations;
    }

    const saved = await this.userRepository.save(user);
    this.logger.log(`User created successfully with ID: ${saved.id}`);
    return saved;
  }

  async findAll(includeRelations: boolean = true): Promise<User[]> {
    this.logger.log('Retrieving all users');
    const options = includeRelations ? { relations: ['organizations'] } : {};
    return this.userRepository.find(options);
  }

  async findOne(id: string, includeRelations: boolean = true): Promise<User> {
    this.logger.log(`Retrieving user with ID: ${id}`);
    const options = includeRelations ? { where: { id }, relations: ['organizations'] } : { where: { id } };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    const user = await this.findOne(id, false);

    if (updateUserDto.password) {
      // NOTE: In production, hash the password properly (e.g., bcrypt)
      (updateUserDto as any).passwordHash = updateUserDto.password;
      delete (updateUserDto as any).password;
    }

    if (updateUserDto.organizationIds) {
      const organizations = await this.organizationRepository.find({ where: { id: In(updateUserDto.organizationIds) } });
      if (organizations.length !== updateUserDto.organizationIds.length) {
        throw new BadRequestException('One or more organizations not found');
      }
      (updateUserDto as any).organizations = organizations;
      delete (updateUserDto as any).organizationIds;
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
