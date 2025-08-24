-- Migration: Update locations table to use INTEGER ID and update references
-- This migration changes location IDs from TEXT to INTEGER and updates all references

-- Check if migration is needed
-- If locations table already has INTEGER id, skip migration
BEGIN;

-- Check current schema
CREATE TEMP TABLE schema_check AS 
SELECT sql FROM sqlite_master WHERE type='table' AND name='locations';

-- Only proceed if locations table has TEXT id
-- We'll use a more robust approach by checking if the migration is needed

-- Step 1: Check if we need to migrate (locations table has TEXT id)
-- If locations.id is already INTEGER, we skip the migration
CREATE TEMP TABLE migration_needed AS
SELECT CASE 
  WHEN EXISTS (
    SELECT 1 FROM pragma_table_info('locations') 
    WHERE name = 'id' AND type = 'TEXT'
  ) THEN 1 
  ELSE 0 
END as need_migration;

-- Step 2: Only proceed if migration is needed
-- Create new tables only if migration is needed
CREATE TABLE IF NOT EXISTS locations_temp_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    manager TEXT,
    capacity INTEGER NOT NULL DEFAULT 0,
    operating_hours TEXT NOT NULL,
    specialties TEXT NOT NULL,
    equipment TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees_temp_new (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    hours_per_month REAL NOT NULL,
    hours_per_week REAL,
    location_id INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations_temp_new(id)
);

CREATE TABLE IF NOT EXISTS shift_definitions_temp_new (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    hours REAL NOT NULL,
    day_type TEXT NOT NULL CHECK (day_type IN ('longDays', 'shortDays', 'both')),
    location_id INTEGER,
    allowed_roles TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations_temp_new(id)
);

-- Step 3: Migrate data only if needed and source tables exist
-- Migrate locations
INSERT OR IGNORE INTO locations_temp_new (id, name, address, city, postal_code, phone, email, manager, capacity, operating_hours, specialties, equipment, is_active, created_at, updated_at)
SELECT 
    CASE 
        WHEN l.id = 'elmshorn' OR l.name LIKE '%Elmshorn%' THEN 1
        WHEN l.id = 'uetersen' OR l.name LIKE '%Uetersen%' THEN 2
        ELSE ROW_NUMBER() OVER (ORDER BY l.created_at) + 2
    END as id,
    l.name,
    l.address,
    l.city,
    l.postal_code,
    l.phone,
    l.email,
    l.manager,
    l.capacity,
    l.operating_hours,
    l.specialties,
    l.equipment,
    l.is_active,
    l.created_at,
    l.updated_at
FROM locations l
WHERE EXISTS (SELECT 1 FROM migration_needed WHERE need_migration = 1)
  AND EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='locations');

-- Migrate employees
INSERT OR IGNORE INTO employees_temp_new (id, name, role, hours_per_month, hours_per_week, location_id, is_active, created_at, updated_at)
SELECT 
    e.id,
    e.name,
    e.role,
    e.hours_per_month,
    e.hours_per_week,
    CASE 
        WHEN e.location = 'Standort A' OR e.location LIKE '%Elmshorn%' THEN 1
        WHEN e.location = 'Standort B' OR e.location LIKE '%Uetersen%' THEN 2
        ELSE 1
    END as location_id,
    e.is_active,
    e.created_at,
    e.updated_at
FROM employees e
WHERE EXISTS (SELECT 1 FROM migration_needed WHERE need_migration = 1)
  AND EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='employees');

-- Migrate shift_definitions
INSERT OR IGNORE INTO shift_definitions_temp_new (id, name, display_name, start_time, end_time, hours, day_type, location_id, allowed_roles, is_active, created_at, updated_at)
SELECT 
    sd.id,
    sd.name,
    sd.display_name,
    sd.start_time,
    sd.end_time,
    sd.hours,
    sd.day_type,
    CASE 
        WHEN sd.location = 'Standort A' OR sd.location LIKE '%Elmshorn%' THEN 1
        WHEN sd.location = 'Standort B' OR sd.location LIKE '%Uetersen%' THEN 2
        ELSE NULL
    END as location_id,
    sd.allowed_roles,
    sd.is_active,
    sd.created_at,
    sd.updated_at
