import { logger } from '../utils/logger';

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  maxConnections: number;
  idleTimeout: number;
  connectionTimeout: number;
}

export class ConfigValidationError extends Error {
  constructor(missingVars: string[]) {
    super(`Fehlende erforderliche Umgebungsvariablen: ${missingVars.join(', ')}`);
    this.name = 'ConfigValidationError';
  }
}

export function validateDatabaseConfig(): DatabaseConfig {
  const requiredEnvVars = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new ConfigValidationError(missingVars);
  }

  const port = parseInt(process.env.DATABASE_PORT!, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('DATABASE_PORT muss eine gültige Portnummer zwischen 1 und 65535 sein');
  }

  const maxConnections = process.env.DATABASE_MAX_CONNECTIONS 
    ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) 
    : 20;

  if (isNaN(maxConnections) || maxConnections < 1) {
    throw new Error('DATABASE_MAX_CONNECTIONS muss eine positive Zahl sein');
  }

  const idleTimeout = process.env.DATABASE_IDLE_TIMEOUT
    ? parseInt(process.env.DATABASE_IDLE_TIMEOUT, 10)
    : 30000;

  if (isNaN(idleTimeout) || idleTimeout < 0) {
    throw new Error('DATABASE_IDLE_TIMEOUT muss eine nicht-negative Zahl sein');
  }

  const connectionTimeout = process.env.DATABASE_CONNECTION_TIMEOUT
    ? parseInt(process.env.DATABASE_CONNECTION_TIMEOUT, 10)
    : 2000;

  if (isNaN(connectionTimeout) || connectionTimeout < 0) {
    throw new Error('DATABASE_CONNECTION_TIMEOUT muss eine nicht-negative Zahl sein');
  }

  return {
    host: process.env.DATABASE_HOST!,
    port: port,
    database: process.env.DATABASE_NAME!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    ssl: process.env.DATABASE_SSL === 'true',
    maxConnections: maxConnections,
    idleTimeout: idleTimeout,
    connectionTimeout: connectionTimeout
  };
}

export function validateTestDatabaseConfig(): DatabaseConfig {
  const requiredEnvVars = [
    'TEST_DATABASE_HOST',
    'TEST_DATABASE_PORT',
    'TEST_DATABASE_NAME',
    'TEST_DATABASE_USER',
    'TEST_DATABASE_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new ConfigValidationError(missingVars);
  }

  const port = parseInt(process.env.TEST_DATABASE_PORT!, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('TEST_DATABASE_PORT muss eine gültige Portnummer zwischen 1 und 65535 sein');
  }

  return {
    host: process.env.TEST_DATABASE_HOST!,
    port: port,
    database: process.env.TEST_DATABASE_NAME!,
    user: process.env.TEST_DATABASE_USER!,
    password: process.env.TEST_DATABASE_PASSWORD!,
    ssl: process.env.TEST_DATABASE_SSL === 'true',
    maxConnections: 5, // Geringere Pool-Größe für Tests
    idleTimeout: 10000,
    connectionTimeout: 1000
  };
}

export function validateEnvironmentConfig(): void {
  try {
    const dbConfig = validateDatabaseConfig();
    logger.info('Umgebungskonfiguration erfolgreich validiert', {
      database: dbConfig.database,
      host: dbConfig.host,
      port: dbConfig.port,
      maxConnections: dbConfig.maxConnections
    });
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      logger.error('Konfigurationsfehler:', error.message);
      logger.error('Bitte überprüfen Sie Ihre .env-Datei und stellen Sie sicher, dass alle erforderlichen Variablen gesetzt sind.');
      process.exit(1);
    }
    throw error;
  }
}