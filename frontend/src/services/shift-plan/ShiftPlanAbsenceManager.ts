import { EmployeeAbsenceService } from '../EmployeeAbsenceService';

/**
 * Service für das Management von Abwesenheiten im Schichtplan-Kontext
 */
export class ShiftPlanAbsenceManager {
  private absenceService: EmployeeAbsenceService;

  constructor() {
    this.absenceService = new EmployeeAbsenceService();
  }

  /**
   * Lädt Abwesenheiten für einen Monat
   */
  async loadAbsencesForMonth(year: number, month: number): Promise<any[]> {
    try {
      // Verwende die getAbsencesByMonth Methode
      const monthAbsences = await this.absenceService.getAbsencesByMonth(
        year.toString(),
        month.toString()
      );
      
      return monthAbsences;
    } catch (error) {
      console.error('Fehler beim Laden der Abwesenheiten:', error);
      return [];
    }
  }

  /**
   * Prüft ob ein Datum in einem Abwesenheitszeitraum liegt
   */
  isDateInAbsenceRange(date: Date, startDate: string, endDate: string): boolean {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return checkDate >= start && checkDate <= end;
  }

  /**
   * Gibt den Text für einen Abwesenheitstyp zurück
   */
  getAbsenceReasonText(absenceType: string): string {
    switch (absenceType) {
      case 'vacation':
        return 'Urlaub';
      case 'sick_leave':
        return 'Krankheit';
      case 'other':
        return 'Sonstiges';
      default:
        return 'Abwesend';
    }
  }
}