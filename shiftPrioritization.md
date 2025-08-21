# Optimierte Schichtpriorisierung

Die Reihenfolge, in der Schichten im Planungsalgorithmus zugewiesen werden, hat erheblichen Einfluss auf die Effizienz und Qualität des Ergebnisses. Eine intelligente Priorisierungsstrategie kann den Suchraum erheblich reduzieren und zu besseren Schichtplänen führen.

## Schlüsselkonzepte der Schichtpriorisierung

### 1. Most Constrained Variable (MCV) Prinzip

Das MCV-Prinzip besagt, dass Variablen mit den strengsten Einschränkungen oder den wenigsten Optionen zuerst zugewiesen werden sollten. Angewendet auf die Schichtplanung bedeutet dies:

- Schichten mit spezifischen Rollenanforderungen (z.B. "nur Schichtleiter") haben Priorität
- Schichten mit wenigen qualifizierten Mitarbeitern werden früh zugewiesen
- Schichten an kritischen Tagen (z.B. Samstagen) werden bevorzugt

### 2. Dynamische Priorisierung

Die Priorität einer Schicht sollte nicht statisch sein, sondern dynamisch basierend auf:

- Aktuellem Zustand des Schichtplans
- Verfügbarkeit qualifizierter Mitarbeiter
- Spezifischen Anforderungen des aktuellen Planungstages

### 3. Hierarchische Planungsreihenfolge

Die Planung sollte in einer hierarchischen Struktur erfolgen:

1. Kritische Tage und Schichten zuerst (Samstage, Spezialschichten)
2. Schichten mit spezifischen Rollenanforderungen
3. Regelmäßige Schichten mit höherem Personalbedarf
4. Restliche Schichten

## Implementierung der Schichtpriorisierung

