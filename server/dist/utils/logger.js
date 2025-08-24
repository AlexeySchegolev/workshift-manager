"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggers = exports.loggerMiddleware = exports.logStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
}), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.prettyPrint());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({
    format: 'HH:mm:ss'
}), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
}));
const transports = [
    new winston_1.default.transports.Console({
        level: logLevel,
        format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat
    })
];
if (process.env.NODE_ENV === 'production') {
    const logDir = path_1.default.join(process.cwd(), 'logs');
    const fs = require('fs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'error.log'),
        level: 'error',
        format: logFormat,
        maxsize: 5242880,
        maxFiles: 5
    }), new winston_1.default.transports.File({
        filename: path_1.default.join(logDir, 'combined.log'),
        format: logFormat,
        maxsize: 5242880,
        maxFiles: 5
    }));
}
exports.logger = winston_1.default.createLogger({
    level: logLevel,
    format: logFormat,
    transports,
    exceptionHandlers: [
        new winston_1.default.transports.Console({
            format: consoleFormat
        })
    ],
    rejectionHandlers: [
        new winston_1.default.transports.Console({
            format: consoleFormat
        })
    ]
});
exports.logStream = {
    write: (message) => {
        exports.logger.info(message.trim());
    }
};
const loggerMiddleware = (req, res, next) => {
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
            exports.logger.warn('HTTP Request', logData);
        }
        else {
            exports.logger.info('HTTP Request', logData);
        }
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
exports.loggers = {
    database: (message, meta) => {
        exports.logger.info(`[DATABASE] ${message}`, meta);
    },
    api: (message, meta) => {
        exports.logger.info(`[API] ${message}`, meta);
    },
    service: (message, meta) => {
        exports.logger.info(`[SERVICE] ${message}`, meta);
    },
    auth: (message, meta) => {
        exports.logger.info(`[AUTH] ${message}`, meta);
    },
    error: (message, error, meta) => {
        exports.logger.error(`${message}`, {
            error: error?.message,
            stack: error?.stack,
            ...meta
        });
    }
};
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map