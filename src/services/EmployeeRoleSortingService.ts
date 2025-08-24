import { Employee, EmployeeAvailability } from '../models/interfaces';

/**
 * Service für die Sortierung von Mitarbeitern nach Rolle
 */
export class EmployeeRoleSortingService {
  /**
   * Sortiert Mitarbeiter nach Rolle mit festgelegter Priorität
   * Reihenfolge: ShiftLeader > Specialist > Assistant
   */
  static sortEmployeesByRole(employees: Employee[]): Employee[] {
    // Kopie des Arrays erstellen, um das Original nicht zu verändern
    const sortedEmployees = [...employees];
    
    // Rollenpriorität definieren (niedrigerer Wert = höhere Priorität)
    const rolePriority: { [key: string]: number } = {
      'ShiftLeader': 1,
      'Specialist': 2,
      'Assistant': 3
    };
    
    // Nach Rolle sortieren
    sortedEmployees.sort((a, b) => {
      const priorityA = rolePriority[a.role] || 999; // Fallback für unbekannte Rollen
      const priorityB = rolePriority[b.role] || 999;
      
      return priorityA - priorityB;
    });
    
    return sortedEmployees;
  }
  
  /**
   * Sortiert Mitarbeiter nach Rolle und dann für abwechslungsreiche Schichtverteilung
   * Berücksichtigt Arbeitsbelastung UND Schichttyp-Rotation für Abwechslung
   */
  static sortAndShuffleByRole(employees: Employee[], employeeAvailability?: any, currentShiftType?: string): Employee[] {
    // Mitarbeiter nach Rolle gruppieren
    const shiftLeaders = employees.filter(emp => emp.role === 'ShiftLeader');
    const specialists = employees.filter(emp => emp.role === 'Specialist');
    const assistants = employees.filter(emp => emp.role === 'Assistant');
    const others = employees.filter(emp =>
      emp.role !== 'ShiftLeader' &&
      emp.role !== 'Specialist' &&
      emp.role !== 'Assistant'
    );
    
    // Hilfsfunktion für abwechslungsreiche Sortierung
    const sortForVariety = (employeeList: Employee[]) => {
      if (employeeAvailability && currentShiftType) {
        return [...employeeList].sort((a, b) => {
          const aAvail = employeeAvailability[a.id] || { totalHoursAssigned: 0, shiftsAssigned: [], lastShiftType: null };
          const bAvail = employeeAvailability[b.id] || { totalHoursAssigned: 0, shiftsAssigned: [], lastShiftType: null };
          
          // 1. Priorität: Abwechslung - bevorzuge Mitarbeiter, die NICHT die gleiche Schicht wie zuletzt hatten
          const aLastShift = aAvail.lastShiftType;
          const bLastShift = bAvail.lastShiftType;
          
          const aSameAsLast = aLastShift === currentShiftType;
          const bSameAsLast = bLastShift === currentShiftType;
          
          if (aSameAsLast !== bSameAsLast) {
            return aSameAsLast ? 1 : -1; // Nicht-gleiche Schicht bevorzugen
          }
          
          // 2. Priorität: Arbeitsbelastung - weniger belastete bevorzugen
          const aHours = aAvail.totalHoursAssigned;
          const bHours = bAvail.totalHoursAssigned;
          const aShifts = aAvail.shiftsAssigned?.length || 0;
          const bShifts = bAvail.shiftsAssigned?.length || 0;
          
          if (Math.abs(aHours - bHours) > 7) { // Nur bei größeren Unterschieden (> 7h)
            return aHours - bHours;
          }
          
          // 3. Priorität: Anzahl Schichten
          if (aShifts !== bShifts) {
            return aShifts - bShifts;
          }
          
          // 4. Fallback: Alphabetisch für Konsistenz
          return a.name.localeCompare(b.name);
        });
      } else if (employeeAvailability) {
        // Fallback ohne Schichttyp-Information
        return [...employeeList].sort((a, b) => {
          const aHours = employeeAvailability[a.id]?.totalHoursAssigned || 0;
          const bHours = employeeAvailability[b.id]?.totalHoursAssigned || 0;
          const aShifts = employeeAvailability[a.id]?.shiftsAssigned?.length || 0;
          const bShifts = employeeAvailability[b.id]?.shiftsAssigned?.length || 0;
          
          if (aHours !== bHours) return aHours - bHours;
          return aShifts - bShifts;
        });
      } else {
        // Fallback: Alphabetisch sortieren für Konsistenz
        return [...employeeList].sort((a, b) => a.name.localeCompare(b.name));
      }
    };
    
    // Abwechslungsreiche Sortierung für ALLE Rollen
    const sortedShiftLeaders = sortForVariety(shiftLeaders);
    const sortedSpecialists = sortForVariety(specialists);
    const sortedAssistants = sortForVariety(assistants);
    
    // Nur andere/unbekannte Rollen zufällig mischen
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    
    // Alle Gruppen in der gewünschten Reihenfolge zusammenführen
    return [
      ...sortedShiftLeaders,
      ...sortedSpecialists,
      ...sortedAssistants,
      ...shuffledOthers
    ];
  }

  /**
   * Spezielle Sortierung für Samstagsschichten - faire Samstagsverteilung
   * Berücksichtigt alle Mitarbeiter (Elmshorn + Uetersen) und priorisiert nach saturdaysWorked
   */
  static sortEmployeesForSaturday(
    employees: Employee[],
    employeeAvailability: EmployeeAvailability
  ): Employee[] {
    console.log('=== SAMSTAGS-SORTIERUNG ===');
    
    const shiftLeaders = employees.filter(emp => emp.role === 'ShiftLeader');
    const specialists = employees.filter(emp => emp.role === 'Specialist');
    const assistants = employees.filter(emp => emp.role === 'Assistant');
    
    // Sortierung nach saturdaysWorked (aufsteigend) - wer weniger Samstage hatte, kommt zuerst
    const sortedShiftLeaders = shiftLeaders.sort((a, b) => {
      const aSaturdays = employeeAvailability[a.id]?.saturdaysWorked || 0;
      const bSaturdays = employeeAvailability[b.id]?.saturdaysWorked || 0;
      
      // Primär: Nach Samstagsanzahl sortieren (weniger = höhere Priorität)
      if (aSaturdays !== bSaturdays) {
        return aSaturdays - bSaturdays;
      }
      
      // Sekundär: Nach Gesamtstunden sortieren (weniger = höhere Priorität)
      const aHours = employeeAvailability[a.id]?.totalHoursAssigned || 0;
      const bHours = employeeAvailability[b.id]?.totalHoursAssigned || 0;
      return aHours - bHours;
    });
    
    const sortedSpecialists = specialists.sort((a, b) => {
      const aSaturdays = employeeAvailability[a.id]?.saturdaysWorked || 0;
      const bSaturdays = employeeAvailability[b.id]?.saturdaysWorked || 0;
      
      if (aSaturdays !== bSaturdays) {
        return aSaturdays - bSaturdays;
      }
      
      const aHours = employeeAvailability[a.id]?.totalHoursAssigned || 0;
      const bHours = employeeAvailability[b.id]?.totalHoursAssigned || 0;
      return aHours - bHours;
    });
    
    const sortedAssistants = assistants.sort((a, b) => {
      const aSaturdays = employeeAvailability[a.id]?.saturdaysWorked || 0;
      const bSaturdays = employeeAvailability[b.id]?.saturdaysWorked || 0;
      
      if (aSaturdays !== bSaturdays) {
        return aSaturdays - bSaturdays;
      }
      
      const aHours = employeeAvailability[a.id]?.totalHoursAssigned || 0;
      const bHours = employeeAvailability[b.id]?.totalHoursAssigned || 0;
      return aHours - bHours;
    });
    
    // Debug-Ausgabe
    console.log('ShiftLeader für Samstag (nach saturdaysWorked sortiert):');
    sortedShiftLeaders.forEach(emp => {
      const saturdays = employeeAvailability[emp.id]?.saturdaysWorked || 0;
      const hours = employeeAvailability[emp.id]?.totalHoursAssigned || 0;
      console.log(`  ${emp.name} (${emp.location || 'Standort A'}): ${saturdays} Samstage, ${hours}h`);
    });
    
    console.log('Specialist für Samstag (nach saturdaysWorked sortiert):');
    sortedSpecialists.forEach(emp => {
      const saturdays = employeeAvailability[emp.id]?.saturdaysWorked || 0;
      const hours = employeeAvailability[emp.id]?.totalHoursAssigned || 0;
      console.log(`  ${emp.name} (${emp.location || 'Standort A'}): ${saturdays} Samstage, ${hours}h`);
    });
    
    console.log('Assistant für Samstag (nach saturdaysWorked sortiert):');
    sortedAssistants.forEach(emp => {
      const saturdays = employeeAvailability[emp.id]?.saturdaysWorked || 0;
      const hours = employeeAvailability[emp.id]?.totalHoursAssigned || 0;
      console.log(`  ${emp.name} (${emp.location || 'Standort A'}): ${saturdays} Samstage, ${hours}h`);
    });
    
    // Reihenfolge: ShiftLeader, Specialist, Assistant
    return [...sortedShiftLeaders, ...sortedSpecialists, ...sortedAssistants];
  }
}