# Verbesserte Mitarbeiterauswahl-Heuristik

Die Qualität eines Schichtplans hängt maßgeblich davon ab, wie gut der Algorithmus geeignete Mitarbeiter für jede Position auswählt. Eine intelligente Heuristik zur Mitarbeiterauswahl kann den Backtracking-Algorithmus erheblich verbessern, indem sie die Wahrscheinlichkeit erhöht, frühzeitig gültige Lösungen zu finden.

## Grundprinzipien

1. **Least Constraining Value**: Wähle die Zuweisungen, die die wenigsten Optionen für zukünftige Entscheidungen ausschließen
2. **Ausgewogene Arbeitsbelastung**: Verteile die Arbeit gleichmäßig auf alle Mitarbeiter
3. **Rollenspezifische Eignung**: Berücksichtige besondere Fähigkeiten und Eignung für bestimmte Schichten
4. **Kontinuität und Fairness**: Sorge für eine faire Verteilung von unbeliebten Schichten (z.B. Samstage)

## Bewertungsfunktion für Mitarbeiter

Der Kern der verbesserten Heuristik ist eine mehrdimensionale Bewertungsfunktion, die jedem Mitarbeiter einen Eignungswert für eine bestimmte Schicht zuweist.

```typescript
/**
 * Bewertet die Eignung eines Mitarbeiters für eine bestimmte Schicht
 * Höhere Werte bedeuten bessere Eignung
 */
function rateEmployeeSuitability(
  employee: Employee,
  shiftName: string,
  dayKey: string,
  weekday: number,
  employeeAvailability: EmployeeAvailability,
  currentSchedule: MonthlyShiftPlan
): number {
  // Ausgangswert
  let rating = 100;
  
  // 1. Arbeitsbelastung (wichtigster Faktor)
  const workloadPercentage = calculateWorkloadPercentage(employee, employeeAvailability);
  
  // Formel: Je näher an 100% der Sollarbeitszeit, desto schlechter die Bewertung
  // Bei Unter-/Überbelastung: Abzug basierend auf der Abweichung von der Ziel-Belastung
  const targetWorkload = 100; // 100% der Sollarbeitszeit als Ziel
  const workloadDeviation = Math.abs(workloadPercentage - targetWorkload);
  
  // Progressiver Malus für Abweichungen
  if (workloadPercentage > targetWorkload) {
    // Überbelastung wird stärker bestraft
    rating -= workloadDeviation * 1.5;
  } else {
    // Unterbelastung wird weniger stark bestraft
    rating -= workloadDeviation;
  }
  
  // 2. Rollenspezifische Eignung
  if (isEmployeeIdealForShift(employee, shiftName)) {
    rating += 25; // Bonus für ideale Rollenzuordnung
  } else if (isEmployeeAcceptableForShift(employee, shiftName)) {
    rating += 10; // Kleinerer Bonus für akzeptable Zuordnung
  }
  
  // 3. Samstagsverteilung (besonders wichtig für Fairness)
  if (weekday === 6) { // Samstag
    const saturdaysWorked = employeeAvailability[employee.id].saturdaysWorked;
    rating -= saturdaysWorked * 20; // Hoher Malus pro bereits gearbeitetem Samstag
  }
  
  // 4. Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen
  const lastShiftType = employeeAvailability[employee.id].lastShiftType;
  if (lastShiftType === shiftName) {
    // Prüfen, ob es sich um aufeinanderfolgende Tage handelt
    const lastAssignedDay = employeeAvailability[employee.id].shiftsAssigned.length > 0
      ? employeeAvailability[employee.id].shiftsAssigned[employeeAvailability[employee.id].shiftsAssigned.length - 1]
      : null;
      
    if (lastAssignedDay && isConsecutiveDay(lastAssignedDay, dayKey)) {
      rating -= 30; // Hoher Malus für gleiche Schichten an aufeinanderfolgenden Tagen
    }
  }
  
  // 5. Domänenspezifische Optimierungen
  
  // 5.1 Schichtleiterbevorzugung für bestimmte Schichten
  if (employee.role === 'Schichtleiter' && (shiftName === 'S0' || shiftName === 'S1')) {
    rating += 15; // Schichtleiter sind besonders geeignet für S0 und S1
  }
  
  // 5.2 Pflegehelfer-Spezialisierung
  if (employee.role === 'Pflegehelfer' && shiftName === 'S0') {
    rating += 15; // Pflegehelfer sind besonders geeignet für S0
  }
  
  // 5.3 Klinik-spezifische Anpassungen
  if (employee.clinic === 'Uetersen' && isUetersenShift(shiftName)) {
    rating += 20; // Starker Bonus für Uetersen-Mitarbeiter bei Uetersen-Schichten
  }
  
  // 6. Forward-Checking: Bewerte die Auswirkungen dieser Zuweisung auf zukünftige Möglichkeiten
  const constraintImpact = estimateConstraintImpact(
    employee,
    shiftName,
    dayKey,
    currentSchedule,
    employeeAvailability
  );
  rating -= constraintImpact * 5; // Malus basierend auf dem Einschränkungsgrad
  
  return Math.max(0, rating); // Bewertung nicht unter 0 fallen lassen
}
```

