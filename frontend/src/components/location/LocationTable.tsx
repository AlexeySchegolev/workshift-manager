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
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    People as PeopleIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { LocationResponseDto } from '@/api/data-contracts';
import {
    getLocationInitials,
    getLocationStatusColor,
    formatLocationStatus,
    formatOperatingHours,
    formatLocationAddress,
    getEmployeeCountColor
} from './utils/locationUtils';

interface LocationTableProps {
    locations: LocationResponseDto[];
    editingId: string | null;
    onEditLocation: (location: LocationResponseDto) => void;
    onDeleteLocation: (location: LocationResponseDto) => void;
    onAddLocation: () => void;
}

const LocationTable: React.FC<LocationTableProps> = ({
    locations,
    editingId,
    onEditLocation,
    onDeleteLocation,
    onAddLocation,
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

    const paginatedLocations = locations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                        <LocationIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Standortverwaltung
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {locations.length} Standorte insgesamt
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddLocation}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                        data-testid="location-form"
                    >
                        Standort hinzufügen
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Standort</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Adresse</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Kontakt</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Mitarbeiter</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Öffnungszeiten</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedLocations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <LocationIcon
                                            sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                                        />
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            Keine Standorte vorhanden
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Fügen Sie Ihren ersten Standort über den Button oben hinzu.
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedLocations.map((location) => (
                                <TableRow
                                    key={location.id}
                                    hover
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                        },
                                        ...(editingId === location.id && {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                        }),
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: location.isActive 
                                                        ? theme.palette.primary.main 
                                                        : theme.palette.grey[500],
                                                    width: 40,
                                                    height: 40,
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {getLocationInitials(location.name)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {location.name}
                                                </Typography>
                                                {location.code && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {location.code}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatLocationAddress(location)}
                                        </Typography>
                                        {location.country && location.country !== 'Germany' && (
                                            <Typography variant="caption" color="text.secondary">
                                                {location.country}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={formatLocationStatus(location.isActive)}
                                            size="small"
                                            sx={{
                                                backgroundColor: alpha(getLocationStatusColor(location.isActive, theme), 0.1),
                                                color: getLocationStatusColor(location.isActive, theme),
                                                fontWeight: 500,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {location.phone && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="caption">
                                                        {location.phone}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {location.email && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="caption">
                                                        {location.email}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {!location.phone && !location.email && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Keine Kontaktdaten
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PeopleIcon 
                                                sx={{ 
                                                    fontSize: 16, 
                                                    color: getEmployeeCountColor(location.employees.length, theme)
                                                }} 
                                            />
                                            <Typography 
                                                variant="body2"
                                                sx={{ 
                                                    color: getEmployeeCountColor(location.employees.length, theme),
                                                    fontWeight: 500
                                                }}
                                            >
                                                {location.employees.length}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatOperatingHours(location)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <Tooltip title="Bearbeiten">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onEditLocation(location)}
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
                                                    onClick={() => onDeleteLocation(location)}
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
                count={locations.length}
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

export default LocationTable;