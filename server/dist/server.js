"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("@/utils/logger");
const migrations_1 = require("@/database/migrations");
const seed_1 = require("@/database/seed");
const database_1 = require("@/database/database");
const employees_1 = __importDefault(require("@/routes/employees"));
const shift_plans_1 = __importDefault(require("@/routes/shift-plans"));
class SchichtplanungServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = parseInt(process.env.PORT || '3001', 10);
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddleware() {
        this.app.use((0, helmet_1.default)({
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
        this.app.use((0, cors_1.default)({
            origin: process.env.NODE_ENV === 'production'
                ? ['https://yourdomain.com']
                : ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: process.env.NODE_ENV === 'production' ? 100 : 1000,
            message: {
                success: false,
                error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use('/api/', limiter);
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use((0, morgan_1.default)('combined', { stream: logger_1.logStream }));
        this.app.use((req, res, next) => {
            req.id = Math.random().toString(36).substring(2, 15);
            res.setHeader('X-Request-ID', req.id);
            next();
        });
        this.app.use((req, res, next) => {
            req.startTime = Date.now();
            next();
        });
    }
    initializeRoutes() {
        this.app.get('/health', (req, res) => {
            const dbStats = database_1.dbManager.getStats();
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
        this.app.get('/api', (req, res) => {
            res.json({
                success: true,
                message: 'Schichtplanung API',
                version: '1.0.0',
                endpoints: {
                    employees: '/api/employees',
                    locations: '/api/locations',
                    'shift-rules': '/api/shift-rules',
                    'shift-plans': '/api/shift-plans',
                    statistics: '/api/statistics'
                },
                documentation: '/api/docs'
            });
        });
        this.app.use('/api/employees', employees_1.default);
        this.app.use('/api/shift-plans', shift_plans_1.default);
        this.app.get('/api/test', (req, res) => {
            res.json({
                success: true,
                message: 'API funktioniert!',
                timestamp: new Date().toISOString()
            });
        });
        this.app.use('/api/*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'API-Endpunkt nicht gefunden',
                path: req.path,
                method: req.method
            });
        });
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Schichtplanung Server läuft',
                api: '/api',
                health: '/health'
            });
        });
    }
    initializeErrorHandling() {
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Route nicht gefunden',
                path: req.originalUrl,
                method: req.method
            });
        });
        this.app.use((error, req, res, next) => {
            const requestId = req.id || 'unknown';
            const duration = req.startTime ? Date.now() - req.startTime : 0;
            logger_1.logger.error('Unbehandelter Fehler', {
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
            const errorResponse = {
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
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.logger.error('Unhandled Promise Rejection', {
                reason: reason?.message || reason,
                stack: reason?.stack
            });
        });
        process.on('uncaughtException', (error) => {
            logger_1.logger.error('Uncaught Exception', {
                error: error.message,
                stack: error.stack
            });
            this.gracefulShutdown('UNCAUGHT_EXCEPTION');
        });
    }
    async initializeDatabase() {
        try {
            logger_1.logger.info('Initialisiere Datenbank...');
            await (0, migrations_1.runMigrations)();
            await (0, seed_1.seedDatabase)();
            logger_1.logger.info('Datenbank erfolgreich initialisiert');
        }
        catch (error) {
            logger_1.logger.error('Fehler bei der Datenbankinitialisierung:', error);
            throw error;
        }
    }
    async start() {
        try {
            await this.initializeDatabase();
            const server = this.app.listen(this.port, () => {
                logger_1.logger.info(`🚀 Server läuft auf Port ${this.port}`);
                logger_1.logger.info(`📊 Health Check: http://localhost:${this.port}/health`);
                logger_1.logger.info(`🔗 API: http://localhost:${this.port}/api`);
                logger_1.logger.info(`🌍 Umgebung: ${process.env.NODE_ENV || 'development'}`);
            });
            const signals = ['SIGTERM', 'SIGINT'];
            signals.forEach(signal => {
                process.on(signal, () => {
                    logger_1.logger.info(`${signal} empfangen. Starte graceful shutdown...`);
                    server.close(() => {
                        this.gracefulShutdown(signal);
                    });
                });
            });
        }
        catch (error) {
            logger_1.logger.error('Fehler beim Starten des Servers:', error);
            process.exit(1);
        }
    }
    gracefulShutdown(signal) {
        logger_1.logger.info(`Graceful shutdown gestartet (${signal})`);
        try {
            database_1.dbManager.close();
            logger_1.logger.info('Datenbankverbindung geschlossen');
            logger_1.logger.info('Server erfolgreich heruntergefahren');
            process.exit(0);
        }
        catch (error) {
            logger_1.logger.error('Fehler beim Herunterfahren:', error);
            process.exit(1);
        }
    }
}
if (require.main === module) {
    const server = new SchichtplanungServer();
    server.start().catch(error => {
        logger_1.logger.error('Kritischer Fehler beim Serverstart:', error);
        process.exit(1);
    });
}
exports.default = SchichtplanungServer;
//# sourceMappingURL=server.js.map