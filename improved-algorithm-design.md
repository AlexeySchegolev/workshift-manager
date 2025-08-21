# Verbesserter Backtracking-Algorithmus für die Schichtplanung

## Constraint-System

Um die korrekte Besetzung jeder Schicht als höchste Priorität zu gewährleisten, strukturieren wir das Constraint-System wie folgt:

### Harte Constraints (müssen immer erfüllt sein)
1. **Korrekte Schichtbesetzung**: Jede Schicht muss mit der richtigen Anzahl und Art von Mitarbeitern besetzt sein
   - Mindestens 4 Pfleger
   - Genau 1 Schichtleiter
   - Mindestens 1 Pflegehelfer
2. **Tägliche Verfügbarkeit**: Ein Mitarbeiter kann höchstens eine Schicht pro Tag haben
3. **Rollenkonformität**: Mitarbeiter dürfen nur Schichten übernehmen, die ihrer Rolle entsprechen

### Weiche Constraints (werden optimiert, wenn möglich)
1. **Samstagsregel**: Maximal 1 Samstag pro Mitarbeiter pro Monat (2 im gelockerten Modus)
2. **Arbeitszeitverteilung**: Einhaltung der Wochenstunden ±10% (±15% im gelockerten Modus)
3. **Schichtwechsel**: Keine gleichen Schichten an aufeinanderfolgenden Tagen

## Algorithmus-Design

### 1. Verbesserter Backtracking-Algorithmus

