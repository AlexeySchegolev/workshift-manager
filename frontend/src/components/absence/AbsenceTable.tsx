import { CreateEmployeeAbsenceDto, EmployeeAbsenceResponseDto, EmployeeResponseDto } from '@/api/data-contracts';
import { employeeAbsenceService } from '@/services';
import {
    EventBusy as EventBusyIcon,
} from '@mui/icons-material';
import {
    alpha,
    Box,
    CardContent,
    CardHeader,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { addDays, format, getDaysInMonth, isToday, startOfMonth } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import MonthSelector from '../common/MonthSelector';
import AbsenceAssignmentDialog from './AbsenceAssignmentDialog';

// Hilfsfunktionen für Abwesenheitstypen basierend auf data-contracts
const getAbsenceTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        'vacation': 'Urlaub',
        'sick_leave': 'Krankheit',
        'other': 'Sonstiges'
    };
    return labels[type] || 'Unbekannt';
};

const getAbsenceTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        'vacation': '#4CAF50',      // Grün für Urlaub
        'sick_leave': '#F44336',    // Rot für Krankheit
        'other': '#757575',         // Grau für Sonstiges
    };
    return colors[type] || '#757575';
};

interface AbsenceTableProps {
    employees: EmployeeResponseDto[];
    absences: EmployeeAbsenceResponseDto[];
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    onRefreshAbsences: () => void;
    isLoading?: boolean;
}


