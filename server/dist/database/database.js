"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.dbManager = exports.DatabaseManager = void 0;
exports.getDb = getDb;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("@/utils/logger");
class DatabaseManager {
    constructor() {
        const dbPath = process.env.NODE_ENV === 'production'
            ? path_1.default.join(process.cwd(), 'data', 'schichtplanung.db')
            : path_1.default.join(process.cwd(), 'data', 'schichtplanung.dev.db');
        const fs = require('fs');
        const dataDir = path_1.default.dirname(dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        this.db = new better_sqlite3_1.default(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('foreign_keys = ON');
        this.db.pragma('synchronous = NORMAL');
        this.db.pragma('cache_size = 1000');
        this.db.pragma('temp_store = memory');
        logger_1.logger.info(`Datenbank initialisiert: ${dbPath}`);
    }
    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    getDatabase() {
        return this.db;
    }
    close() {
        if (this.db) {
            this.db.close();
            logger_1.logger.info('Datenbankverbindung geschlossen');
        }
    }
    transaction(fn) {
        const transaction = this.db.transaction(fn);
        return transaction(this.db);
    }
    prepare(sql) {
        return this.db.prepare(sql);
    }
    exec(sql) {
        this.db.exec(sql);
    }
    backup(backupPath) {
        try {
            this.db.backup(backupPath);
            logger_1.logger.info(`Backup erstellt: ${backupPath}`);
        }
        catch (error) {
            logger_1.logger.error('Fehler beim Erstellen des Backups:', error);
            throw error;
        }
    }
    getStats() {
        const stats = {
            pageCount: this.db.pragma('page_count', { simple: true }),
            pageSize: this.db.pragma('page_size', { simple: true }),
            cacheSize: this.db.pragma('cache_size', { simple: true }),
            journalMode: this.db.pragma('journal_mode', { simple: true }),
            foreignKeys: this.db.pragma('foreign_keys', { simple: true })
        };
        return {
            ...stats,
            databaseSize: (stats.pageCount * stats.pageSize) / 1024 / 1024
        };
    }
}
exports.DatabaseManager = DatabaseManager;
exports.dbManager = DatabaseManager.getInstance();
function getDb() {
    return exports.dbManager.getDatabase();
}
exports.db = exports.dbManager.getDatabase();
//# sourceMappingURL=database.js.map