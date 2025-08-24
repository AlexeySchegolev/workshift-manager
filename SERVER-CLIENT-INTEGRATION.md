# Server-Client-Architektur Integration

Diese Anleitung beschreibt die vollständige Integration der neuen Server-Client-Architektur für die Schichtplanung-Anwendung.

## 🏗️ Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + TypeScript)              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Components  │  │   Pages     │  │   Hooks     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ ApiService  │  │ State Mgmt  │  │ UI Services │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                 SERVER (Node.js + Express + TypeScript)     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ API Routes  │  │ Middleware  │  │ Validation  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Services    │  │ Database    │  │ Logging     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                         SQLite Database
                              │
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                        │
├─────────────────────────────────────────────────────────────┤
│  employees | locations | shift_plans | shift_rules          │
│  shift_assignments | constraint_violations | audit_log      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Setup & Installation

### 1. Backend-Server Setup

```bash
# 1. In das Server-Verzeichnis wechseln
cd server

# 2. Dependencies installieren
npm install

# 3. Umgebungsvariablen konfigurieren
cp .env.example .env
# .env nach Bedarf anpassen

# 4. TypeScript kompilieren
npm run build

# 5. Datenbank initialisieren
npm run migrate
npm run seed

# 6. Server starten
npm run dev  # Development
# oder
npm start    # Production
```

### 2. Frontend-Integration

```bash
# 1. Umgebungsvariablen für Frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:3001/api

# 2. Frontend starten (separates Terminal)
npm start
```

## 📊 Datenmigration

### Automatische Migration

Die bestehenden Daten werden automatisch beim ersten Server-Start migriert:

1. **Mitarbeiterdaten** aus `src/data/employeeData.ts`
2. **Standortdaten** aus `src/data/locationData.ts`
3. **Schichtregeln** aus `src/data/defaultRules.ts`

### Manuelle Migration

Falls eine manuelle Migration erforderlich ist:

```bash
cd server
node dist/database/seed.js --clear  # Alte Daten löschen
node dist/database/seed.js          # Neue Daten einfügen
```

## 🔌 API-Integration

### Frontend-Service-Anpassung

Der neue [`ApiService`](src/services/ApiService.ts) ersetzt die lokalen Services:

```typescript
// Vorher (localStorage)
import { PersistenceService } from './PersistenceService';
const employees = PersistenceService.loadEmployees();

// Nachher (API)
import { ApiService } from './ApiService';
const response = await ApiService.getEmployees();
const employees = response.data;
```

### Beispiel-Integration in Komponenten

```typescript
import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/ApiService';
import { Employee } from '../models/interfaces';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getEmployees();
        setEmployees(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <div>
      {employees.map(emp => (
        <div key={emp.id}>{emp.name} - {emp.role}</div>
      ))}
    </div>
  );
};
```

## 🔄 Schichtplanung-Integration

### Neue Schichtplan-Generierung

```typescript
import { ApiService } from '../services/ApiService';

const generatePlan = async (year: number, month: number) => {
  try {
    const result = await ApiService.generateShiftPlan({
      year,
      month,
      useRelaxedRules: false
    });
    
    console.log('Schichtplan generiert:', result);
    // result.shiftPlan - Der generierte Plan
    // result.violations - Regelverletzungen
    // result.statistics - Planungsstatistiken
    
  } catch (error) {
    console.error('Fehler bei Schichtplan-Generierung:', error);
  }
};
```

### Bestehende Komponenten anpassen

Die wichtigsten Komponenten müssen angepasst werden:

1. **ShiftPlanningPage.tsx** - API-Calls statt lokale Services
2. **EmployeePage.tsx** - CRUD-Operationen über API
3. **LocationManagementPage.tsx** - Standort-Management über API
4. **ShiftTable.tsx** - Daten von API laden

## 🔧 Entwicklung & Testing

### Parallele Entwicklung

```bash
# Terminal 1: Backend-Server
cd server
npm run dev

# Terminal 2: Frontend-Server  
npm start

# Terminal 3: API-Tests
curl http://localhost:3001/api/employees
```

