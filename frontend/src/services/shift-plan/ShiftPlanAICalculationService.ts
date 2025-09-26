import { CalculatedShiftPlan, ShiftPlanDay } from './ShiftPlanTypes';

/**
 * AI-Berechnungsservice für Schichtplan-Generierung
 */
export class ShiftPlanAICalculationService {
  private previewModalCallback: ((previewData: ShiftPlanDay[]) => void) | null = null;
  
  /**
   * Setzt den Callback für die Modal-Anzeige
   */
  setPreviewModalCallback(callback: (previewData: ShiftPlanDay[]) => void) {
    this.previewModalCallback = callback;
  }
  
  /**
   * Generiert Schichtplan basierend auf den gegebenen Daten
   */
  generateShiftPlan(shiftPlanData: CalculatedShiftPlan): void {
    
    // Einfache Rückgabe der days wie gefordert
    const result = shiftPlanData.days;
    
    console.log('✅ AI-Berechnung abgeschlossen - Rückgabewert:', result);
    
    // Zeige Modal mit Preview-Daten
    if (this.previewModalCallback) {
      this.previewModalCallback(result);
    }
  }
}

// Export singleton instance
export const shiftPlanAICalculationService = new ShiftPlanAICalculationService();