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
import {usersSeedData} from "@/database/seeds/data/users.seed";
import {rolesSeedData} from "@/database/seeds/data/roles.seed";
import {shiftsSeedData} from "@/database/seeds/data/shifts.seed";
import {EmployeeAbsence} from "@/database/entities/employee-absence.entity";
import {employeeAbsencesSeedData} from "@/database/seeds/data/employee-absences.seed";
import {ShiftPlan} from "@/database/entities/shift-plan.entity";
import {shiftPlansSeedData} from "@/database/seeds/data/shift-plans.seed";
import {ShiftRole} from "@/database/entities/shift-role.entity";
import {shiftRolesSeedData} from "@/database/seeds/data/shift-roles.seed";
import {ShiftWeekday} from "@/database/entities/shift-weekday.entity";
import {shiftWeekdaysSeedData} from "@/database/seeds/data/shift-weekdays.seed";
import {ShiftPlanDetail} from "@/database/entities/shift-plan-detail.entity";
import {shiftPlanDetailsSeedData} from "@/database/seeds/data/shift-plan-details.seed";

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
            const user = await this.seedUsers(organization);
            const roles = await this.seedRoles(organization);
            const locations = await this.seedLocations(organization);
            const employees = await this.seedEmployees(organization, roles, locations);
            const shifts = await this.seedShifts(organization, locations);
            await this.seedShiftRoles(shifts, roles);
            await this.seedShiftWeekdays(shifts);
            const shiftPlans = await this.seedShiftPlans(organization, locations, user);
            await this.seedShiftPlanDetails(shiftPlans, employees, shifts);
            await this.seedEmployeeAbsences(employees);

            this.logger.log('✅ Database Seeding completed successfully!');
        } catch (error) {
            this.logger.error('❌ Error during Database Seeding:', error);
            throw error;
        }
    }

    private async clearDatabase(): Promise<void> {
        this.logger.log('🧹 Clearing existing data...');

        try {
            // Check if tables exist before truncating
            const tables = [
                'shift_plan_details',
                'shift_plans',
                'shift_weekdays',
                'shift_roles',
                'shift_required_roles',
                'shifts',
                'employee_absences',
                'employee_roles',
                'employees',
                'roles',
                'locations',
                'users',
                'organizations'
            ];

            for (const table of tables) {
                const result = await this.dataSource.query(
                    `SELECT EXISTS (
                        SELECT FROM information_schema.tables
                        WHERE table_schema = 'public'
                        AND table_name = $1
                    )`,
                    [table]
                );

                if (result[0].exists) {
                    await this.dataSource.query(`TRUNCATE TABLE ${table} CASCADE`);
                    this.logger.log(`✅ Cleared table: ${table}`);
                } else {
                    this.logger.warn(`⚠️ Table does not exist: ${table}`);
                }
            }

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
                organizationId: organization.id
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

    private async seedEmployees(organization: Organization, roles: Role[], locations: Location[]): Promise<Employee[]> {
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
            return employees;
        } catch (error) {
            this.logger.error('❌ Error adding employees:', error);
            throw error;
        }
    }


    private async seedShifts(organization: Organization, locations: Location[]): Promise<Shift[]> {
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
            return shifts;
        } catch (error) {
            this.logger.error('❌ Error adding shifts:', error);
            throw error;
        }
    }

    private async seedShiftRoles(shifts: Shift[], roles: Role[]): Promise<void> {
        this.logger.log('👔 Adding shift roles...');

        try {
            const shiftRoleRepo = this.dataSource.getRepository(ShiftRole);

            // Update shift role data with proper references
            const shiftRoleData = shiftRolesSeedData.map(shiftRole => {
                const shiftIndex = parseInt(shiftRole.shiftId as string) - 1;
                const roleIndex = parseInt(shiftRole.roleId as string) - 1;

                return {
                    ...shiftRole,
                    shiftId: shifts[shiftIndex]?.id || shifts[0].id,
                    roleId: roles[roleIndex]?.id || roles[0].id,
                };
            });

            const shiftRoles = await shiftRoleRepo.save(shiftRoleData);

            this.logger.log(`✅ ${shiftRoles.length} shift roles added successfully`);
        } catch (error) {
            this.logger.error('❌ Error adding shift roles:', error);
            throw error;
        }
    }

    private async seedShiftWeekdays(shifts: Shift[]): Promise<void> {
        this.logger.log('📅 Adding shift weekdays...');

        try {
            const shiftWeekdayRepo = this.dataSource.getRepository(ShiftWeekday);

            // Update shift weekday data with proper references
            const shiftWeekdayData = shiftWeekdaysSeedData.map(shiftWeekday => {
                const shiftIndex = parseInt(shiftWeekday.shiftId as string) - 1;

                return {
                    ...shiftWeekday,
                    shiftId: shifts[shiftIndex]?.id || shifts[0].id,
                };
            });

            const shiftWeekdays = await shiftWeekdayRepo.save(shiftWeekdayData);

            this.logger.log(`✅ ${shiftWeekdays.length} shift weekdays added successfully`);
        } catch (error) {
            this.logger.error('❌ Error adding shift weekdays:', error);
            throw error;
        }
    }

    private async seedEmployeeAbsences(employees: Employee[]): Promise<void> {
        this.logger.log('🏖️ Adding employee absences...');

        try {
            const absenceRepo = this.dataSource.getRepository(EmployeeAbsence);

            // Update absence data with proper employee references
            const absenceData = employeeAbsencesSeedData.map(absence => {
                const employeeIndex = parseInt(absence.employeeId as string) - 1;

                return {
                    ...absence,
                    employeeId: employees[employeeIndex]?.id || employees[0].id,
                };
            });

            const absences = await absenceRepo.save(absenceData);

            this.logger.log(`✅ ${absences.length} employee absences added successfully`);
        } catch (error) {
            this.logger.error('❌ Error adding employee absences:', error);
            throw error;
        }
    }

    private async seedShiftPlans(organization: Organization, locations: Location[], user: User): Promise<ShiftPlan[]> {
        this.logger.log('📅 Adding shift plans...');

        try {
            const shiftPlanRepo = this.dataSource.getRepository(ShiftPlan);

            // Update shift plan data with proper references
            const shiftPlanData = shiftPlansSeedData.map(shiftPlan => {
                const locationIndex = parseInt(shiftPlan.locationId as string) - 1;

                return {
                    ...shiftPlan,
                    organizationId: organization.id,
                    locationId: locations[locationIndex]?.id || locations[0].id,
                    createdBy: user.id,
                    updatedBy: user.id
                };
            });

            const shiftPlans = await shiftPlanRepo.save(shiftPlanData);

            this.logger.log(`✅ ${shiftPlans.length} shift plans added successfully`);
            return shiftPlans;
        } catch (error) {
            this.logger.error('❌ Error adding shift plans:', error);
            throw error;
        }
    }

    private async seedShiftPlanDetails(shiftPlans: ShiftPlan[], employees: Employee[], shifts: Shift[]): Promise<void> {
        this.logger.log('📋 Adding shift plan details...');

        try {
            const shiftPlanDetailRepo = this.dataSource.getRepository(ShiftPlanDetail);

            // Update shift plan detail data with proper references
            const shiftPlanDetailData = shiftPlanDetailsSeedData.map(detail => {
                const shiftPlanIndex = parseInt(detail.shiftPlanId as string) - 1;
                const employeeIndex = parseInt(detail.employeeId as string) - 1;
                const shiftIndex = parseInt(detail.shiftId as string) - 1;

                return {
                    ...detail,
                    shiftPlanId: shiftPlans[shiftPlanIndex]?.id || shiftPlans[0].id,
                    employeeId: employees[employeeIndex]?.id || employees[0].id,
                    shiftId: shifts[shiftIndex]?.id || shifts[0].id,
                };
            });

            const shiftPlanDetails = await shiftPlanDetailRepo.save(shiftPlanDetailData);

            this.logger.log(`✅ ${shiftPlanDetails.length} shift plan details added successfully`);
        } catch (error) {
            this.logger.error('❌ Error adding shift plan details:', error);
            throw error;
        }
    }

    async getSeededDataSummary(): Promise<{
        organizations: number;
        users: number;
        roles: number;
        locations: number;
        employees: number;
        employeeAbsences: number;
        shifts: number;
        shiftRoles: number;
        shiftWeekdays: number;
        shiftPlans: number;
        shiftPlanDetails: number;
    }> {
        const organizationRepo = this.dataSource.getRepository(Organization);
        const userRepo = this.dataSource.getRepository(User);
        const roleRepo = this.dataSource.getRepository(Role);
        const locationRepo = this.dataSource.getRepository(Location);
        const employeeRepo = this.dataSource.getRepository(Employee);
        const absenceRepo = this.dataSource.getRepository(EmployeeAbsence);
        const shiftRepo = this.dataSource.getRepository(Shift);
        const shiftRoleRepo = this.dataSource.getRepository(ShiftRole);
        const shiftWeekdayRepo = this.dataSource.getRepository(ShiftWeekday);
        const shiftPlanRepo = this.dataSource.getRepository(ShiftPlan);
        const shiftPlanDetailRepo = this.dataSource.getRepository(ShiftPlanDetail);

        const [organizations, users, roles, locations, employees, employeeAbsences, shifts, shiftRoles, shiftWeekdays, shiftPlans, shiftPlanDetails] = await Promise.all([
            organizationRepo.count(),
            userRepo.count(),
            roleRepo.count(),
            locationRepo.count(),
            employeeRepo.count(),
            absenceRepo.count(),
            shiftRepo.count(),
            shiftRoleRepo.count(),
            shiftWeekdayRepo.count(),
            shiftPlanRepo.count(),
            shiftPlanDetailRepo.count(),
        ]);

        return {organizations, users, roles, locations, employees, employeeAbsences, shifts, shiftRoles, shiftWeekdays, shiftPlans, shiftPlanDetails};
    }
}