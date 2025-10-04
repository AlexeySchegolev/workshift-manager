import {
    alpha,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import React, { useEffect, useMemo, useState } from 'react';
import { EmployeeAbsenceResponseDto } from '../../api/data-contracts';
import { EmployeeAbsenceService } from '../../services/EmployeeAbsenceService';
import { shiftPlanPreviewService } from '../../services/shift-plan/shift-plan-preview/ShiftPlanPreviewService';
import { CalculatedShiftPlan, ShiftPlanDay } from '../../services/shift-plan/ShiftPlanTypes';
import EmployeeCell from '../common/EmployeeCell';
import ShiftChip from '../shift-plan/ShiftChip';
import { ShiftPlanTableStyles } from '../shift-plan/ShiftPlanTableStyles';

interface ShiftPlanPreviewModalProps {
    open: boolean;
    onClose: () => void;
    onAccept: () => void;
    previewData: ShiftPlanDay[] | null;
    originalData: CalculatedShiftPlan;
    isSaving?: boolean;
    lpModel?: any;
}

const ShiftPlanPreviewModal: React.FC<ShiftPlanPreviewModalProps> = ({
    open,
    onClose,
    onAccept,
    previewData,
    originalData,
    isSaving = false,
    lpModel
}) => {
    const theme = useTheme();

    // Tab state
    const [activeTab, setActiveTab] = useState(0);

    // Absences state
    const [absences, setAbsences] = useState<EmployeeAbsenceResponseDto[]>([]);
    const [absenceService] = useState(() => new EmployeeAbsenceService());

    // Load absences when modal opens
    useEffect(() => {
        if (!open || !originalData) return;

        const loadAbsences = async () => {
            try {
                const year = originalData.year.toString();
                const month = originalData.month.toString().padStart(2, '0');
                const monthlyAbsences = await absenceService.getAbsencesByMonth(year, month);
                setAbsences(monthlyAbsences);
            } catch (error) {
                console.error('Fehler beim Laden der Abwesenheiten:', error);
                setAbsences([]);
            }
        };

        loadAbsences();
    }, [open, originalData, absenceService]);

    // Berechne Mitarbeiterzeiten und Schichtenbelegung für Preview
    const { employeesWithHours, daysWithOccupancy } = useMemo(() => {
        if (!previewData || !originalData) {
            return { employeesWithHours: [], daysWithOccupancy: [] };
        }
        return shiftPlanPreviewService.calculatePreviewData(previewData, originalData.employees, originalData);
    }, [previewData, originalData]);

    if (!previewData || !originalData) {
        return null;
    }

    const tableCellStyles = ShiftPlanTableStyles.getTableCellStyles(theme);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const renderLPModel = () => {
        if (!lpModel) {
            return (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        Kein LP Modell verfügbar
                    </Typography>
                </Box>
            );
        }

        // Gruppiere Variablen nach Typ
        const groupedVariables = Object.entries(lpModel.variables || {}).reduce((groups: any, [varName, varData]) => {
            const parts = varName.split('_');
            if (parts.length >= 4 && parts[0] === 'x') {
                const employeeId = parts[1];
                const day = parts[2];
                const shiftId = parts[3];
                
                if (!groups.assignments) groups.assignments = [];
                groups.assignments.push({ varName, employeeId, day, shiftId, data: varData });
            } else {
                if (!groups.other) groups.other = [];
                groups.other.push({ varName, data: varData });
            }
            return groups;
        }, {});

        // Gruppiere Constraints nach Typ
        const groupedConstraints = Object.entries(lpModel.constraints || {}).reduce((groups: any, [constraintName, constraintData]) => {
            if (constraintName.startsWith('shift_coverage_')) {
                if (!groups.shiftCoverage) groups.shiftCoverage = [];
                groups.shiftCoverage.push({ name: constraintName, data: constraintData });
            } else if (constraintName.startsWith('role_coverage_')) {
                if (!groups.roleCoverage) groups.roleCoverage = [];
                groups.roleCoverage.push({ name: constraintName, data: constraintData });
            } else if (constraintName.startsWith('one_shift_per_day_')) {
                if (!groups.oneShiftPerDay) groups.oneShiftPerDay = [];
                groups.oneShiftPerDay.push({ name: constraintName, data: constraintData });
            } else if (constraintName.includes('_hours_')) {
                if (!groups.workHours) groups.workHours = [];
                groups.workHours.push({ name: constraintName, data: constraintData });
            } else {
                if (!groups.other) groups.other = [];
                groups.other.push({ name: constraintName, data: constraintData });
            }
            return groups;
        }, {});

        return (
            <Box sx={{ p: 2, height: '100%', overflow: 'auto', fontFamily: 'monospace' }}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'inherit' }}>
                    Linear Programming Model (Debug)
                </Typography>
                
                {/* Objective Function */}
                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                        Objective Function
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: '#fff', p: 1, border: '1px solid #ddd' }}>
                        {lpModel.opType === 'max' ? 'maximize' : 'minimize'} {lpModel.optimize}
                    </Typography>
                </Paper>

                {/* Variables */}
                <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                        Variables ({Object.keys(lpModel.variables || {}).length})
                    </Typography>
                    
                    {/* Assignment Variables */}
                    {groupedVariables.assignments && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                                Assignment Variables: x_employee_day_shift
                            </Typography>
                            <TableContainer component={Paper} sx={{ maxHeight: 300, border: '1px solid #ddd' }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.8rem' }}>Variable Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.8rem' }}>Employee ID</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.8rem' }}>Day</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.8rem' }}>Shift ID</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.8rem' }}>Coefficient</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {groupedVariables.assignments.slice(0, 100).map((variable: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                                    {variable.varName}
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{variable.employeeId}</TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{variable.day}</TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{variable.shiftId}</TableCell>
                                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{variable.data.fairness || 1}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {groupedVariables.assignments.length > 100 && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: 'monospace' }}>
                                    ... {groupedVariables.assignments.length - 100} more variables (showing first 100)
                                </Typography>
                            )}
                        </Box>
                    )}
                </Paper>

                {/* Constraints */}
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                        Constraints ({Object.keys(lpModel.constraints || {}).length})
                    </Typography>
                    
                    {/* Shift Coverage Constraints */}
                    {groupedConstraints.shiftCoverage && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                                Shift Coverage: shift_coverage_day_shift ({groupedConstraints.shiftCoverage.length})
                            </Typography>
                            <Box sx={{ maxHeight: 200, overflow: 'auto', backgroundColor: '#fff', border: '1px solid #ddd', p: 1 }}>
                                {groupedConstraints.shiftCoverage.slice(0, 50).map((constraint: any, index: number) => (
                                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mb: 0.5 }}>
                                        {constraint.name}: {JSON.stringify(constraint.data)}
                                    </Typography>
                                ))}
                                {groupedConstraints.shiftCoverage.length > 50 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                        ... {groupedConstraints.shiftCoverage.length - 50} more constraints
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Role Coverage Constraints */}
                    {groupedConstraints.roleCoverage && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                                Role Coverage: role_coverage_day_shift_role ({groupedConstraints.roleCoverage.length})
                            </Typography>
                            <Box sx={{ maxHeight: 200, overflow: 'auto', backgroundColor: '#fff', border: '1px solid #ddd', p: 1 }}>
                                {groupedConstraints.roleCoverage.slice(0, 30).map((constraint: any, index: number) => (
                                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mb: 0.5 }}>
                                        {constraint.name}: {JSON.stringify(constraint.data)}
                                    </Typography>
                                ))}
                                {groupedConstraints.roleCoverage.length > 30 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                        ... {groupedConstraints.roleCoverage.length - 30} more constraints
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* One Shift Per Day Constraints */}
                    {groupedConstraints.oneShiftPerDay && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                                One Shift Per Day: one_shift_per_day_employee_day ({groupedConstraints.oneShiftPerDay.length})
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: '#fff', p: 1, border: '1px solid #ddd', fontSize: '0.75rem' }}>
                                Each constraint: max: 1 (sum of all shifts for employee on specific day ≤ 1)
                            </Typography>
                        </Box>
                    )}

                    {/* Work Hours Constraints */}
                    {groupedConstraints.workHours && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                                Work Hours Distribution: min_hours_employee / max_hours_employee ({groupedConstraints.workHours.length})
                            </Typography>
                            <Box sx={{ maxHeight: 150, overflow: 'auto', backgroundColor: '#fff', border: '1px solid #ddd', p: 1 }}>
                                {groupedConstraints.workHours.slice(0, 20).map((constraint: any, index: number) => (
                                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mb: 0.5 }}>
                                        {constraint.name}: {JSON.stringify(constraint.data)}
                                    </Typography>
                                ))}
                                {groupedConstraints.workHours.length > 20 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                        ... {groupedConstraints.workHours.length - 20} more constraints
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* Other Constraints */}
                    {groupedConstraints.other && groupedConstraints.other.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                                Other Constraints ({groupedConstraints.other.length})
                            </Typography>
                            <Box sx={{ maxHeight: 150, overflow: 'auto', backgroundColor: '#fff', border: '1px solid #ddd', p: 1 }}>
                                {groupedConstraints.other.slice(0, 20).map((constraint: any, index: number) => (
                                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mb: 0.5 }}>
                                        {constraint.name}: {JSON.stringify(constraint.data)}
                                    </Typography>
                                ))}
                                {groupedConstraints.other.length > 20 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                        ... {groupedConstraints.other.length - 20} more constraints
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    height: '90vh',
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle>
                <Typography variant="h6" component="div">
                    AI Schichtplan Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {format(new Date(originalData.year, originalData.month - 1), 'MMMM yyyy', { locale: de })}
                    {originalData.locationName && ` • ${originalData.locationName}`}
                </Typography>
                
                {/* Tabs */}
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mt: 2 }}>
                    <Tab label="Schichtplan" />
                    <Tab label="LP Modell" disabled={!lpModel} />
                </Tabs>
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                {activeTab === 0 ? (
                <TableContainer
                    component={Paper}
                    sx={{
                        height: '100%',
                        overflow: 'auto',
                        borderRadius: 0,
                        border: 'none',
                    }}
                >
                    <Table stickyHeader size="medium">
                        {/* Table head with dates */}
                        <TableHead>
                            <TableRow>
                                <TableCell sx={tableCellStyles.employeeCell}>
                                    
                                </TableCell>
                                {daysWithOccupancy.map((dayInfo) => (
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
                                {daysWithOccupancy.map((dayInfo) => (
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
                            {employeesWithHours.map((emp) => (
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
                                            month={originalData.month}
                                            year={originalData.year}
                                            absences={absences.filter(absence =>
                                                absence.employeeId === emp.id
                                            )}
                                        />
                                    </TableCell>

                                    {daysWithOccupancy.map((dayInfo) => {
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
                ) : (
                    renderLPModel()
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} variant="outlined" disabled={isSaving}>
                    Abbrechen
                </Button>
                <Button
                    onClick={onAccept}
                    variant="contained"
                    color="primary"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} /> : undefined}
                >
                    {isSaving ? 'Wird gespeichert...' : 'Schichtplan übernehmen'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShiftPlanPreviewModal;