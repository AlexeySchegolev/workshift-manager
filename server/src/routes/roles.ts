import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/database';
import { loggers } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/roles
 * Alle Rollen abrufen
 */
router.get('/', async (req: any, res: any) => {
  try {
    const { isActive } = req.query;
    
    let query = 'SELECT * FROM roles WHERE 1=1';
    const params: any[] = [];
    
    if (isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY priority ASC, name ASC';
    
    const stmt = db.prepare(query);
    const roles = stmt.all(...params) as any[];
    
    // Daten transformieren und Berechtigungen/Anforderungen laden
    const transformedRoles = await Promise.all(roles.map(async (role) => {
      const permissions = JSON.parse(role.permissions || '[]');
      const requirements = JSON.parse(role.requirements || '[]');
      
      // Detaillierte Berechtigungen laden
      const permissionDetails = permissions.length > 0 ? 
        db.prepare(`SELECT * FROM role_permissions WHERE id IN (${permissions.map(() => '?').join(',')})`)
          .all(...permissions) : [];
      
      // Detaillierte Anforderungen laden
      const requirementDetails = requirements.length > 0 ?
        db.prepare(`SELECT * FROM role_requirements WHERE id IN (${requirements.map(() => '?').join(',')})`)
          .all(...requirements) : [];
      
      return {
        id: role.id,
        name: role.name,
        displayName: role.display_name,
        description: role.description,
        color: role.color,
        priority: role.priority,
        permissions: permissionDetails.map((p: any) => ({
          id: p.id,
          name: p.name,
          displayName: p.display_name,
          description: p.description,
          category: p.category
        })),
        requirements: requirementDetails.map((r: any) => ({
          id: r.id,
          name: r.name,
          displayName: r.display_name,
          description: r.description,
          type: r.type,
          required: Boolean(r.required)
        })),
        isActive: Boolean(role.is_active)
      };
    }));
    
    loggers.api(`${roles.length} Rollen abgerufen`);
    
    res.json({
      success: true,
      data: transformedRoles
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Rollen', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Rollen'
    });
  }
});

/**
 * GET /api/roles/permissions
 * Alle verfügbaren Berechtigungen abrufen
 */
router.get('/permissions', async (req: any, res: any) => {
  try {
    const stmt = db.prepare('SELECT * FROM role_permissions WHERE is_active = 1 ORDER BY category, name');
    const permissions = stmt.all() as any[];
    
    const transformedPermissions = permissions.map(p => ({
      id: p.id,
      name: p.name,
      displayName: p.display_name,
      description: p.description,
      category: p.category
    }));
    
    loggers.api(`${permissions.length} Berechtigungen abgerufen`);
    
    res.json({
      success: true,
      data: transformedPermissions
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Berechtigungen', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Berechtigungen'
    });
  }
});

/**
 * GET /api/roles/requirements
 * Alle verfügbaren Anforderungen abrufen
 */
router.get('/requirements', async (req: any, res: any) => {
  try {
    const stmt = db.prepare('SELECT * FROM role_requirements WHERE is_active = 1 ORDER BY type, name');
    const requirements = stmt.all() as any[];
    
    const transformedRequirements = requirements.map(r => ({
      id: r.id,
      name: r.name,
      displayName: r.display_name,
      description: r.description,
      type: r.type,
      required: Boolean(r.required)
    }));
    
    loggers.api(`${requirements.length} Anforderungen abgerufen`);
    
    res.json({
      success: true,
      data: transformedRequirements
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Anforderungen', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Anforderungen'
    });
  }
});

/**
 * GET /api/roles/:id
 * Einzelne Rolle abrufen
 */
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('SELECT * FROM roles WHERE id = ?');
    const role = stmt.get(id) as any;
    
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Rolle nicht gefunden'
      });
    }
    
    const permissions = JSON.parse(role.permissions || '[]');
    const requirements = JSON.parse(role.requirements || '[]');
    
    // Detaillierte Berechtigungen laden
    const permissionDetails = permissions.length > 0 ? 
      db.prepare(`SELECT * FROM role_permissions WHERE id IN (${permissions.map(() => '?').join(',')})`)
        .all(...permissions) : [];
    
    // Detaillierte Anforderungen laden
    const requirementDetails = requirements.length > 0 ?
      db.prepare(`SELECT * FROM role_requirements WHERE id IN (${requirements.map(() => '?').join(',')})`)
        .all(...requirements) : [];
    
    const transformedRole = {
      id: role.id,
      name: role.name,
      displayName: role.display_name,
      description: role.description,
      color: role.color,
      priority: role.priority,
      permissions: permissionDetails.map((p: any) => ({
        id: p.id,
        name: p.name,
        displayName: p.display_name,
        description: p.description,
        category: p.category
      })),
      requirements: requirementDetails.map((r: any) => ({
        id: r.id,
        name: r.name,
        displayName: r.display_name,
        description: r.description,
        type: r.type,
        required: Boolean(r.required)
      })),
      isActive: Boolean(role.is_active)
    };
    
    loggers.api(`Rolle abgerufen: ${role.display_name}`, { id });
    
    res.json({
      success: true,
      data: transformedRole
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Rolle', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Rolle'
    });
  }
});

