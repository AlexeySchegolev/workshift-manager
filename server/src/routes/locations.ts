import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/database';
import { Location, ApiResponse, PaginatedResponse } from '../types/interfaces';
import { loggers } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/locations
 * Alle Standorte abrufen
 */
router.get('/', async (req: any, res: any) => {
  try {
    const { isActive } = req.query;
    
    let query = 'SELECT * FROM locations WHERE 1=1';
    const params: any[] = [];
    
    if (isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY name ASC';
    
    const stmt = db.prepare(query);
    const locations = stmt.all(...params) as any[];
    
    // Daten transformieren
    const transformedLocations: Location[] = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      city: loc.city,
      postalCode: loc.postal_code,
      phone: loc.phone,
      email: loc.email,
      manager: loc.manager,
      capacity: loc.capacity,
      operatingHours: JSON.parse(loc.operating_hours),
      services: JSON.parse(loc.specialties),
      equipment: JSON.parse(loc.equipment),
      isActive: Boolean(loc.is_active)
    }));
    
    loggers.api(`${locations.length} Standorte abgerufen`);
    
    res.json({
      success: true,
      data: transformedLocations
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Standorte', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Standorte'
    });
  }
});

/**
 * GET /api/locations/:id
 * Einzelnen Standort abrufen
 */
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('SELECT * FROM locations WHERE id = ?');
    const location = stmt.get(id) as any;
    
    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Standort nicht gefunden'
      });
    }
    
    const transformedLocation: Location = {
      id: location.id,
      name: location.name,
      address: location.address,
      city: location.city,
      postalCode: location.postal_code,
      phone: location.phone,
      email: location.email,
      manager: location.manager,
      capacity: location.capacity,
      operatingHours: JSON.parse(location.operating_hours),
      services: JSON.parse(location.specialties),
      equipment: JSON.parse(location.equipment),
      isActive: Boolean(location.is_active)
    };
    
    loggers.api(`Standort abgerufen: ${location.name}`, { id });
    
    res.json({
      success: true,
      data: transformedLocation
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen des Standorts', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen des Standorts'
    });
  }
});

/**
 * POST /api/locations
 * Neuen Standort erstellen
 */
router.post('/', async (req: any, res: any) => {
  try {
    const locationData = req.body;
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO locations (
        id, name, address, city, postal_code, phone, email, manager,
        capacity, operating_hours, specialties, equipment, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      locationData.name,
      locationData.address,
      locationData.city,
      locationData.postalCode,
      locationData.phone || null,
      locationData.email || null,
      locationData.manager || null,
      locationData.capacity,
      JSON.stringify(locationData.operatingHours),
      JSON.stringify(locationData.services || []),
      JSON.stringify(locationData.equipment || []),
      locationData.isActive ? 1 : 0
    );
    
    // Erstellten Standort abrufen
    const selectStmt = db.prepare('SELECT * FROM locations WHERE id = ?');
    const newLocation = selectStmt.get(id) as any;
    
    const transformedLocation: Location = {
      id: newLocation.id,
      name: newLocation.name,
      address: newLocation.address,
      city: newLocation.city,
      postalCode: newLocation.postal_code,
      phone: newLocation.phone,
      email: newLocation.email,
      manager: newLocation.manager,
      capacity: newLocation.capacity,
      operatingHours: JSON.parse(newLocation.operating_hours),
      services: JSON.parse(newLocation.specialties),
      equipment: JSON.parse(newLocation.equipment),
      isActive: Boolean(newLocation.is_active)
    };
    
    loggers.api(`Neuer Standort erstellt: ${locationData.name}`, { id });
    
    res.status(201).json({
      success: true,
      data: transformedLocation,
      message: 'Standort erfolgreich erstellt'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Erstellen des Standorts', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen des Standorts'
    });
  }
});

