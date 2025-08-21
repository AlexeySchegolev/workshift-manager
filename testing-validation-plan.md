# Test- und Validierungsplan für den verbesserten Schichtplanungs-Algorithmus

Um sicherzustellen, dass der überarbeitete Algorithmus korrekt funktioniert und alle Anforderungen erfüllt, ist ein strukturierter Test- und Validierungsprozess erforderlich. Dieser Plan beschreibt die Methoden, Testfälle und Erfolgskriterien für die Validierung.

## Testmethoden

### 1. Modulare Komponententests

Jede Kernkomponente des Algorithmus sollte isoliert getestet werden:

```typescript
// Beispiel für einen Komponententest der Constraint-Überprüfung
describe('ShiftPlanningConstraintService', () => {
  describe('checkHardConstraints', () => {
    it('sollte korrekte Besetzungsanforderungen erkennen', () => {
      // Testdaten
      const mockShiftPlan = createMockShiftPlan();
      const mockEmployees = createMockEmployees();
      
      // Ausführung
      const violations = checkHardConstraints(mockShiftPlan, mockEmployees);
      
      // Überprüfung
      expect(violations).toHaveLength(0);
    });
    
    it('sollte Verstöße gegen Besetzungsanforderungen melden', () => {
      // Testdaten mit absichtlichem Verstoß
      const mockShiftPlan = createMockShiftPlanWithViolation();
      const mockEmployees = createMockEmployees();
      
      // Ausführung
      const violations = checkHardConstraints(mockShiftPlan, mockEmployees);
      
      // Überprüfung
      expect(violations).toHaveLength(1);
      expect(violations[0].type).toBe('StaffingViolation');
    });
  });
});
```

### 2. Integrierte Algorithmus-Tests

Testen des Zusammenspiels der Komponenten im vollständigen Algorithmus:

```typescript
describe('ShiftPlanningBacktrackingService', () => {
  describe('assignDayWithBacktracking', () => {
    it('sollte einen gültigen Plan für einen Tag generieren', () => {
      // Testdaten
      const date = new Date(2023, 6, 10); // Ein Montag
      const employees = createTestEmployees();
      const availability = initializeAvailability(employees);
      const shiftPlan = {};
      
      // Ausführung
      const success = assignDayWithBacktracking(date, employees, availability, shiftPlan);
      
      // Überprüfung
      expect(success).toBe(true);
      
      const dayKey = formatDayKey(date);
      expect(shiftPlan[dayKey]).not.toBeNull();
      
      // Überprüfen der Schichtbesetzung
      const dayPlan = shiftPlan[dayKey];
      
      // Überprüfen der Schichtleiter-Anforderung
      const hasSchichtleiter = checkRolePresence(dayPlan, employees, 'Schichtleiter');
      expect(hasSchichtleiter).toBe(true);
      
      // Überprüfen der Pfleger-Anforderung (mindestens 4)
      const pflegerCount = countRoleAssignments(dayPlan, employees, 'Pfleger');
      expect(pflegerCount).toBeGreaterThanOrEqual(4);
      
      // Überprüfen der Pflegehelfer-Anforderung (mindestens 1)
      const helferCount = countRoleAssignments(dayPlan, employees, 'Pflegehelfer');
      expect(helferCount).toBeGreaterThanOrEqual(1);
    });
  });
});
```

### 3. End-to-End-Tests

Vollständige Tests der Schichtplangenerierung für einen ganzen Monat:

```typescript
describe('ShiftPlanningService', () => {
  describe('generateShiftPlan', () => {
    it('sollte einen vollständigen Monatsplan generieren', () => {
      // Testdaten
      const year = 2023;
      const month = 7; // Juli
      const employees = createRealWorldEmployees();
      
      // Ausführung
      const { shiftPlan, employeeAvailability } = generateShiftPlan(employees, year, month);
      
      // Überprüfung
      const daysInMonth = new Date(year, month, 0).getDate();
      let validDays = 0;
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayKey = formatDayKey(date);
        
        // Sonntage haben keinen Plan
        if (date.getDay() === 0) {
          expect(shiftPlan[dayKey]).toBeNull();
          continue;
        }
        
        if (shiftPlan[dayKey] !== null) {
          validDays++;
        }
      }
      
      // Erfolgskriterium: Mindestens 90% der Tage sollten gültig geplant sein
      const nonSundayDays = daysInMonth - countSundays(year, month);
      const successRate = (validDays / nonSundayDays) * 100;
      
      expect(successRate).toBeGreaterThanOrEqual(90);
      
      // Überprüfen der Constraints
      const violations = checkAllConstraints(shiftPlan, employees, employeeAvailability);
      expect(violations.filter(v => v.type === 'StaffingViolation')).toHaveLength(0);
    });
  });
});
```

