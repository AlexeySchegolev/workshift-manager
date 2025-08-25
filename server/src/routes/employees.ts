import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '@/database/database';
import { Employee, PaginatedResponse } from '@/types/interfaces';
import {
  validateRequestBody,
  validateQuery,
  validateParams,
  EmployeeCreateSchema,
  EmployeeUpdateSchema,
  EmployeeQuerySchema,
  UUIDParamsSchema
} from '@/validation/schemas';
import { logger } from '@/utils/logger';

const router = express.Router();

/**
 * GET /api/employees
 * Alle Mitarbeiter abrufen mit Paginierung und Filterung
 */
router.get('/', validateQuery(EmployeeQuerySchema), async (req: any, res: any) => {
  try {
    const { page, limit, role, location, isActive, sortBy, sortOrder } = req.validatedQuery;
    
    // Base Query mit JOIN für Location-Namen
    let query = `
      SELECT e.*, l.name as location_name
      FROM employees e
      LEFT JOIN locations l ON e.location_id = l.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;
    
    // Filter anwenden
    if (role) {
      query += ` AND e.role = $${paramIndex++}`;
      params.push(role);
    }
    
    if (location) {
      query += ` AND e.location_id = $${paramIndex++}`;
      params.push(location);
    }
    
    if (isActive !== undefined) {
      query += ` AND e.is_active = $${paramIndex++}`;
      params.push(isActive);
    }
    
    // Sortierung
    const validSortFields = ['name', 'role', 'hours_per_month', 'created_at'];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Ungültiges Sortierfeld: ${sortBy}`);
    }
    query += ` ORDER BY e.${sortBy} ${sortOrder.toUpperCase()}`;
    
    // Paginierung
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);
    
    // Daten abrufen
    const result = await dbManager.query(query, params);
    const employees = result.rows;
    
    // Gesamtanzahl für Paginierung
    let countQuery = 'SELECT COUNT(*) as total FROM employees e WHERE 1=1';
    const countParams: any[] = [];
    let countParamIndex = 1;
    
    if (role) {
      countQuery += ` AND e.role = $${countParamIndex++}`;
      countParams.push(role);
    }
    if (location) {
      countQuery += ` AND e.location_id = $${countParamIndex++}`;
      countParams.push(location);
    }
    if (isActive !== undefined) {
      countQuery += ` AND e.is_active = $${countParamIndex++}`;
      countParams.push(isActive);
    }
    
    const countResult = await dbManager.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    // Daten transformieren
    const transformedEmployees: Employee[] = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      hoursPerMonth: parseFloat(emp.hours_per_month),
      hoursPerWeek: emp.hours_per_week ? parseFloat(emp.hours_per_week) : undefined,
      locationId: emp.location_id,
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
    
    logger.info(`${employees.length} Mitarbeiter abgerufen`, {
      filters: { role, location, isActive },
      pagination: { page, limit }
    });
    
    res.json({
      success: true,
      data: response
    });
    
  } catch (error) {
    logger.error('Fehler beim Abrufen der Mitarbeiter:', error);
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
router.get('/:id', validateParams(UUIDParamsSchema), async (req: any, res: any) => {
  try {
    const { id } = req.validatedParams;
    
    const query = `
      SELECT e.*, l.name as location_name
      FROM employees e
      LEFT JOIN locations l ON e.location_id = l.id
      WHERE e.id = $1 AND e.is_active = true
    `;
    
    const result = await dbManager.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mitarbeiter nicht gefunden'
      });
    }
    
    const employee = result.rows[0];
    const transformedEmployee: Employee = {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      hoursPerMonth: parseFloat(employee.hours_per_month),
      hoursPerWeek: employee.hours_per_week ? parseFloat(employee.hours_per_week) : undefined,
      locationId: employee.location_id,
      createdAt: new Date(employee.created_at),
      updatedAt: new Date(employee.updated_at)
    };
    
    logger.info(`Mitarbeiter abgerufen: ${employee.name}`, { id });
    
    res.json({
      success: true,
      data: transformedEmployee
    });
    
  } catch (error) {
    logger.error('Fehler beim Abrufen des Mitarbeiters:', error);
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
    
    const insertQuery = `
      INSERT INTO employees (
        id, name, role, hours_per_month, hours_per_week, location_id, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, true)
    `;
    
    await dbManager.query(insertQuery, [
      id,
      employeeData.name,
      employeeData.role,
      employeeData.hoursPerMonth,
      employeeData.hoursPerWeek || null,
      employeeData.locationId || null
    ]);
    
    // Erstellten Mitarbeiter abrufen
    const selectQuery = `
      SELECT e.*, l.name as location_name
      FROM employees e
      LEFT JOIN locations l ON e.location_id = l.id
      WHERE e.id = $1
    `;
    const result = await dbManager.query(selectQuery, [id]);
    const newEmployee = result.rows[0];
    
    const transformedEmployee: Employee = {
      id: newEmployee.id,
      name: newEmployee.name,
      role: newEmployee.role,
      hoursPerMonth: parseFloat(newEmployee.hours_per_month),
      hoursPerWeek: newEmployee.hours_per_week ? parseFloat(newEmployee.hours_per_week) : undefined,
      locationId: newEmployee.location_id,
      createdAt: new Date(newEmployee.created_at),
      updatedAt: new Date(newEmployee.updated_at)
    };
    
    logger.info(`Neuer Mitarbeiter erstellt: ${employeeData.name}`, { id });
    
    res.status(201).json({
      success: true,
      data: transformedEmployee,
      message: 'Mitarbeiter erfolgreich erstellt'
    });
    
  } catch (error) {
    logger.error('Fehler beim Erstellen des Mitarbeiters:', error);
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
  validateParams(UUIDParamsSchema),
  validateRequestBody(EmployeeUpdateSchema),
  async (req: any, res: any) => {
    try {
      const { id } = req.validatedParams;
      const updateData = req.validatedBody;
      
      // Prüfen ob Mitarbeiter existiert
      const checkQuery = 'SELECT id FROM employees WHERE id = $1 AND is_active = true';
      const checkResult = await dbManager.query(checkQuery, [id]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Mitarbeiter nicht gefunden'
        });
      }
      
      // Update-Query dynamisch erstellen
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;
      
      if (updateData.name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        updateValues.push(updateData.name);
      }
      if (updateData.role !== undefined) {
        updateFields.push(`role = $${paramIndex++}`);
        updateValues.push(updateData.role);
      }
      if (updateData.hoursPerMonth !== undefined) {
        updateFields.push(`hours_per_month = $${paramIndex++}`);
        updateValues.push(updateData.hoursPerMonth);
      }
      if (updateData.hoursPerWeek !== undefined) {
        updateFields.push(`hours_per_week = $${paramIndex++}`);
        updateValues.push(updateData.hoursPerWeek);
      }
      if (updateData.locationId !== undefined) {
        updateFields.push(`location_id = $${paramIndex++}`);
        updateValues.push(updateData.locationId);
      }
      
      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Keine Aktualisierungsdaten bereitgestellt'
        });
      }
      
      // updated_at automatisch setzen
      updateFields.push(`updated_at = $${paramIndex++}`);
      updateValues.push(new Date());
      updateValues.push(id);
      
      const updateQuery = `
        UPDATE employees 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramIndex}
      `;
      
      await dbManager.query(updateQuery, updateValues);
      
      // Aktualisierten Mitarbeiter abrufen
      const selectQuery = `
        SELECT e.*, l.name as location_name
        FROM employees e
        LEFT JOIN locations l ON e.location_id = l.id
        WHERE e.id = $1
      `;
      const result = await dbManager.query(selectQuery, [id]);
      const updatedEmployee = result.rows[0];
      
      const transformedEmployee: Employee = {
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        role: updatedEmployee.role,
        hoursPerMonth: parseFloat(updatedEmployee.hours_per_month),
        hoursPerWeek: updatedEmployee.hours_per_week ? parseFloat(updatedEmployee.hours_per_week) : undefined,
        locationId: updatedEmployee.location_id,
        createdAt: new Date(updatedEmployee.created_at),
        updatedAt: new Date(updatedEmployee.updated_at)
      };
      
      logger.info(`Mitarbeiter aktualisiert: ${updatedEmployee.name}`, { 
        id, 
        updatedFields: updateFields.filter(field => !field.includes('updated_at'))
      });
      
      res.json({
        success: true,
        data: transformedEmployee,
        message: 'Mitarbeiter erfolgreich aktualisiert'
      });
      
    } catch (error) {
      logger.error('Fehler beim Aktualisieren des Mitarbeiters:', error);
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
router.delete('/:id', validateParams(UUIDParamsSchema), async (req: any, res: any) => {
  try {
    const { id } = req.validatedParams;
    
    // Prüfen ob Mitarbeiter existiert
    const checkQuery = 'SELECT name FROM employees WHERE id = $1 AND is_active = true';
    const checkResult = await dbManager.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mitarbeiter nicht gefunden'
      });
    }
    
    const employee = checkResult.rows[0];
    
    // Soft Delete
    const deleteQuery = `
      UPDATE employees 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `;
    await dbManager.query(deleteQuery, [id]);
    
    logger.info(`Mitarbeiter deaktiviert: ${employee.name}`, { id });
    
    res.json({
      success: true,
      message: 'Mitarbeiter erfolgreich deaktiviert'
    });
    
  } catch (error) {
    logger.error('Fehler beim Deaktivieren des Mitarbeiters:', error);
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
      byLocation: {} as Record<string, number>,
      averageHoursPerMonth: 0,
      active: 0,
      inactive: 0
    };
    
    // Gesamtstatistiken
    const totalQuery = 'SELECT COUNT(*) as count FROM employees';
    const totalResult = await dbManager.query(totalQuery);
    stats.total = parseInt(totalResult.rows[0].count);
    
    const activeQuery = 'SELECT COUNT(*) as count FROM employees WHERE is_active = true';
    const activeResult = await dbManager.query(activeQuery);
    stats.active = parseInt(activeResult.rows[0].count);
    stats.inactive = stats.total - stats.active;
    
    // Nach Rolle
    const roleQuery = `
      SELECT role, COUNT(*) as count 
      FROM employees 
      WHERE is_active = true 
      GROUP BY role
      ORDER BY count DESC
    `;
    const roleResult = await dbManager.query(roleQuery);
    roleResult.rows.forEach(row => {
      stats.byRole[row.role] = parseInt(row.count);
    });
    
    // Nach Standort
    const locationQuery = `
      SELECT l.name as location_name, COUNT(*) as count
      FROM employees e
      LEFT JOIN locations l ON e.location_id = l.id
      WHERE e.is_active = true AND e.location_id IS NOT NULL
      GROUP BY l.name
      ORDER BY count DESC
    `;
    const locationResult = await dbManager.query(locationQuery);
    locationResult.rows.forEach(row => {
      stats.byLocation[row.location_name] = parseInt(row.count);
    });
    
    // Durchschnittliche Stunden
    const avgQuery = `
      SELECT AVG(hours_per_month) as avg 
      FROM employees 
      WHERE is_active = true AND hours_per_month IS NOT NULL
    `;
    const avgResult = await dbManager.query(avgQuery);
    const avgValue = avgResult.rows[0].avg;
    stats.averageHoursPerMonth = Math.round(parseFloat(avgValue) || 0);
    
    logger.info('Mitarbeiter-Statistiken abgerufen', {
      total: stats.total,
      active: stats.active,
      rolesCount: Object.keys(stats.byRole).length
    });
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    logger.error('Fehler beim Abrufen der Mitarbeiter-Statistiken:', error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Statistiken'
    });
  }
});

export default router;