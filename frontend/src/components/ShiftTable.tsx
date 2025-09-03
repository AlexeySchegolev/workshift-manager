import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Alert,
    CircularProgress,
    Chip,
    CardContent,
    CardHeader,
    useTheme,
    alpha,
    Fade,
    Tooltip,
    IconButton,
} from '@mui/material';
import {
    FileDownload as FileDownloadIcon,
    Schedule as ScheduleIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import {format} from 'date-fns';
import {de} from 'date-fns/locale';
import {EmployeeResponseDto} from "@/api/data-contracts.ts";
import {excelExportService} from '@/services';
import MonthSelector from './MonthSelector';

interface ShiftTableProps {
    employees: EmployeeResponseDto[];
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    shiftPlan: any | null;
    shiftPlanId?: string | null; // Optional shift plan ID for Excel export
    isLoading: boolean;
    onGeneratePlan: () => void;
}

/**
 * Modern Shift Plan Table in Dashboard Style
 */
const ShiftTable: React.FC<ShiftTableProps> = ({
                                                   employees,
                                                   selectedDate,
                                                   onDateChange,
                                                   shiftPlan,
                                                   shiftPlanId,
                                                   isLoading,
                                                   onGeneratePlan
                                               }) => {
    const theme = useTheme();

    // Generate all days of the selected month
    const generateMonthDays = (date: Date): string[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days: string[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
            // Format as DD.MM.YYYY to match the backend format
            const dayStr = day.toString().padStart(2, '0');
            const monthStr = (month + 1).toString().padStart(2, '0');
            days.push(`${dayStr}.${monthStr}.${year}`);
        }
        return days;
    };

    // Use generated days or shift plan days if available
    const sortedDays = shiftPlan
        ? Object.keys(shiftPlan as Record<string, any>)
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.split('.').map(Number);
                const [dayB, monthB, yearB] = b.split('.').map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateA.getTime() - dateB.getTime();
            })
        : generateMonthDays(selectedDate);

    // Formatted month name
    const monthName = format(selectedDate, 'MMMM yyyy', {locale: de});

    // Function to export the shift plan
    const handleExportToExcel = async () => {
        if (!shiftPlan || !shiftPlanId) {
            alert('Kein Schichtplan zum Exportieren verfügbar.');
            return;
        }

        try {
            const blob = await excelExportService.exportShiftPlan(
                shiftPlanId,
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
            console.error('Error exporting shift plan:', error);
            alert('Der Schichtplan konnte nicht exportiert werden.');
        }
    };

    // Function to determine background color based on shift
    const getShiftBackgroundColor = (shift: string): string => {
        switch (shift) {
            case 'F':
                return alpha(theme.palette.shifts?.early || theme.palette.success.main, 0.1);
            case 'S':
            case 'S0':
            case 'S1':
            case 'S00':
                return alpha(theme.palette.shifts?.late || theme.palette.warning.main, 0.1);
            case 'FS':
                return alpha(theme.palette.shifts?.special || theme.palette.info.main, 0.1);
            case '4':
            case '5':
            case '6':
                return alpha(theme.palette.shifts?.uetersen || theme.palette.info.main, 0.1);
            default:
                return 'transparent';
        }
    };

    // Function for shift colors
    const getShiftColor = (shift: string): string => {
        switch (shift) {
            case 'F':
                return theme.palette.shifts?.early || theme.palette.success.main;
            case 'S':
            case 'S0':
            case 'S1':
            case 'S00':
                return theme.palette.shifts?.late || theme.palette.warning.main;
            case 'FS':
                return theme.palette.shifts?.special || theme.palette.info.main;
            case '4':
            case '5':
            case '6':
                return theme.palette.shifts?.uetersen || theme.palette.info.main;
            default:
                return theme.palette.text.secondary;
        }
    };
    return (
        <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            {/* Header */}
            <CardHeader
                title={
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                        <ScheduleIcon sx={{fontSize: '1.25rem', color: 'primary.main'}}/>
                        <Typography variant="h6" component="div">
                            Schichtplan für
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
                    <Box sx={{display: 'flex', gap: 1}}>
                        <Tooltip title="Schichtplan generieren">
                            <IconButton
                                color="primary"
                                onClick={onGeneratePlan}
                                disabled={isLoading}
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: 'white',
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                    '&:disabled': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.3),
                                        color: alpha(theme.palette.common.white, 0.5),
                                    },
                                }}
                            >
                                {isLoading ? <CircularProgress size={20} sx={{color: 'inherit'}}/> : <RefreshIcon/>}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Als Excel exportieren">
                            <IconButton
                                color="primary"
                                onClick={handleExportToExcel}
                                disabled={!shiftPlan || isLoading}
                                sx={{
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    },
                                }}
                            >
                                <FileDownloadIcon/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
                sx={{pb: 1}}
            />

            <CardContent sx={{pt: 0, px: 0, flex: 1, display: 'flex', flexDirection: 'column'}}>
                {/* Shift plan table */}
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            py: 8,
                            gap: 2,
                        }}
                    >
                        <CircularProgress size={48}/>
                        <Typography variant="body1" color="text.secondary">
                            Schichtplan wird generiert...
                        </Typography>
                    </Box>
                ) : sortedDays.length === 0 ? (
                    <Alert
                        severity="warning"
                        sx={{
                            borderRadius: 2,
                            '& .MuiAlert-message': {
                                width: '100%',
                            },
                        }}
                    >
                        <Typography variant="body2">
                            Keine gültigen Tage für den ausgewählten Monat gefunden.
                        </Typography>
                    </Alert>
                ) : (
                    <Fade in timeout={600}>
                        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
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
                                    {/* Table head with dates */}
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
                                            {sortedDays.map(dayKey => {
                                                const [day, month, year] = dayKey.split('.').map(Number);
                                                const date = new Date(year, month - 1, day);

                                                // Validate that the date is valid
                                                if (isNaN(date.getTime()) || isNaN(day) || isNaN(month) || isNaN(year)) {
                                                    console.warn(`Invalid date key: ${dayKey}`);
                                                    return null; // Skip invalid dates
                                                }

                                                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                                return (
                                                    <TableCell
                                                        key={dayKey}
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
                                                            <Typography variant="caption"
                                                                        sx={{display: 'block', fontWeight: 700}}>
                                                                {format(date, 'dd.MM')}
                                                            </Typography>
                                                            <Typography variant="caption"
                                                                        sx={{fontSize: '0.7rem', opacity: 0.8}}>
                                                                {format(date, 'EEE', {locale: de})}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHead>

                                    {/* Table body with employees and shifts */}
                                    <TableBody>
                                        {employees.map((emp) => (
                                            <TableRow
                                                key={emp.id}
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
                                                    <Box sx={{py: 0.5}}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: '0.85rem',
                                                                color: 'text.primary',
                                                            }}
                                                        >
                                                            {emp.lastName}, {emp.firstName}
                                                        </Typography>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            mt: 0.5
                                                        }}>
                                                            <Chip
                                                                label={emp.primaryRole?.name}
                                                                size="small"
                                                                color={"primary"}
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                            <Chip
                                                                label={emp.location?.name}
                                                                size="small"
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.7rem',
                                                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                                    color: theme.palette.info.main,
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {sortedDays.map(dayKey => {
                                                    const dayPlan = (shiftPlan as Record<string, any>)?.[dayKey] as Record<string, string[]> | null;
                                                    let assignedShift = '';

                                                    if (dayPlan) {
                                                        for (const shiftName in dayPlan) {
                                                            // Defensive programming: ensure dayPlan[shiftName] is an array before calling .includes()
                                                            // This matches the same pattern used in the backend service
                                                            const employeeList = Array.isArray(dayPlan[shiftName]) ? dayPlan[shiftName] : [];
                                                            if (employeeList.includes(emp.id)) {
                                                                assignedShift = shiftName;
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    const [day, month, year] = dayKey.split('.').map(Number);
                                                    const date = new Date(year, month - 1, day);
                                                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                                                    return (
                                                        <TableCell
                                                            key={`${emp.id}-${dayKey}`}
                                                            align="center"
                                                            sx={{
                                                                backgroundColor: (shiftPlan as Record<string, any>)?.[dayKey] === null
                                                                    ? alpha(theme.palette.grey[500], 0.1)
                                                                    : assignedShift
                                                                        ? getShiftBackgroundColor(assignedShift)
                                                                        : isWeekend
                                                                            ? alpha(theme.palette.error.main, 0.02)
                                                                            : 'inherit',
                                                                border: assignedShift
                                                                    ? `1px solid ${alpha(getShiftColor(assignedShift), 0.3)}`
                                                                    : 'none',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            {(shiftPlan as Record<string, any>)?.[dayKey] === null ? (
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: 'text.disabled',
                                                                        fontStyle: 'italic',
                                                                        fontSize: '0.75rem',
                                                                    }}
                                                                >
                                                                    —
                                                                </Typography>
                                                            ) : assignedShift ? (
                                                                <Chip
                                                                    label={assignedShift}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 24,
                                                                        fontSize: '0.75rem',
                                                                        fontWeight: 700,
                                                                        backgroundColor: getShiftBackgroundColor(assignedShift),
                                                                        color: getShiftColor(assignedShift),
                                                                        border: `1px solid ${alpha(getShiftColor(assignedShift), 0.5)}`,
                                                                        '& .MuiChip-label': {
                                                                            px: 1,
                                                                        },
                                                                    }}
                                                                />
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
                    </Fade>
                )}
            </CardContent>
        </Box>
    );
};

export default ShiftTable;