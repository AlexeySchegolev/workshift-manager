import { ShiftRules } from '../models/interfaces';

// Export leeres Objekt, damit die Datei als Modul erkannt wird
export {};

/**
 * Hilfsservice für die Schichtplanung
 * Enthält allgemeine Hilfsfunktionen, die von verschiedenen Teilen des Schichtplanungssystems verwendet werden
 */
export class ShiftPlanningUtilService {
  /**
   * Gruppiert die Tage eines Monats nach Kalenderwochen
   */
  static groupDaysByWeek(
    year: number, 
    month: number, 
    daysInMonth: number
  ): { [weekNumber: string]: Date[] } {
    const weeks: { [weekNumber: string]: Date[] } = {};
    
    // Alle Tage des Monats generieren
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const weekNumber = this.getWeekNumber(date);
      
      if (!weeks[weekNumber]) {
        weeks[weekNumber] = [];
      }
      
      weeks[weekNumber].push(date);
    }
    
    return weeks;
  }
  
  /**
   * Berechnet die Kalenderwoche nach ISO-8601-Standard
   */
  static getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 - 3 
      + ((week1.getDay() + 6) % 7)) / 7
    );
  }
  
  /**
   * Berechnet die Stundenzahl einer Schicht
   */
  static calculateShiftHours(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const start = startHour + startMinute / 60;
    const end = endHour + endMinute / 60;
    
    return end - start;
  }
}