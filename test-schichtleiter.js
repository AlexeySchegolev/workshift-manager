// Test-Datei für die vereinfachte Schichtleiter-Planung
// Führe diesen Test aus: node test-schichtleiter.js

const { ShiftPlanningService } = require('./src/services/ShiftPlanningService');
const { employeeData } = require('./src/data/employeeData');

console.log('=== TEST: VEREINFACHTE SCHICHTLEITER-PLANUNG ===\n');

// Nur Schichtleiter für den Test
const schichtleiter = employeeData.filter(emp => emp.role === 'Schichtleiter');
console.log('Verfügbare Schichtleiter:');
schichtleiter.forEach(sl => {
  console.log(`- ${sl.name} (${sl.clinic}, ${sl.hoursPerMonth}h/Monat)`);
});
console.log('');

// Test für August 2024
const year = 2024;
const month = 8;

console.log(`Generiere Schichtplan für ${month}/${year} mit nur Schichtleitern...\n`);

try {
  const result = ShiftPlanningService.generateShiftPlan(schichtleiter, year, month);
  
  console.log('=== ERGEBNIS ===');
  
  // Zähle zugewiesene Tage
  let assignedDays = 0;
  let nullDays = 0;
  let totalShifts = 0;
  
  for (const dayKey in result.shiftPlan) {
    const dayPlan = result.shiftPlan[dayKey];
    
    if (dayPlan === null) {
      nullDays++;
    } else {
      assignedDays++;
      // Zähle Schichten für diesen Tag
      for (const shiftName in dayPlan) {
        totalShifts += dayPlan[shiftName].length;
      }
    }
  }
  
  console.log(`Zugewiesene Tage: ${assignedDays}`);
  console.log(`Nicht belegte Tage: ${nullDays}`);
  console.log(`Gesamte Schichtleiter-Schichten: ${totalShifts}\n`);
  
  // Zeige Schichtleiter-Statistiken
  console.log('=== SCHICHTLEITER-STATISTIKEN ===');
  schichtleiter.forEach(sl => {
    const availability = result.employeeAvailability[sl.id];
    if (availability && availability.shiftsAssigned.length > 0) {
      console.log(`${sl.name}: ${availability.shiftsAssigned.length} Schichten, ${availability.totalHoursAssigned.toFixed(1)}h`);
    } else {
      console.log(`${sl.name}: Keine Schichten zugewiesen`);
    }
  });
  
  // Zeige erste 5 Tage als Beispiel
  console.log('\n=== BEISPIEL: ERSTE 5 ARBEITSTAGE ===');
  let dayCount = 0;
  for (const dayKey in result.shiftPlan) {
    if (dayCount >= 5) break;
    
    const dayPlan = result.shiftPlan[dayKey];
    
    // Überspringe Sonntage
    const [day, month, year] = dayKey.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getDay() === 0) continue; // Sonntag
    
    console.log(`${dayKey}:`);
    if (dayPlan === null) {
      console.log('  Kein Plan erstellt');
    } else {
      for (const shiftName in dayPlan) {
        const employeeIds = dayPlan[shiftName];
        const employeeNames = employeeIds.map(id => {
          const emp = schichtleiter.find(e => e.id === id);
          return emp ? emp.name : id;
        });
        console.log(`  ${shiftName}: ${employeeNames.join(', ')}`);
      }
    }
    dayCount++;
  }
  
  // Constraint-Checks
  console.log('\n=== CONSTRAINT-CHECKS ===');
  const constraints = ShiftPlanningService.checkConstraints(
    result.shiftPlan, 
    schichtleiter, 
    result.employeeAvailability
  );
  
  constraints.forEach(check => {
    const status = check.status === 'ok' ? '✓' : 
                  check.status === 'warning' ? '⚠' : 
                  check.status === 'violation' ? '✗' : 'ℹ';
    console.log(`${status} ${check.message}`);
  });
  
} catch (error) {
  console.error('Fehler beim Generieren des Schichtplans:', error);
  console.error(error.stack);
}

console.log('\n=== TEST ABGESCHLOSSEN ===');