## Zusätzliche Hilfsfunktionen

Zur Unterstützung der Hauptbewertungsfunktion werden verschiedene Hilfsfunktionen benötigt:

```typescript
/**
 * Berechnet den Prozentsatz der bereits zugewiesenen Arbeitsstunden
 * im Verhältnis zur Sollarbeitszeit des Mitarbeiters
 */
function calculateWorkloadPercentage(
  employee: Employee,
  employeeAvailability: EmployeeAvailability
): number {
  const totalAssignedHours = employeeAvailability[employee.id].totalHoursAssigned;
  const targetHoursPerMonth = employee.hoursPerWeek * 4.33; // Durchschnittliche Anzahl Wochen pro Monat
  
  return (totalAssignedHours / targetHoursPerMonth) * 100;
}

/**
 * Prüft, ob ein Mitarbeiter ideal für eine bestimmte Schicht geeignet ist
 * Basierend auf Rolle und spezifischer Eignung
 */
function isEmployeeIdealForShift(
  employee: Employee,
  shiftName: string
): boolean {
  const idealRoleShiftPairs = {
    'Schichtleiter': ['S0', 'S1', 'FS'],
    'Pfleger': ['S', 'S00', 'F'],
    'Pflegehelfer': ['F', 'S0']
  };
  
  return idealRoleShiftPairs[employee.role]?.includes(shiftName) || false;
}

/**
 * Prüft, ob ein Mitarbeiter akzeptabel für eine Schicht ist
 * (nicht ideal, aber zulässig)
 */
function isEmployeeAcceptableForShift(
  employee: Employee,
  shiftName: string
): boolean {
  const acceptableRoleShiftPairs = {
    'Schichtleiter': ['F'],
    'Pfleger': ['S0', 'S1', 'FS'],
    'Pflegehelfer': []
  };
  
  return acceptableRoleShiftPairs[employee.role]?.includes(shiftName) || false;
}

/**
 * Prüft, ob zwei Tage aufeinanderfolgend sind
 */
function isConsecutiveDay(
  day1: string, 
  day2: string
): boolean {
  const [d1, m1, y1] = day1.split('.').map(Number);
  const [d2, m2, y2] = day2.split('.').map(Number);
  
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  
  // Differenz in Millisekunden
  const diff = Math.abs(date2.getTime() - date1.getTime());
  
  // Ein Tag hat 86400000 Millisekunden
  return diff === 86400000;
}

/**
 * Schätzt die Auswirkungen einer Zuweisung auf zukünftige Möglichkeiten
 * Je höher der Wert, desto stärker schränkt diese Zuweisung zukünftige Optionen ein
 */
function estimateConstraintImpact(
  employee: Employee,
  shiftName: string,
  dayKey: string,
  currentSchedule: MonthlyShiftPlan,
  employeeAvailability: EmployeeAvailability
): number {
  let impact = 0;
  
  // 1. Auswirkung auf die verbleibende Arbeitszeitkapazität
  const remainingCapacity = getRemainingWorkCapacity(employee, employeeAvailability);
  if (remainingCapacity < 10) {
    impact += 10 - remainingCapacity; // Je weniger Kapazität übrig, desto höher der Impact
  }
  
  // 2. Auswirkung auf die Verfügbarkeit dieser Rolle in der Zukunft
  const roleAvailability = countAvailableEmployeesOfRole(employee.role, employeeAvailability);
  if (roleAvailability < 3) {
    impact += (3 - roleAvailability) * 2; // Knappheit dieser Rolle erhöht den Impact
  }
  
  // 3. Auswirkung auf spezielle Schichtarten
  // Beispiel: Wenn ein Schichtleiter für eine F-Schicht eingeteilt wird,
  // steht er nicht mehr für die kritischeren S0/S1-Schichten zur Verfügung
  if (employee.role === 'Schichtleiter' && shiftName === 'F') {
    impact += 3; // Höherer Impact, da Schichtleiter wichtiger für andere Schichten sind
  }
  
  return impact;
}

/**
 * Berechnet die verbleibende Arbeitskapazität eines Mitarbeiters in Stunden
 */
function getRemainingWorkCapacity(
  employee: Employee,
  employeeAvailability: EmployeeAvailability
): number {
  const totalAssignedHours = employeeAvailability[employee.id].totalHoursAssigned;
  const targetHoursPerMonth = employee.hoursPerWeek * 4.33;
  const maxAllowedHours = targetHoursPerMonth * 1.15; // 15% Überstunden erlaubt
  
  return maxAllowedHours - totalAssignedHours;
}

/**
 * Zählt die Anzahl verfügbarer Mitarbeiter einer bestimmten Rolle
 * Ein Mitarbeiter gilt als verfügbar, wenn er weniger als 90% seiner Sollarbeitszeit erreicht hat
 */
function countAvailableEmployeesOfRole(
  role: EmployeeRole,
  employeeAvailability: EmployeeAvailability
): number {
  let count = 0;
  
  // Alle Mitarbeiter durchgehen und prüfen, ob sie verfügbar sind
  for (const empId in employeeAvailability) {
    const employee = getEmployeeById(empId);
    if (employee && employee.role === role) {
      const workloadPercentage = calculateWorkloadPercentage(employee, employeeAvailability);
      if (workloadPercentage < 90) {
        count++;
      }
    }
  }
  
  return count;
}
```

