-- Migration 002: Rollen-Tabelle hinzufügen
-- Erstellt eine dedizierte Tabelle für Rollendefinitionen

-- Rollen-Tabelle
CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- "ShiftLeader", "Specialist", "Assistant"
    display_name TEXT NOT NULL, -- "Schichtleiter", "Fachkraft", "Hilfskraft"
    description TEXT,
    color TEXT NOT NULL DEFAULT '#1976d2',
    priority INTEGER NOT NULL DEFAULT 1,
    permissions TEXT NOT NULL DEFAULT '[]', -- JSON-Array mit Berechtigungen
    requirements TEXT NOT NULL DEFAULT '[]', -- JSON-Array mit Anforderungen
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Berechtigungen-Tabelle
CREATE TABLE IF NOT EXISTS role_permissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general', -- 'shift_planning', 'management', 'administration', 'reporting'
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Anforderungen-Tabelle
CREATE TABLE IF NOT EXISTS role_requirements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'qualification', -- 'qualification', 'experience', 'certification'
    required BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_active ON roles(is_active);
CREATE INDEX IF NOT EXISTS idx_roles_priority ON roles(priority);

CREATE INDEX IF NOT EXISTS idx_role_permissions_category ON role_permissions(category);
CREATE INDEX IF NOT EXISTS idx_role_permissions_active ON role_permissions(is_active);

CREATE INDEX IF NOT EXISTS idx_role_requirements_type ON role_requirements(type);
CREATE INDEX IF NOT EXISTS idx_role_requirements_active ON role_requirements(is_active);

-- Trigger für updated_at Timestamps
CREATE TRIGGER IF NOT EXISTS update_roles_timestamp 
    AFTER UPDATE ON roles
    FOR EACH ROW
    BEGIN
        UPDATE roles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;