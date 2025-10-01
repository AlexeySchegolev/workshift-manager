import { CalculatedShiftPlan, ShiftPlanDay } from '../ShiftPlanTypes';
import { ShiftPlanOptimizer } from './ShiftPlanOptimizer';

/**
 * AI-Berechnungsservice für Schichtplan-Generierung mit Simplex-Optimierung
 */
export class ShiftPlanAICalculationService {
  private previewModalCallback: ((previewData: ShiftPlanDay[]) => void) | null = null;
  private optimizer: ShiftPlanOptimizer;
  
  constructor() {
    this.optimizer = new ShiftPlanOptimizer();
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
  generateShiftPlan(shiftPlanData: CalculatedShiftPlan): void {
    console.log('🚀 Starte Simplex-Optimierung für Schichtplan...');
    
    try {
      // Optimiere Schichtplan mit Simplex-Algorithmus
      const optimizedDays = this.optimizer.optimizeShiftPlan(shiftPlanData);
      
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