import { CalculatedShiftPlan, ReducedEmployee } from '@/services';
import {
    AutoAwesome as AutoAwesomeIcon,
    FileDownload as FileDownloadIcon,
    Schedule as ScheduleIcon
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
import { shiftPlanAICalculationService } from '../../services/shift-plan/ShiftPlanAICalculationService';
import LocationSelector from '../LocationSelector';
import MonthSelector from '../MonthSelector';
import NoShiftPlanOverlay from '../NoShiftPlanOverlay';
import ShiftAssignmentDialog from '../shift/ShiftAssignmentDialog';
import ShiftChip from './ShiftChip';
import { ShiftPlanTableExport } from './ShiftPlanTableExport';
import { ShiftPlanTableHandlers } from './ShiftPlanTableHandlers';
import { ShiftPlanTableStyles } from './ShiftPlanTableStyles';

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

    // Get styles
    const headerActionStyles = ShiftPlanTableStyles.getHeaderActionStyles(theme);
    const monthSelectorStyles = ShiftPlanTableStyles.getMonthSelectorStyles();
    const tableCellStyles = ShiftPlanTableStyles.getTableCellStyles(theme);

    // Event handlers
    const handleExportToExcel = () => ShiftPlanTableExport.exportToExcel(shiftPlan, selectedDate);
    
    const handleAIGeneration = () => {
        shiftPlanAICalculationService.generateShiftPlan(calculatedShiftPlan);
    };
    
    const handleCellClick = ShiftPlanTableHandlers.createCellClickHandler(
        setSelectedEmployee,
        setSelectedDateForAssignment,
        setCurrentShiftId,
        setIsAssignmentDialogOpen
    );

    const handleShiftAssignment = (employeeId: string, shiftId: string | null, date: string) =>
        ShiftPlanTableHandlers.handleShiftAssignment(employeeId, shiftId, date, shiftPlan, onGeneratePlan);

    const handleCloseAssignmentDialog = ShiftPlanTableHandlers.createCloseAssignmentDialogHandler(
        setIsAssignmentDialogOpen,
        setSelectedEmployee,
        setSelectedDateForAssignment,
        setCurrentShiftId
    );

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
                        <Box sx={monthSelectorStyles}>
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
                        <Tooltip title="AI Schichtplan generieren">
                            <IconButton
                                color="secondary"
                                onClick={handleAIGeneration}
                                disabled={isLoading}
                                sx={headerActionStyles.refreshButton}
                            >
                                <AutoAwesomeIcon/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Als Excel exportieren">
                            <IconButton
                                color="primary"
                                onClick={handleExportToExcel}
                                disabled={!shiftPlan || isLoading}
                                sx={headerActionStyles.exportButton}
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
                                            <TableCell sx={tableCellStyles.employeeCell}>
                                                
                                            </TableCell>
                                            {days.map((dayInfo) => (
                                                <TableCell
                                                    key={dayInfo.dayKey}
                                                    align="center"
                                                    sx={tableCellStyles.dateCell(dayInfo)}
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
                                            ))}
                                        </TableRow>
                                        
                                        {/* Schicht-Übersicht Zeile */}
                                        <TableRow>
                                            <TableCell sx={tableCellStyles.shiftOverviewCell}>
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
                                                        verticalAlign: 'top',
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
                                                                    ? ShiftPlanTableStyles.getShiftBackgroundColor(assignedShift, theme)
                                                                    : absenceReason
                                                                        ? alpha(theme.palette.warning.main, 0.1)
                                                                        : dayInfo.isToday
                                                                            ? alpha(theme.palette.primary.main, 0.03)
                                                                            : dayInfo.isWeekend
                                                                                ? alpha(theme.palette.error.main, 0.02)
                                                                                : 'inherit',
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
                                                                            width: 33,
                                                                            height: 33,
                                                                            borderRadius: '50%',
                                                                            backgroundColor: alpha(ShiftPlanTableStyles.getShiftColor(assignedShift, theme), 0.15),
                                                                            color: ShiftPlanTableStyles.getShiftColor(assignedShift, theme),
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontSize: '0.7rem',
                                                                            fontWeight: '600',
                                                                            cursor: 'pointer',
                                                                            margin: 'auto',
                                                                            padding: '2px',
                                                                        }}
                                                                    >
                                                                        {assignedShift}
                                                                    </Box>
                                                                </Tooltip>
                                                            ) : absenceReason ? (
                                                                <Tooltip title={absenceReason} arrow>
                                                                    <Box
                                                                        sx={{
                                                                            width: 33,
                                                                            height: 33,
                                                                            borderRadius: '50%',
                                                                            backgroundColor: alpha(theme.palette.warning.main, 0.15),
                                                                            color: theme.palette.warning.main,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            fontSize: '0.6rem',
                                                                            fontWeight: '600',
                                                                            cursor: 'pointer',
                                                                            margin: 'auto',
                                                                            padding: '2px',
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