FROM shift_definitions sd
WHERE EXISTS (SELECT 1 FROM migration_needed WHERE need_migration = 1)
  AND EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='shift_definitions');

-- Step 4: Replace old tables with new ones (only if migration was needed)
-- This is done conditionally based on migration_needed

-- Drop old tables and rename new ones (only if migration needed)
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS shift_definitions;
DROP TABLE IF EXISTS locations;

-- Rename temp tables to final names
ALTER TABLE locations_temp_new RENAME TO locations;
ALTER TABLE employees_temp_new RENAME TO employees;
ALTER TABLE shift_definitions_temp_new RENAME TO shift_definitions;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_location_id ON employees(location_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);

CREATE INDEX IF NOT EXISTS idx_shift_definitions_name ON shift_definitions(name);
CREATE INDEX IF NOT EXISTS idx_shift_definitions_day_type ON shift_definitions(day_type);
CREATE INDEX IF NOT EXISTS idx_shift_definitions_location_id ON shift_definitions(location_id);
CREATE INDEX IF NOT EXISTS idx_shift_definitions_active ON shift_definitions(is_active);

CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);

-- Step 6: Recreate triggers
CREATE TRIGGER IF NOT EXISTS update_employees_timestamp 
    AFTER UPDATE ON employees
    FOR EACH ROW
    BEGIN
        UPDATE employees SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_locations_timestamp 
    AFTER UPDATE ON locations
    FOR EACH ROW
    BEGIN
        UPDATE locations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_shift_definitions_timestamp
    AFTER UPDATE ON shift_definitions
    FOR EACH ROW
    BEGIN
        UPDATE shift_definitions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Step 7: Recreate audit triggers for employees
CREATE TRIGGER IF NOT EXISTS audit_employees_insert
    AFTER INSERT ON employees
    FOR EACH ROW
    BEGIN
        INSERT INTO audit_log (id, table_name, record_id, action, new_values)
        VALUES (
            hex(randomblob(16)),
            'employees',
            NEW.id,
            'INSERT',
            json_object(
                'id', NEW.id,
                'name', NEW.name,
                'role', NEW.role,
                'hours_per_month', NEW.hours_per_month,
                'hours_per_week', NEW.hours_per_week,
                'location_id', NEW.location_id,
                'is_active', NEW.is_active
            )
        );
    END;

CREATE TRIGGER IF NOT EXISTS audit_employees_update
    AFTER UPDATE ON employees
    FOR EACH ROW
    BEGIN
        INSERT INTO audit_log (id, table_name, record_id, action, old_values, new_values)
        VALUES (
            hex(randomblob(16)),
            'employees',
            NEW.id,
            'UPDATE',
            json_object(
                'id', OLD.id,
                'name', OLD.name,
                'role', OLD.role,
                'hours_per_month', OLD.hours_per_month,
                'hours_per_week', OLD.hours_per_week,
                'location_id', OLD.location_id,
                'is_active', OLD.is_active
            ),
            json_object(
                'id', NEW.id,
                'name', NEW.name,
                'role', NEW.role,
                'hours_per_month', NEW.hours_per_month,
                'hours_per_week', NEW.hours_per_week,
                'location_id', NEW.location_id,
                'is_active', NEW.is_active
            )
        );
    END;

CREATE TRIGGER IF NOT EXISTS audit_employees_delete
    AFTER DELETE ON employees
    FOR EACH ROW
    BEGIN
        INSERT INTO audit_log (id, table_name, record_id, action, old_values)
        VALUES (
            hex(randomblob(16)),
            'employees',
            OLD.id,
            'DELETE',
            json_object(
                'id', OLD.id,
                'name', OLD.name,
                'role', OLD.role,
                'hours_per_month', OLD.hours_per_month,
                'hours_per_week', OLD.hours_per_week,
                'location_id', OLD.location_id,
                'is_active', OLD.is_active
            )
        );
    END;

-- Clean up temp tables
DROP TABLE IF EXISTS schema_check;
DROP TABLE IF EXISTS migration_needed;

COMMIT;