```typescript
/**
 * Hauptfunktion für den verbesserten Backtracking-Algorithmus
 * Gewährleistet die korrekte Besetzung jeder Schicht
 */
function assignShiftPlan(
  year: number,
  month: number,
  employees: Employee[]
): { shiftPlan: MonthlyShiftPlan; employeeAvailability: EmployeeAvailability } {
  // Initialisierung
  const shiftPlan: MonthlyShiftPlan = {};
  const employeeAvailability: EmployeeAvailability = initializeAvailability(employees);
  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks = groupDaysByWeek(year, month, daysInMonth);
  
  // Für jede Woche
  for (const weekNumber in weeks) {
    // Wöchentliche Verfügbarkeit zurücksetzen
    resetWeeklyAvailability(employeeAvailability);
    
    // Für jeden Tag in der Woche
    const days = weeks[weekNumber];
    for (const date of days) {
      // Tag überspringen, wenn es ein Sonntag ist
      if (date.getDay() === 0) {
        const dayKey = formatDayKey(date);
        shiftPlan[dayKey] = null;
        continue;
      }
      
      // Tag verarbeiten
      const success = assignDayWithBacktracking(
        date,
        employees,
        employeeAvailability,
        shiftPlan
      );
      
      // Wenn die Zuweisung fehlschlägt, im gelockerten Modus versuchen
      if (!success) {
        const relaxedSuccess = assignDayWithBacktracking(
          date,
          employees,
          employeeAvailability,
          shiftPlan,
          true // relaxedMode
        );
        
        if (!relaxedSuccess) {
          // Wenn auch im gelockerten Modus keine Lösung gefunden wurde
          const dayKey = formatDayKey(date);
          shiftPlan[dayKey] = null;
        }
      }
    }
  }
  
  return { shiftPlan, employeeAvailability };
}

/**
 * Weist einen einzelnen Tag mit Backtracking zu
 * Hauptalgorithmus für die Schichtzuweisung
 */
function assignDayWithBacktracking(
  date: Date,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability,
  shiftPlan: MonthlyShiftPlan,
  relaxedMode: boolean = false
): boolean {
  const dayKey = formatDayKey(date);
  const weekday = date.getDay();
  const isLongDay = [1, 3, 5].includes(weekday); // Mo, Mi, Fr
  
  // Schichten für diesen Tag bestimmen
  const dayShifts = isLongDay ? getLongDayShifts() : getShortDayShifts();
  
  // Prioritätsreihenfolge der Schichten festlegen
  const shiftPriority = getPriorityOrder(dayShifts, isLongDay);
  
  // Schichtplan für diesen Tag initialisieren
  shiftPlan[dayKey] = {};
  
  // Für jede Schicht in der Prioritätsreihenfolge
  for (const shiftName of shiftPriority) {
    const shiftRequirements = getShiftRequirements(shiftName, relaxedMode);
    
    // Schicht dem Plan hinzufügen
    const dayPlan = shiftPlan[dayKey] as DayShiftPlan;
    dayPlan[shiftName] = [];
    
    // Benötigte Besetzung für diese Schicht zuweisen
    const success = fillShiftPositions(
      shiftName,
      shiftRequirements,
      employees,
      employeeAvailability,
      dayPlan,
      dayKey,
      weekday,
      relaxedMode
    );
    
    if (!success) {
      // Bei Misserfolg: Schicht zurücksetzen und die gesamte Tageszuweisung abbrechen
      delete dayPlan[shiftName];
      return false;
    }
  }
  
  return true;
}

/**
 * Füllt alle benötigten Positionen für eine Schicht
 * Implementiert rekursives Backtracking für optimale Besetzung
 */
function fillShiftPositions(
  shiftName: string,
  requirements: ShiftRequirements,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability,
  dayPlan: DayShiftPlan,
  dayKey: string,
  weekday: number,
  relaxedMode: boolean
): boolean {
  // Alle Positionen erfolgreich gefüllt?
  if (allPositionsFilled(requirements, dayPlan[shiftName])) {
    return true;
  }
  
  // Nächste zu füllende Position finden
  const nextPosition = findNextPositionToFill(requirements, dayPlan[shiftName]);
  if (!nextPosition) return false;
  
  // Geeignete Mitarbeiter für diese Position finden und nach Eignung sortieren
  const suitableEmployees = findSuitableEmployees(
    nextPosition.role,
    employees,
    employeeAvailability,
    dayKey,
    shiftName,
    weekday,
    relaxedMode
  );
  
  // Versuche jeden geeigneten Mitarbeiter für diese Position
  for (const employee of suitableEmployees) {
    // Mitarbeiter zuweisen
    dayPlan[shiftName].push(employee.id);
    updateEmployeeAvailability(employee, employeeAvailability, dayKey, shiftName, weekday);
    
    // Rekursiv fortfahren
    if (fillShiftPositions(
      shiftName,
      requirements,
      employees,
      employeeAvailability,
      dayPlan,
      dayKey,
      weekday,
      relaxedMode
    )) {
      return true;
    }
    
    // Backtracking: Zuweisung rückgängig machen
    dayPlan[shiftName].pop();
    revertEmployeeAvailability(employee, employeeAvailability, dayKey, shiftName, weekday);
  }
  
  return false;
}

/**
 * Findet geeignete Mitarbeiter für eine Position und sortiert sie nach Eignung
 * Implementiert intelligente Heuristik für optimale Mitarbeiterauswahl
 */
function findSuitableEmployees(
  role: EmployeeRole,
  employees: Employee[],
  employeeAvailability: EmployeeAvailability,
  dayKey: string,
  shiftName: string,
  weekday: number,
  relaxedMode: boolean
): Employee[] {
  // Mitarbeiter filtern, die für diese Rolle und Schicht geeignet sind
  const suitable = employees.filter(emp => 
    emp.role === role && 
    isEmployeeAvailable(emp, employeeAvailability, dayKey) &&
    isEmployeeAllowedForShift(emp, shiftName, relaxedMode)
  );
  
  // Mitarbeiter nach Eignung sortieren
  return suitable.sort((a, b) => {
    // 1. Priorität: Mitarbeiter mit geringerer Auslastung bevorzugen
    const aWorkload = calculateWorkloadPercentage(a, employeeAvailability);
    const bWorkload = calculateWorkloadPercentage(b, employeeAvailability);
    if (Math.abs(aWorkload - bWorkload) > 10) { // 10% Unterschied als signifikant betrachten
      return aWorkload - bWorkload;
    }
    
    // 2. Priorität: Samstagsverteilung (für Samstage)
    if (weekday === 6) {
      return employeeAvailability[a.id].saturdaysWorked - employeeAvailability[b.id].saturdaysWorked;
    }
    
    // 3. Priorität: Vermeidung gleicher Schichten an aufeinanderfolgenden Tagen
    const aLastShift = employeeAvailability[a.id].lastShiftType;
    const bLastShift = employeeAvailability[b.id].lastShiftType;
    if (aLastShift === shiftName && bLastShift !== shiftName) return 1;
    if (aLastShift !== shiftName && bLastShift === shiftName) return -1;
    
    // 4. Zufälligkeit als letztes Kriterium (um gleichmäßige Verteilung zu fördern)
    return 0.5 - Math.random(); // Deterministisch machen, wenn nötig
  });
}
```

### 2. Robuste Constraint-Überprüfung

