# Schichtplanung Backend Server

Backend-Server für die Schichtplanung-Anwendung mit Node.js, Express, TypeScript und SQLite.

## 🏗️ Architektur

```
server/
├── src/
│   ├── database/           # Datenbank-Management
│   │   ├── database.ts     # SQLite-Verbindung
│   │   ├── migrations.ts   # Migrations-System
│   │   ├── schema.sql      # Datenbankschema
│   │   └── seed.ts         # Seed-Daten
│   ├── routes/             # API-Routen
│   │   ├── employees.ts    # Mitarbeiter-API
│   │   ├── locations.ts    # Standort-API
│   │   ├── shift-plans.ts  # Schichtplan-API
│   │   └── shift-rules.ts  # Schichtregeln-API
│   ├── services/           # Business Logic
│   │   └── ShiftPlanningService.ts
│   ├── types/              # TypeScript-Interfaces
│   │   └── interfaces.ts
│   ├── utils/              # Hilfsfunktionen
│   │   └── logger.ts       # Winston-Logger
│   ├── validation/         # Zod-Schemas
│   │   └── schemas.ts
│   └── server.ts           # Express-Server
├── data/                   # SQLite-Datenbanken
├── logs/                   # Log-Dateien (Production)
├── backups/                # Datenbank-Backups
├── package.json
├── tsconfig.json
└── .env.example
```

## 🚀 Installation & Setup

### 1. Dependencies installieren

```bash
cd server
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
# .env-Datei nach Bedarf anpassen
```

### 3. Datenbank initialisieren

```bash
# Migrationen ausführen und Seed-Daten einfügen
npm run migrate
npm run seed
```

### 4. Server starten

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📊 Datenbank

### Schema

- **employees** - Mitarbeiterdaten mit Rollen und Arbeitszeiten
- **locations** - Standortinformationen mit Öffnungszeiten
- **shift_plans** - Monatliche Schichtpläne
- **shift_rules** - Konfigurierbare Schichtregeln
- **shift_assignments** - Einzelne Schichtzuweisungen
- **constraint_violations** - Regelverletzungen für Audit
- **audit_log** - Änderungsprotokoll

### Migrationen

```bash
# Alle Migrationen ausführen
npm run migrate

# Migrations-Status anzeigen
node dist/database/migrations.js --status

# Backup vor Migrationen
node dist/database/migrations.js --backup
```

### Seed-Daten

```bash
# Seed-Daten einfügen
npm run seed

# Seed-Status prüfen
node dist/database/seed.js --status

# Seed-Daten löschen (für Tests)
node dist/database/seed.js --clear
```

## 🔌 API-Endpunkte

### Mitarbeiter (`/api/employees`)

```http
GET    /api/employees              # Alle Mitarbeiter (mit Paginierung)
GET    /api/employees/:id          # Einzelner Mitarbeiter
POST   /api/employees              # Neuen Mitarbeiter erstellen
PUT    /api/employees/:id          # Mitarbeiter aktualisieren
DELETE /api/employees/:id          # Mitarbeiter deaktivieren
GET    /api/employees/stats        # Mitarbeiter-Statistiken
```

### Schichtpläne (`/api/shift-plans`)

```http
GET    /api/shift-plans                    # Alle Schichtpläne
GET    /api/shift-plans/:year/:month       # Schichtplan für Monat
POST   /api/shift-plans/generate           # Neuen Schichtplan generieren
PUT    /api/shift-plans/:id/finalize       # Schichtplan finalisieren
DELETE /api/shift-plans/:id               # Schichtplan löschen
GET    /api/shift-plans/stats              # Schichtplan-Statistiken
```

### Standorte (`/api/locations`)

```http
GET    /api/locations              # Alle Standorte
GET    /api/locations/:id          # Einzelner Standort
POST   /api/locations              # Neuen Standort erstellen
PUT    /api/locations/:id          # Standort aktualisieren
DELETE /api/locations/:id          # Standort deaktivieren
```

### Schichtregeln (`/api/shift-rules`)

```http
GET    /api/shift-rules            # Aktuelle Schichtregeln
PUT    /api/shift-rules            # Schichtregeln aktualisieren
GET    /api/shift-rules/history    # Regelhistorie
```

### System

```http
GET    /health                     # Health Check
GET    /api                        # API-Info
GET    /api/test                   # Test-Endpunkt
```

## 🔧 Entwicklung

### Scripts

```bash
npm run dev          # Development-Server mit Hot Reload
npm run build        # TypeScript kompilieren
npm run start        # Production-Server starten
npm run test         # Tests ausführen
npm run test:watch   # Tests im Watch-Modus
npm run migrate      # Datenbank-Migrationen
npm run seed         # Seed-Daten einfügen
```

### Logging

Der Server verwendet Winston für strukturiertes Logging:

```typescript
import { logger, loggers } from '@/utils/logger';

// Allgemeine Logs
logger.info('Server gestartet');
logger.error('Fehler aufgetreten', error);

// Kategorisierte Logs
loggers.api('API-Aufruf', { endpoint: '/employees' });
loggers.database('Query ausgeführt', { query: 'SELECT * FROM employees' });
loggers.service('Service-Operation', { operation: 'generateShiftPlan' });
```

### Validierung

Zod-Schemas für Request-Validierung:

```typescript
import { validateRequestBody, EmployeeCreateSchema } from '@/validation/schemas';

router.post('/', validateRequestBody(EmployeeCreateSchema), (req, res) => {
  const validatedData = req.validatedBody;
  // ...
});
```

## 🔒 Sicherheit

- **Helmet** - Security Headers
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - API-Rate-Limiting
- **Input Validation** - Zod-Schema-Validierung
- **SQL Injection Protection** - Prepared Statements

## 📈 Performance

- **Compression** - Gzip-Komprimierung
- **Connection Pooling** - SQLite-Optimierungen
- **Caching** - In-Memory-Cache für häufige Abfragen
- **Indizes** - Datenbankindizes für Performance

## 🚀 Deployment

### Docker (empfohlen)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["npm", "start"]
```

### PM2

```bash
npm install -g pm2
pm2 start dist/server.js --name schichtplanung-api
pm2 startup
pm2 save
```

### Umgebungsvariablen (Production)

```env
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/schichtplanung.db
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## 🔍 Monitoring

### Health Check

```bash
curl http://localhost:3001/health
```

### Logs

```bash
# Development
tail -f logs/combined.log

# Production mit PM2
pm2 logs schichtplanung-api
```

### Datenbank-Statistiken

```bash
curl http://localhost:3001/api/employees/stats
curl http://localhost:3001/api/shift-plans/stats
```

## 🧪 Testing

```bash
# Alle Tests
npm test

# Tests mit Coverage
npm run test:coverage

# Integration Tests
npm run test:integration

# API Tests mit curl
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","role":"Pfleger","hoursPerMonth":160}'
```

## 🐛 Troubleshooting

### Häufige Probleme

1. **Port bereits belegt**
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **Datenbank-Fehler**
   ```bash
   rm -f data/*.db
   npm run migrate
   npm run seed
   ```

3. **TypeScript-Fehler**
   ```bash
   npm run build
   # Fehler in der Konsole prüfen
   ```

### Debug-Modus

```bash
DEBUG=* npm run dev
```

## 📝 API-Dokumentation

Die vollständige API-Dokumentation ist verfügbar unter:
- Development: http://localhost:3001/api
- Swagger UI: http://localhost:3001/api/docs (wenn aktiviert)

## 🤝 Beitragen

1. Fork des Repositories
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.