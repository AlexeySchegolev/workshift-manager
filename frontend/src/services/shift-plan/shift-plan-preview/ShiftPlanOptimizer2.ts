import { ShiftPlanAbsenceManager } from '../ShiftPlanAbsenceManager';
import { CalculatedShiftPlan, ShiftPlanDay } from '../ShiftPlanTypes';

/**
 * Einfacher Schichtplan-Optimizer ohne Optimierung
 * Gibt die Eingabedaten unverändert zurück
 */
export class ShiftPlanOptimizer2 {
  private lastModel: any = null;
  private absenceManager: ShiftPlanAbsenceManager;
  private absences: any[] = [];
  
  constructor() {
    this.absenceManager = new ShiftPlanAbsenceManager();
  }

  /**
   * "Optimiert" Schichtplan für einen Monat (gibt unveränderte Daten zurück)
   */
  async optimizeShiftPlan(shiftPlanData: CalculatedShiftPlan): Promise<ShiftPlanDay[]> {
    const { year, month, days } = shiftPlanData;
    console.log(shiftPlanData);
    
    // Lade Abwesenheiten für den Monat (für Kompatibilität)
    this.absences = await this.absenceManager.loadAbsencesForMonth(year, month);
    
    // Erstelle leeres Modell für Kompatibilität
    this.lastModel = {
      optimizer: 'ShiftPlanOptimizer2',
      status: 'passthrough',
      message: 'Keine Optimierung - Eingabedaten unverändert zurückgegeben'
    };
    
    console.log('🔧 ShiftPlanOptimizer2: Gebe Eingabedaten unverändert zurück');
    
    // Gebe die ursprünglichen Tage unverändert zurück
    return days;
  }
  
  /**
   * Gibt das zuletzt erstellte "Modell" zurück
   */
  getLastModel(): any {
    return this.lastModel;
  }
}