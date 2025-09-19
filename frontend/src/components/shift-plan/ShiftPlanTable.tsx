import { excelExportService, shiftPlanDetailService } from '@/services';
import { CalculatedShiftPlan, ReducedEmployee } from '@/services';
import {
    FileDownload as FileDownloadIcon,
    Refresh as RefreshIcon,
    Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
    alpha,
    Box,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Fade,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { useState } from 'react';
import LocationSelector from '../LocationSelector';
import MonthSelector from '../MonthSelector';
import NoShiftPlanOverlay from '../NoShiftPlanOverlay';
import ShiftAssignmentDialog from '../shift/ShiftAssignmentDialog';
import ShiftChip from './ShiftChip';

interface ShiftPlanTableProps {
    calculatedShiftPlan: CalculatedShiftPlan;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    selectedLocationId: string | null;
    onLocationChange: (locationId: string | null) => void;
    isLoading: boolean;
    onGeneratePlan: () => void;
    onCreatePlan?: () => void;
    showNoShiftPlanOverlay?: boolean;
}

/**
 * Modern Shift Plan Table in Dashboard Style
 */
const ShiftPlanTable: React.FC<ShiftPlanTableProps> = ({
                                                   calculatedShiftPlan,
                                                   selectedDate,
                                                   onDateChange,
                                                   selectedLocationId,
                                                   onLocationChange,
                                                   isLoading,
                                                   onGeneratePlan,
                                                   onCreatePlan,
                                                   showNoShiftPlanOverlay = false
                                               }) => {
  const theme = useTheme();
  
  // Modal state
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ReducedEmployee | null>(null);
  const [selectedDateForAssignment, setSelectedDateForAssignment] = useState<string>('');
  const [currentShiftId, setCurrentShiftId] = useState<string | null>(null);

  // Destructure calculated data
  const { employees, days, shiftPlan, shiftPlanDetails } = calculatedShiftPlan;

    // Formatted month name
    const monthName = format(selectedDate, 'MMMM yyyy', {locale: de});

    // Function to export the shift plan
    const handleExportToExcel = async () => {
        if (!shiftPlan || !shiftPlan.id) {
            alert('Kein Schichtplan zum Exportieren verfügbar.');
            return;
        }

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


    // Handle cell click to open assignment dialog
    const handleCellClick = (employee: ReducedEmployee, dayKey: string, currentShift?: string) => {
        setSelectedEmployee(employee);
        setSelectedDateForAssignment(dayKey);
        setCurrentShiftId(currentShift || null);
        setIsAssignmentDialogOpen(true);
    };

    // Handle shift assignment
    const handleShiftAssignment = async (employeeId: string, shiftId: string | null, date: string) => {
        if (!shiftPlan || !shiftPlan.id) {
            throw new Error('Kein Schichtplan verfügbar');
        }

        // Parse date from DD.MM.YYYY format
        const [day, month, year] = date.split('.');
        const dayNumber = parseInt(day, 10);

        try {
            if (shiftId) {
                // Assign shift
                await shiftPlanDetailService.assignEmployeeToShift(
                    shiftPlan.id,
                    employeeId,
                    shiftId,
                    dayNumber
                );
            } else {
                // Remove assignment
                await shiftPlanDetailService.removeEmployeeAssignment(
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
                                                    minWidth: 250,
                                                    width: '250px',
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
                                                
                                            </TableCell>
                                            {days.map((dayInfo) => {

                                                return (
                                                    <TableCell
                                                        key={dayInfo.dayKey}
                                                        align="center"
                                                        sx={{
                                                            minWidth: 50,
                                                            width: '50px',
                                                            height: '50px',
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            backgroundColor: dayInfo.isToday
                                                                ? alpha(theme.palette.primary.main, 0.04)
                                                                : dayInfo.isWeekend
                                                                    ? alpha(theme.palette.error.main, 0.05)
                                                                    : theme.palette.background.paper,
                                                            color: dayInfo.isWeekend ? theme.palette.error.main : 'inherit',
                                                            position: 'sticky',
                                                            top: 0,
                                                            zIndex: 2,
                                                            borderBottom: `2px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography variant="caption"
                                                                        sx={{display: 'block', fontWeight: 700}}>
                                                                {format(dayInfo.date, 'dd.MM')}
                                                            </Typography>
                                                            <Typography variant="caption"
                                                                        sx={{fontSize: '0.7rem', opacity: 0.8}}>
                                                                {format(dayInfo.date, 'EEE', {locale: de})}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                        
                                        {/* Schicht-Übersicht Zeile */}
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    minWidth: 250,
                                                    width: '250px',
                                                    position: 'sticky',
                                                    left: 0,
                                                    top: 50,
                                                    zIndex: 3,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRight: `2px solid ${theme.palette.divider}`,
                                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                                    fontWeight: 600,
                                                    fontSize: '0.8rem',
                                                    color: theme.palette.text.primary,
                                                    padding: 0,
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: `linear-gradient(to top right, transparent 49%, ${theme.palette.divider} 49%, ${theme.palette.divider} 51%, transparent 51%)`,
                                                        zIndex: 1,
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '100%',
                                                    minHeight: 50,
                                                    zIndex: 2
                                                }}>
                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 6,
                                                            right: 8,
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            color: theme.palette.text.primary,
                                                        }}
                                                    >
                                                        Schichten
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: 6,
                                                            left: 8,
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            color: theme.palette.text.primary,
                                                        }}
                                                    >
                                                        Mitarbeiter
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            {days.map((dayInfo) => (
                                                <TableCell
                                                    key={`shifts-${dayInfo.dayKey}`}
                                                    align="center"
                                                    sx={{
                                                        minWidth: 50,
                                                        width: '50px',
                                                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                                                        position: 'sticky',
                                                        top: 50,
                                                        zIndex: 2,
                                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                                        padding: '4px',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        {dayInfo.shiftOccupancy.map((shift) => (
                                                            <ShiftChip
                                                                key={shift.shiftId}
                                                                shift={shift}
                                                            />
                                                        ))}
                                                        {dayInfo.shiftOccupancy.length === 0 && (
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: 'text.disabled',
                                                                    fontSize: '0.6rem',
                                                                }}
                                                            >
                                                                —
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                            ))}
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
                                                        minWidth: 250,
                                                        width: '250px',
                                                        position: 'sticky',
                                                        left: 0,
                                                        backgroundColor: theme.palette.background.paper,
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
                                                            {emp.name}
                                                        </Typography>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            mt: 0.5,
                                                            flexWrap: 'wrap'
                                                        }}>
                                                            <Chip
                                                                label={emp.role}
                                                                size="small"
                                                                color={"primary"}
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 500,
                                                                }}
                                                            />
                                                            <Chip
                                                                label={emp.location}
                                                                size="small"
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.7rem',
                                                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                                    color: theme.palette.info.main,
                                                                }}
                                                            />
                                                        </Box>
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
                                                                     color: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0)
                                                                         ? theme.palette.error.main
                                                                         : 'inherit',
                                                                     fontWeight: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0)
                                                                         ? 700
                                                                         : 'inherit',
                                                                     backgroundColor: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0)
                                                                         ? alpha(theme.palette.error.main, 0.1)
                                                                         : 'transparent',
                                                                     px: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0) ? 0.3 : 0,
                                                                     borderRadius: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0) ? 0.3 : 0,
                                                                 }}
                                                            >
                                                                {emp.calculatedMonthlyHours.toFixed(1)}h
                                                            </Box>
                                                            {' / '}
                                                            <Box component="span"
                                                                 sx={{
                                                                     color: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0)
                                                                         ? theme.palette.error.main
                                                                         : 'inherit',
                                                                     fontWeight: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0)
                                                                         ? 700
                                                                         : 'inherit',
                                                                     backgroundColor: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0)
                                                                         ? alpha(theme.palette.error.main, 0.1)
                                                                         : 'transparent',
                                                                     px: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0) ? 0.3 : 0,
                                                                     borderRadius: emp.calculatedMonthlyHours > (emp.monthlyWorkHours || 0) ? 0.3 : 0,
                                                                 }}
                                                            >
                                                                {emp.monthlyWorkHours || 0}h
                                                            </Box>
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                {days.map((dayInfo) => {
                                                    // Finde den Mitarbeiter-Status für diesen Tag
                                                    const employeeStatus = dayInfo.employees.find(empStatus =>
                                                        empStatus.employee.id === emp.id
                                                    );
                                                    
                                                    const assignedShift = employeeStatus?.assignedShift || '';
                                                    const shiftName = employeeStatus?.shiftName || assignedShift || '';
                                                    const absenceReason = employeeStatus?.absenceReason || null;

                                                    return (
                                                        <TableCell
                                                            key={`${emp.id}-${dayInfo.dayKey}`}
                                                            align="center"
                                                            onClick={() => handleCellClick(emp, dayInfo.dayKey, assignedShift)}
                                                            sx={{
                                                                backgroundColor: assignedShift
                                                                    ? getShiftBackgroundColor(assignedShift)
                                                                    : absenceReason
                                                                        ? alpha(theme.palette.warning.main, 0.1)
                                                                        : dayInfo.isToday
                                                                            ? alpha(theme.palette.primary.main, 0.03)
                                                                            : dayInfo.isWeekend
                                                                                ? alpha(theme.palette.error.main, 0.02)
                                                                                : 'inherit',
                                                                border: assignedShift
                                                                    ? `1px solid ${alpha(getShiftColor(assignedShift), 0.3)}`
                                                                    : absenceReason
                                                                        ? `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
                                                                        : 'none',
                                                                position: 'relative',
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                                },
                                                            }}
                                                        >
                                                            {assignedShift ? (
                                                                <Tooltip title={shiftName} arrow>
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
                                                                        {assignedShift}
                                                                    </Box>
                                                                </Tooltip>
                                                            ) : absenceReason ? (
                                                                <Tooltip title={absenceReason} arrow>
                                                                    <Box
                                                                        sx={{
                                                                            width: 28,
                                                                            height: 28,
                                                                            borderRadius: '50%',
                                                                            backgroundColor: alpha(theme.palette.warning.main, 0.15),
                                                                            color: theme.palette.warning.main,
                                                                            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontSize: '0.6rem',
                                                                            fontWeight: '600',
                                                                            cursor: 'pointer',
                                                                            margin: 'auto',
                                                                        }}
                                                                    >
                                                                        A
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