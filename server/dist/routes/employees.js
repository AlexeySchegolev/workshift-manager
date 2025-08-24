"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const database_1 = require("@/database/database");
const schemas_1 = require("@/validation/schemas");
const logger_1 = require("@/utils/logger");
const router = express_1.default.Router();
router.get('/', (0, schemas_1.validateQuery)(schemas_1.EmployeeQuerySchema), async (req, res) => {
    try {
        const { page, limit, role, location, isActive, sortBy, sortOrder } = req.validatedQuery;
        let query = 'SELECT * FROM employees WHERE 1=1';
        const params = [];
        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }
        if (location) {
            query += ' AND location = ?';
            params.push(location);
        }
        if (isActive !== undefined) {
            query += ' AND is_active = ?';
            params.push(isActive ? 1 : 0);
        }
        const validSortFields = ['name', 'role', 'clinic', 'hours_per_month', 'created_at'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
        query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const stmt = database_1.db.prepare(query);
        const employees = stmt.all(...params);
        let countQuery = 'SELECT COUNT(*) as total FROM employees WHERE 1=1';
        const countParams = [];
        if (role) {
            countQuery += ' AND role = ?';
            countParams.push(role);
        }
        if (location) {
            countQuery += ' AND location = ?';
            countParams.push(location);
        }
        if (isActive !== undefined) {
            countQuery += ' AND is_active = ?';
            countParams.push(isActive ? 1 : 0);
        }
        const countStmt = database_1.db.prepare(countQuery);
        const { total } = countStmt.get(...countParams);
        const transformedEmployees = employees.map(emp => ({
            id: emp.id,
            name: emp.name,
            role: emp.role,
            hoursPerMonth: emp.hours_per_month,
            hoursPerWeek: emp.hours_per_week,
            location: emp.location,
            createdAt: new Date(emp.created_at),
            updatedAt: new Date(emp.updated_at)
        }));
        const response = {
            data: transformedEmployees,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
        logger_1.loggers.api(`${employees.length} Mitarbeiter abgerufen`, {
            filters: { role, location, isActive },
            pagination: { page, limit }
        });
        res.json({
            success: true,
            ...response
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Abrufen der Mitarbeiter', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen der Mitarbeiter'
        });
    }
});
router.get('/:id', (0, schemas_1.validateParams)(schemas_1.UUIDParamsSchema), async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const stmt = database_1.db.prepare('SELECT * FROM employees WHERE id = ? AND is_active = 1');
        const employee = stmt.get(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: 'Mitarbeiter nicht gefunden'
            });
        }
        const transformedEmployee = {
            id: employee.id,
            name: employee.name,
            role: employee.role,
            hoursPerMonth: employee.hours_per_month,
            hoursPerWeek: employee.hours_per_week,
            location: employee.location,
            createdAt: new Date(employee.created_at),
            updatedAt: new Date(employee.updated_at)
        };
        logger_1.loggers.api(`Mitarbeiter abgerufen: ${employee.name}`, { id });
        res.json({
            success: true,
            data: transformedEmployee
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Abrufen des Mitarbeiters', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen des Mitarbeiters'
        });
    }
});
router.post('/', (0, schemas_1.validateRequestBody)(schemas_1.EmployeeCreateSchema), async (req, res) => {
    try {
        const employeeData = req.validatedBody;
        const id = (0, uuid_1.v4)();
        const stmt = database_1.db.prepare(`
      INSERT INTO employees (
        id, name, role, hours_per_month, hours_per_week, location, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
        stmt.run(id, employeeData.name, employeeData.role, employeeData.hoursPerMonth, employeeData.hoursPerWeek || null, employeeData.location || null);
        const selectStmt = database_1.db.prepare('SELECT * FROM employees WHERE id = ?');
        const newEmployee = selectStmt.get(id);
        const transformedEmployee = {
            id: newEmployee.id,
            name: newEmployee.name,
            role: newEmployee.role,
            hoursPerMonth: newEmployee.hours_per_month,
            hoursPerWeek: newEmployee.hours_per_week,
            location: newEmployee.location,
            createdAt: new Date(newEmployee.created_at),
            updatedAt: new Date(newEmployee.updated_at)
        };
        logger_1.loggers.api(`Neuer Mitarbeiter erstellt: ${employeeData.name}`, { id });
        res.status(201).json({
            success: true,
            data: transformedEmployee,
            message: 'Mitarbeiter erfolgreich erstellt'
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Erstellen des Mitarbeiters', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Erstellen des Mitarbeiters'
        });
    }
});
router.put('/:id', (0, schemas_1.validateParams)(schemas_1.UUIDParamsSchema), (0, schemas_1.validateRequestBody)(schemas_1.EmployeeUpdateSchema), async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const updateData = req.validatedBody;
        const checkStmt = database_1.db.prepare('SELECT id FROM employees WHERE id = ? AND is_active = 1');
        const exists = checkStmt.get(id);
        if (!exists) {
            return res.status(404).json({
                success: false,
                error: 'Mitarbeiter nicht gefunden'
            });
        }
        const updateFields = [];
        const updateValues = [];
        if (updateData.name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(updateData.name);
        }
        if (updateData.role !== undefined) {
            updateFields.push('role = ?');
            updateValues.push(updateData.role);
        }
        if (updateData.hoursPerMonth !== undefined) {
            updateFields.push('hours_per_month = ?');
            updateValues.push(updateData.hoursPerMonth);
        }
        if (updateData.hoursPerWeek !== undefined) {
            updateFields.push('hours_per_week = ?');
            updateValues.push(updateData.hoursPerWeek);
        }
        if (updateData.location !== undefined) {
            updateFields.push('location = ?');
            updateValues.push(updateData.location);
        }
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Keine Aktualisierungsdaten bereitgestellt'
            });
        }
        updateValues.push(id);
        const updateStmt = database_1.db.prepare(`
        UPDATE employees 
        SET ${updateFields.join(', ')} 
        WHERE id = ?
      `);
        updateStmt.run(...updateValues);
        const selectStmt = database_1.db.prepare('SELECT * FROM employees WHERE id = ?');
        const updatedEmployee = selectStmt.get(id);
        const transformedEmployee = {
            id: updatedEmployee.id,
            name: updatedEmployee.name,
            role: updatedEmployee.role,
            hoursPerMonth: updatedEmployee.hours_per_month,
            hoursPerWeek: updatedEmployee.hours_per_week,
            location: updatedEmployee.location,
            createdAt: new Date(updatedEmployee.created_at),
            updatedAt: new Date(updatedEmployee.updated_at)
        };
        logger_1.loggers.api(`Mitarbeiter aktualisiert: ${updatedEmployee.name}`, { id, updateFields });
        res.json({
            success: true,
            data: transformedEmployee,
            message: 'Mitarbeiter erfolgreich aktualisiert'
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Aktualisieren des Mitarbeiters', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Aktualisieren des Mitarbeiters'
        });
    }
});
router.delete('/:id', (0, schemas_1.validateParams)(schemas_1.UUIDParamsSchema), async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const checkStmt = database_1.db.prepare('SELECT name FROM employees WHERE id = ? AND is_active = 1');
        const employee = checkStmt.get(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: 'Mitarbeiter nicht gefunden'
            });
        }
        const deleteStmt = database_1.db.prepare('UPDATE employees SET is_active = 0 WHERE id = ?');
        deleteStmt.run(id);
        logger_1.loggers.api(`Mitarbeiter deaktiviert: ${employee.name}`, { id });
        res.json({
            success: true,
            message: 'Mitarbeiter erfolgreich deaktiviert'
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Deaktivieren des Mitarbeiters', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Deaktivieren des Mitarbeiters'
        });
    }
});
router.get('/stats', async (req, res) => {
    try {
        const stats = {
            total: 0,
            byRole: {},
            byLocation: {},
            averageHoursPerMonth: 0,
            active: 0,
            inactive: 0
        };
        const totalStmt = database_1.db.prepare('SELECT COUNT(*) as count FROM employees');
        stats.total = totalStmt.get().count;
        const activeStmt = database_1.db.prepare('SELECT COUNT(*) as count FROM employees WHERE is_active = 1');
        stats.active = activeStmt.get().count;
        stats.inactive = stats.total - stats.active;
        const roleStmt = database_1.db.prepare(`
      SELECT role, COUNT(*) as count 
      FROM employees 
      WHERE is_active = 1 
      GROUP BY role
    `);
        const roleResults = roleStmt.all();
        roleResults.forEach(row => {
            stats.byRole[row.role] = row.count;
        });
        const locationStmt = database_1.db.prepare(`
      SELECT location, COUNT(*) as count
      FROM employees
      WHERE is_active = 1 AND location IS NOT NULL
      GROUP BY location
    `);
        const locationResults = locationStmt.all();
        locationResults.forEach(row => {
            stats.byLocation[row.location] = row.count;
        });
        const avgStmt = database_1.db.prepare(`
      SELECT AVG(hours_per_month) as avg 
      FROM employees 
      WHERE is_active = 1 AND hours_per_month IS NOT NULL
    `);
        const avgResult = avgStmt.get();
        stats.averageHoursPerMonth = Math.round(avgResult.avg || 0);
        logger_1.loggers.api('Mitarbeiter-Statistiken abgerufen');
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Abrufen der Mitarbeiter-Statistiken', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen der Statistiken'
        });
    }
});
exports.default = router;
//# sourceMappingURL=employees.js.map