## Integration in den Backtracking-Algorithmus

Die verbesserte Heuristik wird in den Backtracking-Algorithmus integriert, indem die Funktion `findSuitableEmployees` die Mitarbeiter nach ihrer Eignung sortiert:

```typescript
/**
 * Findet und sortiert geeignete Mitarbeiter für eine bestimmte Schichtposition
 */
function findSuitableEmployees(
  role: EmployeeRole,
  shiftName: string,
  dayKey: string,
  weekday: number,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability,
  currentSchedule: MonthlyShiftPlan
): Employee[] {
  // 1. Filtere Mitarbeiter, die grundsätzlich geeignet sind
  const eligibleEmployees = employees.filter(emp => 
    emp.role === role && 
    !employeeAvailability[emp.id].shiftsAssigned.includes(dayKey) &&
    isEmployeeEligibleForShift(emp, shiftName)
  );
  
  // 2. Bewerte die Eignung jedes Mitarbeiters
  const ratedEmployees = eligibleEmployees.map(emp => ({
    employee: emp,
    rating: rateEmployeeSuitability(
      emp,
      shiftName,
      dayKey,
      weekday,
      employeeAvailability,
      currentSchedule
    )
  }));
  
  // 3. Sortiere nach Eignung (höhere Bewertung zuerst)
  ratedEmployees.sort((a, b) => b.rating - a.rating);
  
  // 4. Gib die sortierten Mitarbeiter zurück
  return ratedEmployees.map(item => item.employee);
}
```

## Vorteile der verbesserten Heuristik

1. **Bessere Lösungsqualität**: Die Heuristik berücksichtigt multiple Faktoren und führt zu ausgewogeneren Schichtplänen

2. **Schnellere Konvergenz**: Durch die intelligente Vorsortierung der Mitarbeiter findet der Backtracking-Algorithmus schneller gültige Lösungen

3. **Höhere Fairness**: Die Berücksichtigung von Arbeitsbelastung und Samstagsverteilung führt zu faireren Plänen

4. **Reduzierte Fehlerhäufigkeit**: Die Berücksichtigung des Constraint-Impacts reduziert die Wahrscheinlichkeit von Sackgassen im Backtracking

5. **Flexibilität und Anpassbarkeit**: Die Gewichtungen der verschiedenen Faktoren können leicht angepasst werden, um verschiedene Prioritäten zu setzen

## Implementierungshinweise

- Die Bewertungsfunktion sollte effizient implementiert werden, da sie sehr häufig aufgerufen wird
- Cache-Mechanismen können die Leistung verbessern, indem bereits berechnete Bewertungen wiederverwendet werden
- Die Gewichtungen der verschiedenen Faktoren sollten empirisch optimiert werden
- Domänenspezifische Anpassungen sollten basierend auf Feedback aus der Praxis kontinuierlich verfeinert werden

Die hier beschriebene Heuristik bietet eine solide Grundlage für eine intelligente Mitarbeiterauswahl im Schichtplanungs-Algorithmus und kann erheblich zur Verbesserung der Gesamtqualität der generierten Pläne beitragen.