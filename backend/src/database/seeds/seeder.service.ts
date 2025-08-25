import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Location } from '../entities/location.entity';
import { Employee } from '../entities/employee.entity';
import { ShiftRules } from '../entities/shift-rules.entity';
import { locationsSeedData, employeesSeedData, shiftRulesSeedData } from './data';

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

      // 2. Seed-Daten einfügen
      await this.seedLocations();
      await this.seedShiftRules();
      await this.seedEmployees();

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
      await this.dataSource.query('TRUNCATE TABLE employees CASCADE');
      await this.dataSource.query('TRUNCATE TABLE locations CASCADE');
      await this.dataSource.query('TRUNCATE TABLE shift_rules CASCADE');
      
      this.logger.log('✅ Datenbank erfolgreich geleert');
    } catch (error) {
      this.logger.error('❌ Fehler beim Leeren der Datenbank:', error);
      throw error;
    }
  }

  private async seedLocations(): Promise<void> {
    this.logger.log('📍 Füge Standorte hinzu...');
    
    try {
      const locationRepo = this.dataSource.getRepository(Location);
      const locations = await locationRepo.save(locationsSeedData);
      
      this.logger.log(`✅ ${locations.length} Standorte erfolgreich hinzugefügt`);
    } catch (error) {
      this.logger.error('❌ Fehler beim Hinzufügen der Standorte:', error);
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

  private async seedEmployees(): Promise<void> {
    this.logger.log('👥 Füge Mitarbeiter hinzu...');
    
    try {
      const employeeRepo = this.dataSource.getRepository(Employee);
      const employees = await employeeRepo.save(employeesSeedData);
      
      this.logger.log(`✅ ${employees.length} Mitarbeiter erfolgreich hinzugefügt`);
    } catch (error) {
      this.logger.error('❌ Fehler beim Hinzufügen der Mitarbeiter:', error);
      throw error;
    }
  }

  async getSeededDataSummary(): Promise<{
    locations: number;
    employees: number;
    shiftRules: number;
  }> {
    const locationRepo = this.dataSource.getRepository(Location);
    const employeeRepo = this.dataSource.getRepository(Employee);
    const shiftRulesRepo = this.dataSource.getRepository(ShiftRules);

    const [locations, employees, shiftRules] = await Promise.all([
      locationRepo.count(),
      employeeRepo.count(),
      shiftRulesRepo.count(),
    ]);

    return { locations, employees, shiftRules };
  }
}