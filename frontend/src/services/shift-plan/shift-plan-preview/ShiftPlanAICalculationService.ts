import { CalculatedShiftPlan, ShiftPlanDay } from '../ShiftPlanTypes';
import { ShiftPlanOptimizerFrontend } from './ShiftPlanOptimizer2';
import HttpClientManager from '../../HttpClientManager';
import { ShiftPlanCalculation } from '../../../api/ShiftPlanCalculation';

/**
 * AI-Berechnungsservice für Schichtplan-Generierung mit Backend-Integration
 */
export class ShiftPlanAICalculationService {
  private previewModalCallback: ((previewData: ShiftPlanDay[]) => void) | null = null;
  private optimizer: ShiftPlanOptimizerFrontend;
  private shiftPlanCalculationApi: ShiftPlanCalculation;
  
  constructor() {
    this.optimizer = new ShiftPlanOptimizerFrontend();
    this.shiftPlanCalculationApi = new ShiftPlanCalculation(HttpClientManager.getInstance().getHttpClient());
  }
  
  /**
   * Setzt den Callback für die Modal-Anzeige
   */
  setPreviewModalCallback(callback: (previewData: ShiftPlanDay[]) => void) {
    this.previewModalCallback = callback;
  }
  
  /**
   * Generiert optimalen Schichtplan über Backend-API
   */
  async generateShiftPlan(shiftPlanData: CalculatedShiftPlan): Promise<void> {
    try {
      console.log('🚀 Starte Backend-Schichtplan-Generierung...');
      
      // Backend-API Aufruf
      const response = await this.shiftPlanCalculationApi.shiftPlanCalculationControllerCalculateShiftPlan({
        organizationId: shiftPlanData.shiftPlan?.organizationId || '',
        locationId: shiftPlanData.locationId,
        year: shiftPlanData.year,
        month: shiftPlanData.month
      });
      
      console.log('✅ Backend-Antwort erhalten:', response.data);
      
      // Konvertiere Backend-Response zu ShiftPlanDay[]
      const optimizedDays = this.convertBackendResponseToShiftPlanDays(response.data);
      
      // Zeige Modal mit optimierten Preview-Daten
      if (this.previewModalCallback) {
        console.log('📋 Zeige Preview-Modal mit Backend-optimierten Daten');
        this.previewModalCallback(optimizedDays);
      } else {
        console.warn('⚠️ Kein Preview-Modal-Callback gesetzt');
      }
      
    } catch (error) {
      console.error('❌ Fehler bei Backend-Schichtplan-Generierung:', error);
      
      // Fallback: Verwende Frontend-Optimierung
      try {
        console.log('🔄 Fallback: Verwende Frontend-Optimierung...');
        const optimizedDays = await this.optimizer.optimizeShiftPlan(shiftPlanData);
        
        if (this.previewModalCallback) {
          console.log('📋 Zeige Preview-Modal mit Frontend-optimierten Daten (Fallback)');
          this.previewModalCallback(optimizedDays);
        }
      } catch (fallbackError) {
        console.error('❌ Auch Frontend-Fallback fehlgeschlagen:', fallbackError);
        
        // Letzter Fallback: Verwende ursprüngliche Daten
        if (this.previewModalCallback) {
          console.log('📋 Zeige Preview-Modal mit ursprünglichen Daten (Letzter Fallback)');
          this.previewModalCallback(shiftPlanData.days);
        }
      }
    }
  }
  
  /**
   * Konvertiert Backend-Response zu ShiftPlanDay[]
   */
  private convertBackendResponseToShiftPlanDays(response: any): ShiftPlanDay[] {
    if (!response.days || !Array.isArray(response.days)) {
      throw new Error('Ungültige Backend-Response: days Array fehlt');
    }
    
    return response.days.map((day: any) => ({
      date: new Date(day.date),
      dayKey: day.dayKey,
      dayNumber: day.dayNumber,
      isWeekend: day.isWeekend,
      isToday: day.isToday,
      employees: day.employees || [],
      shiftOccupancy: day.shiftOccupancy || []
    }));
  }
}

// Export singleton instance
export const shiftPlanAICalculationService = new ShiftPlanAICalculationService();