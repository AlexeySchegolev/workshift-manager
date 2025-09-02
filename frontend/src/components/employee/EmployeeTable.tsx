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
    Avatar,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    People as PeopleIcon,
    Badge as BadgeIcon,
} from '@mui/icons-material';
import { EmployeeResponseDto } from '@/api/data-contracts';
import {
    getInitials,
    getEmployeeStatusColor,
    formatEmployeeStatus,
    getContractTypeColor,
    formatContractType
} from './utils/employeeUtils';

interface EmployeeTableProps {
    employees: EmployeeResponseDto[];
    editingId: string | null;
    onEditEmployee: (employee: EmployeeResponseDto) => void;
    onDeleteEmployee: (employee: EmployeeResponseDto) => void;
    onAddEmployee: () => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
    employees,
    editingId,
    onEditEmployee,
    onDeleteEmployee,
    onAddEmployee,
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

    const paginatedEmployees = employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


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
                        <PeopleIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Mitarbeiterverwaltung
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {employees.length} Mitarbeiter insgesamt
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddEmployee}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                        data-testid="employee-form"
                    >
                        Mitarbeiter hinzufügen
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Mitarbeiter</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Rolle</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Vertragsart</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Stunden/Monat</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Standort</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Dienstjahre</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <PeopleIcon
                                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                                        />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Keine Mitarbeiter vorhanden
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fügen Sie Ihren ersten Mitarbeiter über den Button oben hinzu.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedEmployees.map((employee) => (
                                <TableRow
                                    key={employee.id}
                                    hover
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                        },
                                        ...(editingId === employee.id && {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                        }),
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: employee.primaryRole?.colorCode || theme.palette.grey[500],
                                                    width: 40,
                                                    height: 40,
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {getInitials(`${employee.firstName} ${employee.lastName}`)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={employee.primaryRole?.name || employee.primaryRole?.displayName || 'Keine Rolle'}
                                            size="small"
                                            sx={{
                                                backgroundColor: employee.primaryRole?.colorCode
                                                    ? alpha(employee.primaryRole.colorCode, 0.1)
                                                    : alpha(theme.palette.grey[500], 0.1),
                                                color: employee.primaryRole?.colorCode || theme.palette.grey[500],
                                                fontWeight: 500,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={formatEmployeeStatus(employee.status)}
                                            size="small"
                                            sx={{
                                                backgroundColor: alpha(getEmployeeStatusColor(employee.status, theme), 0.1),
                                                color: getEmployeeStatusColor(employee.status, theme),
                                                fontWeight: 500,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={formatContractType(employee.contractType)}
                                            size="small"
                                            sx={{
                                                backgroundColor: alpha(getContractTypeColor(employee.contractType, theme), 0.1),
                                                color: getContractTypeColor(employee.contractType, theme),
                                                fontWeight: 500,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {employee.hoursPerMonth?.toFixed(1) || '0.0'}h
                                        </Typography>
                                        {employee.hoursPerWeek && (
                                            <Typography variant="caption" color="text.secondary">
                                                {employee.hoursPerWeek}h/Woche
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {employee.location?.name || 'Kein Standort'}
                                        </Typography>
                                        {employee.location?.code && (
                                            <Typography variant="caption" color="text.secondary">
                                                {employee.location.code}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <BadgeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {employee.yearsOfService || 0} Jahre
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="Bearbeiten">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onEditEmployee(employee)}
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
                                                    onClick={() => onDeleteEmployee(employee)}
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={employees.length}
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

export default EmployeeTable;