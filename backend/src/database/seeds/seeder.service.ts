import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Organization } from "../entities/organization.entity";
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

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('🌱 Starte Database Seeding...');

    try {
      // 1. Alle Tabellen leeren (in korrekter Reihenfolge wegen Foreign Keys)
      await this.clearDatabase();

      // 2. Seed-Daten einfügen (in korrekter Reihenfolge)
      const organization = await this.seedOrganizations();
      const user = await this.seedUsers(organization);
      const roles = await this.seedRoles(organization);
      const locations = await this.seedLocations(organization);
      await this.seedEmployees(organization, roles, locations);
      await this.seedShiftRules();

      this.logger.log('✅ Database Seeding erfolgreich abgeschlossen!');
    } catch (error) {
      this.logger.error('❌ Fehler beim Database Seeding:', error);
      throw error;
    }
  }

  private async clearDatabase(): Promise<void> {
    this.logger.log('🧹 Lösche bestehende Daten...');
    
    try {
      // Reihenfolge wichtig wegen Foreign Key Constraints
      await this.dataSource.query('TRUNCATE TABLE shift_assignments CASCADE');
      await this.dataSource.query('TRUNCATE TABLE constraint_violations CASCADE');
      await this.dataSource.query('TRUNCATE TABLE shift_plans CASCADE');
      await this.dataSource.query('TRUNCATE TABLE employee_roles CASCADE');
      await this.dataSource.query('TRUNCATE TABLE employees CASCADE');
      await this.dataSource.query('TRUNCATE TABLE roles CASCADE');
      await this.dataSource.query('TRUNCATE TABLE locations CASCADE');
      await this.dataSource.query('TRUNCATE TABLE user_organizations CASCADE');
      await this.dataSource.query('TRUNCATE TABLE users CASCADE');
      await this.dataSource.query('TRUNCATE TABLE organizations CASCADE');
      await this.dataSource.query('TRUNCATE TABLE shift_rules CASCADE');
      
      this.logger.log('✅ Datenbank erfolgreich geleert');
    } catch (error) {
      this.logger.error('❌ Fehler beim Leeren der Datenbank:', error);
      throw error;
    }
  }

  private async seedOrganizations(): Promise<Organization> {
    this.logger.log('🏢 Füge Organisationen hinzu...');
    
    try {
      const organizationRepo = this.dataSource.getRepository(Organization);
      const organizations = await organizationRepo.save(organizationsSeedData);
      
      this.logger.log(`✅ ${organizations.length} Organisationen erfolgreich hinzugefügt`);
      return organizations[0]; // Return first organization for reference
    } catch (error) {
      this.logger.error('❌ Fehler beim Hinzufügen der Organisationen:', error);
      throw error;
    }
  }

  private async seedUsers(organization: Organization): Promise<User> {
    this.logger.log('👤 Füge Benutzer hinzu...');
    
    try {
      const userRepo = this.dataSource.getRepository(User);
      
      // Update user data with organization reference
      const userData = usersSeedData.map(user => ({
        ...user,
        organizations: [organization]
      }));
      
      const users = await userRepo.save(userData);
      
      this.logger.log(`✅ ${users.length} Benutzer erfolgreich hinzugefügt`);
      return users[0]; // Return first user for reference
    } catch (error) {
      this.logger.error('❌ Fehler beim Hinzufügen der Benutzer:', error);
      throw error;
    }
  }

  private async seedRoles(organization: Organization): Promise<Role[]> {
    this.logger.log('🎭 Füge Rollen hinzu...');
    
    try {
      const roleRepo = this.dataSource.getRepository(Role);
      
      // Update role data with organization reference
      const roleData = rolesSeedData.map(role => ({
        ...role,
        organizationId: organization.id
      }));
      
      const roles = await roleRepo.save(roleData);
      
      this.logger.log(`✅ ${roles.length} Rollen erfolgreich hinzugefügt`);
      return roles;
    } catch (error) {
      this.logger.error('❌ Fehler beim Hinzufügen der Rollen:', error);
      throw error;
    }
  }

  private async seedLocations(organization: Organization): Promise<Location[]> {
    this.logger.log('📍 Füge Standorte hinzu...');
    
    try {
      const locationRepo = this.dataSource.getRepository(Location);
      
      // Update location data with organization reference
      const locationData = locationsSeedData.map(location => ({
        ...location,
        organizationId: organization.id
      }));
      
      const locations = await locationRepo.save(locationData);
      
      this.logger.log(`✅ ${locations.length} Standorte erfolgreich hinzugefügt`);
      return locations;
    } catch (error) {
      this.logger.error('❌ Fehler beim Hinzufügen der Standorte:', error);
      throw error;
    }
  }

  private async seedEmployees(organization: Organization, roles: Role[], locations: Location[]): Promise<void> {
    this.logger.log('👥 Füge Mitarbeiter hinzu...');
    
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
      
      this.logger.log(`✅ ${employees.length} Mitarbeiter erfolgreich hinzugefügt`);
    } catch (error) {
      this.logger.error('❌ Fehler beim Hinzufügen der Mitarbeiter:', error);
      throw error;
    }
  }

  private async seedShiftRules(): Promise<void> {
    this.logger.log('📋 Füge Schichtregeln hinzu...');
    
    try {
      const shiftRulesRepo = this.dataSource.getRepository(ShiftRules);
      const shiftRules = await shiftRulesRepo.save(shiftRulesSeedData);
      
      this.logger.log(`✅ ${shiftRules.length} Schichtregeln erfolgreich hinzugefügt`);
    } catch (error) {
      this.logger.error('❌ Fehler beim Hinzufügen der Schichtregeln:', error);
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
  }> {
    const organizationRepo = this.dataSource.getRepository(Organization);
    const userRepo = this.dataSource.getRepository(User);
    const roleRepo = this.dataSource.getRepository(Role);
    const locationRepo = this.dataSource.getRepository(Location);
    const employeeRepo = this.dataSource.getRepository(Employee);
    const shiftRulesRepo = this.dataSource.getRepository(ShiftRules);

    const [organizations, users, roles, locations, employees, shiftRules] = await Promise.all([
      organizationRepo.count(),
      userRepo.count(),
      roleRepo.count(),
      locationRepo.count(),
      employeeRepo.count(),
      shiftRulesRepo.count(),
    ]);

    return { organizations, users, roles, locations, employees, shiftRules };
  }
}