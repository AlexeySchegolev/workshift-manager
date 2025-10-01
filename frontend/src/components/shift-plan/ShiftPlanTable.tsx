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
    useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { EmployeeAbsenceResponseDto } from '../../api/data-contracts';
import { EmployeeAbsenceService } from '../../services/EmployeeAbsenceService';
import { shiftPlanAICalculationService } from '../../services/shift-plan/shift-plan-preview/ShiftPlanAICalculationService';
import { ShiftPlanDay } from '../../services/shift-plan/ShiftPlanTypes';
import EmployeeCell from '../common/EmployeeCell';
import LocationSelector from '../common/LocationSelector';
import MonthSelector from '../common/MonthSelector';
import ShiftPlanPreviewModal from '../shift-plan-preview/ShiftPlanPreviewModal';
import ShiftAssignmentDialog from '../shift/ShiftAssignmentDialog';
import NoShiftPlanOverlay from './NoShiftPlanOverlay';
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
    
    // AI Preview Modal state
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState<ShiftPlanDay[] | null>(null);

    // Absences state
    const [absences, setAbsences] = useState<EmployeeAbsenceResponseDto[]>([]);
    const [absenceService] = useState(() => new EmployeeAbsenceService());

    // Destructure calculated data
    const { employees, days, shiftPlan, shiftPlanDetails } = calculatedShiftPlan;

    // Get styles
    const headerActionStyles = ShiftPlanTableStyles.getHeaderActionStyles(theme);
    const monthSelectorStyles = ShiftPlanTableStyles.getMonthSelectorStyles();
    const tableCellStyles = ShiftPlanTableStyles.getTableCellStyles(theme);

    // Setup AI service callback
    useEffect(() => {
        shiftPlanAICalculationService.setPreviewModalCallback((data: ShiftPlanDay[]) => {
            setPreviewData(data);
            setIsPreviewModalOpen(true);
        });
    }, []);

    // Load absences when date changes
    useEffect(() => {
        const loadAbsences = async () => {
            try {
                const year = selectedDate.getFullYear().toString();
                const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                const monthlyAbsences = await absenceService.getAbsencesByMonth(year, month);
                setAbsences(monthlyAbsences);
            } catch (error) {
                console.error('Fehler beim Laden der Abwesenheiten:', error);
                setAbsences([]);
            }
        };

        loadAbsences();
    }, [selectedDate, absenceService]);
    
    // Event handlers
    const handleExportToExcel = () => ShiftPlanTableExport.exportToExcel(shiftPlan, selectedDate);
    
    const handleAIGeneration = () => {
        shiftPlanAICalculationService.generateShiftPlan(calculatedShiftPlan);
    };
    
    const handlePreviewModalClose = () => {
        setIsPreviewModalOpen(false);
        setPreviewData(null);
    };
    
    const handlePreviewModalAccept = () => {
        // Hier würde die Logik zum Übernehmen des Schichtplans stehen
        console.log('Schichtplan übernommen');
        handlePreviewModalClose();
        onGeneratePlan(); // Refresh der Daten
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
                                                    <EmployeeCell
                                                        employee={emp}
                                                        month={calculatedShiftPlan.month}
                                                        year={calculatedShiftPlan.year}
                                                        absences={absences.filter(absence => absence.employeeId === emp.id)}
                                                    />
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
            
            {/* AI Preview Modal */}
            <ShiftPlanPreviewModal
                open={isPreviewModalOpen}
                onClose={handlePreviewModalClose}
                onAccept={handlePreviewModalAccept}
                previewData={previewData}
                originalData={calculatedShiftPlan}
            />
        </Box>
    );
};

export default ShiftPlanTable;