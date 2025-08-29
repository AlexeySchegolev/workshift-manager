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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [primaryRole, setPrimaryRole] = useState<RoleResponseDto | null>(null);
    const [location, setLocation] = useState<LocationResponseDto | null>(null);
    const [hoursPerMonth, setHoursPerMonth] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        role?: string;
        hoursPerMonth?: string;
        location?: string;
    }>({});

    // Dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeResponseDto | null>(null);
    const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);

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
        setFirstName('');
        setLastName('');
        setPrimaryRole(null);
        setHoursPerMonth(null);
        setLocation(null);
        setEditingId(null);
        setErrors({});
    };

    // Load employee for editing
    const handleEditEmployee = (employee: EmployeeResponseDto) => {
        setFirstName(employee.firstName);
        setLastName(employee.lastName);
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

    // Open modal to add employee
    const handleOpenAddEmployeeModal = () => {
        resetForm();
        setAddEmployeeModalOpen(true);
    };

    // Close modal to add employee
    const handleCloseAddEmployeeModal = () => {
        setAddEmployeeModalOpen(false);
        resetForm();
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
            firstName?: string;
            lastName?: string;
            role?: string;
            hoursPerMonth?: string;
            location?: string;
        } = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'Vorname ist erforderlich';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Nachname ist erforderlich';
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
                        firstName,
                        lastName,
                        fullName: `${firstName} ${lastName}`,
                        role: primaryRole,
                        hoursPerMonth: Number(hoursPerMonth.toFixed(1)),
                        hoursPerWeek: Math.round(hoursPerMonth / 4.33),
                        locationId: location?.id
                    }
                    : emp
            );

            setSnackbar({
                open: true,
                message: `Mitarbeiter ${firstName} ${lastName} wurde aktualisiert`,
                severity: 'success'
            });
        } else {
            // Add new employee
            const newEmployee: EmployeeResponseDto = {
                contractType: "full_time",
                createdAt: "",
                email: "",
                employeeNumber: "",
                firstName: firstName,
                fullName: `${firstName} ${lastName}`,
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
                lastName: lastName,
                primaryRole: primaryRole ?? undefined,
                hoursPerMonth: Number(hoursPerMonth.toFixed(1)),
                locationId: location?.id,
                certifications: []

            };

            updatedEmployees = [...employees, newEmployee];

            setSnackbar({
                open: true,
                message: `Mitarbeiter ${firstName} ${lastName} wurde hinzugefügt`,
                severity: 'success'
            });
        }

        onEmployeesChange(updatedEmployees);
        resetForm();
        
        // Close modal if it was opened from modal
        if (addEmployeeModalOpen) {
            setAddEmployeeModalOpen(false);
        }
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
                        action={
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PersonAddIcon />}
                                onClick={handleOpenAddEmployeeModal}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                }}
                            >
                                Mitarbeiter hinzufügen
                            </Button>
                        }
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
                                                                {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {employee.id.slice(0, 8)}...
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={employee.primaryRole?.name || 'Keine Rolle'}
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
                        Möchten Sie den Mitarbeiter <strong>"{employeeToDelete?.fullName || `${employeeToDelete?.firstName} ${employeeToDelete?.lastName}`}"</strong> wirklich löschen?
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

            {/* Modal for adding new employee */}
            <Dialog
                open={addEmployeeModalOpen}
                onClose={handleCloseAddEmployeeModal}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    },
                }}
            >
                <DialogTitle sx={{pb: 1}}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <PersonAddIcon sx={{fontSize: '1.25rem', color: 'primary.main'}}/>
                        <Typography variant="h6" component="div" sx={{fontWeight: 600}}>
                            Neuen Mitarbeiter hinzufügen
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'},
                            gap: 3,
                            pt: 2,
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            label="Vorname"
                            variant="outlined"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <TextField
                            label="Nachname"
                            variant="outlined"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <FormControl fullWidth error={!!errors.role}>
                            <InputLabel id="modal-role-label">Rolle</InputLabel>
                            <Select
                                labelId="modal-role-label"
                                value={primaryRole}
                                label="Rolle"
                                onChange={(e) => setPrimaryRole(e.target.value as RoleResponseDto)}
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
                            <InputLabel id="modal-location-label">Standort</InputLabel>
                            <Select
                                labelId="modal-location-label"
                                value={location}
                                label="Standort"
                                onChange={(e) => setLocation(e.target.value as LocationResponseDto)}
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
                    </Box>
                </DialogContent>
                <DialogActions sx={{p: 3, pt: 1}}>
                    <Button
                        onClick={handleCloseAddEmployeeModal}
                        color="secondary"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleSaveEmployee}
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon/>}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        Hinzufügen
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmployeeManagement;