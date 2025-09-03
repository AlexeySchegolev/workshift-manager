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
  Alert,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { roleService } from '@/services';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from '../api/data-contracts';

interface RoleFormData {
  name: string;
  isActive: boolean;
  organizationId: string;
}

/**
 * Component for Role Management
 */
const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponseDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleResponseDto | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [showInactive, setShowInactive] = useState(false);


  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    isActive: true,
    organizationId: '', // TODO: Get from context or props
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load roles from backend using service
      const roles = await roleService.getAllRoles({ includeRelations: true });
      setRoles(roles);
    } catch (error) {
      showAlert('error', 'Fehler beim Laden der Daten');
      console.error('Error loading role data:', error);
    }
  };

  const showAlert = (type: 'success' | 'error' | 'warning', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenDialog = (role?: RoleResponseDto) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        isActive: role.isActive,
        organizationId: role.organizationId,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        isActive: true,
        organizationId: '', // TODO: Get from context or props
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
      if (editingRole) {
        // Update role
        const updateData: UpdateRoleDto = {
          name: formData.name,
          isActive: formData.isActive,
        };
        
        await roleService.updateRole(editingRole.id, updateData);
        showAlert('success', 'Rolle erfolgreich aktualisiert');
      } else {
        // Create new role
        const createData: CreateRoleDto = {
          name: formData.name,
          organizationId: formData.organizationId,
          isActive: formData.isActive,
        };
        
        await roleService.createRole(createData);
        showAlert('success', 'Rolle erfolgreich erstellt');
      }
      
      loadData();
      handleCloseDialog();
    } catch (error) {
      showAlert('error', 'Fehler beim Speichern der Rolle');
      console.error('Error saving role:', error);
    }
  };

  const handleDeleteRole = (role: RoleResponseDto) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (roleToDelete) {
      try {
        await roleService.deleteRole(roleToDelete.id);
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

  const handleToggleActive = async (role: RoleResponseDto) => {
    try {
      const updateData: UpdateRoleDto = {
        isActive: !role.isActive,
      };
      await roleService.updateRole(role.id, updateData);
      showAlert('success', `Rolle ${role.isActive ? 'deaktiviert' : 'aktiviert'}`);
      loadData();
    } catch (error) {
      showAlert('error', 'Fehler beim Ändern des Rollenstatus');
    }
  };

  const filteredRoles = showInactive ? roles : roles.filter(role => role.isActive);
  const sortedRoles = filteredRoles.sort((a, b) => a.name.localeCompare(b.name));


  return (
    <Box sx={{ p: 3 }}>
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Rollen
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
              border: `2px solid #1976d220`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: '#1976d2',
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
              <Divider sx={{ my: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog for creating/editing role */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRole ? 'Rolle bearbeiten' : 'Neue Rolle erstellen'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Rollenname"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
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

      {/* Delete confirmation */}
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