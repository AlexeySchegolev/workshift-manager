import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/database';
import { loggers } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/shift-rules/configurations
 * Alle Schichtregeln-Konfigurationen abrufen
 */
router.get('/configurations', async (req: any, res: any) => {
  try {
    const { isActive } = req.query;
    
    let query = 'SELECT * FROM shift_rules_configurations WHERE 1=1';
    const params: any[] = [];
    
    if (isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY is_default DESC, name ASC';
    
    const stmt = db.prepare(query);
    const configurations = stmt.all(...params) as any[];
    
    // Für jede Konfiguration die Details laden
    const transformedConfigurations = await Promise.all(configurations.map(async (config) => {
      // Globale Regeln laden
      const globalRulesStmt = db.prepare('SELECT * FROM global_shift_rules WHERE configuration_id = ?');
      const globalRules = globalRulesStmt.get(config.id) as any;
      
      // Schichten laden
      const shiftsStmt = db.prepare('SELECT * FROM configurable_shifts WHERE configuration_id = ? AND is_active = 1 ORDER BY name');
      const shifts = shiftsStmt.all(config.id) as any[];
      
      // Für jede Schicht die Details laden
      const transformedShifts = await Promise.all(shifts.map(async (shift) => {
        // Tag-Typen laden
        const dayTypesStmt = db.prepare('SELECT day_type FROM shift_day_types WHERE shift_id = ?');
        const dayTypes = dayTypesStmt.all(shift.id) as { day_type: string }[];
        
        // Rollenanforderungen laden
        const roleReqStmt = db.prepare('SELECT * FROM shift_role_requirements WHERE shift_id = ? ORDER BY priority');
        const roleRequirements = roleReqStmt.all(shift.id) as any[];
        
        return {
          id: shift.id,
          name: shift.name,
          displayName: shift.display_name,
          startTime: shift.start_time,
          endTime: shift.end_time,
          location: shift.location,
          dayTypes: dayTypes.map(dt => dt.day_type),
          requiredRoles: roleRequirements.map(rr => ({
            roleId: rr.role_id,
            roleName: rr.role_name,
            minCount: rr.min_count,
            maxCount: rr.max_count,
            priority: rr.priority
          })),
          isActive: Boolean(shift.is_active),
          createdAt: new Date(shift.created_at),
          updatedAt: new Date(shift.updated_at)
        };
      }));
      
      return {
        id: config.id,
        name: config.name,
        description: config.description,
        isDefault: Boolean(config.is_default),
        isActive: Boolean(config.is_active),
        globalRules: globalRules ? {
          maxConsecutiveDays: globalRules.max_consecutive_days,
          minRestHoursBetweenShifts: globalRules.min_rest_hours_between_shifts,
          maxOvertimePercentage: globalRules.max_overtime_percentage,
          maxSaturdaysPerMonth: globalRules.max_saturdays_per_month,
          allowBackToBackShifts: Boolean(globalRules.allow_back_to_back_shifts),
          preferredShiftRotation: globalRules.preferred_shift_rotation
        } : null,
        shifts: transformedShifts,
        createdAt: new Date(config.created_at),
        updatedAt: new Date(config.updated_at)
      };
    }));
    
    loggers.api(`${configurations.length} Schichtregeln-Konfigurationen abgerufen`);
    
    res.json({
      success: true,
      data: transformedConfigurations
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Schichtregeln-Konfigurationen', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Schichtregeln-Konfigurationen'
    });
  }
});

/**
 * GET /api/shift-rules/configurations/default
 * Standard-Schichtregeln-Konfiguration abrufen
 */
router.get('/configurations/default', async (req: any, res: any) => {
  try {
    const stmt = db.prepare('SELECT * FROM shift_rules_configurations WHERE is_default = 1 AND is_active = 1 LIMIT 1');
    const config = stmt.get() as any;
    
    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Keine Standard-Konfiguration gefunden'
      });
    }
    
    // Globale Regeln laden
    const globalRulesStmt = db.prepare('SELECT * FROM global_shift_rules WHERE configuration_id = ?');
    const globalRules = globalRulesStmt.get(config.id) as any;
    
    // Schichten laden
    const shiftsStmt = db.prepare('SELECT * FROM configurable_shifts WHERE configuration_id = ? AND is_active = 1 ORDER BY name');
    const shifts = shiftsStmt.all(config.id) as any[];
    
    // Für jede Schicht die Details laden
    const transformedShifts = await Promise.all(shifts.map(async (shift) => {
      // Tag-Typen laden
      const dayTypesStmt = db.prepare('SELECT day_type FROM shift_day_types WHERE shift_id = ?');
      const dayTypes = dayTypesStmt.all(shift.id) as { day_type: string }[];
      
      // Rollenanforderungen laden
      const roleReqStmt = db.prepare('SELECT * FROM shift_role_requirements WHERE shift_id = ? ORDER BY priority');
      const roleRequirements = roleReqStmt.all(shift.id) as any[];
      
      return {
        id: shift.id,
        name: shift.name,
        displayName: shift.display_name,
        startTime: shift.start_time,
        endTime: shift.end_time,
        location: shift.location,
        dayTypes: dayTypes.map(dt => dt.day_type),
        requiredRoles: roleRequirements.map(rr => ({
          roleId: rr.role_id,
          roleName: rr.role_name,
          minCount: rr.min_count,
          maxCount: rr.max_count,
          priority: rr.priority
        })),
        isActive: Boolean(shift.is_active),
        createdAt: new Date(shift.created_at),
        updatedAt: new Date(shift.updated_at)
      };
    }));
    
    const transformedConfig = {
      id: config.id,
      name: config.name,
      description: config.description,
      isDefault: Boolean(config.is_default),
      isActive: Boolean(config.is_active),
      globalRules: globalRules ? {
        maxConsecutiveDays: globalRules.max_consecutive_days,
        minRestHoursBetweenShifts: globalRules.min_rest_hours_between_shifts,
        maxOvertimePercentage: globalRules.max_overtime_percentage,
        maxSaturdaysPerMonth: globalRules.max_saturdays_per_month,
        allowBackToBackShifts: Boolean(globalRules.allow_back_to_back_shifts),
        preferredShiftRotation: globalRules.preferred_shift_rotation
      } : null,
      shifts: transformedShifts,
      createdAt: new Date(config.created_at),
      updatedAt: new Date(config.updated_at)
    };
    
    loggers.api(`Standard-Schichtregeln-Konfiguration abgerufen: ${config.name}`);
    
    res.json({
      success: true,
      data: transformedConfig
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Standard-Schichtregeln-Konfiguration', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Standard-Schichtregeln-Konfiguration'
    });
  }
});

