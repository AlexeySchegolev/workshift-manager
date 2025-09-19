import { ReducedEmployee } from '@/services';
import { ShiftPlanDetailService } from '@/services/shift-plan/ShiftPlanDetailService';

/**
 * Event handlers and assignment logic for ShiftPlanTable
 */
export class ShiftPlanTableHandlers {
    /**
     * Handle shift assignment
     */
    static async handleShiftAssignment(
        employeeId: string,
        shiftId: string | null,
        date: string,
        shiftPlan: any,
        onGeneratePlan: () => void
    ): Promise<void> {
        if (!shiftPlan || !shiftPlan.id) {
            throw new Error('Kein Schichtplan verfügbar');
        }

        // Parse date from DD.MM.YYYY format
        const [day, month, year] = date.split('.');
        const dayNumber = parseInt(day, 10);

        try {
            const detailService = new ShiftPlanDetailService();
            
            if (shiftId) {
                // Assign shift
                await detailService.assignEmployeeToShift(
                    shiftPlan.id,
                    employeeId,
                    shiftId,
                    dayNumber
                );
            } else {
                // Remove assignment
                await detailService.removeEmployeeAssignment(
                    shiftPlan.id,
                    employeeId,
                    dayNumber
                );
            }

            // Refresh the shift plan data
            onGeneratePlan();
        } catch (error) {
            console.error('Error assigning shift:', error);
            throw error;
        }
    }

    /**
     * Create cell click handler
     */
    static createCellClickHandler(
        setSelectedEmployee: (employee: ReducedEmployee | null) => void,
        setSelectedDateForAssignment: (date: string) => void,
        setCurrentShiftId: (shiftId: string | null) => void,
        setIsAssignmentDialogOpen: (open: boolean) => void
    ) {
        return (employee: ReducedEmployee, dayKey: string, currentShift?: string) => {
            setSelectedEmployee(employee);
            setSelectedDateForAssignment(dayKey);
            setCurrentShiftId(currentShift || null);
            setIsAssignmentDialogOpen(true);
        };
    }

    /**
     * Create close assignment dialog handler
     */
    static createCloseAssignmentDialogHandler(
        setIsAssignmentDialogOpen: (open: boolean) => void,
        setSelectedEmployee: (employee: ReducedEmployee | null) => void,
        setSelectedDateForAssignment: (date: string) => void,
        setCurrentShiftId: (shiftId: string | null) => void
    ) {
        return () => {
            setIsAssignmentDialogOpen(false);
            setSelectedEmployee(null);
            setSelectedDateForAssignment('');
            setCurrentShiftId(null);
        };
    }
}