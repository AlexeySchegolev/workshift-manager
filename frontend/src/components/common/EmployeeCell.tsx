import { ReducedEmployee } from '@/services';
import { alpha, Box, Chip, Typography, useTheme } from '@mui/material';
import React from 'react';
import { EmployeeAbsenceResponseDto } from '../../api/data-contracts';

export interface EmployeeCellProps {
    employee: ReducedEmployee & { calculatedMonthlyHours: number };
    month: number;
    year: number;
    absences: EmployeeAbsenceResponseDto[];
}

/**
 * Komponente für die Anzeige von Mitarbeiterdaten in der Schichttabelle
 */
const EmployeeCell: React.FC<EmployeeCellProps> = ({
    employee,
    month,
    year,
    absences
}) => {
    const theme = useTheme();

    // Prüfe ob Mitarbeiter Überstunden hat
    const hasOvertime = employee.calculatedMonthlyHours > (employee.monthlyWorkHours || 0);

    // Berechne Abwesenheitstage für den aktuellen Monat
    const calculateAbsenceDays = () => {
        let totalDays = 0;
        
        absences.forEach(absence => {
            const startDate = new Date(absence.startDate);
            const endDate = new Date(absence.endDate);
            const monthStart = new Date(year, month - 1, 1);
            const monthEnd = new Date(year, month, 0);
            
            // Prüfe ob Abwesenheit in diesem Monat liegt
            if (startDate <= monthEnd && endDate >= monthStart) {
                // Berechne überlappende Tage im Monat
                const overlapStart = new Date(Math.max(startDate.getTime(), monthStart.getTime()));
                const overlapEnd = new Date(Math.min(endDate.getTime(), monthEnd.getTime()));
                
                const diffTime = overlapEnd.getTime() - overlapStart.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                totalDays += diffDays;
            }
        });
        
        return totalDays;
    };

    const absenceDays = calculateAbsenceDays();

    // Bestimme Abwesenheitstyp für Anzeige
    const getAbsenceTypeLabel = (type: string) => {
        switch (type) {
            case 'vacation': return 'Urlaub';
            case 'sick_leave': return 'Krankheit';
            case 'other': return 'Sonstiges';
            default: return 'Abwesenheit';
        }
    };

    return (
        <Box sx={{ py: 0.5 }}>
            {/* Mitarbeitername */}
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: 'text.primary',
                }}
            >
                {employee.name}
            </Typography>

            {/* Rolle und Standort */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 0.5,
                flexWrap: 'wrap'
            }}>
                <Chip
                    label={employee.role}
                    size="small"
                    color="primary"
                    sx={{
                        height: 18,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                    }}
                />
                <Chip
                    label={employee.location}
                    size="small"
                    sx={{
                        height: 18,
                        fontSize: '0.7rem',
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                    }}
                />
            </Box>

            {/* Arbeitszeiten und Abwesenheiten */}
            <Typography
                variant="caption"
                sx={{
                    display: 'block',
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                    mt: 0.5,
                    fontWeight: 500,
                }}
            >
                <Box component="span"
                     sx={{
                         color: hasOvertime ? theme.palette.error.main : 'inherit',
                         fontWeight: hasOvertime ? 700 : 'inherit',
                         backgroundColor: hasOvertime ? alpha(theme.palette.error.main, 0.1) : 'transparent',
                         px: hasOvertime ? 0.3 : 0,
                         borderRadius: hasOvertime ? 0.3 : 0,
                     }}
                >
                    {employee.calculatedMonthlyHours.toFixed(1)}h
                </Box>
                {' / '}
                <Box component="span"
                     sx={{
                         color: hasOvertime ? theme.palette.error.main : 'inherit',
                         fontWeight: hasOvertime ? 700 : 'inherit',
                         backgroundColor: hasOvertime ? alpha(theme.palette.error.main, 0.1) : 'transparent',
                         px: hasOvertime ? 0.3 : 0,
                         borderRadius: hasOvertime ? 0.3 : 0,
                     }}
                >
                    {employee.monthlyWorkHours || 0}h
                </Box>
                {absenceDays > 0 && (
                    <>
                        {' • '}
                        <Box component="span"
                             sx={{
                                 color: theme.palette.warning.main,
                                 fontWeight: 600,
                                 backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                 px: 0.3,
                                 borderRadius: 0.3,
                             }}
                        >
                            {absenceDays}T Abw.
                        </Box>
                    </>
                )}
            </Typography>
        </Box>
    );
};

export default EmployeeCell;