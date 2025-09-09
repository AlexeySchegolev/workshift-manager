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
} from '@mui/icons-material';
import { RoleResponseDto } from '@/api/data-contracts';
import {
    getRoleInitials,
} from './utils/roleUtils';

interface RoleTableProps {
    roles: RoleResponseDto[];
    editingId: string | null;
    onEditRole: (role: RoleResponseDto) => void;
    onDeleteRole: (role: RoleResponseDto) => void;
    onAddRole: () => void;
}

const RoleTable: React.FC<RoleTableProps> = ({
    roles,
    editingId,
    onEditRole,
    onDeleteRole,
    onAddRole,
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

    const paginatedRoles = roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                                Rollenverwaltung
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {roles.length} Rollen insgesamt
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddRole}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                        data-testid="role-form"
                    >
                        Rolle hinzufügen
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Rolle</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Verfügbarkeit</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Erstellt am</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRoles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <PeopleIcon
                                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                                        />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Keine Rollen vorhanden
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fügen Sie Ihre erste Rolle über den Button oben hinzu.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedRoles.map((role) => (
                                <TableRow
                                    key={role.id}
                                    hover
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                        },
                                        ...(editingId === role.id && {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                        }),
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: theme.palette.primary.main,
                                                    width: 40,
                                                    height: 40,
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {getRoleInitials(role.name)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {role.displayName || role.name}
                                                </Typography>
                                                {role.displayName && role.displayName !== role.name && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {role.name}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={role.isAvailable ? 'Verfügbar' : 'Nicht verfügbar'}
                                            size="small"
                                            sx={{
                                                backgroundColor: alpha(
                                                    role.isAvailable ? theme.palette.info.main : theme.palette.warning.main, 
                                                    0.1
                                                ),
                                                color: role.isAvailable ? theme.palette.info.main : theme.palette.warning.main,
                                                fontWeight: 500,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {role.createdAt ? new Date(role.createdAt).toLocaleDateString('de-DE') : 'Unbekannt'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="Bearbeiten">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onEditRole(role)}
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
                                                    onClick={() => onDeleteRole(role)}
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
                count={roles.length}
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

export default RoleTable;