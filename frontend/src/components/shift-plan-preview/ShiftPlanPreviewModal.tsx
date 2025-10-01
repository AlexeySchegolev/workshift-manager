import {
    alpha,
    Box,
    Button,
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
}

const ShiftPlanPreviewModal: React.FC<ShiftPlanPreviewModalProps> = ({
    open,
    onClose,
    onAccept,
    previewData,
    originalData
}) => {
    const theme = useTheme();

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
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
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
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Abbrechen
                </Button>
                <Button onClick={onAccept} variant="contained" color="primary">
                    Schichtplan übernehmen
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShiftPlanPreviewModal;