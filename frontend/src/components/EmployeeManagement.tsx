import React, {useState} from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    FormHelperText,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Avatar,
    useTheme,
    alpha,
    Fade,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Cancel as CancelIcon,
    Save as SaveIcon,
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import {v4 as uuidv4} from 'uuid';

import {EmployeeResponseDto, LocationResponseDto, RoleResponseDto} from "@/api/data-contracts.ts";

interface EmployeeManagementProps {
    employees: EmployeeResponseDto[];
    onEmployeesChange: (employees: EmployeeResponseDto[]) => void;
}

/**
 * Modern Employee Management in Dashboard Style
 */
const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
                                                                   employees,
                                                                   onEmployeesChange
                                                               }) => {
    const theme = useTheme();

    // Form state
    const [name, setName] = useState('');
    const [primaryRole, setPrimaryRole] = useState<RoleResponseDto | null>(null);
    const [location, setLocation] = useState<LocationResponseDto | null>(null);
    const [hoursPerMonth, setHoursPerMonth] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errors, setErrors] = useState<{
        name?: string;
        role?: string;
        hoursPerMonth?: string;
        location?: string;
    }>({});

    // Dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeResponseDto | null>(null);

    // Snackbar state
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'info'
    });

    // Reset form
    const resetForm = () => {
        setName('');
        setPrimaryRole(null);
        setHoursPerMonth(null);
        setLocation(null);
        setEditingId(null);
        setErrors({});
    };

    // Load employee for editing
    const handleEditEmployee = (employee: EmployeeResponseDto) => {
        setName(employee.lastName);
        setPrimaryRole(employee.primaryRole ?? null);
        setHoursPerMonth(employee.hoursPerMonth ?? 0);
        setLocation(employee.location ?? null);
        setEditingId(employee.id);
        setErrors({});
    };

    // Open dialog to delete employee
    const handleOpenDeleteDialog = (employee: EmployeeResponseDto) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    // Close dialog to delete employee
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    // Delete employee
    const handleDeleteEmployee = () => {
        if (employeeToDelete) {
            const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
            onEmployeesChange(updatedEmployees);

            setSnackbar({
                open: true,
                message: `Mitarbeiter ${employeeToDelete.lastName} wurde gelöscht`,
                severity: 'success'
            });

            handleCloseDeleteDialog();
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: {
            name?: string;
            role?: string;
            hoursPerMonth?: string;
            location?: string;
        } = {};

        if (!name.trim()) {
            newErrors.name = 'Name ist erforderlich';
        }

        if (!primaryRole) {
            newErrors.role = 'Rolle ist erforderlich';
        }

        if (hoursPerMonth === null) {
            newErrors.hoursPerMonth = 'Monatsstunden sind erforderlich';
        } else {
            if (hoursPerMonth <= 0) {
                newErrors.hoursPerMonth = 'Monatsstunden müssen größer als 0 sein';
            } else if (hoursPerMonth > 180) {
                newErrors.hoursPerMonth = 'Monatsstunden sollten nicht mehr als 180 sein';
            }
        }

        if (!location) {
            newErrors.location = 'Standort ist erforderlich';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save employee (add or update)
    const handleSaveEmployee = () => {
        if (!validateForm()) return;

        if (typeof hoursPerMonth !== 'number') return;

        let updatedEmployees: EmployeeResponseDto[];

        if (editingId) {
            // Update existing employee
            updatedEmployees = employees.map(emp =>
                emp.id === editingId
                    ? {
                        ...emp,
                        name,
                        role: primaryRole,
                        hoursPerMonth: Number(hoursPerMonth.toFixed(1)),
                        hoursPerWeek: Math.round(hoursPerMonth / 4.33),
                        locationId: location?.id
                    }
                    : emp
            );

            setSnackbar({
                open: true,
                message: `Mitarbeiter ${name} wurde aktualisiert`,
                severity: 'success'
            });
        } else {
            // Add new employee
            const newEmployee: EmployeeResponseDto = {
                contractType: "full_time",
                createdAt: "",
                email: "",
                employeeNumber: "",
                firstName: "",
                fullName: "",
                hireDate: "",
                isActive: false,
                isAvailable: false,
                languages: [],
                organizationId: "",
                skills: [],
                status: "active",
                updatedAt: "",
                yearsOfService: 0,
                id: uuidv4(),
                lastName: name,
                primaryRole: primaryRole ?? undefined,
                hoursPerMonth: Number(hoursPerMonth.toFixed(1)),
                locationId: location?.id,
                certifications: []

            };

            updatedEmployees = [...employees, newEmployee];

            setSnackbar({
                open: true,
                message: `Mitarbeiter ${name} wurde hinzugefügt`,
                severity: 'success'
            });
        }

        onEmployeesChange(updatedEmployees);
        resetForm();
    };

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({...prev, open: false}));
    };

    // Role-specific colors
    const getRoleColor = (role?: RoleResponseDto) => {
        switch (role?.type) {
            case 'shift_leader':
                return theme.palette.primary.main;
            case 'specialist':
                return theme.palette.success.main;
            case 'assistant':
                return theme.palette.info.main;
            default:
                return theme.palette.grey[500];
        }
    };

    // Generate avatar initials
    const getInitials = (name: string | undefined | null) => {
        if (!name) {
            return '??';
        }
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
            {/* Statistics Cards */}
            <Fade in timeout={600}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)',
                        },
                        gap: 3,
                    }}
                >
                    {/* Statistics Cards content remains unchanged */}
                    {/* ... (rest of the existing code) ... */}
                </Box>
            </Fade>

            {/* Form for adding/editing employees */}
            <Fade in timeout={800}>
                <Card
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <CardHeader
                        title={
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <PersonAddIcon sx={{fontSize: '1.25rem', color: 'primary.main'}}/>
                                <Typography variant="h6" component="div">
                                    {editingId ? 'Mitarbeiter bearbeiten' : 'Neuen Mitarbeiter hinzufügen'}
                                </Typography>
                            </Box>
                        }
                        sx={{pb: 1}}
                    />
                    <CardContent>
                        <Box
                            component="form"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {xs: '1fr', md: 'repeat(4, 1fr) auto'},
                                gap: 3,
                                alignItems: 'flex-start'
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={!!errors.name}
                                helperText={errors.name}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />

                            <FormControl fullWidth error={!!errors.role}>
                                <InputLabel id="role-label">Rolle</InputLabel>
                                <Select
                                    labelId="role-label"
                                    value={primaryRole}
                                    label="Rolle"
                                    sx={{
                                        borderRadius: 2,
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Bitte wählen</em>
                                    </MenuItem>
                                    <MenuItem value="Specialist">Fachkraft</MenuItem>
                                    <MenuItem value="Assistant">Hilfskraft</MenuItem>
                                    <MenuItem value="ShiftLeader">Schichtleiter</MenuItem>
                                </Select>
                                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                            </FormControl>

                            <TextField
                                label="Stunden pro Monat"
                                variant="outlined"
                                type="number"
                                inputProps={{min: 1, max: 180, step: "0.1"}}
                                value={hoursPerMonth}
                                onChange={(e) => setHoursPerMonth(e.target.value === '' ? null : Number(e.target.value))}
                                error={!!errors.hoursPerMonth}
                                helperText={errors.hoursPerMonth}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />

                            <FormControl fullWidth error={!!errors.location}>
                                <InputLabel id="location-label">Standort</InputLabel>
                                <Select
                                    labelId="location-label"
                                    value={location}
                                    label="Standort"
                                    sx={{
                                        borderRadius: 2,
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Bitte wählen</em>
                                    </MenuItem>
                                    <MenuItem value="Standort A">Standort A</MenuItem>
                                    <MenuItem value="Standort B">Standort B</MenuItem>
                                </Select>
                                {errors.location && <FormHelperText>{errors.location}</FormHelperText>}
                            </FormControl>

                            <Box sx={{display: 'flex', gap: 1, alignSelf: 'center'}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={editingId ? <SaveIcon/> : <AddIcon/>}
                                    onClick={handleSaveEmployee}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3,
                                    }}
                                >
                                    {editingId ? 'Speichern' : 'Hinzufügen'}
                                </Button>

                                {editingId && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<CancelIcon/>}
                                        onClick={resetForm}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Abbrechen
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>

            {/* Table with existing employees */}
            <Fade in timeout={1000}>
                <Card
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <CardHeader
                        title={
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <PeopleIcon sx={{fontSize: '1.25rem', color: 'primary.main'}}/>
                                <Typography variant="h6" component="div">
                                    Mitarbeiterübersicht
                                </Typography>
                            </Box>
                        }
                        subheader={`${employees.length} Mitarbeiter registriert`}
                        sx={{pb: 1}}
                    />
                    <CardContent sx={{pt: 0, px: 0}}>
                        <TableContainer
                            sx={{
                                borderRadius: 0,
                                border: 'none',
                                maxHeight: '70vh',
                                width: '100%',
                            }}
                        >
                            <Table stickyHeader size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{fontWeight: 700, width: '30%'}}>Mitarbeiter</TableCell>
                                        <TableCell sx={{fontWeight: 700, width: '20%'}}>Rolle</TableCell>
                                        <TableCell sx={{fontWeight: 700, width: '15%'}}>Stunden/Monat</TableCell>
                                        <TableCell sx={{fontWeight: 700, width: '15%'}}>Standort</TableCell>
                                        <TableCell align="right"
                                                   sx={{fontWeight: 700, width: '20%'}}>Aktionen</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{py: 8}}>
                                                <Box sx={{textAlign: 'center'}}>
                                                    <PeopleIcon sx={{fontSize: 48, color: 'text.disabled', mb: 2}}/>
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                                        Keine Mitarbeiter vorhanden
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Fügen Sie Ihren ersten Mitarbeiter über das Formular oben hinzu.
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        employees.map((employee) => (
                                            <TableRow
                                                key={employee.id}
                                                hover
                                                sx={{
                                                    backgroundColor: employee.id === editingId
                                                        ? alpha(theme.palette.primary.main, 0.05)
                                                        : 'inherit',
                                                    '&:hover': {
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                                    },
                                                }}
                                            >
                                                <TableCell>
                                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: getRoleColor(employee.primaryRole),
                                                                width: 40,
                                                                height: 40,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {getInitials(employee.lastName)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" sx={{fontWeight: 600}}>
                                                                {employee.lastName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {employee.id.slice(0, 8)}...
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={employee.lastName}
                                                        size="small"
                                                        color={employee.primaryRole?.type === 'shift_leader' ? 'primary' : 'default'}
                                                        sx={{
                                                            fontWeight: 500,
                                                            borderRadius: 1.5,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{fontWeight: 600}}>
                                                        {employee.hoursPerMonth !== undefined
                                                            ? employee.hoursPerMonth.toFixed(1)
                                                            : "0.0"}h
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={employee.location?.name}
                                                        size="small"
                                                        color={'info'}
                                                        sx={{
                                                            fontWeight: 500,
                                                            borderRadius: 1.5,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{display: 'flex', gap: 0.5, justifyContent: 'flex-end'}}>
                                                        <Tooltip title="Bearbeiten">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => handleEditEmployee(employee)}
                                                                disabled={!!editingId && editingId !== employee.id}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    '&:hover': {
                                                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Löschen">
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleOpenDeleteDialog(employee)}
                                                                disabled={!!editingId}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    '&:hover': {
                                                                        backgroundColor: alpha(theme.palette.error.main, 0.08),
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteIcon/>
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
                    </CardContent>
                </Card>
            </Fade>

            {/* Confirmation dialog for deletion */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle sx={{pb: 1}}>
                    <Typography variant="h6" sx={{fontWeight: 600}}>
                        Mitarbeiter löschen
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Möchten Sie den Mitarbeiter <strong>"{employeeToDelete?.lastName}"</strong> wirklich löschen?
                        Diese Aktion kann nicht rückgängig gemacht werden.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{p: 3, pt: 1}}>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        color="primary"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleDeleteEmployee}
                        color="error"
                        variant="contained"
                        autoFocus
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmployeeManagement;