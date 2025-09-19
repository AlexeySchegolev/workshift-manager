import { excelExportService } from '@/services';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Excel export functionality for ShiftPlanTable
 */
export class ShiftPlanTableExport {
    /**
     * Export shift plan to Excel
     */
    static async exportToExcel(
        shiftPlan: any,
        selectedDate: Date
    ): Promise<void> {
        if (!shiftPlan || !shiftPlan.id) {
            alert('Kein Schichtplan zum Exportieren verfügbar.');
            return;
        }

        const monthName = format(selectedDate, 'MMMM yyyy', { locale: de });

        try {
            const blob = await excelExportService.exportShiftPlan(
                shiftPlan.id,
                {
                    includeStatistics: true,
                    includePlanning: true,
                    dateRange: {
                        start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
                        end: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
                    }
                }
            );

            excelExportService.downloadBlob(blob, `Schichtplan_${monthName}.xlsx`);
        } catch (error) {
            alert('Der Schichtplan konnte nicht exportiert werden.');
        }
    }
}