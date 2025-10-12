import { CalculatedShiftPlan, ShiftPlanDay } from '../ShiftPlanTypes';
import { ShiftPlanOptimizerFrontend } from './ShiftPlanOptimizer2';

/**
 * AI-Berechnungsservice für Schichtplan-Generierung mit Simplex-Optimierung
 */
export class ShiftPlanAICalculationService {
  private previewModalCallback: ((previewData: ShiftPlanDay[]) => void) | null = null;
  private optimizer: ShiftPlanOptimizerFrontend;
  
  constructor() {
    this.optimizer = new ShiftPlanOptimizerFrontend();
  }
  
  /**
   * Setzt den Callback für die Modal-Anzeige
   */
  setPreviewModalCallback(callback: (previewData: ShiftPlanDay[]) => void) {
    this.previewModalCallback = callback;
  }
  
  /**
   * Generiert optimalen Schichtplan mit Simplex-Algorithmus
   */
  async generateShiftPlan(shiftPlanData: CalculatedShiftPlan): Promise<void> {

    try {
      // Optimiere Schichtplan mit Simplex-Algorithmus
      const optimizedDays = await this.optimizer.optimizeShiftPlan(shiftPlanData);
      
      // Zeige Modal mit optimierten Preview-Daten
      if (this.previewModalCallback) {
        console.log('📋 Zeige Preview-Modal mit optimierten Daten');
        this.previewModalCallback(optimizedDays);
      } else {
        console.warn('⚠️ Kein Preview-Modal-Callback gesetzt');
      }
      
    } catch (error) {
      console.error('❌ Fehler bei Simplex-Optimierung:', error);
      
      // Fallback: Verwende ursprüngliche Daten
      if (this.previewModalCallback) {
        console.log('📋 Zeige Preview-Modal mit ursprünglichen Daten (Fallback)');
        this.previewModalCallback(shiftPlanData.days);
      } else {
        console.warn('⚠️ Kein Preview-Modal-Callback gesetzt (Fallback)');
      }
    }
  }
}

// Export singleton instance
export const shiftPlanAICalculationService = new ShiftPlanAICalculationService();