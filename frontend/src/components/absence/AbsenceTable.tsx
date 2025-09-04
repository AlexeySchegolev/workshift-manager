import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Chip,
    useTheme,
    alpha,
    Tooltip,
    CardHeader,
    CardContent,
} from '@mui/material';
import {
    Add as AddIcon,
    EventBusy as EventBusyIcon,
} from '@mui/icons-material';
import { format, getDaysInMonth, startOfMonth, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { EmployeeResponseDto, EmployeeAbsenceResponseDto } from '@/api/data-contracts';
import MonthSelector from '../MonthSelector';

interface AbsenceTableProps {
    employees: EmployeeResponseDto[];
    absences: EmployeeAbsenceResponseDto[];
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    onAddAbsence: () => void;
    isLoading?: boolean;
}

// Hilfsfunktion für Abwesenheitstyp-Farben
const getAbsenceTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
        vacation: '#4CAF50',
        sick_leave: '#F44336',
        personal_leave: '#FF9800',
        maternity_leave: '#E91E63',
        paternity_leave: '#9C27B0',
        unpaid_leave: '#607D8B',
        training: '#2196F3',
        conference: '#00BCD4',
        bereavement: '#795548',
        jury_duty: '#9E9E9E',
        military_leave: '#3F51B5',
        other: '#757575',
    };
    return colors[type] || '#757575';
};

// Hilfsfunktion für Abwesenheitstyp-Labels
const getAbsenceTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        vacation: 'Urlaub',
        sick_leave: 'Krankheit',
        personal_leave: 'Persönlich',
        maternity_leave: 'Mutterschutz',
        paternity_leave: 'Vaterzeit',
        unpaid_leave: 'Unbezahlt',
        training: 'Schulung',
        conference: 'Konferenz',
        bereavement: 'Trauerfall',
        jury_duty: 'Geschworene',
        military_leave: 'Militärdienst',
        other: 'Sonstiges',
    };
    return labels[type] || type;
};

const AbsenceTable: React.FC<AbsenceTableProps> = ({
    employees,
    absences,
    selectedDate,
    onDateChange,
    onAddAbsence,
    isLoading = false,
}) => {
    const theme = useTheme();
    const [monthDays, setMonthDays] = useState<Date[]>([]);

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
                action={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddAbsence}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        Abwesenheit hinzufügen
                    </Button>
                }
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
                                        
                                        return (
                                            <TableCell
                                                key={day.toISOString()}
                                                align="center"
                                                sx={{
                                                    minWidth: 70,
                                                    width: '70px',
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem',
                                                    backgroundColor: isWeekend
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
                                                backgroundColor: 'inherit',
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
                                                            color={employee.primaryRole.name === 'shift_leader' ? 'primary' : 'default'}
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
                                            
                                            return (
                                                <TableCell
                                                    key={`${employee.id}-${day.toISOString()}`}
                                                    align="center"
                                                    sx={{
                                                        backgroundColor: dayAbsences.length > 0
                                                            ? alpha(getAbsenceTypeColor(dayAbsences[0].absenceType), 0.1)
                                                            : isWeekend
                                                                ? alpha(theme.palette.error.main, 0.02)
                                                                : 'inherit',
                                                        border: dayAbsences.length > 0
                                                            ? `1px solid ${alpha(getAbsenceTypeColor(dayAbsences[0].absenceType), 0.3)}`
                                                            : 'none',
                                                        position: 'relative',
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
        </Box>
    );
};

export default AbsenceTable;