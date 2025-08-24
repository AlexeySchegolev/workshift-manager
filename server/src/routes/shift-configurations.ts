import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/database';
import { loggers } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/shift-configurations
 * Standard-Schichtregeln-Konfiguration abrufen (vereinfachte Route)
 */
router.get('/', async (req: any, res: any) => {
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

export default router;