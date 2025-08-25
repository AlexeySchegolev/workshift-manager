-- Schichtplanung Datenbank Schema
-- PostgreSQL-Datenbank für die Schichtplanung-Anwendung

-- UUID-Extension aktivieren
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger-Funktion für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Standorte-Tabelle (zuerst wegen Foreign Key Dependencies)
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    manager VARCHAR(255),
    capacity INTEGER NOT NULL DEFAULT 0 CHECK (capacity >= 0),
    operating_hours JSONB NOT NULL,
    specialties JSONB NOT NULL,
    equipment JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mitarbeiter-Tabelle
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    hours_per_month DECIMAL(5,2) NOT NULL CHECK (hours_per_month > 0),
    hours_per_week DECIMAL(5,2) CHECK (hours_per_week > 0),
    location_id INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- Schichtdefinitionen-Tabelle
CREATE TABLE IF NOT EXISTS shift_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(10) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    hours DECIMAL(4,2) NOT NULL CHECK (hours > 0),
    day_type VARCHAR(20) NOT NULL CHECK (day_type IN ('longDays', 'shortDays', 'both')),
    location_id INTEGER,
    allowed_roles JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    UNIQUE(name, location_id)
);

-- Schichtregeln-Tabelle
CREATE TABLE IF NOT EXISTS shift_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    min_nurses_per_shift INTEGER NOT NULL DEFAULT 4 CHECK (min_nurses_per_shift >= 0),
    min_nurse_managers_per_shift INTEGER NOT NULL DEFAULT 1 CHECK (min_nurse_managers_per_shift >= 0),
    min_helpers INTEGER NOT NULL DEFAULT 1 CHECK (min_helpers >= 0),
    max_saturdays_per_month INTEGER NOT NULL DEFAULT 1 CHECK (max_saturdays_per_month >= 0),
    max_consecutive_same_shifts INTEGER NOT NULL DEFAULT 0 CHECK (max_consecutive_same_shifts >= 0),
    weekly_hours_overflow_tolerance DECIMAL(3,2) NOT NULL DEFAULT 0.1 CHECK (weekly_hours_overflow_tolerance >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schichtpläne-Tabelle
CREATE TABLE IF NOT EXISTS shift_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    plan_data JSONB NOT NULL,
    employee_availability JSONB,
    statistics JSONB,
    is_finalized BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month)
);

-- Einzelne Schichtzuweisungen-Tabelle
CREATE TABLE IF NOT EXISTS shift_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_plan_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    date DATE NOT NULL,
    shift_type VARCHAR(10) NOT NULL,
    hours DECIMAL(4,2) NOT NULL CHECK (hours > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_plan_id) REFERENCES shift_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE(shift_plan_id, employee_id, date)
);

-- Constraint-Verletzungen-Tabelle
CREATE TABLE IF NOT EXISTS constraint_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_plan_id UUID NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('hard', 'soft')),
    rule VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    employee_id UUID,
    date DATE,
    severity INTEGER DEFAULT 1 CHECK (severity IN (1, 2, 3)),
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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