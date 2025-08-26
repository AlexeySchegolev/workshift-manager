import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

interface RoleFormData {
  name: string;
  displayName: string;
  description: string;
  color: string;
  priority: number;
  permissions: string[];
  requirements: string[];
  isActive: boolean;
}

/**
 * Komponente für die Verwaltung von Rollen
 */
const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [requirements, setRequirements] = useState<RoleRequirement[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleDefinition | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    displayName: '',
    description: '',
    color: '#1976d2',
    priority: 1,
    permissions: [],
    requirements: [],
    isActive: true,
  });

  // Daten laden
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rolesData, permissionsData, requirementsData] = await Promise.all([
        ApiService.getRoles(),
        ApiService.getPermissions(),
        ApiService.getRequirements()
      ]);
      
      setRoles(rolesData);
      setPermissions(permissionsData);
      setRequirements(requirementsData);
    } catch (error) {
      showAlert('error', 'Fehler beim Laden der Daten');
      console.error('Fehler beim Laden der Rollen-Daten:', error);
    }
  };

  const showAlert = (type: 'success' | 'error' | 'warning', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenDialog = (role?: RoleDefinition) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        displayName: role.displayName,
        description: role.description,
        color: role.color,
        priority: role.priority,
        permissions: role.permissions.map(p => p.id),
        requirements: role.requirements.map(r => r.id),
        isActive: role.isActive,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        displayName: '',
        description: '',
        color: '#1976d2',
        priority: Math.max(...roles.map(r => r.priority), 0) + 1,
        permissions: [],
        requirements: [],
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRole(null);
  };

  const handleSaveRole = async () => {
    try {
      const roleData = {
        ...formData,
        permissions: formData.permissions,
        requirements: formData.requirements,
      };

      if (editingRole) {
        // Rolle aktualisieren
        await ApiService.updateRole(editingRole.id, roleData);
        showAlert('success', 'Rolle erfolgreich aktualisiert');
      } else {
        // Neue Rolle erstellen
        await ApiService.createRole(roleData);
        showAlert('success', 'Rolle erfolgreich erstellt');
      }
      
      loadData();
      handleCloseDialog();
    } catch (error) {
      showAlert('error', 'Fehler beim Speichern der Rolle');
      console.error('Fehler beim Speichern der Rolle:', error);
    }
  };

  const handleDeleteRole = (role: RoleDefinition) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (roleToDelete) {
      try {
        await ApiService.deleteRole(roleToDelete.id);
        showAlert('success', 'Rolle erfolgreich gelöscht');
        loadData();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Fehler beim Löschen der Rolle';
        showAlert('error', errorMessage);
      }
    }
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleToggleActive = async (role: RoleDefinition) => {
    try {
      const updatedRole = { ...role, isActive: !role.isActive };
      await ApiService.updateRole(role.id, updatedRole);
      showAlert('success', `Rolle ${role.isActive ? 'deaktiviert' : 'aktiviert'}`);
      loadData();
    } catch (error) {
      showAlert('error', 'Fehler beim Ändern des Rollenstatus');
    }
  };

  const filteredRoles = showInactive ? roles : roles.filter(role => role.isActive);
  const sortedRoles = filteredRoles.sort((a, b) => a.priority - b.priority);

  const getPermissionsByCategory = (categoryPermissions: RolePermission[]) => {
    const categories = ['shift_planning', 'management', 'administration', 'reporting'] as const;
    return categories.reduce((acc, category) => {
      acc[category] = categoryPermissions.filter(p => p.category === category);
      return acc;
    }, {} as Record<string, RolePermission[]>);
  };

  const categoryLabels = {
    shift_planning: 'Schichtplanung',
    management: 'Verwaltung',
    administration: 'Administration',
    reporting: 'Berichte'
  };

  return (
    <Box sx={{ p: 3 }}>
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Rollenverwaltung
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
            }
            label="Inaktive anzeigen"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Neue Rolle
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
        gap: 3 
      }}>
        {sortedRoles.map((role) => (
          <Card 
            key={role.id}
            sx={{ 
              height: '100%',
              opacity: role.isActive ? 1 : 0.6,
              border: `2px solid ${role.color}20`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: role.color,
                    mr: 2,
                    width: 40,
                    height: 40,
                  }}
                >
                  <PeopleIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2">
                    {role.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Priorität: {role.priority}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title={role.isActive ? 'Deaktivieren' : 'Aktivieren'}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleActive(role)}
                    >
                      {role.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Bearbeiten">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(role)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Löschen">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRole(role)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                {role.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon fontSize="small" />
                    <Typography variant="body2">
                      Berechtigungen ({role.permissions.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {role.permissions.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.permissions.map((permission) => (
                        <Chip
                          key={permission.id}
                          label={permission.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Keine Berechtigungen zugewiesen
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon fontSize="small" />
                    <Typography variant="body2">
                      Anforderungen ({role.requirements.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {role.requirements.length > 0 ? (
                    <List dense>
                      {role.requirements.map((requirement) => (
                        <ListItem key={requirement.id} sx={{ px: 0 }}>
                          <ListItemText
                            primary={requirement.name}
                            secondary={requirement.description}
                          />
                          {requirement.required && (
                            <Chip
                              label="Erforderlich"
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Keine Anforderungen definiert
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog für Rolle erstellen/bearbeiten */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRole ? 'Rolle bearbeiten' : 'Neue Rolle erstellen'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Rollenname"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Anzeigename"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
              />
            </Box>
            
            <TextField
              fullWidth
              label="Beschreibung"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Farbe"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
              <TextField
                fullWidth
                label="Priorität"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1 }}
              />
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Berechtigungen</InputLabel>
              <Select
                multiple
                value={formData.permissions}
                onChange={(e) => setFormData({ ...formData, permissions: e.target.value as string[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const permission = permissions.find(p => p.id === value);
                      return (
                        <Chip key={value} label={permission?.name || value} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {Object.entries(getPermissionsByCategory(permissions)).map(([category, categoryPermissions]) => [
                  <MenuItem key={`${category}-header`} disabled>
                    <Typography variant="subtitle2" color="primary">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </Typography>
                  </MenuItem>,
                  ...categoryPermissions.map((permission) => (
                    <MenuItem key={permission.id} value={permission.id}>
                      {permission.name}
                    </MenuItem>
                  ))
                ])}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Anforderungen</InputLabel>
              <Select
                multiple
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value as string[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const requirement = requirements.find(r => r.id === value);
                      return (
                        <Chip key={value} label={requirement?.name || value} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {requirements.map((requirement) => (
                  <MenuItem key={requirement.id} value={requirement.id}>
                    {requirement.name} {requirement.required && '(Erforderlich)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Rolle ist aktiv"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Abbrechen</Button>
          <Button onClick={handleSaveRole} variant="contained">
            {editingRole ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lösch-Bestätigung */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Rolle löschen</DialogTitle>
        <DialogContent>
          <Typography>
            Sind Sie sicher, dass Sie die Rolle "{roleToDelete?.displayName}" löschen möchten?
            Diese Aktion kann nicht rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={confirmDeleteRole} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;