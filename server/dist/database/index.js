"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbManager = exports.db = void 0;
const database_1 = require("./database");
const dbManager = database_1.DatabaseManager.getInstance();
exports.dbManager = dbManager;
exports.db = dbManager.getDatabase();
//# sourceMappingURL=index.js.map