### Health Checks

```bash
# Server-Status prüfen
curl http://localhost:3001/health

# API-Endpunkte testen
curl http://localhost:3001/api
curl http://localhost:3001/api/employees/stats
```

## 🛠️ Konfiguration

### Backend-Konfiguration (`server/.env`)

```env
NODE_ENV=development
PORT=3001
DATABASE_PATH=./data/schichtplanung.db
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=1000
LOG_LEVEL=debug
```

### Frontend-Konfiguration (`.env`)

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
REACT_APP_ENABLE_API=true
REACT_APP_DEBUG=true
```

## 🔒 Sicherheit

### CORS-Konfiguration

Der Server ist für lokale Entwicklung konfiguriert:

```typescript
// server/src/server.ts
cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
})
```

### Rate Limiting

API-Calls sind limitiert:
- Development: 1000 Requests/15min
- Production: 100 Requests/15min

## 📈 Performance

### Caching-Strategie

1. **Browser-Cache** - HTTP-Headers für statische Daten
2. **Memory-Cache** - Häufig abgerufene Daten im Server
3. **Database-Indizes** - Optimierte Datenbankabfragen

### Optimierungen

```typescript
// Paginierung für große Datensätze
const employees = await ApiService.getEmployees({
  page: 1,
  limit: 20,
  role: 'Pfleger'
});

// Lazy Loading für Schichtpläne
const plan = await ApiService.getShiftPlan(2024, 1);
```

## 🐛 Troubleshooting

### Häufige Probleme

1. **CORS-Fehler**
   ```
   Lösung: ALLOWED_ORIGINS in server/.env prüfen
   ```

2. **API nicht erreichbar**
   ```bash
   # Server-Status prüfen
   curl http://localhost:3001/health
   
   # Port-Konflikte prüfen
   lsof -ti:3001
   ```

3. **Datenbank-Fehler**
   ```bash
   # Datenbank zurücksetzen
   cd server
   rm -f data/*.db
   npm run migrate
   npm run seed
   ```

4. **TypeScript-Fehler**
   ```bash
   # Backend kompilieren
   cd server
   npm run build
   
   # Frontend neu starten
   npm start
   ```

### Debug-Modus

```bash
# Backend mit Debug-Logs
cd server
DEBUG=* npm run dev

# Frontend mit API-Debug
REACT_APP_DEBUG=true npm start
```

## 🚀 Deployment

### Production-Setup

```bash
# 1. Backend bauen
cd server
npm run build

# 2. Frontend bauen
npm run build

# 3. Server starten
cd server
NODE_ENV=production npm start
```

### Docker-Deployment

```dockerfile
# server/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["npm", "start"]
```

## 📋 Checkliste

### Vor dem Go-Live

- [ ] Backend-Server läuft stabil
- [ ] Datenbank ist migriert
- [ ] API-Endpunkte funktionieren
- [ ] Frontend kann mit API kommunizieren
- [ ] Schichtplanung funktioniert über API
- [ ] Error-Handling implementiert
- [ ] Logging konfiguriert
- [ ] Performance getestet
- [ ] Security-Headers gesetzt
- [ ] Backup-Strategie definiert

### Nach dem Go-Live

- [ ] Monitoring eingerichtet
- [ ] Log-Rotation konfiguriert
- [ ] Backup-Jobs laufen
- [ ] Performance-Metriken überwachen
- [ ] User-Feedback sammeln

## 📞 Support

Bei Problemen oder Fragen:

1. **Logs prüfen**: `server/logs/` oder `pm2 logs`
2. **Health Check**: `curl http://localhost:3001/health`
3. **API-Status**: `curl http://localhost:3001/api`
4. **Datenbank-Status**: SQLite-Browser verwenden

---

**Hinweis**: Diese Architektur ist vollständig rückwärtskompatibel. Das Frontend kann weiterhin mit localStorage arbeiten, wenn der Server nicht verfügbar ist.