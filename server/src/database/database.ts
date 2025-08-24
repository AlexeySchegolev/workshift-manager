import Database from 'better-sqlite3';
import path from 'path';
import { logger } from '../utils/logger';

// Type alias für bessere TypeScript-Kompatibilität
export type DatabaseInstance = Database.Database;

/**
 * SQLite-Datenbank-Konfiguration und -Verwaltung
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database.Database;

  private constructor() {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'data', 'schichtplanung.db')
      : path.join(process.cwd(), 'data', 'schichtplanung.dev.db');

    // Stelle sicher, dass das data-Verzeichnis existiert
    const fs = require('fs');
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = 1000');
    this.db.pragma('temp_store = memory');

    logger.info(`Datenbank initialisiert: ${dbPath}`);
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public getDatabase(): DatabaseInstance {
    return this.db;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      logger.info('Datenbankverbindung geschlossen');
    }
  }

  /**
   * Führt eine Transaktion aus
   */
  public transaction<T>(fn: (db: Database.Database) => T): T {
    const transaction = this.db.transaction(fn);
    return transaction(this.db);
  }

  /**
   * Bereitet ein Statement vor
   */
  public prepare(sql: string): Database.Statement {
    return this.db.prepare(sql);
  }

  /**
   * Führt ein SQL-Statement aus
   */
  public exec(sql: string): void {
    this.db.exec(sql);
  }

  /**
   * Backup der Datenbank erstellen
   */
  public backup(backupPath: string): void {
    try {
      this.db.backup(backupPath);
      logger.info(`Backup erstellt: ${backupPath}`);
    } catch (error) {
      logger.error('Fehler beim Erstellen des Backups:', error);
      throw error;
    }
  }

  /**
   * Datenbankstatistiken abrufen
   */
  public getStats(): any {
    const stats = {
      pageCount: this.db.pragma('page_count', { simple: true }) as number,
      pageSize: this.db.pragma('page_size', { simple: true }) as number,
      cacheSize: this.db.pragma('cache_size', { simple: true }) as number,
      journalMode: this.db.pragma('journal_mode', { simple: true }) as string,
      foreignKeys: this.db.pragma('foreign_keys', { simple: true }) as number
    };

    return {
      ...stats,
      databaseSize: (stats.pageCount * stats.pageSize) / 1024 / 1024 // MB
    };
  }
}

// Singleton-Instanz exportieren
export const dbManager = DatabaseManager.getInstance();

// Wrapper-Funktion für bessere TypeScript-Kompatibilität
export function getDb(): DatabaseInstance {
  return dbManager.getDatabase();
}

// Direkte Datenbankinstanz für Import-Kompatibilität
export const db = dbManager.getDatabase();