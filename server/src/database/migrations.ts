import { readFileSync } from 'fs';
import path from 'path';
import { db } from './database';

/**
 * Datenbank-Migrations-System
 */
export class MigrationManager {
  private static readonly MIGRATION_TABLE = 'schema_migrations';

  /**
   * Initialisiert das Migrations-System
   */
  public static init(): void {
    // Migrations-Tabelle erstellen falls sie nicht existiert
    db.exec(`
      CREATE TABLE IF NOT EXISTS ${this.MIGRATION_TABLE} (
        version TEXT PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  /**
   * Führt alle ausstehenden Migrationen aus
   */
  public static async runMigrations(): Promise<void> {
    this.init();

    const appliedMigrations = this.getAppliedMigrations();
    console.log(`Bereits angewendete Migrationen: ${appliedMigrations.length}`);

    // Schema-Migration (Initial)
    if (!appliedMigrations.includes('001_initial_schema')) {
      await this.runSchemaMigration();
      this.markMigrationAsApplied('001_initial_schema');
      console.log('✓ Initial Schema Migration angewendet');
    }

    // Rollen-Migration
    if (!appliedMigrations.includes('002_add_roles_table')) {
      await this.runRolesMigration();
      this.markMigrationAsApplied('002_add_roles_table');
      console.log('✓ Rollen-Tabellen Migration angewendet');
    }

    // Schichtregeln-Konfiguration Migration
    if (!appliedMigrations.includes('003_add_shift_rules_configuration')) {
      await this.runShiftRulesConfigurationMigration();
      this.markMigrationAsApplied('003_add_shift_rules_configuration');
      console.log('✓ Schichtregeln-Konfiguration Migration angewendet');
    }

    // Location Integer ID Migration
    if (!appliedMigrations.includes('004_update_locations_to_integer_id')) {
      await this.runLocationIntegerIdMigration();
      this.markMigrationAsApplied('004_update_locations_to_integer_id');
      console.log('✓ Location Integer ID Migration angewendet');
    }

    console.log('Alle Migrationen erfolgreich angewendet');
  }

  /**
   * Führt die initiale Schema-Migration aus
   */
  private static async runSchemaMigration(): Promise<void> {
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schemaSql = readFileSync(schemaPath, 'utf8');
      
      // Schema direkt ausführen (SQLite kann mehrere Statements auf einmal verarbeiten)
      db.exec(schemaSql);

    } catch (error) {
      console.error('Fehler beim Ausführen der Schema-Migration:', error);
      throw error;
    }
  }

  /**
   * Führt die Rollen-Migration aus
   */
  private static async runRolesMigration(): Promise<void> {
    try {
      const migrationPath = path.join(__dirname, 'migrations', '002_add_roles_table.sql');
      const migrationSql = readFileSync(migrationPath, 'utf8');
      
      // Migration ausführen
      db.exec(migrationSql);

    } catch (error) {
      console.error('Fehler beim Ausführen der Rollen-Migration:', error);
      throw error;
    }
  }

  /**
   * Führt die Schichtregeln-Konfiguration Migration aus
   */
  private static async runShiftRulesConfigurationMigration(): Promise<void> {
    try {
      const migrationPath = path.join(__dirname, 'migrations', '003_add_shift_rules_configuration.sql');
      const migrationSql = readFileSync(migrationPath, 'utf8');
      
      // Migration ausführen
      db.exec(migrationSql);

    } catch (error) {
      console.error('Fehler beim Ausführen der Schichtregeln-Konfiguration Migration:', error);
      throw error;
    }
  }

  /**
   * Führt die Location Integer ID Migration aus
   */
  private static async runLocationIntegerIdMigration(): Promise<void> {
    try {
      const migrationPath = path.join(__dirname, 'migrations', '004_update_locations_to_integer_id.sql');
      const migrationSql = readFileSync(migrationPath, 'utf8');
      
      // Migration ausführen
      db.exec(migrationSql);

    } catch (error) {
      console.error('Fehler beim Ausführen der Location Integer ID Migration:', error);
      throw error;
    }
  }

  /**
   * Ruft alle angewendeten Migrationen ab
   */
  private static getAppliedMigrations(): string[] {
    try {
      const stmt = db.prepare(`SELECT version FROM ${this.MIGRATION_TABLE} ORDER BY applied_at`);
      const rows = stmt.all() as { version: string }[];
      return rows.map(row => row.version);
    } catch (error) {
      // Tabelle existiert noch nicht
      return [];
    }
  }

  /**
   * Markiert eine Migration als angewendet
   */
  private static markMigrationAsApplied(version: string): void {
    const stmt = db.prepare(`
      INSERT INTO ${this.MIGRATION_TABLE} (version) 
      VALUES (?)
    `);
    stmt.run(version);
  }

  /**
   * Rollback einer Migration (für zukünftige Verwendung)
   */
  public static rollbackMigration(version: string): void {
    const stmt = db.prepare(`
      DELETE FROM ${this.MIGRATION_TABLE} 
      WHERE version = ?
    `);
    stmt.run(version);
    console.log(`Migration ${version} zurückgesetzt`);
  }

  /**
   * Zeigt den Status aller Migrationen
   */
  public static showMigrationStatus(): void {
    const appliedMigrations = this.getAppliedMigrations();
    const availableMigrations = ['001_initial_schema', '002_add_roles_table', '003_add_shift_rules_configuration', '004_update_locations_to_integer_id']; // Erweitere diese Liste für neue Migrationen

    console.log('\n=== Migrations-Status ===');
    for (const migration of availableMigrations) {
      const status = appliedMigrations.includes(migration) ? '✓ Angewendet' : '✗ Ausstehend';
      console.log(`${migration}: ${status}`);
    }
    console.log('========================\n');
  }

  /**
   * Überprüft die Datenbankintegrität
   */
  public static checkDatabaseIntegrity(): boolean {
    try {
      // Überprüfe, ob alle wichtigen Tabellen existieren
      const requiredTables = [
        'employees',
        'locations',
        'roles',
        'role_permissions',
        'role_requirements',
        'shift_rules',
        'shift_rules_configurations',
        'global_shift_rules',
        'configurable_shifts',
        'shift_day_types',
        'shift_role_requirements',
        'shift_plans',
        'shift_assignments',
        'constraint_violations',
        'audit_log'
      ];

      const stmt = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN (${requiredTables.map(() => '?').join(',')})
      `);
      
      const existingTables = stmt.all(...requiredTables) as { name: string }[];
      const existingTableNames = existingTables.map(t => t.name);

      const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));
      
      if (missingTables.length > 0) {
        console.error('Fehlende Tabellen:', missingTables);
        return false;
      }

      // Überprüfe Foreign Key Constraints
      const pragmaResult = db.pragma('foreign_key_check') as any[];
      if (pragmaResult.length > 0) {
        console.error('Foreign Key Constraint Verletzungen:', pragmaResult);
        return false;
      }

      console.log('✓ Datenbankintegrität erfolgreich überprüft');
      return true;

    } catch (error) {
      console.error('Fehler bei der Integritätsprüfung:', error);
      return false;
    }
  }

  /**
   * Erstellt ein Backup der Datenbank vor Migrationen
   */
  public static createBackup(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(process.cwd(), 'backups', `backup-${timestamp}.db`);
    
    // Stelle sicher, dass das backup-Verzeichnis existiert
    const fs = require('fs');
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    try {
      db.backup(backupPath);
      console.log(`✓ Backup erstellt: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Fehler beim Erstellen des Backups:', error);
      throw error;
    }
  }
}

/**
 * Hilfsfunktion zum Ausführen von Migrationen
 */
export const runMigrations = async (): Promise<void> => {
  console.log('Starte Datenbank-Migrationen...');
  
  try {
    // Backup erstellen
    MigrationManager.createBackup();
    
    // Migrationen ausführen
    await MigrationManager.runMigrations();
    
    // Integrität prüfen
    const isIntegrityOk = MigrationManager.checkDatabaseIntegrity();
    if (!isIntegrityOk) {
      throw new Error('Datenbankintegrität nach Migration fehlgeschlagen');
    }
    
    // Status anzeigen
    MigrationManager.showMigrationStatus();
    
  } catch (error) {
    console.error('Migration fehlgeschlagen:', error);
    throw error;
  }
};