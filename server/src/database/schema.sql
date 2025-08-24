-- Schichtplanung Datenbank Schema
-- SQLite-Datenbank für die Schichtplanung-Anwendung

-- Mitarbeiter-Tabelle
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    hours_per_month REAL NOT NULL,
    hours_per_week REAL,
    location_id INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Standorte-Tabelle
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    manager TEXT,
    capacity INTEGER NOT NULL DEFAULT 0,
    operating_hours TEXT NOT NULL, -- JSON-String mit Öffnungszeiten
    specialties TEXT NOT NULL, -- JSON-Array mit Spezialisierungen
    equipment TEXT NOT NULL, -- JSON-Array mit Ausrüstung
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Schichtdefinitionen-Tabelle
CREATE TABLE IF NOT EXISTS shift_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL, -- "F", "S", "S0", "S1", "FS", etc.
    display_name TEXT NOT NULL, -- "Frühschicht", "Spätschicht", etc.
    start_time TEXT NOT NULL, -- Format: "HH:MM"
    end_time TEXT NOT NULL, -- Format: "HH:MM"
    hours REAL NOT NULL, -- Berechnete Stunden
    day_type TEXT NOT NULL CHECK (day_type IN ('longDays', 'shortDays', 'both')),
    location_id INTEGER, -- Foreign Key zu locations Tabelle, oder NULL für beide
    allowed_roles TEXT NOT NULL, -- JSON-Array mit erlaubten Rollen
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Schichtregeln-Tabelle
CREATE TABLE IF NOT EXISTS shift_rules (
    id TEXT PRIMARY KEY,
    min_nurses_per_shift INTEGER NOT NULL DEFAULT 4,
    min_nurse_managers_per_shift INTEGER NOT NULL DEFAULT 1,
    min_helpers INTEGER NOT NULL DEFAULT 1,
    max_saturdays_per_month INTEGER NOT NULL DEFAULT 1,
    max_consecutive_same_shifts INTEGER NOT NULL DEFAULT 0,
    weekly_hours_overflow_tolerance REAL NOT NULL DEFAULT 0.1,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Schichtpläne-Tabelle
CREATE TABLE IF NOT EXISTS shift_plans (
    id TEXT PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    plan_data TEXT NOT NULL, -- JSON-serialized MonthlyShiftPlan
    employee_availability TEXT, -- JSON-serialized EmployeeAvailability
    statistics TEXT, -- JSON-serialized PlanningStatistics
    is_finalized BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month)
);

-- Einzelne Schichtzuweisungen-Tabelle
CREATE TABLE IF NOT EXISTS shift_assignments (
    id TEXT PRIMARY KEY,
    shift_plan_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    date TEXT NOT NULL, -- Format: "DD.MM.YYYY"
    shift_type TEXT NOT NULL, -- "F", "S", "FS", etc.
    hours REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_plan_id) REFERENCES shift_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE(shift_plan_id, employee_id, date)
);

-- Constraint-Verletzungen-Tabelle
CREATE TABLE IF NOT EXISTS constraint_violations (
    id TEXT PRIMARY KEY,
    shift_plan_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hard', 'soft')),
    rule TEXT NOT NULL,
    message TEXT NOT NULL,
    employee_id TEXT,
    date TEXT, -- Format: "DD.MM.YYYY"
    severity INTEGER DEFAULT 1, -- 1=niedrig, 2=mittel, 3=hoch
    is_resolved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_plan_id) REFERENCES shift_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Audit-Log-Tabelle für Änderungen
CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    user_id TEXT, -- Für zukünftige Authentifizierung
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_location_id ON employees(location_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active);

CREATE INDEX IF NOT EXISTS idx_shift_definitions_name ON shift_definitions(name);
CREATE INDEX IF NOT EXISTS idx_shift_definitions_day_type ON shift_definitions(day_type);
CREATE INDEX IF NOT EXISTS idx_shift_definitions_location_id ON shift_definitions(location_id);
CREATE INDEX IF NOT EXISTS idx_shift_definitions_active ON shift_definitions(is_active);

CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);

CREATE INDEX IF NOT EXISTS idx_shift_plans_year_month ON shift_plans(year, month);
CREATE INDEX IF NOT EXISTS idx_shift_plans_finalized ON shift_plans(is_finalized);

CREATE INDEX IF NOT EXISTS idx_shift_assignments_plan ON shift_assignments(shift_plan_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_employee ON shift_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_shift_assignments_date ON shift_assignments(date);

CREATE INDEX IF NOT EXISTS idx_constraint_violations_plan ON constraint_violations(shift_plan_id);
CREATE INDEX IF NOT EXISTS idx_constraint_violations_type ON constraint_violations(type);
CREATE INDEX IF NOT EXISTS idx_constraint_violations_resolved ON constraint_violations(is_resolved);

CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);

-- Trigger für updated_at Timestamps
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

CREATE TRIGGER IF NOT EXISTS update_shift_rules_timestamp
    AFTER UPDATE ON shift_rules
    FOR EACH ROW
    BEGIN
        UPDATE shift_rules SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_shift_plans_timestamp 
    AFTER UPDATE ON shift_plans
    FOR EACH ROW
    BEGIN
        UPDATE shift_plans SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Audit-Trigger für Mitarbeiter
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