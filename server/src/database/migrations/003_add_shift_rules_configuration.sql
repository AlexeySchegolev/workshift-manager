-- Migration 003: Erweiterte Schichtregeln-Konfiguration
-- Erstellt Tabellen für konfigurierbare Schichtregeln

-- Schichtregeln-Konfigurationen (Haupttabelle)
CREATE TABLE IF NOT EXISTS shift_rules_configurations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Globale Schichtregeln für eine Konfiguration
CREATE TABLE IF NOT EXISTS global_shift_rules (
    id TEXT PRIMARY KEY,
    configuration_id TEXT NOT NULL,
    max_consecutive_days INTEGER NOT NULL DEFAULT 5,
    min_rest_hours_between_shifts INTEGER NOT NULL DEFAULT 11,
    max_overtime_percentage INTEGER NOT NULL DEFAULT 10,
    max_saturdays_per_month INTEGER NOT NULL DEFAULT 1,
    allow_back_to_back_shifts BOOLEAN DEFAULT 0,
    preferred_shift_rotation TEXT CHECK (preferred_shift_rotation IN ('forward', 'backward', 'none')) DEFAULT 'forward',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (configuration_id) REFERENCES shift_rules_configurations(id) ON DELETE CASCADE
);

-- Konfigurierbare Schichten
CREATE TABLE IF NOT EXISTS configurable_shifts (
    id TEXT PRIMARY KEY,
    configuration_id TEXT NOT NULL,
    name TEXT NOT NULL, -- Schichtcode (F, S, 4, 5, etc.)
    display_name TEXT NOT NULL,
    start_time TEXT NOT NULL, -- Format: "HH:MM"
    end_time TEXT NOT NULL, -- Format: "HH:MM"
    location TEXT CHECK (location IN ('Elmshorn', 'Uetersen', 'Both')),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (configuration_id) REFERENCES shift_rules_configurations(id) ON DELETE CASCADE
);

-- Tag-Typen für Schichten (Many-to-Many Beziehung)
CREATE TABLE IF NOT EXISTS shift_day_types (
    id TEXT PRIMARY KEY,
    shift_id TEXT NOT NULL,
    day_type TEXT NOT NULL CHECK (day_type IN ('longDay', 'shortDay', 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES configurable_shifts(id) ON DELETE CASCADE,
    UNIQUE(shift_id, day_type)
);

-- Rollenanforderungen für Schichten
CREATE TABLE IF NOT EXISTS shift_role_requirements (
    id TEXT PRIMARY KEY,
    shift_id TEXT NOT NULL,
    role_id TEXT NOT NULL, -- Referenz auf roles.id
    role_name TEXT NOT NULL, -- Denormalisiert für Performance
    min_count INTEGER NOT NULL DEFAULT 1,
    max_count INTEGER, -- NULL bedeutet unbegrenzt
    priority INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES configurable_shifts(id) ON DELETE CASCADE,
    UNIQUE(shift_id, role_id)
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_shift_rules_configurations_active ON shift_rules_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_shift_rules_configurations_default ON shift_rules_configurations(is_default);

CREATE INDEX IF NOT EXISTS idx_global_shift_rules_config ON global_shift_rules(configuration_id);

CREATE INDEX IF NOT EXISTS idx_configurable_shifts_config ON configurable_shifts(configuration_id);
CREATE INDEX IF NOT EXISTS idx_configurable_shifts_name ON configurable_shifts(name);
CREATE INDEX IF NOT EXISTS idx_configurable_shifts_location ON configurable_shifts(location);
CREATE INDEX IF NOT EXISTS idx_configurable_shifts_active ON configurable_shifts(is_active);

CREATE INDEX IF NOT EXISTS idx_shift_day_types_shift ON shift_day_types(shift_id);
CREATE INDEX IF NOT EXISTS idx_shift_day_types_type ON shift_day_types(day_type);

CREATE INDEX IF NOT EXISTS idx_shift_role_requirements_shift ON shift_role_requirements(shift_id);
CREATE INDEX IF NOT EXISTS idx_shift_role_requirements_role ON shift_role_requirements(role_id);

-- Trigger für updated_at Timestamps
CREATE TRIGGER IF NOT EXISTS update_shift_rules_configurations_timestamp
    AFTER UPDATE ON shift_rules_configurations
    FOR EACH ROW
    BEGIN
        UPDATE shift_rules_configurations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_global_shift_rules_timestamp
    AFTER UPDATE ON global_shift_rules
    FOR EACH ROW
    BEGIN
        UPDATE global_shift_rules SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_configurable_shifts_timestamp
    AFTER UPDATE ON configurable_shifts
    FOR EACH ROW
    BEGIN
        UPDATE configurable_shifts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_shift_role_requirements_timestamp
    AFTER UPDATE ON shift_role_requirements
    FOR EACH ROW
    BEGIN
        UPDATE shift_role_requirements SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;