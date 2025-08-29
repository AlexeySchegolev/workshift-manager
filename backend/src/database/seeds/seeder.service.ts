import {Injectable, Logger} from '@nestjs/common';
import {InjectDataSource} from '@nestjs/typeorm';
import {DataSource} from 'typeorm';
import {Location} from '../entities/location.entity';
import {Shift} from '../entities/shift.entity';
import {Organization} from "../entities/organization.entity";
import {User} from "@/database/entities/user.entity";
import {organizationsSeedData} from "@/database/seeds/data/organizations.seed";
import {Role} from "@/database/entities/role.entity";
import {Employee} from "@/database/entities/employee.entity";
import {employeesSeedData} from "@/database/seeds/data/employees.seed";
import {locationsSeedData} from "@/database/seeds/data/locations.seed";
import {ShiftRules} from "@/database/entities/shift-rules.entity";
import {shiftRulesSeedData} from "@/database/seeds/data/shift-rules.seed";
import {usersSeedData} from "@/database/seeds/data/users.seed";
import {rolesSeedData} from "@/database/seeds/data/roles.seed";
import {shiftsSeedData} from "@/database/seeds/data/shifts.seed";

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
    }

    async seed(): Promise<void> {
        this.logger.log('🌱 Starting Database Seeding...');

        try {
            // 1. Clear all tables (in correct order due to Foreign Keys)
            await this.clearDatabase();

            // 2. Insert seed data (in correct order)
            const organization = await this.seedOrganizations();
            await this.seedUsers(organization);
            const roles = await this.seedRoles(organization);
            const locations = await this.seedLocations(organization);
            await this.seedEmployees(organization, roles, locations);
            await this.seedShiftRules();
            await this.seedShifts(organization, locations);

            this.logger.log('✅ Database Seeding completed successfully!');
        } catch (error) {
            this.logger.error('❌ Error during Database Seeding:', error);
            throw error;
        }
    }

    private async clearDatabase(): Promise<void> {
        this.logger.log('🧹 Clearing existing data...');

        try {
            // Order is important due to Foreign Key Constraints
            await this.dataSource.query('TRUNCATE TABLE shift_assignments CASCADE');
            await this.dataSource.query('TRUNCATE TABLE constraint_violations CASCADE');
            await this.dataSource.query('TRUNCATE TABLE shift_plans CASCADE');
            await this.dataSource.query('TRUNCATE TABLE shift_required_roles CASCADE');
            await this.dataSource.query('TRUNCATE TABLE shifts CASCADE');
            await this.dataSource.query('TRUNCATE TABLE employee_roles CASCADE');
            await this.dataSource.query('TRUNCATE TABLE employees CASCADE');
            await this.dataSource.query('TRUNCATE TABLE roles CASCADE');
            await this.dataSource.query('TRUNCATE TABLE locations CASCADE');
            await this.dataSource.query('TRUNCATE TABLE user_organizations CASCADE');
            await this.dataSource.query('TRUNCATE TABLE users CASCADE');
            await this.dataSource.query('TRUNCATE TABLE organizations CASCADE');
            await this.dataSource.query('TRUNCATE TABLE shift_rules CASCADE');

            this.logger.log('✅ Database cleared successfully');
        } catch (error) {
            this.logger.error('❌ Error clearing database:', error);
            throw error;
        }
    }

    private async seedOrganizations(): Promise<Organization> {
        this.logger.log('🏢 Adding organizations...');

        try {
            const organizationRepo = this.dataSource.getRepository(Organization);
            const organizations = await organizationRepo.save(organizationsSeedData);

            this.logger.log(`✅ ${organizations.length} organizations added successfully`);
            return organizations[0]; // Return first organization for reference
        } catch (error) {
            this.logger.error('❌ Error adding organizations:', error);
            throw error;
        }
    }

    private async seedUsers(organization: Organization): Promise<User> {
        this.logger.log('👤 Adding users...');

        try {
            const userRepo = this.dataSource.getRepository(User);

            // Update user data with organization reference
            const userData = usersSeedData.map(user => ({
                ...user,
                organizations: [organization]
            }));

            const users = await userRepo.save(userData);

            this.logger.log(`✅ ${users.length} users added successfully`);
            return users[0]; // Return first user for reference
        } catch (error) {
            this.logger.error('❌ Error adding users:', error);
            throw error;
        }
    }

    private async seedRoles(organization: Organization): Promise<Role[]> {
        this.logger.log('🎭 Adding roles...');

        try {
            const roleRepo = this.dataSource.getRepository(Role);

            // Update role data with organization reference
            const roleData = rolesSeedData.map(role => ({
                ...role,
                organizationId: organization.id
            }));

            const roles = await roleRepo.save(roleData);

            this.logger.log(`✅ ${roles.length} roles added successfully`);
            return roles;
        } catch (error) {
            this.logger.error('❌ Error adding roles:', error);
            throw error;
        }
    }

    private async seedLocations(organization: Organization): Promise<Location[]> {
        this.logger.log('📍 Adding locations...');

        try {
            const locationRepo = this.dataSource.getRepository(Location);

            // Update location data with organization reference
            const locationData = locationsSeedData.map(location => ({
                ...location,
                organizationId: organization.id
            }));

            const locations = await locationRepo.save(locationData);

            this.logger.log(`✅ ${locations.length} locations added successfully`);
            return locations;
        } catch (error) {
            this.logger.error('❌ Error adding locations:', error);
            throw error;
        }
    }

    private async seedEmployees(organization: Organization, roles: Role[], locations: Location[]): Promise<void> {
        this.logger.log('👥 Adding employees...');

        try {
            const employeeRepo = this.dataSource.getRepository(Employee);

            // Update employee data with proper references
            const employeeData = employeesSeedData.map((employee, index) => {
                const locationIndex = parseInt(employee.locationId as string) - 1;
                const roleIndex = parseInt(employee.primaryRoleId as string) - 1;

                return {
                    ...employee,
                    organizationId: organization.id,
                    locationId: locations[locationIndex]?.id || locations[0].id,
                    primaryRoleId: roles[roleIndex]?.id || roles[0].id,
                    roles: [roles[roleIndex] || roles[0]] // Assign primary role
                };
            });

            const employees = await employeeRepo.save(employeeData);

            this.logger.log(`✅ ${employees.length} employees added successfully`);
        } catch (error) {
            this.logger.error('❌ Error adding employees:', error);
            throw error;
        }
    }

    private async seedShiftRules(): Promise<void> {
        this.logger.log('📋 Adding shift rules...');

        try {
            const shiftRulesRepo = this.dataSource.getRepository(ShiftRules);
            const shiftRules = await shiftRulesRepo.save(shiftRulesSeedData);

            this.logger.log(`✅ ${shiftRules.length} shift rules added successfully`);
        } catch (error) {
            this.logger.error('❌ Error adding shift rules:', error);
            throw error;
        }
    }

    private async seedShifts(organization: Organization, locations: Location[]): Promise<void> {
        this.logger.log('⏰ Adding shifts...');

        try {
            const shiftRepo = this.dataSource.getRepository(Shift);

            // Update shift data with proper references
            const shiftData = shiftsSeedData.map(shift => {
                const locationIndex = parseInt(shift.locationId as string) - 1;

                return {
                    ...shift,
                    organizationId: organization.id,
                    locationId: locations[locationIndex]?.id || locations[0].id,
                };
            });

            const shifts = await shiftRepo.save(shiftData);

            this.logger.log(`✅ ${shifts.length} shifts added successfully`);
        } catch (error) {
            this.logger.error('❌ Error adding shifts:', error);
            throw error;
        }
    }

    async getSeededDataSummary(): Promise<{
        organizations: number;
        users: number;
        roles: number;
        locations: number;
        employees: number;
        shiftRules: number;
        shifts: number;
    }> {
        const organizationRepo = this.dataSource.getRepository(Organization);
        const userRepo = this.dataSource.getRepository(User);
        const roleRepo = this.dataSource.getRepository(Role);
        const locationRepo = this.dataSource.getRepository(Location);
        const employeeRepo = this.dataSource.getRepository(Employee);
        const shiftRulesRepo = this.dataSource.getRepository(ShiftRules);
        const shiftRepo = this.dataSource.getRepository(Shift);

        const [organizations, users, roles, locations, employees, shiftRules, shifts] = await Promise.all([
            organizationRepo.count(),
            userRepo.count(),
            roleRepo.count(),
            locationRepo.count(),
            employeeRepo.count(),
            shiftRulesRepo.count(),
            shiftRepo.count(),
        ]);

        return {organizations, users, roles, locations, employees, shiftRules, shifts};
    }
}