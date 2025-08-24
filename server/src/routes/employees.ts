import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/database/database';
import { Employee, ApiResponse, PaginatedResponse } from '@/types/interfaces';
import { 
  validateRequestBody, 
  validateQuery, 
  validateParams,
  EmployeeCreateSchema,
  EmployeeUpdateSchema,
  EmployeeQuerySchema,
  UUIDSchema
} from '@/validation/schemas';
import { loggers } from '@/utils/logger';

const router = express.Router();

/**
 * GET /api/employees
 * Alle Mitarbeiter abrufen mit Paginierung und Filterung
 */
router.get('/', validateQuery(EmployeeQuerySchema), async (req: any, res: any) => {
  try {
    const { page, limit, role, clinic, isActive, sortBy, sortOrder } = req.validatedQuery;
    
    // Base Query
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params: any[] = [];
    
    // Filter anwenden
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    
    if (clinic) {
      query += ' AND clinic = ?';
      params.push(clinic);
    }
    
    if (isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(isActive ? 1 : 0);
    }
    
    // Sortierung
    const validSortFields = ['name', 'role', 'clinic', 'hours_per_month', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    query += ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
    
    // Paginierung
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    // Daten abrufen
    const stmt = db.prepare(query);
    const employees = stmt.all(...params) as any[];
    
    // Gesamtanzahl für Paginierung
    let countQuery = 'SELECT COUNT(*) as total FROM employees WHERE 1=1';
    const countParams: any[] = [];
    
    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }
    if (clinic) {
      countQuery += ' AND clinic = ?';
      countParams.push(clinic);
    }
    if (isActive !== undefined) {
      countQuery += ' AND is_active = ?';
      countParams.push(isActive ? 1 : 0);
    }
    
    const countStmt = db.prepare(countQuery);
    const { total } = countStmt.get(...countParams) as { total: number };
    
    // Daten transformieren
    const transformedEmployees: Employee[] = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      hoursPerMonth: emp.hours_per_month,
      hoursPerWeek: emp.hours_per_week,
      clinic: emp.clinic,
      createdAt: new Date(emp.created_at),
      updatedAt: new Date(emp.updated_at)
    }));
    
    const response: PaginatedResponse<Employee> = {
      data: transformedEmployees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
    
    loggers.api(`${employees.length} Mitarbeiter abgerufen`, { 
      filters: { role, clinic, isActive },
      pagination: { page, limit }
    });
    
    res.json({
      success: true,
      ...response
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Mitarbeiter', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Mitarbeiter'
    });
  }
});

/**
 * GET /api/employees/:id
 * Einzelnen Mitarbeiter abrufen
 */
router.get('/:id', validateParams(UUIDSchema.pick({ id: true })), async (req: any, res: any) => {
  try {
    const { id } = req.validatedParams;
    
    const stmt = db.prepare('SELECT * FROM employees WHERE id = ? AND is_active = 1');
    const employee = stmt.get(id) as any;
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Mitarbeiter nicht gefunden'
      });
    }
    
    const transformedEmployee: Employee = {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      hoursPerMonth: employee.hours_per_month,
      hoursPerWeek: employee.hours_per_week,
      clinic: employee.clinic,
      createdAt: new Date(employee.created_at),
      updatedAt: new Date(employee.updated_at)
    };
    
    loggers.api(`Mitarbeiter abgerufen: ${employee.name}`, { id });
    
    res.json({
      success: true,
      data: transformedEmployee
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen des Mitarbeiters', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen des Mitarbeiters'
    });
  }
});

/**
 * POST /api/employees
 * Neuen Mitarbeiter erstellen
 */
