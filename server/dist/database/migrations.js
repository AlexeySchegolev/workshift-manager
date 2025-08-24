"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = exports.MigrationManager = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
class MigrationManager {
    static init() {
        database_1.db.exec(`
      CREATE TABLE IF NOT EXISTS ${this.MIGRATION_TABLE} (
        version TEXT PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    static async runMigrations() {
        this.init();
        const appliedMigrations = this.getAppliedMigrations();
        console.log(`Bereits angewendete Migrationen: ${appliedMigrations.length}`);
        if (!appliedMigrations.includes('001_initial_schema')) {
            await this.runSchemaMigration();
            this.markMigrationAsApplied('001_initial_schema');
            console.log('✓ Initial Schema Migration angewendet');
        }
        console.log('Alle Migrationen erfolgreich angewendet');
    }
    static async runSchemaMigration() {
        try {
            const schemaPath = path_1.default.join(__dirname, 'schema.sql');
            const schemaSql = (0, fs_1.readFileSync)(schemaPath, 'utf8');
            const statements = schemaSql
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0);
            database_1.db.transaction(() => {
                for (const statement of statements) {
                    if (statement.trim()) {
                        database_1.db.exec(statement);
                    }
                }
            })();
        }
        catch (error) {
            console.error('Fehler beim Ausführen der Schema-Migration:', error);
            throw error;
        }
    }
    static getAppliedMigrations() {
        try {
            const stmt = database_1.db.prepare(`SELECT version FROM ${this.MIGRATION_TABLE} ORDER BY applied_at`);
            const rows = stmt.all();
            return rows.map(row => row.version);
        }
        catch (error) {
            return [];
        }
    }
    static markMigrationAsApplied(version) {
        const stmt = database_1.db.prepare(`
      INSERT INTO ${this.MIGRATION_TABLE} (version) 
      VALUES (?)
    `);
        stmt.run(version);
    }
    static rollbackMigration(version) {
        const stmt = database_1.db.prepare(`
      DELETE FROM ${this.MIGRATION_TABLE} 
      WHERE version = ?
    `);
        stmt.run(version);
        console.log(`Migration ${version} zurückgesetzt`);
    }
    static showMigrationStatus() {
        const appliedMigrations = this.getAppliedMigrations();
        const availableMigrations = ['001_initial_schema'];
        console.log('\n=== Migrations-Status ===');
        for (const migration of availableMigrations) {
            const status = appliedMigrations.includes(migration) ? '✓ Angewendet' : '✗ Ausstehend';
            console.log(`${migration}: ${status}`);
        }
        console.log('========================\n');
    }
    static checkDatabaseIntegrity() {
        try {
            const requiredTables = [
                'employees',
                'locations',
                'shift_rules',
                'shift_plans',
                'shift_assignments',
                'constraint_violations',
                'audit_log'
            ];
            const stmt = database_1.db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN (${requiredTables.map(() => '?').join(',')})
      `);
            const existingTables = stmt.all(...requiredTables);
            const existingTableNames = existingTables.map(t => t.name);
            const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));
            if (missingTables.length > 0) {
                console.error('Fehlende Tabellen:', missingTables);
                return false;
            }
            const pragmaResult = database_1.db.pragma('foreign_key_check');
            if (pragmaResult.length > 0) {
                console.error('Foreign Key Constraint Verletzungen:', pragmaResult);
                return false;
            }
            console.log('✓ Datenbankintegrität erfolgreich überprüft');
            return true;
        }
        catch (error) {
            console.error('Fehler bei der Integritätsprüfung:', error);
            return false;
        }
    }
    static createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path_1.default.join(process.cwd(), 'backups', `backup-${timestamp}.db`);
        const fs = require('fs');
        const backupDir = path_1.default.dirname(backupPath);
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        try {
            database_1.db.backup(backupPath);
            console.log(`✓ Backup erstellt: ${backupPath}`);
            return backupPath;
        }
        catch (error) {
            console.error('Fehler beim Erstellen des Backups:', error);
            throw error;
        }
    }
}
exports.MigrationManager = MigrationManager;
MigrationManager.MIGRATION_TABLE = 'schema_migrations';
const runMigrations = async () => {
    console.log('Starte Datenbank-Migrationen...');
    try {
        MigrationManager.createBackup();
        await MigrationManager.runMigrations();
        const isIntegrityOk = MigrationManager.checkDatabaseIntegrity();
        if (!isIntegrityOk) {
            throw new Error('Datenbankintegrität nach Migration fehlgeschlagen');
        }
        MigrationManager.showMigrationStatus();
    }
    catch (error) {
        console.error('Migration fehlgeschlagen:', error);
        throw error;
    }
};
exports.runMigrations = runMigrations;
//# sourceMappingURL=migrations.js.map