```typescript
/**
 * Hauptfunktion zur Bestimmung der optimalen Zuweisungsreihenfolge für Schichten
 * Gibt eine sortierte Liste von Schichten zurück
 */
function prioritizeShifts(
  date: Date,
  dayShifts: { [key: string]: any },
  employees: Employee[],
  employeeAvailability: EmployeeAvailability,
  currentSchedule: MonthlyShiftPlan
): string[] {
  const weekday = date.getDay();
  const isLongDay = [1, 3, 5].includes(weekday); // Mo, Mi, Fr
  const isSaturday = weekday === 6;
  
  // Alle verfügbaren Schichten für diesen Tag
  const availableShifts = Object.keys(dayShifts);
  
  // Schichtbewertungen berechnen
  const ratedShifts = availableShifts.map(shiftName => ({
    name: shiftName,
    priority: calculateShiftPriority(
      shiftName,
      dayShifts[shiftName],
      isLongDay,
      isSaturday,
      employees,
      employeeAvailability,
      currentSchedule
    )
  }));
  
  // Nach Priorität sortieren (höhere Werte zuerst)
  ratedShifts.sort((a, b) => b.priority - a.priority);
  
  // Sortierte Schichtnamen zurückgeben
  return ratedShifts.map(shift => shift.name);
}

/**
 * Berechnet einen Prioritätswert für eine bestimmte Schicht
 * Höhere Werte bedeuten höhere Priorität
 */
function calculateShiftPriority(
  shiftName: string,
  shift: any,
  isLongDay: boolean,
  isSaturday: boolean,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability,
  currentSchedule: MonthlyShiftPlan
): number {
  // Basispriorität
  let priority = 100;
  
  // 1. Spezialschicht-Priorität
  const specialShiftPriority = getSpecialShiftPriority(shiftName);
  priority += specialShiftPriority;
  
  // 2. Rollenbeschränkungen
  const validRoles = getValidRolesForShift(shiftName);
  const rolePriority = calculateRolePriority(validRoles, employees, employeeAvailability);
  priority += rolePriority;
  
  // 3. Tagestyp-Anpassungen
  if (isSaturday) {
    priority += 50; // Samstage haben höchste Priorität
  } else if (isLongDay) {
    // Lange Tage haben unterschiedliche Prioritäten je nach Schicht
    if (['S0', 'S1'].includes(shiftName)) {
      priority += 30; // Kritische Schichten an langen Tagen
    } else if (['S00', 'S'].includes(shiftName)) {
      priority += 20; // Wichtige Schichten an langen Tagen
    }
  } else {
    // Kurze Tage
    if (shiftName === 'FS') {
      priority += 25; // FS-Schicht an kurzen Tagen hat hohe Priorität
    }
  }
  
  // 4. Verfügbarkeitsanalyse
  const eligibleEmployeeCount = countEligibleEmployees(
    shiftName,
    employees,
    employeeAvailability
  );
  
  // Je weniger geeignete Mitarbeiter, desto höher die Priorität
  if (eligibleEmployeeCount <= 2) {
    priority += 40; // Kritischer Mangel an geeigneten Mitarbeitern
  } else if (eligibleEmployeeCount <= 4) {
    priority += 20; // Begrenztes Angebot an geeigneten Mitarbeitern
  }
  
  // 5. Abhängigkeiten zwischen Schichten
  priority += calculateDependencyPriority(shiftName, currentSchedule);
  
  return priority;
}

/**
 * Bestimmt die Basispriorität für Spezialschichten
 */
function getSpecialShiftPriority(shiftName: string): number {
  // Festgelegte Prioritäten für Spezialschichten
  const specialShiftPriorities: { [key: string]: number } = {
    'S0': 40,   // Höchste Priorität: Kann von Schichtleitern/Pflegern/Pflegehelfern besetzt werden
    'S1': 35,   // Sehr hohe Priorität: Kann von Schichtleitern/Pflegern besetzt werden
    'FS': 30,   // Hohe Priorität: Spezielle Schicht für kurze Tage
    'S00': 25,  // Mittlere Priorität: Kann nur von Pflegern besetzt werden
    'S': 20,    // Mittlere Priorität: Kann von Pflegern besetzt werden
    'F': 10     // Niedrigere Priorität: Kann von allen besetzt werden
  };
  
  return specialShiftPriorities[shiftName] || 0;
}

/**
 * Berechnet die Priorität basierend auf Rollenanforderungen
 */
function calculateRolePriority(
  validRoles: string[],
  employees: Employee[],
  employeeAvailability: EmployeeAvailability
): number {
  // Je spezifischer die Rollenanforderungen, desto höher die Priorität
  if (validRoles.length === 1) {
    // Nur eine spezifische Rolle erlaubt
    return 30;
  } else if (validRoles.length === 2) {
    // Zwei Rollen erlaubt
    return 15;
  }
  
  // Zusätzlich: Berücksichtige die Knappheit bestimmter Rollen
  let rolePriority = 0;
  
  for (const role of validRoles) {
    const availableEmployees = countAvailableEmployeesOfRole(
      role as EmployeeRole,
      employees,
      employeeAvailability
    );
    
    // Besondere Priorität für knappe Rollen
    if (role === 'Schichtleiter' && availableEmployees < 2) {
      rolePriority += 25; // Schichtleiter sind besonders knapp
    } else if (availableEmployees < 3) {
      rolePriority += 15; // Andere Rollen sind knapp
    }
  }
  
  return rolePriority;
}

/**
 * Zählt, wie viele geeignete Mitarbeiter für eine bestimmte Schicht verfügbar sind
 */
function countEligibleEmployees(
  shiftName: string,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability
): number {
  const validRoles = getValidRolesForShift(shiftName);
  
  return employees.filter(emp => 
    validRoles.includes(emp.role) && 
    hasRemainingCapacity(emp, employeeAvailability)
  ).length;
}

/**
 * Berechnet Priorität basierend auf Abhängigkeiten zwischen Schichten
 */
function calculateDependencyPriority(
  shiftName: string,
  currentSchedule: MonthlyShiftPlan
): number {
  let priority = 0;
  
  // Beispiel: Wenn S0 bereits besetzt ist, erhält S1 eine höhere Priorität
  if (shiftName === 'S1') {
    // Prüfe, ob S0 für diesen Tag bereits besetzt ist
    const dayKeys = Object.keys(currentSchedule);
    const currentDayKey = dayKeys[dayKeys.length - 1]; // Aktueller Tag
    
    if (currentDayKey && 
        currentSchedule[currentDayKey] !== null && 
        (currentSchedule[currentDayKey] as DayShiftPlan)['S0']?.length > 0) {
      priority += 15; // S1 hat höhere Priorität, wenn S0 bereits besetzt ist
    }
  }
  
  // Weitere Abhängigkeiten können hier hinzugefügt werden
  
  return priority;
}

/**
 * Prüft, ob ein Mitarbeiter noch ausreichend Kapazität hat
 */
function hasRemainingCapacity(
  employee: Employee,
  employeeAvailability: EmployeeAvailability
): boolean {
  const totalAssigned = employeeAvailability[employee.id].totalHoursAssigned;
  const targetHours = employee.hoursPerWeek * 4.33; // Monatliche Sollstunden
  const maxHours = targetHours * 1.15; // 15% Überstunden erlaubt
  
  return totalAssigned < maxHours;
}

/**
 * Gibt die für eine Schicht gültigen Rollen zurück
 */
function getValidRolesForShift(shiftName: string): EmployeeRole[] {
  // Rollendefinitionen für jede Schicht
  const shiftRoles: { [key: string]: EmployeeRole[] } = {
    'S0': ['Schichtleiter', 'Pfleger', 'Pflegehelfer'],
    'S1': ['Schichtleiter', 'Pfleger'],
    'S00': ['Pfleger'],
    'S': ['Pfleger'],
    'FS': ['Schichtleiter', 'Pfleger'],
    'F': ['Schichtleiter', 'Pfleger', 'Pflegehelfer'],
    // Uetersen-Schichten
    '4': ['Pfleger', 'Pflegehelfer'],
    '5': ['Pfleger'],
    '6': ['Schichtleiter']
  };
  
  return shiftRoles[shiftName] || ['Pfleger', 'Schichtleiter', 'Pflegehelfer'];
}

/**
 * Zählt verfügbare Mitarbeiter einer bestimmten Rolle
 */
function countAvailableEmployeesOfRole(
  role: EmployeeRole,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability
): number {
  return employees.filter(emp => 
    emp.role === role && 
    hasRemainingCapacity(emp, employeeAvailability)
  ).length;
}
```