/**
 * POST /api/roles
 * Neue Rolle erstellen
 */
router.post('/', async (req: any, res: any) => {
  try {
    const roleData = req.body;
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO roles (
        id, name, display_name, description, color, priority, 
        permissions, requirements, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      roleData.name,
      roleData.displayName,
      roleData.description || null,
      roleData.color || '#1976d2',
      roleData.priority || 1,
      JSON.stringify(roleData.permissions || []),
      JSON.stringify(roleData.requirements || []),
      roleData.isActive ? 1 : 0
    );
    
    // Erstellte Rolle abrufen
    const selectStmt = db.prepare('SELECT * FROM roles WHERE id = ?');
    const newRole = selectStmt.get(id) as any;
    
    const transformedRole = {
      id: newRole.id,
      name: newRole.name,
      displayName: newRole.display_name,
      description: newRole.description,
      color: newRole.color,
      priority: newRole.priority,
      permissions: [],
      requirements: [],
      isActive: Boolean(newRole.is_active)
    };
    
    loggers.api(`Neue Rolle erstellt: ${roleData.displayName}`, { id });
    
    res.status(201).json({
      success: true,
      data: transformedRole,
      message: 'Rolle erfolgreich erstellt'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Erstellen der Rolle', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen der Rolle'
    });
  }
});

/**
 * PUT /api/roles/:id
 * Rolle aktualisieren
 */
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Prüfen ob Rolle existiert
    const checkStmt = db.prepare('SELECT id FROM roles WHERE id = ?');
    const exists = checkStmt.get(id);
    
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Rolle nicht gefunden'
      });
    }
    
    const updateStmt = db.prepare(`
      UPDATE roles 
      SET name = ?, display_name = ?, description = ?, color = ?, 
          priority = ?, permissions = ?, requirements = ?, is_active = ?
      WHERE id = ?
    `);
    
    updateStmt.run(
      updateData.name,
      updateData.displayName,
      updateData.description || null,
      updateData.color || '#1976d2',
      updateData.priority || 1,
      JSON.stringify(updateData.permissions || []),
      JSON.stringify(updateData.requirements || []),
      updateData.isActive ? 1 : 0,
      id
    );
    
    // Aktualisierte Rolle abrufen
    const selectStmt = db.prepare('SELECT * FROM roles WHERE id = ?');
    const updatedRole = selectStmt.get(id) as any;
    
    const permissions = JSON.parse(updatedRole.permissions || '[]');
    const requirements = JSON.parse(updatedRole.requirements || '[]');
    
    // Detaillierte Berechtigungen laden
    const permissionDetails = permissions.length > 0 ? 
      db.prepare(`SELECT * FROM role_permissions WHERE id IN (${permissions.map(() => '?').join(',')})`)
        .all(...permissions) : [];
    
    // Detaillierte Anforderungen laden
    const requirementDetails = requirements.length > 0 ?
      db.prepare(`SELECT * FROM role_requirements WHERE id IN (${requirements.map(() => '?').join(',')})`)
        .all(...requirements) : [];
    
    const transformedRole = {
      id: updatedRole.id,
      name: updatedRole.name,
      displayName: updatedRole.display_name,
      description: updatedRole.description,
      color: updatedRole.color,
      priority: updatedRole.priority,
      permissions: permissionDetails.map((p: any) => ({
        id: p.id,
        name: p.name,
        displayName: p.display_name,
        description: p.description,
        category: p.category
      })),
      requirements: requirementDetails.map((r: any) => ({
        id: r.id,
        name: r.name,
        displayName: r.display_name,
        description: r.description,
        type: r.type,
        required: Boolean(r.required)
      })),
      isActive: Boolean(updatedRole.is_active)
    };
    
    loggers.api(`Rolle aktualisiert: ${updatedRole.display_name}`, { id });
    
    res.json({
      success: true,
      data: transformedRole,
      message: 'Rolle erfolgreich aktualisiert'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Aktualisieren der Rolle', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren der Rolle'
    });
  }
});

/**
 * DELETE /api/roles/:id
 * Rolle deaktivieren (Soft Delete)
 */
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Prüfen ob Rolle existiert
    const checkStmt = db.prepare('SELECT display_name, name FROM roles WHERE id = ? AND is_active = 1');
    const role = checkStmt.get(id) as any;
    
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Rolle nicht gefunden'
      });
    }
    
    // Prüfen ob Rolle noch verwendet wird
    const usageStmt = db.prepare('SELECT COUNT(*) as count FROM employees WHERE role = ? AND is_active = 1');
    const usage = usageStmt.get(role.name) as { count: number };
    
    if (usage.count > 0) {
      return res.status(400).json({
        success: false,
        error: `Rolle wird noch von ${usage.count} Mitarbeiter(n) verwendet und kann nicht gelöscht werden`
      });
    }
    
    // Soft Delete
    const deleteStmt = db.prepare('UPDATE roles SET is_active = 0 WHERE id = ?');
    deleteStmt.run(id);
    
    loggers.api(`Rolle deaktiviert: ${role.display_name}`, { id });
    
    res.json({
      success: true,
      message: 'Rolle erfolgreich deaktiviert'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Deaktivieren der Rolle', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Deaktivieren der Rolle'
    });
  }
});


export default router;