### 4. Leistungstests

Überprüfung der Algorithmus-Effizienz:

```typescript
describe('Leistungstests', () => {
  it('sollte den Schichtplan in angemessener Zeit generieren', () => {
    // Testdaten
    const year = 2023;
    const month = 7;
    const employees = createRealWorldEmployees();
    
    // Zeitmessung
    const startTime = performance.now();
    
    generateShiftPlan(employees, year, month);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Leistungskriterium: Unter 5 Sekunden
    expect(executionTime).toBeLessThan(5000);
  });
});
```

## Testszenarien

### 1. Standard-Testszenario

Ein typischer Monat mit ausreichender Personaldecke:

- **Jahr**: 2023
- **Monat**: Juli (31 Tage, 5 Samstage)
- **Mitarbeiter**: 10 Pfleger, 2 Schichtleiter, 3 Pflegehelfer
- **Erwartetes Ergebnis**: Vollständiger Plan mit 0 Regelverletzungen

### 2. Stressszenario: Knapper Personalstand

Ein Monat mit knapper Personaldecke:

- **Jahr**: 2023
- **Monat**: August (31 Tage, 4 Samstage)
- **Mitarbeiter**: 8 Pfleger, 1 Schichtleiter, 2 Pflegehelfer
- **Erwartetes Ergebnis**: Mindestens 90% der Tage sollten geplant sein

### 3. Extremszenario: Sehr knappe Personaldecke

Ein Monat mit sehr knapper Personaldecke:

- **Jahr**: 2023
- **Monat**: Dezember (31 Tage, 5 Samstage)
- **Mitarbeiter**: 6 Pfleger, 1 Schichtleiter, 1 Pflegehelfer
- **Erwartetes Ergebnis**: Der Algorithmus sollte für die kritischsten Tage Pläne generieren können und klar identifizieren, welche Tage nicht besetzt werden können

### 4. Uetersen-Spezifisches Szenario

Test der Planungsfähigkeiten für die zweite Praxis:

- **Jahr**: 2023
- **Monat**: Juli (31 Tage)
- **Mitarbeiter**: Standard-Team plus 5 Uetersen-spezifische Mitarbeiter
- **Erwartetes Ergebnis**: Sowohl Hauptpraxis als auch Uetersen-Praxis sollten korrekt besetzt sein

## Validierungsmethoden

### 1. Automatisierte Constraint-Validierung

Nach der Generierung jedes Schichtplans sollte eine umfassende Constraint-Überprüfung durchgeführt werden:

```typescript
function validateGeneratedPlan(
  shiftPlan: MonthlyShiftPlan,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability
): ValidationResult {
  // Überprüfung der harten Constraints
  const hardConstraintViolations = checkHardConstraints(shiftPlan, employees);
  
  // Überprüfung der weichen Constraints
  const softConstraintViolations = checkSoftConstraints(shiftPlan, employees, employeeAvailability);
  
  // Vollständigkeitsprüfung
  const completeness = calculatePlanCompleteness(shiftPlan);
  
  // Fairness-Metriken
  const fairnessMetrics = calculateFairnessMetrics(employees, employeeAvailability);
  
  return {
    isValid: hardConstraintViolations.length === 0,
    completeness,
    hardConstraintViolations,
    softConstraintViolations,
    fairnessMetrics
  };
}
```

### 2. Simulierte Nutzung

Die generierten Pläne sollten in einem simulierten Umfeld "verwendet" werden:

```typescript
function simulateMonthExecution(
  shiftPlan: MonthlyShiftPlan,
  employees: Employee[]
): SimulationResult {
  const dailyExecutionResults = [];
  
  for (const dayKey in shiftPlan) {
    const dayPlan = shiftPlan[dayKey];
    if (dayPlan === null) continue;
    
    // Simulation der Tagesausführung
    const dayResult = simulateDayExecution(dayKey, dayPlan, employees);
    dailyExecutionResults.push(dayResult);
  }
  
  return {
    successful: dailyExecutionResults.every(r => r.successful),
    details: dailyExecutionResults
  };
}
```