/**
 * PUT /api/locations/:id
 * Standort aktualisieren
 */
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Prüfen ob Standort existiert
    const checkStmt = db.prepare('SELECT id FROM locations WHERE id = ?');
    const exists = checkStmt.get(id);
    
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Standort nicht gefunden'
      });
    }
    
    const updateStmt = db.prepare(`
      UPDATE locations 
      SET name = ?, address = ?, city = ?, postal_code = ?, phone = ?, 
          email = ?, manager = ?, capacity = ?, operating_hours = ?, 
          specialties = ?, equipment = ?, is_active = ?
      WHERE id = ?
    `);
    
    updateStmt.run(
      updateData.name,
      updateData.address,
      updateData.city,
      updateData.postalCode,
      updateData.phone || null,
      updateData.email || null,
      updateData.manager || null,
      updateData.capacity,
      JSON.stringify(updateData.operatingHours),
      JSON.stringify(updateData.services || []),
      JSON.stringify(updateData.equipment || []),
      updateData.isActive ? 1 : 0,
      id
    );
    
    // Aktualisierten Standort abrufen
    const selectStmt = db.prepare('SELECT * FROM locations WHERE id = ?');
    const updatedLocation = selectStmt.get(id) as any;
    
    const transformedLocation: Location = {
      id: updatedLocation.id,
      name: updatedLocation.name,
      address: updatedLocation.address,
      city: updatedLocation.city,
      postalCode: updatedLocation.postal_code,
      phone: updatedLocation.phone,
      email: updatedLocation.email,
      manager: updatedLocation.manager,
      capacity: updatedLocation.capacity,
      operatingHours: JSON.parse(updatedLocation.operating_hours),
      services: JSON.parse(updatedLocation.specialties),
      equipment: JSON.parse(updatedLocation.equipment),
      isActive: Boolean(updatedLocation.is_active)
    };
    
    loggers.api(`Standort aktualisiert: ${updatedLocation.name}`, { id });
    
    res.json({
      success: true,
      data: transformedLocation,
      message: 'Standort erfolgreich aktualisiert'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Aktualisieren des Standorts', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren des Standorts'
    });
  }
});

/**
 * DELETE /api/locations/:id
 * Standort deaktivieren (Soft Delete)
 */
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Prüfen ob Standort existiert
    const checkStmt = db.prepare('SELECT name FROM locations WHERE id = ? AND is_active = 1');
    const location = checkStmt.get(id) as any;
    
    if (!location) {
      return res.status(404).json({
        success: false,
        error: 'Standort nicht gefunden'
      });
    }
    
    // Soft Delete
    const deleteStmt = db.prepare('UPDATE locations SET is_active = 0 WHERE id = ?');
    deleteStmt.run(id);
    
    loggers.api(`Standort deaktiviert: ${location.name}`, { id });
    
    res.json({
      success: true,
      message: 'Standort erfolgreich deaktiviert'
    });
    
  } catch (error) {
    loggers.error('Fehler beim Deaktivieren des Standorts', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Deaktivieren des Standorts'
    });
  }
});

/**
 * GET /api/locations/stats
 * Standort-Statistiken
 */
router.get('/stats', async (req: any, res: any) => {
  try {
    const stats = {
      total: 0,
      active: 0,
      inactive: 0,
      totalCapacity: 0,
      averageCapacity: 0,
      byCity: {} as Record<string, number>
    };
    
    // Gesamtstatistiken
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM locations');
    stats.total = (totalStmt.get() as { count: number }).count;
    
    const activeStmt = db.prepare('SELECT COUNT(*) as count FROM locations WHERE is_active = 1');
    stats.active = (activeStmt.get() as { count: number }).count;
    stats.inactive = stats.total - stats.active;
    
    // Kapazitätsstatistiken
    const capacityStmt = db.prepare(`
      SELECT SUM(capacity) as total, AVG(capacity) as avg 
      FROM locations 
      WHERE is_active = 1
    `);
    const capacityResult = capacityStmt.get() as { total: number | null; avg: number | null };
    stats.totalCapacity = capacityResult.total || 0;
    stats.averageCapacity = Math.round(capacityResult.avg || 0);
    
    // Nach Stadt
    const cityStmt = db.prepare(`
      SELECT city, COUNT(*) as count
      FROM locations
      WHERE is_active = 1
      GROUP BY city
    `);
    const cityResults = cityStmt.all() as { city: string; count: number }[];
    cityResults.forEach(row => {
      stats.byCity[row.city] = row.count;
    });
    
    loggers.api('Standort-Statistiken abgerufen');
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    loggers.error('Fehler beim Abrufen der Standort-Statistiken', error as Error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Statistiken'
    });
  }
});

export default router;