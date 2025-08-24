import winston from 'winston';
import path from 'path';

/**
 * Winston Logger-Konfiguration für die Schichtplanung-Anwendung
 */

// Log-Level basierend auf Umgebung
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Log-Format definieren
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console-Format für Development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Transports definieren
const transports: winston.transport[] = [
  // Console-Output
  new winston.transports.Console({
    level: logLevel,
    format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat
  })
];

// File-Transports für Production
if (process.env.NODE_ENV === 'production') {
  const logDir = path.join(process.cwd(), 'logs');
  
  // Stelle sicher, dass das logs-Verzeichnis existiert
  const fs = require('fs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  transports.push(
    // Error-Log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Combined-Log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// Logger erstellen
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports,
  // Uncaught Exceptions abfangen
  exceptionHandlers: [
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
  // Unhandled Promise Rejections abfangen
  rejectionHandlers: [
    new winston.transports.Console({
      format: consoleFormat
    })
  ]
});

// Stream für Morgan HTTP-Logger
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

/**
 * Logger-Middleware für Express
 */
export const loggerMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;
    
    const logData = {
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: req.get('User-Agent')
    };

    if (statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });

  next();
};

/**
 * Hilfsfunktionen für strukturiertes Logging
 */
export const loggers = {
  database: (message: string, meta?: any) => {
    logger.info(`[DATABASE] ${message}`, meta);
  },
  
  api: (message: string, meta?: any) => {
    logger.info(`[API] ${message}`, meta);
  },
  
  service: (message: string, meta?: any) => {
    logger.info(`[SERVICE] ${message}`, meta);
  },
  
  auth: (message: string, meta?: any) => {
    logger.info(`[AUTH] ${message}`, meta);
  },
  
  error: (message: string, error?: Error, meta?: any) => {
    logger.error(`${message}`, {
      error: error?.message,
      stack: error?.stack,
      ...meta
    });
  }
};

export default logger;