## Spezifische Priorisierungsstrategien für verschiedene Tagestypen

### Lange Tage (Mo, Mi, Fr)

Für lange Tage (Montag, Mittwoch, Freitag) wird folgende Priorisierung empfohlen:

1. **S0-Schicht**: Höchste Priorität, da sie von Schichtleitern, Pflegern und optional Pflegehelfern besetzt werden kann
2. **S1-Schicht**: Hohe Priorität, da sie von Schichtleitern und Pflegern besetzt werden kann
3. **S00-Schicht**: Mittlere Priorität, nur für Pfleger
4. **S-Schicht**: Mittlere Priorität, nur für Pfleger
5. **F-Schicht**: Niedrigere Priorität, kann von allen Rollen besetzt werden

### Kurze Tage (Di, Do)

Für kurze Tage (Dienstag, Donnerstag) wird folgende Priorisierung empfohlen:

1. **FS-Schicht**: Hohe Priorität, kann nur von Schichtleitern und Pflegern besetzt werden
2. **F-Schicht**: Niedrigere Priorität, kann von allen Rollen besetzt werden

### Samstage

Für Samstage gilt eine besondere Priorisierungsstrategie:

1. **FS-Schicht**: Höchste Priorität
2. **F-Schicht**: Niedrigere Priorität, aber mit höherer Wichtigkeit als an anderen kurzen Tagen

## Dynamische Anpassung der Prioritäten

Die statische Priorisierung sollte durch dynamische Faktoren ergänzt werden:

1. **Fortschritt im Monat**: Je später im Monat, desto höher die Priorität für bisher wenig besetzte Schichten
2. **Verfügbarkeitsstatistik**: Schichten, für die wenige qualifizierte Mitarbeiter zur Verfügung stehen, erhalten höhere Priorität
3. **Rollenknappheit**: Wenn eine bestimmte Rolle (insb. Schichtleiter) knapp wird, erhalten Schichten, die diese Rolle erfordern, höhere Priorität
4. **Schichtabhängigkeiten**: Berücksichtigung von Abhängigkeiten zwischen verschiedenen Schichten

## Integration in den Hauptalgorithmus

Die Schichtpriorisierung wird in den Hauptalgorithmus integriert, indem der `assignDayWithBacktracking`-Funktion die priorisierten Schichten übergeben werden:

```typescript
function assignDayWithBacktracking(
  date: Date,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability,
  shiftPlan: MonthlyShiftPlan,
  relaxedMode: boolean = false
): boolean {
  const dayKey = formatDayKey(date);
  const weekday = date.getDay();
  const isLongDay = [1, 3, 5].includes(weekday);
  
  // Schichten für diesen Tag bestimmen
  const dayShifts = isLongDay ? getLongDayShifts() : getShortDayShifts();
  
  // Schichten priorisieren
  const prioritizedShifts = prioritizeShifts(
    date,
    dayShifts,
    employees,
    employeeAvailability,
    shiftPlan
  );
  
  // Schichtplan für diesen Tag initialisieren
  shiftPlan[dayKey] = {};
  
  // Schichten in priorisierter Reihenfolge zuweisen
  for (const shiftName of prioritizedShifts) {
    // ... (Schichtzuweisung wie zuvor beschrieben)
  }
  
  return true;
}
```

## Vorteile der optimierten Schichtpriorisierung

1. **Effizientere Lösungsfindung**: Der Algorithmus findet schneller gültige Lösungen
2. **Reduzierte Backtracking-Schritte**: Durch die intelligente Reihenfolge werden weniger Backtracking-Schritte benötigt
3. **Höhere Erfolgsrate**: Die Wahrscheinlichkeit, einen vollständigen Plan zu generieren, steigt
4. **Bessere Qualität**: Die generierten Pläne berücksichtigen kritische Faktoren früher
5. **Flexibilität**: Die Priorisierung kann leicht an veränderte Anforderungen angepasst werden

Die hier beschriebene Priorisierungsstrategie bildet einen wichtigen Baustein für einen robusten Schichtplanungs-Algorithmus und trägt wesentlich zur Erfüllung aller Regeln und Anforderungen bei.