/**
 * GET /api/shift-rules/configurations/:id
 * Einzelne Schichtregeln-Konfiguration abrufen
 */
router.get('/configurations/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('SELECT * FROM shift_rules_configurations WHERE id = ?');
    const config = stmt.get(id) as any;
    
    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Schichtregeln-Konfiguration nicht gefunden'
      });
    }
    
    // Globale Regeln laden
    const globalRulesStmt = db.prepare('SELECT * FROM global_shift_rules WHERE configuration_id = ?');
    const globalRules = globalRulesStmt.get(config.id) as any;
    
    // Schichten laden
    const shiftsStmt = db.prepare('SELECT * FROM configurable_shifts WHERE configuration_id = ? ORDER BY name');
    const shifts = shiftsStmt.all(config.id) as any[];
    
    // Für jede Schicht die Details laden
    const transformedShifts = await Promise.all(shifts.map(async (shift) => {
      // Tag-Typen laden
      const dayTypesStmt = db.prepare('SELECT day_type FROM shift_day_types WHERE shift_id = ?');
      const dayTypes = dayTypesStmt.all(shift.id) as { day_type: string }[];
      
      // Rollenanforderungen laden
      const roleReqStmt = db.prepare('SELECT * FROM shift_role_requirements WHERE shift_id = ? ORDER BY priority');
      const roleRequirements = roleReqStmt.all(shift.id) as any[];
      
      return {
        id: shift.id,
        name: shift.name,
        displayName: shift.display_name,
        startTime: shift.start_time,
        endTime: shift.end_time,
        location: shift.location,
        dayTypes: dayTypes.map(dt => dt.day_type),
        requiredRoles: roleRequirements.map(rr => ({
          roleId: rr.role_id,
          roleName: rr.role_name,
          minCount: rr.min_count,
          maxCount: rr.max_count,
          priority: rr.priority
        })),
        isActive: Boolean(shift.is_active),
        createdAt: new Date(shift.created_at),
        updatedAt: new Date(shift.updated_at)
      };
    }));
    
    const transformedConfig = {
      id: config.id,
      name: config.name,
      description: config.description,
      isDefault: Boolean(config.is_default),
      isActive: Boolean(config.is_active),
      globalRules: globalRules ? {
        maxConsecutiveDays: globalRules.max_consecutive_days,
        minRestHoursBetweenShifts: globalRules.min_rest_hours_between_shifts,
        maxOvertimePercentage: globalRules.max_overtime_percentage,
        maxSaturdaysPerMonth: globalRules.max_saturdays_per_month,
        allowBackToBackShifts: Boolean(globalRules.allow_back_to_back_shifts),
        preferredShiftRotation: globalRules.preferred_shift_rotation
      } : null,
      shifts: transformedShifts,
      createdAt: new Date(config.created_at),
      updatedAt: new Date(config.updated_at)
    };
    
    loggers.api(`Schichtregeln-Konfiguration abgerufen: ${config.name}`, { id });
    
    res.json({
      success: true,
      data: transformedConfig
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Schichtregeln-Konfiguration', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Schichtregeln-Konfiguration'
    });
  }
});