const AbsenceTable: React.FC<AbsenceTableProps> = ({
    employees,
    absences,
    selectedDate,
    onDateChange,
    onRefreshAbsences,
    isLoading = false,
}) => {
    const theme = useTheme();
    const [monthDays, setMonthDays] = useState<Date[]>([]);
    
    // Modal state
    const [isAbsenceDialogOpen, setIsAbsenceDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponseDto | null>(null);
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    // Berechne die Tage des Monats
    useEffect(() => {
        const daysInMonth = getDaysInMonth(selectedDate);
        const firstDay = startOfMonth(selectedDate);
        const days: Date[] = [];
        
        for (let i = 0; i < daysInMonth; i++) {
            days.push(addDays(firstDay, i));
        }
        
        setMonthDays(days);
    }, [selectedDate]);

    // Navigation zwischen Monaten wird jetzt von MonthSelector übernommen

    // Finde Abwesenheiten für einen bestimmten Mitarbeiter und Tag
    const getAbsencesForEmployeeAndDay = (employeeId: string, day: Date): EmployeeAbsenceResponseDto[] => {
        return absences.filter(absence => {
            const startDate = new Date(absence.startDate);
            const endDate = new Date(absence.endDate);
            return absence.employeeId === employeeId && 
                   day >= startDate && day <= endDate;
        });
    };

    // Handle cell click to open absence assignment dialog
    const handleCellClick = (employee: EmployeeResponseDto, day: Date) => {
        setSelectedEmployee(employee);
        setSelectedDay(day);
        setIsAbsenceDialogOpen(true);
    };

    // Handle absence assignment
    const handleAbsenceAssignment = async (absenceData: CreateEmployeeAbsenceDto): Promise<void> => {
        try {
            await employeeAbsenceService.createAbsence(absenceData);
            onRefreshAbsences();
        } catch (error) {
            console.error('Error creating absence:', error);
            throw error;
        }
    };

    // Handle dialog close
    const handleCloseDialog = () => {
        setIsAbsenceDialogOpen(false);
        setSelectedEmployee(null);
        setSelectedDay(null);
    };

    // Convert employee to reduced format for dialog
    const getReducedEmployee = (employee: EmployeeResponseDto) => ({
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        role: employee.primaryRole?.displayName || employee.primaryRole?.name || '',
        location: employee.location?.name || '',
        calculatedMonthlyHours: 0,
        monthlyWorkHours: employee.monthlyWorkHours || 0,
    });

    // Format date for dialog (DD.MM.YYYY)
    const formatDateForDialog = (date: Date): string => {
        return format(date, 'dd.MM.yyyy');
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <CardHeader
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <EventBusyIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
                        <Typography variant="h6" component="div">
                            Abwesenheiten für
                        </Typography>
                        <Box sx={{
                            '& .MuiBox-root': {
                                margin: 0,
                                padding: 0,
                                backgroundColor: 'transparent',
                                borderRadius: 1,
                            },
                            '& .MuiButton-root': {
                                fontSize: '1rem',
                                fontWeight: 600,
                                padding: '4px 8px',
                                minHeight: 'auto',
                                textTransform: 'capitalize',
                            },
                            '& .MuiIconButton-root': {
                                padding: '4px',
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1.2rem',
                                },
                            },
                        }}>
                            <MonthSelector
                                selectedDate={selectedDate}
                                onDateChange={onDateChange}
                            />
                        </Box>
                    </Box>
                }
                action={null}
                sx={{ pb: 1 }}
            />

            <CardContent sx={{ pt: 0, px: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Abwesenheiten-Tabelle */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            flex: 1,
                            maxHeight: '75vh',
                            overflow: 'auto',
                            borderRadius: 0,
                            border: 'none',
                            width: '100%',
                        }}
                    >
                        <Table stickyHeader size="medium">
                            {/* Table head mit Datumsangaben */}
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            minWidth: 200,
                                            width: '200px',
                                            position: 'sticky',
                                            left: 0,
                                            top: 0,
                                            zIndex: 4,
                                            backgroundColor: theme.palette.background.paper,
                                            borderRight: `2px solid ${theme.palette.divider}`,
                                            borderBottom: `2px solid ${theme.palette.divider}`,
                                            fontWeight: 700,
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Mitarbeiter
                                    </TableCell>
                                    {monthDays.map((day) => {
                                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                        const isTodayDate = isToday(day);
                                        
                                        return (
                                            <TableCell
                                                key={day.toISOString()}
                                                align="center"
                                                sx={{
                                                    minWidth: 70,
                                                    width: '70px',
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem',
                                                    backgroundColor: isTodayDate
                                                        ? alpha(theme.palette.primary.main, 0.04)
                                                        : isWeekend
                                                            ? alpha(theme.palette.error.main, 0.05)
                                                            : theme.palette.background.paper,
                                                    color: isWeekend ? theme.palette.error.main : 'inherit',
                                                    position: 'sticky',
                                                    top: 0,
                                                    zIndex: 2,
                                                    borderBottom: `2px solid ${theme.palette.divider}`,
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                                                        {format(day, 'dd.MM')}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                                        {format(day, 'EEE', { locale: de })}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>

                            {/* Table body mit Mitarbeitern und Abwesenheiten */}
                            <TableBody>
                                {employees.map((employee) => (
                                    <TableRow
                                        key={employee.id}
                                        hover
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                            },
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                            },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{
                                                minWidth: 200,
                                                width: '200px',
                                                position: 'sticky',
                                                left: 0,
                                                backgroundColor: theme.palette.background.paper,
                                                borderRight: `2px solid ${theme.palette.divider}`,
                                                zIndex: 1,
                                            }}
                                        >
                                            <Box sx={{ py: 0.5 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    {employee.lastName}, {employee.firstName}
                                                </Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mt: 0.5
                                                }}>
                                                    {employee.primaryRole && (
                                                        <Chip
                                                            label={employee.primaryRole.displayName || employee.primaryRole.name}
                                                            size="small"
                                                            color="primary"
                                                            sx={{
                                                                height: 18,
                                                                fontSize: '0.7rem',
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    )}
                                                    {employee.location && (
                                                        <Chip
                                                            label={employee.location.name}
                                                            size="small"
                                                            sx={{
                                                                height: 18,
                                                                fontSize: '0.7rem',
                                                                backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                                color: theme.palette.info.main,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>

                                        {monthDays.map((day) => {
                                            const dayAbsences = getAbsencesForEmployeeAndDay(employee.id, day);
                                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                            const isTodayDate = isToday(day);
                                            
                                            return (
                                                <TableCell
                                                    key={`${employee.id}-${day.toISOString()}`}
                                                    align="center"
                                                    onClick={() => handleCellClick(employee, day)}
                                                    sx={{
                                                        backgroundColor: dayAbsences.length > 0
                                                            ? alpha(getAbsenceTypeColor(dayAbsences[0].absenceType), 0.1)
                                                            : isTodayDate
                                                                ? alpha(theme.palette.primary.main, 0.03)
                                                                : isWeekend
                                                                    ? alpha(theme.palette.error.main, 0.02)
                                                                    : 'inherit',
                                                        border: dayAbsences.length > 0
                                                            ? `1px solid ${alpha(getAbsenceTypeColor(dayAbsences[0].absenceType), 0.3)}`
                                                            : 'none',
                                                        position: 'relative',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                        },
                                                    }}
                                                >
                                                    {dayAbsences.length > 0 ? (
                                                        <Tooltip
                                                            title={
                                                                <Box>
                                                                    {dayAbsences.map((absence, index) => (
                                                                        <Box key={index} sx={{ mb: index < dayAbsences.length - 1 ? 1 : 0 }}>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                                {getAbsenceTypeLabel(absence.absenceType)}
                                                                            </Typography>
                                                                            <Typography variant="caption">
                                                                                {format(new Date(absence.startDate), 'dd.MM.yyyy')} - {format(new Date(absence.endDate), 'dd.MM.yyyy')}
                                                                            </Typography>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            }
                                                        >
                                                            <Chip
                                                                label={getAbsenceTypeLabel(dayAbsences[0].absenceType).substring(0, 3)}
                                                                size="small"
                                                                sx={{
                                                                    height: 24,
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 700,
                                                                    backgroundColor: alpha(getAbsenceTypeColor(dayAbsences[0].absenceType), 0.2),
                                                                    color: getAbsenceTypeColor(dayAbsences[0].absenceType),
                                                                    border: `1px solid ${alpha(getAbsenceTypeColor(dayAbsences[0].absenceType), 0.5)}`,
                                                                    '& .MuiChip-label': {
                                                                        px: 1,
                                                                    },
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                width: 24,
                                                                height: 24,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: 'text.disabled',
                                                                    fontSize: '0.7rem',
                                                                }}
                                                            >
                                                                —
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </CardContent>

            {/* Absence Assignment Dialog */}
            <AbsenceAssignmentDialog
                open={isAbsenceDialogOpen}
                onClose={handleCloseDialog}
                onAssign={handleAbsenceAssignment}
                employee={selectedEmployee ? getReducedEmployee(selectedEmployee) : null}
                selectedDate={selectedDay ? formatDateForDialog(selectedDay) : ''}
            />
        </Box>
    );
};

export default AbsenceTable;