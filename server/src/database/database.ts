import { Pool, PoolClient, QueryResult } from 'pg';
import { logger } from '../utils/logger';
import { validateDatabaseConfig, validateTestDatabaseConfig, DatabaseConfig } from '../config/database';

/**
 * PostgreSQL-Datenbank-Konfiguration und -Verwaltung
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: Pool;
  private config: DatabaseConfig;

  private constructor(isTestEnvironment: boolean = false) {
    try {
      // Strikte Konfigurationsvalidierung ohne Fallback-Werte
      this.config = isTestEnvironment 
        ? validateTestDatabaseConfig() 
        : validateDatabaseConfig();

      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        ssl: this.config.ssl,
        max: this.config.maxConnections,
        idleTimeoutMillis: this.config.idleTimeout,
        connectionTimeoutMillis: this.config.connectionTimeout,
      });

      // Event-Handler für Pool-Events
      this.pool.on('error', (err) => {
        logger.error('Unerwarteter Fehler im PostgreSQL-Pool:', err);
      });

      this.pool.on('connect', (client) => {
        logger.debug('Neue PostgreSQL-Verbindung hergestellt');
      });

      this.pool.on('remove', (client) => {
        logger.debug('PostgreSQL-Verbindung aus Pool entfernt');
      });

      logger.info('PostgreSQL-Datenbank-Pool initialisiert', {
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        maxConnections: this.config.maxConnections
      });

    } catch (error) {
      logger.error('Fehler bei der Datenbank-Initialisierung:', error);
      throw error;
    }
  }

  public static getInstance(isTestEnvironment: boolean = false): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(isTestEnvironment);
    }
    return DatabaseManager.instance;
  }

  public async query(text: string, params?: any[]): Promise<QueryResult> {
    const startTime = Date.now();
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(text, params);
      const duration = Date.now() - startTime;
      
      logger.debug('SQL-Query ausgeführt', {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        duration: `${duration}ms`,
        rowCount: result.rowCount
      });
      
      return result;
    } catch (error) {
      logger.error('Fehler bei SQL-Query:', {
        query: text,
        params: params,
        error: error
      });
      throw error;
    } finally {
      client.release();
    }
  }

  public async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      logger.debug('Transaktion gestartet');
      
      const result = await fn(client);
      
      await client.query('COMMIT');
      logger.debug('Transaktion erfolgreich beendet');
      
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Transaktion zurückgerollt:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health_check');
      return result.rows.length === 1;
    } catch (error) {
      logger.error('Gesundheitsprüfung der Datenbank fehlgeschlagen:', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    logger.info('PostgreSQL-Pool geschlossen');
  }

  public getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }

  public getConfig(): DatabaseConfig {
    return { ...this.config };
  }

  /**
   * Führt ein SQL-Statement aus (für Migrations)
   */
  public async exec(sql: string): Promise<void> {
    await this.query(sql);
  }
}

// Singleton-Instanz exportieren
export const dbManager = DatabaseManager.getInstance(process.env.NODE_ENV === 'test');

// Wrapper-Funktion für Kompatibilität
export async function getDb(): Promise<DatabaseManager> {
  return dbManager;
}