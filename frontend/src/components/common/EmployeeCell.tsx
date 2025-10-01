import { ReducedEmployee } from '@/services';
import { alpha, Box, Chip, Typography, useTheme, Tooltip } from '@mui/material';
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

    // Berechne Abwesenheitsstunden für den aktuellen Monat
    const calculateAbsenceHours = () => {
        let totalHours = 0;
        
        absences.forEach(absence => {
            const startDate = new Date(absence.startDate);
            const endDate = new Date(absence.endDate);
            const monthStart = new Date(year, month - 1, 1);
            const monthEnd = new Date(year, month, 0);
            
            // Prüfe ob Abwesenheit in diesem Monat liegt
            if (startDate <= monthEnd && endDate >= monthStart) {
                // Verwende hoursCount falls vorhanden, sonst berechne aus Tagen
                if (absence.hoursCount) {
                    totalHours += absence.hoursCount;
                } else {
                    // Fallback: Berechne aus Tagen
                    const workingHoursPerDay = (employee.monthlyWorkHours || 0) / 22;
                    const overlapStart = new Date(Math.max(startDate.getTime(), monthStart.getTime()));
                    const overlapEnd = new Date(Math.min(endDate.getTime(), monthEnd.getTime()));
                    
                    const diffTime = overlapEnd.getTime() - overlapStart.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    totalHours += diffDays * workingHoursPerDay;
                }
            }
        });
        
        return Math.round(totalHours); // Runde auf ganze Stunden
    };

    const absenceHours = calculateAbsenceHours();
    const maxHours = employee.monthlyWorkHours || 0;
    const bookedHours = employee.calculatedMonthlyHours;
    const actualAvailableHours = maxHours - absenceHours;
    
    // Status-Indikatoren
    const hasOvertime = bookedHours > maxHours;
    const hasAbsences = absenceHours > 0;
    const isOverbooked = bookedHours > actualAvailableHours;

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

            {/* Zeitübersicht */}
            <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                {/* Gebuchte vs. Tatsächlich verfügbare Stunden */}
                <Tooltip title={`Gebuchte Stunden: ${bookedHours.toFixed(1)}h / Verfügbare Stunden: ${Math.round(actualAvailableHours)}h`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', minWidth: '20px' }}>
                            📅
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <Box component="span"
                                 sx={{
                                     fontSize: '0.7rem',
                                     fontWeight: 600,
                                     color: isOverbooked ? theme.palette.error.main :
                                            hasOvertime ? theme.palette.warning.main :
                                            theme.palette.success.main,
                                     backgroundColor: isOverbooked ? alpha(theme.palette.error.main, 0.1) :
                                                     hasOvertime ? alpha(theme.palette.warning.main, 0.1) :
                                                     alpha(theme.palette.success.main, 0.1),
                                     px: 0.3,
                                     borderRadius: 0.3,
                                 }}
                            >
                                {bookedHours.toFixed(1)}h
                            </Box>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                                / {Math.round(actualAvailableHours)}h
                            </Typography>
                        </Box>
                    </Box>
                </Tooltip>

                {/* Maximale Stunden */}
                <Tooltip title={`Maximale Stunden: ${maxHours}h`}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', minWidth: '20px' }}>
                            ⏰
                        </Typography>
                        <Box component="span"
                             sx={{
                                 fontSize: '0.7rem',
                                 fontWeight: 500,
                                 color: 'text.secondary',
                             }}
                        >
                            {maxHours}h max
                        </Box>
                    </Box>
                </Tooltip>

                {/* Abwesenheiten */}
                {hasAbsences && (
                    <Tooltip title={`Abwesenheitsstunden: ${absenceHours}h`}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary', minWidth: '20px' }}>
                                🚫
                            </Typography>
                            <Box component="span"
                                 sx={{
                                     fontSize: '0.7rem',
                                     fontWeight: 600,
                                     color: theme.palette.warning.main,
                                     backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                     px: 0.3,
                                     borderRadius: 0.3,
                                 }}
                            >
                                -{absenceHours}h Abw.
                            </Box>
                        </Box>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
};

export default EmployeeCell;