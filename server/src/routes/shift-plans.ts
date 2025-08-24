import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/database/database';
import { ShiftPlanningService } from '@/services/ShiftPlanningService';
import { 
  validateRequestBody, 
  validateQuery, 
  validateParams,
  GenerateShiftPlanSchema,
  ShiftPlanQuerySchema,
  UUIDSchema
} from '@/validation/schemas';
import { loggers } from '@/utils/logger';

const router = express.Router();

/**
 * POST /api/shift-plans/generate
 * Neuen Schichtplan generieren
 */
router.post('/generate', validateRequestBody(GenerateShiftPlanSchema), async (req: any, res: any) => {
  try {
    const generateRequest = req.validatedBody;
    
    loggers.api(`Schichtplan-Generierung gestartet`, generateRequest);
    
    const result = await ShiftPlanningService.generateShiftPlan(generateRequest);
    
    res.json({
      success: true,
      data: result,
      message: 'Schichtplan erfolgreich generiert'
    });
    
  } catch (error) {
    loggers.error('Fehler bei Schichtplan-Generierung', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler bei der Schichtplan-Generierung',
      details: (error as Error).message
    });
  }
});

/**
 * GET /api/shift-plans
 * Alle Schichtpläne abrufen mit Filterung
 */
router.get('/', validateQuery(ShiftPlanQuerySchema), async (req: any, res: any) => {
  try {
    const { page, limit, year, month, isFinalized, sortBy, sortOrder } = req.validatedQuery;
    
    // Base Query
    let query = 'SELECT * FROM shift_plans WHERE 1=1';
    const params: any[] = [];
    
    // Filter anwenden
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
    
    // Sortierung
    const validSortFields = ['year', 'month', 'created_at', 'updated_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
    
    // Paginierung
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    // Daten abrufen
    const stmt = db.prepare(query);
    const plans = stmt.all(...params) as any[];
    
    // Gesamtanzahl für Paginierung
    let countQuery = 'SELECT COUNT(*) as total FROM shift_plans WHERE 1=1';
    const countParams: any[] = [];
    
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
    
    const countStmt = db.prepare(countQuery);
    const { total } = countStmt.get(...countParams) as { total: number };
    
    // Daten transformieren
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
    
    loggers.api(`${plans.length} Schichtpläne abgerufen`, { 
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
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Schichtpläne', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Schichtpläne'
    });
  }
});

/**
 * GET /api/shift-plans/:year/:month
 * Schichtplan für bestimmten Monat abrufen
 */
router.get('/:year/:month', async (req: any, res: any) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        error: 'Ungültiges Jahr oder Monat'
      });
    }
    
    const stmt = db.prepare('SELECT * FROM shift_plans WHERE year = ? AND month = ?');
    const plan = stmt.get(year, month) as any;
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Schichtplan nicht gefunden'
      });
    }
    
    // Constraint-Verletzungen laden
    const violationsStmt = db.prepare(`
      SELECT * FROM constraint_violations 
      WHERE shift_plan_id = ? 
      ORDER BY type DESC, severity DESC
    `);
    const violations = violationsStmt.all(plan.id) as any[];
    
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
    
    loggers.api(`Schichtplan abgerufen: ${month}/${year}`, { planId: plan.id });
    
    res.json({
      success: true,
      data: transformedPlan
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen des Schichtplans', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen des Schichtplans'
    });
  }
});

/**
 * PUT /api/shift-plans/:id/finalize
 * Schichtplan finalisieren
 */
router.put('/:id/finalize', validateParams(UUIDSchema.pick({ id: true })), async (req: any, res: any) => {
  try {
    const { id } = req.validatedParams;
    
    // Prüfen ob Schichtplan existiert
    const checkStmt = db.prepare('SELECT id, year, month FROM shift_plans WHERE id = ?');
    const plan = checkStmt.get(id) as any;
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Schichtplan nicht gefunden'
      });
    }
    
    // Finalisieren
    const updateStmt = db.prepare('UPDATE shift_plans SET is_finalized = 1 WHERE id = ?');
    updateStmt.run(id);
    
    loggers.api(`Schichtplan finalisiert: ${plan.month}/${plan.year}`, { planId: id });
    
    res.json({
      success: true,
      message: 'Schichtplan erfolgreich finalisiert'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Finalisieren des Schichtplans', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Finalisieren des Schichtplans'
    });
  }
});

/**
 * DELETE /api/shift-plans/:id
 * Schichtplan löschen
 */
router.delete('/:id', validateParams(UUIDSchema.pick({ id: true })), async (req: any, res: any) => {
  try {
    const { id } = req.validatedParams;
    
    // Prüfen ob Schichtplan existiert
    const checkStmt = db.prepare('SELECT id, year, month, is_finalized FROM shift_plans WHERE id = ?');
    const plan = checkStmt.get(id) as any;
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Schichtplan nicht gefunden'
      });
    }
    
    // Finalisierte Pläne nicht löschen
    if (plan.is_finalized) {
      return res.status(400).json({
        success: false,
        error: 'Finalisierte Schichtpläne können nicht gelöscht werden'
      });
    }
    
    // Löschen (CASCADE löscht automatisch Constraint-Verletzungen und Zuweisungen)
    const deleteStmt = db.prepare('DELETE FROM shift_plans WHERE id = ?');
    deleteStmt.run(id);
    
    loggers.api(`Schichtplan gelöscht: ${plan.month}/${plan.year}`, { planId: id });
    
    res.json({
      success: true,
      message: 'Schichtplan erfolgreich gelöscht'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Löschen des Schichtplans', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Löschen des Schichtplans'
    });
  }
});

/**
 * GET /api/shift-plans/stats
 * Schichtplan-Statistiken
 */
router.get('/stats', async (req: any, res: any) => {
  try {
    const stats = {
      total: 0,
      finalized: 0,
      draft: 0,
      byYear: {} as Record<string, number>,
      recentPlans: [] as any[]
    };
    
    // Gesamtstatistiken
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM shift_plans');
    stats.total = (totalStmt.get() as { count: number }).count;
    
    const finalizedStmt = db.prepare('SELECT COUNT(*) as count FROM shift_plans WHERE is_finalized = 1');
    stats.finalized = (finalizedStmt.get() as { count: number }).count;
    stats.draft = stats.total - stats.finalized;
    
    // Nach Jahr
    const yearStmt = db.prepare(`
      SELECT year, COUNT(*) as count 
      FROM shift_plans 
      GROUP BY year 
      ORDER BY year DESC
    `);
    const yearResults = yearStmt.all() as { year: number; count: number }[];
    yearResults.forEach(row => {
      stats.byYear[row.year.toString()] = row.count;
    });
    
    // Neueste Pläne
    const recentStmt = db.prepare(`
      SELECT id, year, month, is_finalized, created_at 
      FROM shift_plans 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    const recentResults = recentStmt.all() as any[];
    stats.recentPlans = recentResults.map(plan => ({
      id: plan.id,
      year: plan.year,
      month: plan.month,
      isFinalized: Boolean(plan.is_finalized),
      createdAt: new Date(plan.created_at)
    }));
    
    loggers.api('Schichtplan-Statistiken abgerufen');
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Schichtplan-Statistiken', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Statistiken'
    });
  }
});

export default router;