/**
 * POST /api/shift-rules/configurations
 * Neue Schichtregeln-Konfiguration erstellen
 */
router.post('/configurations', async (req: any, res: any) => {
  try {
    const configData = req.body;
    const configId = uuidv4();
    
    // Transaction starten
    const transaction = db.transaction(() => {
      // Konfiguration erstellen
      const configStmt = db.prepare(`
        INSERT INTO shift_rules_configurations (
          id, name, description, is_default, is_active
        ) VALUES (?, ?, ?, ?, ?)
      `);
      
      configStmt.run(
        configId,
        configData.name,
        configData.description || '',
        configData.isDefault ? 1 : 0,
        configData.isActive ? 1 : 0
      );
      
      // Globale Regeln erstellen
      if (configData.globalRules) {
        const globalRulesStmt = db.prepare(`
          INSERT INTO global_shift_rules (
            id, configuration_id, max_consecutive_days, min_rest_hours_between_shifts,
            max_overtime_percentage, max_saturdays_per_month, allow_back_to_back_shifts,
            preferred_shift_rotation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        globalRulesStmt.run(
          uuidv4(),
          configId,
          configData.globalRules.maxConsecutiveDays || 5,
          configData.globalRules.minRestHoursBetweenShifts || 11,
          configData.globalRules.maxOvertimePercentage || 10,
          configData.globalRules.maxSaturdaysPerMonth || 1,
          configData.globalRules.allowBackToBackShifts ? 1 : 0,
          configData.globalRules.preferredShiftRotation || 'forward'
        );
      }
      
      // Schichten erstellen
      if (configData.shifts && configData.shifts.length > 0) {
        const shiftStmt = db.prepare(`
          INSERT INTO configurable_shifts (
            id, configuration_id, name, display_name, start_time, end_time, location, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const dayTypeStmt = db.prepare(`
          INSERT INTO shift_day_types (id, shift_id, day_type) VALUES (?, ?, ?)
        `);
        
        const roleReqStmt = db.prepare(`
          INSERT INTO shift_role_requirements (
            id, shift_id, role_id, role_name, min_count, max_count, priority
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        for (const shift of configData.shifts) {
          const shiftId = uuidv4();
          
          // Schicht erstellen
          shiftStmt.run(
            shiftId,
            configId,
            shift.name,
            shift.displayName,
            shift.startTime,
            shift.endTime,
            shift.location || null,
            shift.isActive ? 1 : 0
          );
          
          // Tag-Typen hinzufügen
          if (shift.dayTypes && shift.dayTypes.length > 0) {
            for (const dayType of shift.dayTypes) {
              dayTypeStmt.run(uuidv4(), shiftId, dayType);
            }
          }
          
          // Rollenanforderungen hinzufügen
          if (shift.requiredRoles && shift.requiredRoles.length > 0) {
            for (const roleReq of shift.requiredRoles) {
              roleReqStmt.run(
                uuidv4(),
                shiftId,
                roleReq.roleId,
                roleReq.roleName,
                roleReq.minCount,
                roleReq.maxCount || null,
                roleReq.priority
              );
            }
          }
        }
      }
    });
    
    transaction();
    
    // Erstellte Konfiguration abrufen
    const selectStmt = db.prepare('SELECT * FROM shift_rules_configurations WHERE id = ?');
    const newConfig = selectStmt.get(configId) as any;
    
    loggers.api(`Neue Schichtregeln-Konfiguration erstellt: ${configData.name}`, { id: configId });
    
    res.status(201).json({
      success: true,
      data: {
        id: newConfig.id,
        name: newConfig.name,
        description: newConfig.description,
        isDefault: Boolean(newConfig.is_default),
        isActive: Boolean(newConfig.is_active),
        createdAt: new Date(newConfig.created_at),
        updatedAt: new Date(newConfig.updated_at)
      },
      message: 'Schichtregeln-Konfiguration erfolgreich erstellt'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Erstellen der Schichtregeln-Konfiguration', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen der Schichtregeln-Konfiguration'
    });
  }
});

/**
 * PUT /api/shift-rules/configurations/:id
 * Schichtregeln-Konfiguration aktualisieren
 */
router.put('/configurations/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Prüfen ob Konfiguration existiert
    const checkStmt = db.prepare('SELECT id FROM shift_rules_configurations WHERE id = ?');
    const exists = checkStmt.get(id);
    
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Schichtregeln-Konfiguration nicht gefunden'
      });
    }
    
    // Transaction starten
    const transaction = db.transaction(() => {
      // Konfiguration aktualisieren
      const updateConfigStmt = db.prepare(`
        UPDATE shift_rules_configurations 
        SET name = ?, description = ?, is_default = ?, is_active = ?
        WHERE id = ?
      `);
      
      updateConfigStmt.run(
        updateData.name,
        updateData.description || '',
        updateData.isDefault ? 1 : 0,
        updateData.isActive ? 1 : 0,
        id
      );
      
      // Globale Regeln aktualisieren
      if (updateData.globalRules) {
        const updateGlobalRulesStmt = db.prepare(`
          UPDATE global_shift_rules 
          SET max_consecutive_days = ?, min_rest_hours_between_shifts = ?,
              max_overtime_percentage = ?, max_saturdays_per_month = ?,
              allow_back_to_back_shifts = ?, preferred_shift_rotation = ?
          WHERE configuration_id = ?
        `);
        
        updateGlobalRulesStmt.run(
          updateData.globalRules.maxConsecutiveDays || 5,
          updateData.globalRules.minRestHoursBetweenShifts || 11,
          updateData.globalRules.maxOvertimePercentage || 10,
          updateData.globalRules.maxSaturdaysPerMonth || 1,
          updateData.globalRules.allowBackToBackShifts ? 1 : 0,
          updateData.globalRules.preferredShiftRotation || 'forward',
          id
        );
      }
      
      // Bestehende Schichten und deren Abhängigkeiten löschen
      const deleteRoleReqStmt = db.prepare(`
        DELETE FROM shift_role_requirements 
        WHERE shift_id IN (SELECT id FROM configurable_shifts WHERE configuration_id = ?)
      `);
      deleteRoleReqStmt.run(id);
      
      const deleteDayTypesStmt = db.prepare(`
        DELETE FROM shift_day_types 
        WHERE shift_id IN (SELECT id FROM configurable_shifts WHERE configuration_id = ?)
      `);
      deleteDayTypesStmt.run(id);
      
      const deleteShiftsStmt = db.prepare('DELETE FROM configurable_shifts WHERE configuration_id = ?');
      deleteShiftsStmt.run(id);
      
      // Neue Schichten erstellen
      if (updateData.shifts && updateData.shifts.length > 0) {
        const shiftStmt = db.prepare(`
          INSERT INTO configurable_shifts (
            id, configuration_id, name, display_name, start_time, end_time, location, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const dayTypeStmt = db.prepare(`
          INSERT INTO shift_day_types (id, shift_id, day_type) VALUES (?, ?, ?)
        `);
        
        const roleReqStmt = db.prepare(`
          INSERT INTO shift_role_requirements (
            id, shift_id, role_id, role_name, min_count, max_count, priority
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        for (const shift of updateData.shifts) {
          const shiftId = shift.id || uuidv4();
          
          // Schicht erstellen
          shiftStmt.run(
            shiftId,
            id,
            shift.name,
            shift.displayName,
            shift.startTime,
            shift.endTime,
            shift.location || null,
            shift.isActive ? 1 : 0
          );
          
          // Tag-Typen hinzufügen
          if (shift.dayTypes && shift.dayTypes.length > 0) {
            for (const dayType of shift.dayTypes) {
              dayTypeStmt.run(uuidv4(), shiftId, dayType);
            }
          }
          
          // Rollenanforderungen hinzufügen
          if (shift.requiredRoles && shift.requiredRoles.length > 0) {
            for (const roleReq of shift.requiredRoles) {
              roleReqStmt.run(
                uuidv4(),
                shiftId,
                roleReq.roleId,
                roleReq.roleName,
                roleReq.minCount,
                roleReq.maxCount || null,
                roleReq.priority
              );
            }
          }
        }
      }
    });
    
    transaction();
    
    loggers.api(`Schichtregeln-Konfiguration aktualisiert: ${updateData.name}`, { id });
    
    res.json({
      success: true,
      message: 'Schichtregeln-Konfiguration erfolgreich aktualisiert'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Aktualisieren der Schichtregeln-Konfiguration', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren der Schichtregeln-Konfiguration'
    });
  }
});

/**
 * DELETE /api/shift-rules/configurations/:id
 * Schichtregeln-Konfiguration deaktivieren (Soft Delete)
 */
router.delete('/configurations/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Prüfen ob Konfiguration existiert
    const checkStmt = db.prepare('SELECT name, is_default FROM shift_rules_configurations WHERE id = ? AND is_active = 1');
    const config = checkStmt.get(id) as any;
    
    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Schichtregeln-Konfiguration nicht gefunden'
      });
    }
    
    // Standard-Konfiguration kann nicht gelöscht werden
    if (config.is_default) {
      return res.status(400).json({
        success: false,
        error: 'Standard-Konfiguration kann nicht gelöscht werden'
      });
    }
    
    // Soft Delete
    const deleteStmt = db.prepare('UPDATE shift_rules_configurations SET is_active = 0 WHERE id = ?');
    deleteStmt.run(id);
    
    loggers.api(`Schichtregeln-Konfiguration deaktiviert: ${config.name}`, { id });
    
    res.json({
      success: true,
      message: 'Schichtregeln-Konfiguration erfolgreich deaktiviert'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Deaktivieren der Schichtregeln-Konfiguration', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Deaktivieren der Schichtregeln-Konfiguration'
    });
  }
});


export default router;