### 3. Vergleich mit manuellen Plänen

Vergleich der automatisch generierten Pläne mit historischen, manuell erstellten Plänen:

```typescript
function compareWithManualPlan(
  generatedPlan: MonthlyShiftPlan,
  manualPlan: MonthlyShiftPlan
): ComparisonResult {
  // Verschiedene Metriken berechnen
  const coverage = calculateCoverageSimilarity(generatedPlan, manualPlan);
  const roleDistribution = compareRoleDistribution(generatedPlan, manualPlan);
  const workloadDistribution = compareWorkloadDistribution(generatedPlan, manualPlan);
  
  return {
    overallSimilarity: (coverage + roleDistribution + workloadDistribution) / 3,
    coverage,
    roleDistribution,
    workloadDistribution,
    details: generateDetailedComparison(generatedPlan, manualPlan)
  };
}
```

## Erfolgskriterien

Ein erfolgreicher Test der überarbeiteten Implementierung sollte folgende Kriterien erfüllen:

### 1. Korrektheit

- **Harte Constraints**: Keine Verletzungen der harten Constraints in Standard-Szenarien
- **Weiche Constraints**: Minimale Verletzungen der weichen Constraints (< 5%)
- **Vollständigkeit**: Mindestens 95% der Tage in Standard-Szenarien sollten gültig geplant sein

### 2. Robustheit

- **Stress-Szenarien**: Mindestens 90% der Tage in Stress-Szenarien sollten gültig geplant sein
- **Extreme Szenarien**: Der Algorithmus sollte nicht abstürzen und klare Fehlermeldungen liefern

### 3. Effizienz

- **Laufzeit**: Die Plangenerierung für einen Monat sollte unter 5 Sekunden dauern
- **Ressourcenverbrauch**: Der Speicherverbrauch sollte unter 100 MB bleiben

### 4. Praxistauglichkeit

- **Vergleich mit manuellen Plänen**: Die generierten Pläne sollten eine Ähnlichkeit von mindestens 80% mit gut bewerteten manuellen Plänen aufweisen
- **Fairness**: Die Arbeitslast sollte gleichmäßig verteilt sein (Standardabweichung < 10%)
- **Benutzerfeedback**: Positive Bewertung durch tatsächliche Nutzer in einer Pilotphase

## Implementierungsplan

### Phase 1: Vorbereitung

1. Erstellen von Testdaten
2. Implementieren der Testhelfer-Funktionen
3. Einrichten der Testumgebung

### Phase 2: Komponententests

1. Testen des Constraint-Systems
2. Testen der Mitarbeiterauswahl-Heuristik
3. Testen der Schichtpriorisierung

### Phase 3: Integrierte Tests

1. Testen des Backtracking-Algorithmus
2. Testen der Tageszuweisung
3. Testen der Wochenzuweisung

### Phase 4: End-to-End-Tests

1. Testen der vollständigen Plangenerierung
2. Leistungstests
3. Robustheitstests

### Phase 5: Validierung

1. Vergleich mit manuellen Plänen
2. Simulierte Nutzung
3. Benutzer-Feedback sammeln

### Phase 6: Optimierung

1. Beheben identifizierter Probleme
2. Feinabstimmung der Parameter
3. Wiederholung der Tests

## Dokumentation

Alle Testergebnisse sollten detailliert dokumentiert werden, einschließlich:

- Testfälle und Parameter
- Aufgetretene Probleme und Lösungen
- Leistungsmetriken
- Vergleichsanalysen

Die Dokumentation sollte als Grundlage für zukünftige Verbesserungen dienen und die Entscheidungsfindung bei der Weiterentwicklung des Algorithmus unterstützen.

## Fazit

Dieser Test- und Validierungsplan bietet eine umfassende Methodik zur Sicherstellung, dass der überarbeitete Schichtplanungs-Algorithmus korrekt, robust und effizient arbeitet. Durch die methodische Durchführung dieser Tests können wir sicherstellen, dass die neue Implementierung die identifizierten Probleme der aktuellen Lösung behebt und eine zuverlässige Basis für die Schichtplanung bietet.