router.post('/', validateRequestBody(EmployeeCreateSchema), async (req: any, res: any) => {
  try {
    const employeeData = req.validatedBody;
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO employees (
        id, name, role, hours_per_month, hours_per_week, clinic, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, 1)
    `);
    
    stmt.run(
      id,
      employeeData.name,
      employeeData.role,
      employeeData.hoursPerMonth,
      employeeData.hoursPerWeek || null,
      employeeData.clinic || null
    );
    
    // Erstellten Mitarbeiter abrufen
    const selectStmt = db.prepare('SELECT * FROM employees WHERE id = ?');
    const newEmployee = selectStmt.get(id) as any;
    
    const transformedEmployee: Employee = {
      id: newEmployee.id,
      name: newEmployee.name,
      role: newEmployee.role,
      hoursPerMonth: newEmployee.hours_per_month,
      hoursPerWeek: newEmployee.hours_per_week,
      clinic: newEmployee.clinic,
      createdAt: new Date(newEmployee.created_at),
      updatedAt: new Date(newEmployee.updated_at)
    };
    
    loggers.api(`Neuer Mitarbeiter erstellt: ${employeeData.name}`, { id });
    
    res.status(201).json({
      success: true,
      data: transformedEmployee,
      message: 'Mitarbeiter erfolgreich erstellt'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Erstellen des Mitarbeiters', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen des Mitarbeiters'
    });
  }
});

/**
 * PUT /api/employees/:id
 * Mitarbeiter aktualisieren
 */
router.put('/:id', 
  validateParams(UUIDSchema.pick({ id: true })),
  validateRequestBody(EmployeeUpdateSchema),
  async (req: any, res: any) => {
    try {
      const { id } = req.validatedParams;
      const updateData = req.validatedBody;
      
      // Prüfen ob Mitarbeiter existiert
      const checkStmt = db.prepare('SELECT id FROM employees WHERE id = ? AND is_active = 1');
      const exists = checkStmt.get(id);
      
      if (!exists) {
        return res.status(404).json({
          success: false,
          error: 'Mitarbeiter nicht gefunden'
        });
      }
      
      // Update-Query dynamisch erstellen
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      
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
      if (updateData.clinic !== undefined) {
        updateFields.push('clinic = ?');
        updateValues.push(updateData.clinic);
      }
      
      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Keine Aktualisierungsdaten bereitgestellt'
        });
      }
      
      updateValues.push(id);
      
      const updateStmt = db.prepare(`
        UPDATE employees 
        SET ${updateFields.join(', ')} 
        WHERE id = ?
      `);
      
      updateStmt.run(...updateValues);
      
      // Aktualisierten Mitarbeiter abrufen
      const selectStmt = db.prepare('SELECT * FROM employees WHERE id = ?');
      const updatedEmployee = selectStmt.get(id) as any;
      
      const transformedEmployee: Employee = {
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        role: updatedEmployee.role,
        hoursPerMonth: updatedEmployee.hours_per_month,
        hoursPerWeek: updatedEmployee.hours_per_week,
        clinic: updatedEmployee.clinic,
        createdAt: new Date(updatedEmployee.created_at),
        updatedAt: new Date(updatedEmployee.updated_at)
      };
      
      loggers.api(`Mitarbeiter aktualisiert: ${updatedEmployee.name}`, { id, updateFields });
      
      res.json({
        success: true,
        data: transformedEmployee,
        message: 'Mitarbeiter erfolgreich aktualisiert'
      });
      
    } catch (error) {
      loggers.error('Fehler beim Aktualisieren des Mitarbeiters', error as Error);
      res.status(500).json({
        success: false,
        error: 'Fehler beim Aktualisieren des Mitarbeiters'
      });
    }
  }
);

/**
 * DELETE /api/employees/:id
 * Mitarbeiter deaktivieren (Soft Delete)
 */
router.delete('/:id', validateParams(UUIDSchema.pick({ id: true })), async (req: any, res: any) => {
  try {
    const { id } = req.validatedParams;
    
    // Prüfen ob Mitarbeiter existiert
    const checkStmt = db.prepare('SELECT name FROM employees WHERE id = ? AND is_active = 1');
    const employee = checkStmt.get(id) as any;
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Mitarbeiter nicht gefunden'
      });
    }
    
    // Soft Delete
    const deleteStmt = db.prepare('UPDATE employees SET is_active = 0 WHERE id = ?');
    deleteStmt.run(id);
    
    loggers.api(`Mitarbeiter deaktiviert: ${employee.name}`, { id });
    
    res.json({
      success: true,
      message: 'Mitarbeiter erfolgreich deaktiviert'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Deaktivieren des Mitarbeiters', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Deaktivieren des Mitarbeiters'
    });
  }
});

/**
 * GET /api/employees/stats
 * Mitarbeiter-Statistiken
 */
router.get('/stats', async (req: any, res: any) => {
  try {
    const stats = {
      total: 0,
      byRole: {} as Record<string, number>,
      byClinic: {} as Record<string, number>,
      averageHoursPerMonth: 0,
      active: 0,
      inactive: 0
    };
    
    // Gesamtstatistiken
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM employees');
    stats.total = (totalStmt.get() as { count: number }).count;
    
    const activeStmt = db.prepare('SELECT COUNT(*) as count FROM employees WHERE is_active = 1');
    stats.active = (activeStmt.get() as { count: number }).count;
    stats.inactive = stats.total - stats.active;
    
    // Nach Rolle
    const roleStmt = db.prepare(`
      SELECT role, COUNT(*) as count 
      FROM employees 
      WHERE is_active = 1 
      GROUP BY role
    `);
    const roleResults = roleStmt.all() as { role: string; count: number }[];
    roleResults.forEach(row => {
      stats.byRole[row.role] = row.count;
    });
    
    // Nach Klinik
    const clinicStmt = db.prepare(`
      SELECT clinic, COUNT(*) as count 
      FROM employees 
      WHERE is_active = 1 AND clinic IS NOT NULL 
      GROUP BY clinic
    `);
    const clinicResults = clinicStmt.all() as { clinic: string; count: number }[];
    clinicResults.forEach(row => {
      stats.byClinic[row.clinic] = row.count;
    });
    
    // Durchschnittliche Stunden
    const avgStmt = db.prepare(`
      SELECT AVG(hours_per_month) as avg 
      FROM employees 
      WHERE is_active = 1 AND hours_per_month IS NOT NULL
    `);
    const avgResult = avgStmt.get() as { avg: number | null };
    stats.averageHoursPerMonth = Math.round(avgResult.avg || 0);
    
    loggers.api('Mitarbeiter-Statistiken abgerufen');
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Mitarbeiter-Statistiken', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Statistiken'
    });
  }
});

export default router;