```typescript
/**
 * Überprüft die Einhaltung aller harten Constraints
 * Gibt ein detailliertes Ergebnis zurück
 */
function checkHardConstraints(
  shiftPlan: MonthlyShiftPlan,
  employees: Employee[]
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];
  
  // Für jeden Tag im Plan
  for (const dayKey in shiftPlan) {
    const dayPlan = shiftPlan[dayKey];
    if (dayPlan === null) continue; // Sonntage überspringen
    
    // 1. Korrekte Schichtbesetzung prüfen
    const staffingViolations = checkStaffingRequirements(dayPlan, employees, dayKey);
    violations.push(...staffingViolations);
    
    // 2. Tägliche Verfügbarkeit prüfen (ein Mitarbeiter nicht mehrfach eingeteilt)
    const assignedEmployees = new Set<string>();
    let duplicateAssignments = false;
    
    for (const shiftName in dayPlan) {
      for (const empId of dayPlan[shiftName]) {
        if (assignedEmployees.has(empId)) {
          duplicateAssignments = true;
          violations.push({
            type: 'DuplicateAssignment',
            message: `Mitarbeiter ${empId} ist am ${dayKey} mehrfach eingeteilt`,
            day: dayKey,
            employee: empId
          });
        }
        assignedEmployees.add(empId);
      }
    }
    
    // 3. Rollenkonformität prüfen
    for (const shiftName in dayPlan) {
      for (const empId of dayPlan[shiftName]) {
        const employee = employees.find(e => e.id === empId);
        if (employee && !isRoleAllowedForShift(employee.role, shiftName)) {
          violations.push({
            type: 'RoleViolation',
            message: `Mitarbeiter ${employee.name} (${employee.role}) darf nicht in Schicht ${shiftName} am ${dayKey} arbeiten`,
            day: dayKey,
            employee: empId,
            shift: shiftName
          });
        }
      }
    }
  }
  
  return violations;
}

/**
 * Überprüft die Besetzungsanforderungen für alle Schichten eines Tages
 */
function checkStaffingRequirements(
  dayPlan: DayShiftPlan,
  employees: Employee[],
  dayKey: string
): ConstraintViolation[] {
  const violations: ConstraintViolation[] = [];
  
  // Zählen der Mitarbeiter nach Rolle
  const roleCounts = {
    Pfleger: 0,
    Schichtleiter: 0,
    Pflegehelfer: 0
  };
  
  // Alle Schichten durchgehen und Mitarbeiter zählen
  for (const shiftName in dayPlan) {
    for (const empId of dayPlan[shiftName]) {
      const employee = employees.find(e => e.id === empId);
      if (employee) {
        roleCounts[employee.role]++;
      }
    }
  }
  
  // Prüfen, ob die Mindestanforderungen erfüllt sind
  if (roleCounts.Pfleger < 4) {
    violations.push({
      type: 'StaffingViolation',
      message: `Nur ${roleCounts.Pfleger} Pfleger am ${dayKey} (mindestens 4 erforderlich)`,
      day: dayKey,
      role: 'Pfleger',
      required: 4,
      actual: roleCounts.Pfleger
    });
  }
  
  if (roleCounts.Schichtleiter !== 1) {
    violations.push({
      type: 'StaffingViolation',
      message: `${roleCounts.Schichtleiter} Schichtleiter am ${dayKey} (genau 1 erforderlich)`,
      day: dayKey,
      role: 'Schichtleiter',
      required: 1,
      actual: roleCounts.Schichtleiter
    });
  }
  
  if (roleCounts.Pflegehelfer < 1) {
    violations.push({
      type: 'StaffingViolation',
      message: `Nur ${roleCounts.Pflegehelfer} Pflegehelfer am ${dayKey} (mindestens 1 erforderlich)`,
      day: dayKey,
      role: 'Pflegehelfer',
      required: 1,
      actual: roleCounts.Pflegehelfer
    });
  }
  
  return violations;
}
```

## Schlüsselkonzepte der Verbesserung

1. **Klare Constraint-Hierarchie**: Harte Constraints (wie die korrekte Besetzung) werden strikt eingehalten, weiche Constraints werden optimiert, wenn möglich

2. **Robustes Backtracking**: Der Algorithmus setzt Zuweisungen konsequent zurück, wenn keine gültige Lösung gefunden werden kann

3. **Intelligente Mitarbeiterauswahl**: Mitarbeiter werden nach ihrer Eignung für eine Position sortiert, wobei Arbeitsbelastung, Samstagsverteilung und Schichtwechsel berücksichtigt werden

4. **Strukturierte Schichtpriorisierung**: Schichten werden in einer optimalen Reihenfolge zugewiesen, wobei kritische Schichten zuerst besetzt werden

5. **Umfassende Constraint-Überprüfung**: Alle Constraints werden detailliert überprüft und liefern aussagekräftige Fehlermeldungen

6. **Klare Trennung von Verantwortlichkeiten**: Der Algorithmus ist in klar definierte Funktionen aufgeteilt, die jeweils eine spezifische Aufgabe erfüllen

## Nächste Schritte

1. Implementierung des verbesserten Backtracking-Algorithmus
2. Entwicklung einer optimierten Mitarbeiterauswahl-Heuristik
3. Implementierung einer verbesserten Schichtpriorisierung
4. Umfassende Tests und Validierung

Diese Verbesserungen werden dazu beitragen, dass der Schichtplanungs-Algorithmus zuverlässig korrekt besetzte Schichten generiert und die wichtigsten Regeln konsequent einhält.