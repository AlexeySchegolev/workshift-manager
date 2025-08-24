import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { logger, logStream } from './utils/logger';
import { runMigrations } from './database/migrations';
import { seedDatabase } from './database/seed';
import { dbManager } from './database/database';

// Route-Imports
import employeeRoutes from './routes/employees';
import locationRoutes from './routes/locations';
import roleRoutes from './routes/roles';
import shiftRulesRoutes from './routes/shift-rules';
import shiftConfigurationsRoutes from './routes/shift-configurations';
import shiftPlanRoutes from './routes/shift-plans';

/**
 * Express-Server für die Schichtplanung-Anwendung
 */
class SchichtplanungServer {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialisiert alle Middleware
   */
  private initializeMiddleware(): void {
    // Security Middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false
    }));

    // CORS-Konfiguration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] // Produktions-Domain hier eintragen
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Rate Limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 Minuten
      max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Requests pro Window
      message: {
        success: false,
        error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Compression
    this.app.use(compression());

    // Body Parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(morgan('combined', { stream: logStream }));

    // Request ID für Tracing
    this.app.use((req: any, res: any, next: any) => {
      req.id = Math.random().toString(36).substring(2, 15);
      res.setHeader('X-Request-ID', req.id);
      next();
    });

    // Request Timing
    this.app.use((req: any, res: any, next: any) => {
      req.startTime = Date.now();
      next();
    });
  }

  /**
   * Initialisiert alle API-Routen
   */
  private initializeRoutes(): void {
    // Health Check
    this.app.get('/health', (req, res) => {
      const dbStats = dbManager.getStats();
      res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          connected: true,
          ...dbStats
        },
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    // API Info
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'Schichtplanung API',
        version: '1.0.0',
        endpoints: {
          employees: '/api/employees',
          locations: '/api/locations',
          roles: '/api/roles',
          'shift-rules': '/api/shift-rules',
          'shift-configurations': '/api/shift-configurations',
          'shift-plans': '/api/shift-plans',
          statistics: '/api/statistics'
        },
        documentation: '/api/docs'
      });
    });

    // API-Routen
    this.app.use('/api/employees', employeeRoutes);
    this.app.use('/api/locations', locationRoutes);
    this.app.use('/api/roles', roleRoutes);
    this.app.use('/api/shift-rules', shiftRulesRoutes);
    this.app.use('/api/shift-configurations', shiftConfigurationsRoutes);
    this.app.use('/api/shift-plans', shiftPlanRoutes);

    // Temporäre Test-Route
    this.app.get('/api/test', (req, res) => {
      res.json({
        success: true,
        message: 'API funktioniert!',
        timestamp: new Date().toISOString()
      });
    });

    // 404 Handler für API-Routen
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'API-Endpunkt nicht gefunden',
        path: req.path,
        method: req.method
      });
    });

    // Root-Route
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Schichtplanung Server läuft',
        api: '/api',
        health: '/health'
      });
    });
  }

  /**
   * Initialisiert Error-Handling
   */
  private initializeErrorHandling(): void {
    // 404 Handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route nicht gefunden',
        path: req.originalUrl,
        method: req.method
      });
    });

    // Global Error Handler
    this.app.use((error: any, req: any, res: any, next: any) => {
      const requestId = req.id || 'unknown';
      const duration = req.startTime ? Date.now() - req.startTime : 0;

      logger.error('Unbehandelter Fehler', {
        requestId,
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        duration: `${duration}ms`,
        body: req.body,
        query: req.query,
        params: req.params
      });

      // Fehlerdetails nur in Development zeigen
      const errorResponse: any = {
        success: false,
        error: 'Interner Serverfehler',
        requestId
      };

      if (process.env.NODE_ENV !== 'production') {
        errorResponse.details = {
          message: error.message,
          stack: error.stack
        };
      }

      res.status(error.status || 500).json(errorResponse);
    });

    // Unhandled Promise Rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      logger.error('Unhandled Promise Rejection', {
        reason: reason?.message || reason,
        stack: reason?.stack
      });
    });

    // Uncaught Exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
      });
      
      // Graceful shutdown
      this.gracefulShutdown('UNCAUGHT_EXCEPTION');
    });
  }

  /**
   * Initialisiert die Datenbank
   */
  private async initializeDatabase(): Promise<void> {
    try {
      logger.info('Initialisiere Datenbank...');
      
      // Migrationen ausführen
      await runMigrations();
      
      // Seed-Daten einfügen
      await seedDatabase();
      
      logger.info('Datenbank erfolgreich initialisiert');
    } catch (error) {
      logger.error('Fehler bei der Datenbankinitialisierung:', error);
      throw error;
    }
  }

  /**
   * Startet den Server
   */
  public async start(): Promise<void> {
    try {
      // Datenbank initialisieren
      await this.initializeDatabase();

      // Server starten
      const server = this.app.listen(this.port, () => {
        logger.info(`🚀 Server läuft auf Port ${this.port}`);
        logger.info(`📊 Health Check: http://localhost:${this.port}/health`);
        logger.info(`🔗 API: http://localhost:${this.port}/api`);
        logger.info(`🌍 Umgebung: ${process.env.NODE_ENV || 'development'}`);
      });

      // Graceful Shutdown Setup
      const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
      signals.forEach(signal => {
        process.on(signal, () => {
          logger.info(`${signal} empfangen. Starte graceful shutdown...`);
          server.close(() => {
            this.gracefulShutdown(signal);
          });
        });
      });

    } catch (error) {
      logger.error('Fehler beim Starten des Servers:', error);
      process.exit(1);
    }
  }

  /**
   * Graceful Shutdown
   */
  private gracefulShutdown(signal: string): void {
    logger.info(`Graceful shutdown gestartet (${signal})`);
    
    try {
      // Datenbankverbindung schließen
      dbManager.close();
      logger.info('Datenbankverbindung geschlossen');
      
      logger.info('Server erfolgreich heruntergefahren');
      process.exit(0);
    } catch (error) {
      logger.error('Fehler beim Herunterfahren:', error);
      process.exit(1);
    }
  }
}

// Server starten
if (require.main === module) {
  const server = new SchichtplanungServer();
  server.start().catch(error => {
    logger.error('Kritischer Fehler beim Serverstart:', error);
    process.exit(1);
  });
}

export default SchichtplanungServer;