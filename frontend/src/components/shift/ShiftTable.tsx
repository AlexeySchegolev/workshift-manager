import React, { useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Typography,
    Button,
    Tooltip,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Schedule as ScheduleIcon,
    Business as BusinessIcon,
    People as PeopleIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { ShiftResponseDto } from '@/api/data-contracts';
import { formatShiftType, formatShiftStatus, getShiftTypeColor, getShiftStatusColor } from './utils/shiftUtils';

interface ShiftTableProps {
    shifts: ShiftResponseDto[];
    editingId: string | null;
    onEditShift: (shift: ShiftResponseDto) => void;
    onDeleteShift: (shift: ShiftResponseDto) => void;
    onAddShift: () => void;
}

const ShiftTable: React.FC<ShiftTableProps> = ({
    shifts,
    editingId,
    onEditShift,
    onDeleteShift,
    onAddShift,
}) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedShifts = shifts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ScheduleIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Schichtenverwaltung
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {shifts.length} Schichten insgesamt
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddShift}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                        data-testid="shift-form"
                    >
                        Schicht hinzufügen
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Typ</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Datum</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Zeit</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Station</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Personal</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Besetzung</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedShifts.map((shift) => (
                            <TableRow
                                key={shift.id}
                                hover
                                sx={{
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                    },
                                    ...(editingId === shift.id && {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    }),
                                }}
                            >
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {shift.name}
                                        </Typography>
                                        {shift.description && (
                                            <Typography variant="caption" color="text.secondary">
                                                {shift.description}
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={formatShiftType(shift.type)}
                                        size="small"
                                        sx={{
                                            backgroundColor: alpha(getShiftTypeColor(shift.type), 0.1),
                                            color: getShiftTypeColor(shift.type),
                                            fontWeight: 500,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={formatShiftStatus(shift.status)}
                                        size="small"
                                        sx={{
                                            backgroundColor: alpha(getShiftStatusColor(shift.status), 0.1),
                                            color: getShiftStatusColor(shift.status),
                                            fontWeight: 500,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {new Date(shift.shiftDate).toLocaleDateString('de-DE')}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {shift.startTime} - {shift.endTime}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {shift.totalHours}h
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {shift.location?.name || 'Unbekannt'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {shift.location?.code}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {shift.currentEmployees}/{shift.minEmployees}-{shift.maxEmployees}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: alpha(theme.palette.divider, 0.2),
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: `${Math.min(shift.staffingPercentage, 100)}%`,
                                                    height: '100%',
                                                    backgroundColor: shift.isFullyStaffed
                                                        ? theme.palette.success.main
                                                        : shift.staffingPercentage >= 80
                                                        ? theme.palette.warning.main
                                                        : theme.palette.error.main,
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {Math.round(shift.staffingPercentage)}%
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <Tooltip title="Bearbeiten">
                                            <IconButton
                                                size="small"
                                                onClick={() => onEditShift(shift)}
                                                sx={{
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                    },
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Löschen">
                                            <IconButton
                                                size="small"
                                                onClick={() => onDeleteShift(shift)}
                                                sx={{
                                                    color: 'error.main',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                    },
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={shifts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Zeilen pro Seite:"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} von ${count !== -1 ? count : `mehr als ${to}`}`
                }
            />
        </Paper>
    );
};

export default ShiftTable;