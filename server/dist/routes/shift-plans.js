"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("@/database/database");
const ShiftPlanningService_1 = require("@/services/ShiftPlanningService");
const schemas_1 = require("@/validation/schemas");
const logger_1 = require("@/utils/logger");
const router = express_1.default.Router();
router.post('/generate', (0, schemas_1.validateRequestBody)(schemas_1.GenerateShiftPlanSchema), async (req, res) => {
    try {
        const generateRequest = req.validatedBody;
        logger_1.loggers.api(`Schichtplan-Generierung gestartet`, generateRequest);
        const result = await ShiftPlanningService_1.ShiftPlanningService.generateShiftPlan(generateRequest);
        res.json({
            success: true,
            data: result,
            message: 'Schichtplan erfolgreich generiert'
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler bei Schichtplan-Generierung', error);
        res.status(500).json({
            success: false,
            error: 'Fehler bei der Schichtplan-Generierung',
            details: error.message
        });
    }
});
router.get('/', (0, schemas_1.validateQuery)(schemas_1.ShiftPlanQuerySchema), async (req, res) => {
    try {
        const { page, limit, year, month, isFinalized, sortBy, sortOrder } = req.validatedQuery;
        let query = 'SELECT * FROM shift_plans WHERE 1=1';
        const params = [];
        if (year) {
            query += ' AND year = ?';
            params.push(year);
        }
        if (month) {
            query += ' AND month = ?';
            params.push(month);
        }
        if (isFinalized !== undefined) {
            query += ' AND is_finalized = ?';
            params.push(isFinalized ? 1 : 0);
        }
        const validSortFields = ['year', 'month', 'created_at', 'updated_at'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
        query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const stmt = database_1.db.prepare(query);
        const plans = stmt.all(...params);
        let countQuery = 'SELECT COUNT(*) as total FROM shift_plans WHERE 1=1';
        const countParams = [];
        if (year) {
            countQuery += ' AND year = ?';
            countParams.push(year);
        }
        if (month) {
            countQuery += ' AND month = ?';
            countParams.push(month);
        }
        if (isFinalized !== undefined) {
            countQuery += ' AND is_finalized = ?';
            countParams.push(isFinalized ? 1 : 0);
        }
        const countStmt = database_1.db.prepare(countQuery);
        const { total } = countStmt.get(...countParams);
        const transformedPlans = plans.map(plan => ({
            id: plan.id,
            year: plan.year,
            month: plan.month,
            planData: JSON.parse(plan.plan_data),
            employeeAvailability: plan.employee_availability ? JSON.parse(plan.employee_availability) : undefined,
            statistics: plan.statistics ? JSON.parse(plan.statistics) : undefined,
            isFinalized: Boolean(plan.is_finalized),
            createdAt: new Date(plan.created_at),
            updatedAt: new Date(plan.updated_at)
        }));
        logger_1.loggers.api(`${plans.length} Schichtpläne abgerufen`, {
            filters: { year, month, isFinalized },
            pagination: { page, limit }
        });
        res.json({
            success: true,
            data: transformedPlans,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Abrufen der Schichtpläne', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen der Schichtpläne'
        });
    }
});
router.get('/:year/:month', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({
                success: false,
                error: 'Ungültiges Jahr oder Monat'
            });
        }
        const stmt = database_1.db.prepare('SELECT * FROM shift_plans WHERE year = ? AND month = ?');
        const plan = stmt.get(year, month);
        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Schichtplan nicht gefunden'
            });
        }
        const violationsStmt = database_1.db.prepare(`
      SELECT * FROM constraint_violations 
      WHERE shift_plan_id = ? 
      ORDER BY type DESC, severity DESC
    `);
        const violations = violationsStmt.all(plan.id);
        const transformedPlan = {
            id: plan.id,
            year: plan.year,
            month: plan.month,
            planData: JSON.parse(plan.plan_data),
            employeeAvailability: plan.employee_availability ? JSON.parse(plan.employee_availability) : undefined,
            statistics: plan.statistics ? JSON.parse(plan.statistics) : undefined,
            isFinalized: Boolean(plan.is_finalized),
            violations: {
                hard: violations.filter(v => v.type === 'hard').map(v => ({
                    id: v.id,
                    rule: v.rule,
                    message: v.message,
                    employeeId: v.employee_id,
                    date: v.date,
                    severity: v.severity,
                    isResolved: Boolean(v.is_resolved),
                    createdAt: new Date(v.created_at)
                })),
                soft: violations.filter(v => v.type === 'soft').map(v => ({
                    id: v.id,
                    rule: v.rule,
                    message: v.message,
                    employeeId: v.employee_id,
                    date: v.date,
                    severity: v.severity,
                    isResolved: Boolean(v.is_resolved),
                    createdAt: new Date(v.created_at)
                }))
            },
            createdAt: new Date(plan.created_at),
            updatedAt: new Date(plan.updated_at)
        };
        logger_1.loggers.api(`Schichtplan abgerufen: ${month}/${year}`, { planId: plan.id });
        res.json({
            success: true,
            data: transformedPlan
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Abrufen des Schichtplans', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen des Schichtplans'
        });
    }
});
router.put('/:id/finalize', (0, schemas_1.validateParams)(schemas_1.UUIDParamsSchema), async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const checkStmt = database_1.db.prepare('SELECT id, year, month FROM shift_plans WHERE id = ?');
        const plan = checkStmt.get(id);
        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Schichtplan nicht gefunden'
            });
        }
        const updateStmt = database_1.db.prepare('UPDATE shift_plans SET is_finalized = 1 WHERE id = ?');
        updateStmt.run(id);
        logger_1.loggers.api(`Schichtplan finalisiert: ${plan.month}/${plan.year}`, { planId: id });
        res.json({
            success: true,
            message: 'Schichtplan erfolgreich finalisiert'
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Finalisieren des Schichtplans', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Finalisieren des Schichtplans'
        });
    }
});
router.delete('/:id', (0, schemas_1.validateParams)(schemas_1.UUIDParamsSchema), async (req, res) => {
    try {
        const { id } = req.validatedParams;
        const checkStmt = database_1.db.prepare('SELECT id, year, month, is_finalized FROM shift_plans WHERE id = ?');
        const plan = checkStmt.get(id);
        if (!plan) {
            return res.status(404).json({
                success: false,
                error: 'Schichtplan nicht gefunden'
            });
        }
        if (plan.is_finalized) {
            return res.status(400).json({
                success: false,
                error: 'Finalisierte Schichtpläne können nicht gelöscht werden'
            });
        }
        const deleteStmt = database_1.db.prepare('DELETE FROM shift_plans WHERE id = ?');
        deleteStmt.run(id);
        logger_1.loggers.api(`Schichtplan gelöscht: ${plan.month}/${plan.year}`, { planId: id });
        res.json({
            success: true,
            message: 'Schichtplan erfolgreich gelöscht'
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Löschen des Schichtplans', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Löschen des Schichtplans'
        });
    }
});
router.get('/stats', async (req, res) => {
    try {
        const stats = {
            total: 0,
            finalized: 0,
            draft: 0,
            byYear: {},
            recentPlans: []
        };
        const totalStmt = database_1.db.prepare('SELECT COUNT(*) as count FROM shift_plans');
        stats.total = totalStmt.get().count;
        const finalizedStmt = database_1.db.prepare('SELECT COUNT(*) as count FROM shift_plans WHERE is_finalized = 1');
        stats.finalized = finalizedStmt.get().count;
        stats.draft = stats.total - stats.finalized;
        const yearStmt = database_1.db.prepare(`
      SELECT year, COUNT(*) as count 
      FROM shift_plans 
      GROUP BY year 
      ORDER BY year DESC
    `);
        const yearResults = yearStmt.all();
        yearResults.forEach(row => {
            stats.byYear[row.year.toString()] = row.count;
        });
        const recentStmt = database_1.db.prepare(`
      SELECT id, year, month, is_finalized, created_at 
      FROM shift_plans 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
        const recentResults = recentStmt.all();
        stats.recentPlans = recentResults.map(plan => ({
            id: plan.id,
            year: plan.year,
            month: plan.month,
            isFinalized: Boolean(plan.is_finalized),
            createdAt: new Date(plan.created_at)
        }));
        logger_1.loggers.api('Schichtplan-Statistiken abgerufen');
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        logger_1.loggers.error('Fehler beim Abrufen der Schichtplan-Statistiken', error);
        res.status(500).json({
            success: false,
            error: 'Fehler beim Abrufen der Statistiken'
        });
    }
});
exports.default = router;
//# sourceMappingURL=shift-plans.js.map