import React, { useState, useEffect } from 'react';
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
import {format, isToday, getDaysInMonth, startOfMonth, addDays} from 'date-fns';
import {de} from 'date-fns/locale';
import {EmployeeResponseDto} from "@/api/data-contracts.ts";
import {excelExportService, shiftPlanDetailService} from '@/services';
import MonthSelector from '../MonthSelector';
import LocationSelector from '../LocationSelector';
import NoShiftPlanOverlay from '../NoShiftPlanOverlay';
import ShiftAssignmentDialog from '../shift/ShiftAssignmentDialog';

interface ShiftPlanTableProps {
    employees: EmployeeResponseDto[];
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    selectedLocationId: string | null;
    onLocationChange: (locationId: string | null) => void;
    shiftPlan: any | null;
    shiftPlanDetails?: any[]; // Details for shift assignments
    shiftPlanId?: string | null; // Optional shift plan ID for Excel export
    isLoading: boolean;
    onGeneratePlan: () => void;
    onCreatePlan?: () => void; // New prop for creating shift plan
    showNoShiftPlanOverlay?: boolean; // New prop to show overlay
}

/**
 * Modern Shift Plan Table in Dashboard Style
 */
const ShiftPlanTable: React.FC<ShiftPlanTableProps> = ({
                                                   employees,
                                                   selectedDate,
                                                   onDateChange,
                                                   selectedLocationId,
                                                   onLocationChange,
                                                   shiftPlan,
                                                   shiftPlanDetails = [],
                                                   shiftPlanId,
                                                   isLoading,
                                                   onGeneratePlan,
                                                   onCreatePlan,
                                                   showNoShiftPlanOverlay = false
                                               }) => {
  const theme = useTheme();
  const [monthDays, setMonthDays] = useState<Date[]>([]);
  
  // Modal state
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponseDto | null>(null);
  const [selectedDateForAssignment, setSelectedDateForAssignment] = useState<string>('');
  const [currentShiftId, setCurrentShiftId] = useState<string | null>(null);

   // Berechne die Tage des Monats (ähnlich wie in AbsenceTable)
   useEffect(() => {
       const daysInMonth = getDaysInMonth(selectedDate);
       const firstDay = startOfMonth(selectedDate);
       const days: Date[] = [];
       
       for (let i = 0; i < daysInMonth; i++) {
           days.push(addDays(firstDay, i));
       }
       
       setMonthDays(days);
   }, [selectedDate]);

   // Convert Date objects to string format for shift plan compatibility
   const sortedDays = monthDays.map(day => {
       const dayStr = day.getDate().toString().padStart(2, '0');
       const monthStr = (day.getMonth() + 1).toString().padStart(2, '0');
       const yearStr = day.getFullYear().toString();
       return `${dayStr}.${monthStr}.${yearStr}`;
   });

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

    // Function to get shortname for shift display in circle
    const getShiftShortname = (shift: string): string => {
        switch (shift) {
            case 'F':
            case 'Frühschicht':
            case 'morning':
                return 'F';
            case 'S':
            case 'S0':
            case 'S1':
            case 'S00':
            case 'Spätschicht':
            case 'afternoon':
            case 'evening':
                return 'S';
            case 'N':
            case 'Nachtschicht':
            case 'night':
                return 'N';
            case 'FS':
            case 'special':
                return 'FS';
            case '4':
                return '4';
            case '5':
                return '5';
            case '6':
                return '6';
            default:
                return shift.substring(0, 2).toUpperCase();
        }
    };

    // Handle cell click to open assignment dialog
    const handleCellClick = (employee: EmployeeResponseDto, dayKey: string, currentShift?: string) => {
        setSelectedEmployee(employee);
        setSelectedDateForAssignment(dayKey);
        setCurrentShiftId(currentShift || null);
        setIsAssignmentDialogOpen(true);
    };

    // Handle shift assignment
    const handleShiftAssignment = async (employeeId: string, shiftId: string | null, date: string) => {
        if (!shiftPlan || !shiftPlanId) {
            throw new Error('Kein Schichtplan verfügbar');
        }

        // Parse date from DD.MM.YYYY format
        const [day, month, year] = date.split('.');
        const dayNumber = parseInt(day, 10);

        try {
            if (shiftId) {
                // Assign shift
                await shiftPlanDetailService.assignEmployeeToShift(
                    shiftPlanId,
                    employeeId,
                    shiftId,
                    dayNumber
                );
            } else {
                // Remove assignment
                await shiftPlanDetailService.removeEmployeeAssignment(
                    shiftPlanId,
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
    };

    // Close assignment dialog
    const handleCloseAssignmentDialog = () => {
        setIsAssignmentDialogOpen(false);
        setSelectedEmployee(null);
        setSelectedDateForAssignment('');
        setCurrentShiftId(null);
    };

    return (
        <Box sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            {/* Header */}
            <CardHeader
                title={
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                        <ScheduleIcon sx={{fontSize: '1.25rem', color: 'primary.main'}}/>
                        <Typography variant="h6" component="div">
                            Schichtplan für
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
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
                            <LocationSelector
                                selectedLocationId={selectedLocationId}
                                onLocationChange={onLocationChange}
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

            <CardContent sx={{pt: 0, px: 0, flex: 1, display: 'flex', flexDirection: 'column', position: 'relative'}}>
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
                                            {monthDays.map((day, index) => {
                                                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                                const isTodayDate = isToday(day);
                                                const dayKey = sortedDays[index];

                                                return (
                                                    <TableCell
                                                        key={dayKey}
                                                        align="center"
                                                        sx={{
                                                            minWidth: 50,
                                                            width: '50px',
                                                            height: '50px',
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
                                                            <Typography variant="caption"
                                                                        sx={{display: 'block', fontWeight: 700}}>
                                                                {format(day, 'dd.MM')}
                                                            </Typography>
                                                            <Typography variant="caption"
                                                                        sx={{fontSize: '0.7rem', opacity: 0.8}}>
                                                                {format(day, 'EEE', {locale: de})}
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

                                                {monthDays.map((day, index) => {
                                                    const dayKey = sortedDays[index];
                                                    const dayNumber = day.getDate();
                                                    
                                                    // Try to get shift from original shiftPlan structure first (for backward compatibility)
                                                    const dayPlan = (shiftPlan as Record<string, any>)?.[dayKey] as Record<string, string[]> | null;
                                                    let assignedShift = '';

                                                    if (dayPlan) {
                                                        // Original logic: check shiftPlan structure
                                                        for (const shiftName in dayPlan) {
                                                            const employeeList = Array.isArray(dayPlan[shiftName]) ? dayPlan[shiftName] : [];
                                                            if (employeeList.includes(emp.id)) {
                                                                assignedShift = shiftName;
                                                                break;
                                                            }
                                                        }
                                                    } else if (shiftPlanDetails.length > 0) {
                                                        // New logic: use details if available
                                                        const assignment = shiftPlanDetails.find(detail =>
                                                            detail.employeeId === emp.id && detail.day === dayNumber
                                                        );
                                                        assignedShift = assignment?.shift?.name || '';
                                                    }

                                                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                                    const isTodayDate = isToday(day);

                                                    return (
                                                        <TableCell
                                                            key={`${emp.id}-${dayKey}`}
                                                            align="center"
                                                            onClick={() => handleCellClick(emp, dayKey, assignedShift)}
                                                            sx={{
                                                                backgroundColor: (shiftPlan as Record<string, any>)?.[dayKey] === null
                                                                    ? alpha(theme.palette.grey[500], 0.1)
                                                                    : assignedShift
                                                                        ? getShiftBackgroundColor(assignedShift)
                                                                        : isTodayDate
                                                                            ? alpha(theme.palette.primary.main, 0.03)
                                                                            : isWeekend
                                                                                ? alpha(theme.palette.error.main, 0.02)
                                                                                : 'inherit',
                                                                border: assignedShift
                                                                    ? `1px solid ${alpha(getShiftColor(assignedShift), 0.3)}`
                                                                    : 'none',
                                                                position: 'relative',
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                                },
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
                                                                <Tooltip title={assignedShift} arrow>
                                                                    <Box
                                                                        sx={{
                                                                            width: 28,
                                                                            height: 28,
                                                                            borderRadius: '50%',
                                                                            backgroundColor: alpha(getShiftColor(assignedShift), 0.15),
                                                                            color: getShiftColor(assignedShift),
                                                                            border: `1px solid ${alpha(getShiftColor(assignedShift), 0.3)}`,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontSize: '0.7rem',
                                                                            fontWeight: '600',
                                                                            cursor: 'pointer',
                                                                            margin: 'auto',
                                                                        }}
                                                                    >
                                                                        {getShiftShortname(assignedShift)}
                                                                    </Box>
                                                                </Tooltip>
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '100%',
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
                
                {/* No Shift Plan Overlay - positioned within CardContent to not cover header */}
                {showNoShiftPlanOverlay && onCreatePlan && (
                    <NoShiftPlanOverlay
                        selectedDate={selectedDate}
                        selectedLocationId={selectedLocationId}
                        onCreatePlan={onCreatePlan}
                    />
                )}
            </CardContent>

            {/* Shift Assignment Dialog */}
            <ShiftAssignmentDialog
                open={isAssignmentDialogOpen}
                onClose={handleCloseAssignmentDialog}
                onAssign={handleShiftAssignment}
                employee={selectedEmployee}
                selectedDate={selectedDateForAssignment}
                currentShiftId={currentShiftId}
                locationId={selectedLocationId}
            />
        </Box>
    );
};

export default ShiftPlanTable;