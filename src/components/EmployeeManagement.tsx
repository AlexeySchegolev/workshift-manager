import React, { useState } from 'react';
import {
  Box,
  Paper,
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
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import { Employee, EmployeeRole } from '../models/interfaces';

interface EmployeeManagementProps {
  employees: Employee[];
  onEmployeesChange: (employees: Employee[]) => void;
}

/**
 * Komponente zur Verwaltung der Mitarbeiter
 */
const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees,
  onEmployeesChange
}) => {
  // Formularstatus
  const [name, setName] = useState('');
  const [role, setRole] = useState<EmployeeRole | ''>('');
  const [hoursPerMonth, setHoursPerMonth] = useState<number | ''>('');
  const [clinic, setClinic] = useState<'Elmshorn' | 'Uetersen' | ''>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    role?: string;
    hoursPerMonth?: string;
    clinic?: string;
  }>({});
  
  // Dialog-Status
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  
  // Snackbar-Status
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Formular zurücksetzen
  const resetForm = () => {
    setName('');
    setRole('');
    setHoursPerMonth('');
    setClinic('');
    setEditingId(null);
    setErrors({});
  };

  // Mitarbeiter zum Bearbeiten laden
  const handleEditEmployee = (employee: Employee) => {
    setName(employee.name);
    setRole(employee.role);
    // Verwende die tatsächlichen hoursPerMonth-Werte aus den Mitarbeiterdaten
    // Falls hoursPerMonth nicht definiert ist, berechne es aus hoursPerWeek
    setHoursPerMonth(employee.hoursPerMonth ?? employee.hoursPerWeek * 4.33);
    setClinic(employee.clinic || 'Elmshorn');
    setEditingId(employee.id);
    setErrors({});
  };

  // Dialog zum Löschen eines Mitarbeiters öffnen
  const handleOpenDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  // Dialog zum Löschen eines Mitarbeiters schließen
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  // Mitarbeiter löschen
  const handleDeleteEmployee = () => {
    if (employeeToDelete) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
      onEmployeesChange(updatedEmployees);
      // Nicht mehr in localStorage speichern
      
      setSnackbar({
        open: true,
        message: `Mitarbeiter ${employeeToDelete.name} wurde gelöscht`,
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    }
  };

  // Formular validieren
  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      role?: string;
      hoursPerMonth?: string;
      clinic?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name ist erforderlich';
    }
    
    if (!role) {
      newErrors.role = 'Rolle ist erforderlich';
    }
    
    if (hoursPerMonth === '') {
      newErrors.hoursPerMonth = 'Monatsstunden sind erforderlich';
    } else if (typeof hoursPerMonth === 'number') {
      if (hoursPerMonth <= 0) {
        newErrors.hoursPerMonth = 'Monatsstunden müssen größer als 0 sein';
      } else if (hoursPerMonth > 180) {
        newErrors.hoursPerMonth = 'Monatsstunden sollten nicht mehr als 180 sein';
      }
    }
    
    if (!clinic) {
      newErrors.clinic = 'Praxis ist erforderlich';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mitarbeiter speichern (hinzufügen oder aktualisieren)
  const handleSaveEmployee = () => {
    if (!validateForm()) return;
    
    if (typeof hoursPerMonth !== 'number') return;
    
    let updatedEmployees: Employee[];
    
    if (editingId) {
      // Bestehenden Mitarbeiter aktualisieren
      updatedEmployees = employees.map(emp =>
        emp.id === editingId
          ? {
              ...emp,
              name,
              role: role as EmployeeRole,
              hoursPerMonth: Number(hoursPerMonth.toFixed(1)),
              // Auch hoursPerWeek für Kompatibilität aktualisieren (ungefähr 1/4 der Monatsstunden)
              hoursPerWeek: Math.round(hoursPerMonth / 4.33),
              clinic: clinic as 'Elmshorn' | 'Uetersen'
            }
          : emp
      );
      
      setSnackbar({
        open: true,
        message: `Mitarbeiter ${name} wurde aktualisiert`,
        severity: 'success'
      });
    } else {
      // Neuen Mitarbeiter hinzufügen
      const newEmployee: Employee = {
        id: uuidv4(),
        name,
        role: role as EmployeeRole,
        hoursPerMonth: Number(hoursPerMonth.toFixed(1)),
        // Auch hoursPerWeek für Kompatibilität setzen (ungefähr 1/4 der Monatsstunden)
        hoursPerWeek: Math.round(hoursPerMonth / 4.33),
        clinic: clinic as 'Elmshorn' | 'Uetersen'
      };
      
      updatedEmployees = [...employees, newEmployee];
      
      setSnackbar({
        open: true,
        message: `Mitarbeiter ${name} wurde hinzugefügt`,
        severity: 'success'
      });
    }
    
    onEmployeesChange(updatedEmployees);
    // Nicht mehr in localStorage speichern
    resetForm();
  };

  // Snackbar schließen
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Formular zum Hinzufügen/Bearbeiten von Mitarbeitern */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? 'Mitarbeiter bearbeiten' : 'Neuen Mitarbeiter hinzufügen'}
        </Typography>
        
        <Box
          component="form"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr auto' },
            gap: 2,
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
          />
          
          <FormControl fullWidth error={!!errors.role}>
            <InputLabel id="role-label">Rolle</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Rolle"
              onChange={(e) => setRole(e.target.value as EmployeeRole)}
            >
              <MenuItem value="">
                <em>Bitte wählen</em>
              </MenuItem>
              <MenuItem value="Pfleger">Pfleger</MenuItem>
              <MenuItem value="Pflegehelfer">Pflegehelfer</MenuItem>
              <MenuItem value="Schichtleiter">Schichtleiter</MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>
          
          <TextField
            label="Stunden pro Monat"
            variant="outlined"
            type="number"
            inputProps={{ min: 1, max: 180, step: "0.1" }}
            value={hoursPerMonth}
            onChange={(e) => setHoursPerMonth(e.target.value === '' ? '' : Number(e.target.value))}
            error={!!errors.hoursPerMonth}
            helperText={errors.hoursPerMonth}
            fullWidth
          />
          
          <FormControl fullWidth error={!!errors.clinic}>
            <InputLabel id="clinic-label">Praxis</InputLabel>
            <Select
              labelId="clinic-label"
              value={clinic}
              label="Praxis"
              onChange={(e) => setClinic(e.target.value as 'Elmshorn' | 'Uetersen' | '')}
            >
              <MenuItem value="">
                <em>Bitte wählen</em>
              </MenuItem>
              <MenuItem value="Elmshorn">Elmshorn</MenuItem>
              <MenuItem value="Uetersen">Uetersen</MenuItem>
            </Select>
            {errors.clinic && <FormHelperText>{errors.clinic}</FormHelperText>}
          </FormControl>
          
          <Box sx={{ display: 'flex', gap: 1, alignSelf: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={editingId ? <SaveIcon /> : <AddIcon />}
              onClick={handleSaveEmployee}
            >
              {editingId ? 'Speichern' : 'Hinzufügen'}
            </Button>
            
            {editingId && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={resetForm}
              >
                Abbrechen
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Tabelle mit bestehenden Mitarbeitern */}
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: '50vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Rolle</TableCell>
                <TableCell>Stunden/Monat</TableCell>
                <TableCell>Praxis</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      Keine Mitarbeiter vorhanden
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: employee.id === editingId ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                      // Praxisfarbe als Hintergrund (leicht abgeschwächt)
                      ...(employee.clinic === 'Uetersen' ? { backgroundColor: 'rgba(173, 216, 230, 0.2)' } : {})
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      {employee.hoursPerMonth !== undefined
                        ? employee.hoursPerMonth.toFixed(1)
                        : (employee.hoursPerWeek * 4.33).toFixed(1)}
                    </TableCell>
                  <TableCell>{employee.clinic || 'Elmshorn'}</TableCell>
                  <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditEmployee(employee)}
                        disabled={!!editingId && editingId !== employee.id}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(employee)}
                        disabled={!!editingId}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bestätigungsdialog zum Löschen */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Mitarbeiter löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Möchten Sie den Mitarbeiter "{employeeToDelete?.name}" wirklich löschen?
            Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleDeleteEmployee} color="error" autoFocus>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar für Benachrichtigungen */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeManagement;