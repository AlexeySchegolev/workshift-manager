import { Employee } from '../models/interfaces';

/**
 * Service für die Sortierung von Mitarbeitern nach Rolle
 */
export class EmployeeRoleSortingService {
  /**
   * Sortiert Mitarbeiter nach Rolle mit festgelegter Priorität
   * Reihenfolge: Schichtleiter > Pfleger > Pflegehelfer
   */
  static sortEmployeesByRole(employees: Employee[]): Employee[] {
    // Kopie des Arrays erstellen, um das Original nicht zu verändern
    const sortedEmployees = [...employees];
    
    // Rollenpriorität definieren (niedrigerer Wert = höhere Priorität)
    const rolePriority: { [key: string]: number } = {
      'Schichtleiter': 1,
      'Pfleger': 2,
      'Pflegehelfer': 3
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
   * Sortiert Mitarbeiter nach Rolle und mischt dann innerhalb jeder Rollengruppe
   * Behält die Reihenfolge Schichtleiter > Pfleger > Pflegehelfer bei,
   * aber randomisiert die Mitarbeiter innerhalb jeder Gruppe
   */
  static sortAndShuffleByRole(employees: Employee[]): Employee[] {
    // Mitarbeiter nach Rolle gruppieren
    const schichtleiter = employees.filter(emp => emp.role === 'Schichtleiter');
    const pfleger = employees.filter(emp => emp.role === 'Pfleger');
    const pflegehelfer = employees.filter(emp => emp.role === 'Pflegehelfer');
    const others = employees.filter(emp => 
      emp.role !== 'Schichtleiter' && 
      emp.role !== 'Pfleger' && 
      emp.role !== 'Pflegehelfer'
    );
    
    // Jede Gruppe mischen
    const shuffledSchichtleiter = [...schichtleiter].sort(() => Math.random() - 0.5);
    const shuffledPfleger = [...pfleger].sort(() => Math.random() - 0.5);
    const shuffledPflegehelfer = [...pflegehelfer].sort(() => Math.random() - 0.5);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    
    // Alle Gruppen in der gewünschten Reihenfolge zusammenführen
    return [
      ...shuffledSchichtleiter,
      ...shuffledPfleger,
      ...shuffledPflegehelfer,
      ...shuffledOthers
    ];
  }
}