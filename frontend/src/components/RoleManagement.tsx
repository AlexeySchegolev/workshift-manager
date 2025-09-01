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
import { roleService } from '@/services';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from '../api/data-contracts';

interface RoleFormData {
  name: string;
  description: string;
  colorCode: string;
  priorityLevel: number;
  permissions: string[];
  requiredCertifications: string[];
  requiredSkills: string[];
  isActive: boolean;
  organizationId: string;
  type: 'specialist' | 'assistant' | 'shift_leader' | 'nurse' | 'nurse_manager' | 'helper' | 'doctor' | 'technician' | 'administrator' | 'cleaner' | 'security' | 'other';
}

/**
 * Component for Role Management
 */
const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
  const [availableCertifications, setAvailableCertifications] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponseDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleResponseDto | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [showInactive, setShowInactive] = useState(false);


  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    colorCode: '#1976d2',
    priorityLevel: 1,
    permissions: [],
    requiredCertifications: [],
    requiredSkills: [],
    isActive: true,
    organizationId: '', // TODO: Get from context or props
    type: 'other',
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
      
      // Extract unique permissions, certifications, and skills using service helper methods
      setAvailablePermissions(roleService.extractAvailablePermissions(roles));
      setAvailableCertifications(roleService.extractAvailableCertifications(roles));
      setAvailableSkills(roleService.extractAvailableSkills(roles));
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
        description: role.description || '',
        colorCode: role.colorCode || '#1976d2',
        priorityLevel: role.priorityLevel,
        permissions: role.permissions,
        requiredCertifications: role.requiredCertifications,
        requiredSkills: role.requiredSkills,
        isActive: role.isActive,
        organizationId: role.organizationId,
        type: role.type,
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        description: '',
        colorCode: '#1976d2',
        priorityLevel: Math.max(...roles.map(r => r.priorityLevel), 0) + 1,
        permissions: [],
        requiredCertifications: [],
        requiredSkills: [],
        isActive: true,
        organizationId: '', // TODO: Get from context or props
        type: 'other',
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
          description: formData.description,
          colorCode: formData.colorCode,
          priorityLevel: formData.priorityLevel,
          permissions: formData.permissions,
          requiredCertifications: formData.requiredCertifications,
          requiredSkills: formData.requiredSkills,
          isActive: formData.isActive,
          type: formData.type,
        };
        
        await roleService.updateRole(editingRole.id, updateData);
        showAlert('success', 'Rolle erfolgreich aktualisiert');
      } else {
        // Create new role
        const createData: CreateRoleDto = {
          name: formData.name,
          description: formData.description,
          colorCode: formData.colorCode,
          priorityLevel: formData.priorityLevel,
          permissions: formData.permissions,
          requiredCertifications: formData.requiredCertifications,
          requiredSkills: formData.requiredSkills,
          isActive: formData.isActive,
          organizationId: formData.organizationId,
          type: formData.type,
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
  const sortedRoles = filteredRoles.sort((a, b) => a.priorityLevel - b.priorityLevel);


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
              border: `2px solid ${role.colorCode || '#1976d2'}20`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: role.colorCode || '#1976d2',
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
                    Priorität: {role.priorityLevel}
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
                      {role.permissions.map((permission, index) => (
                        <Chip
                          key={index}
                          label={permission}
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
                      Zertifizierungen ({role.requiredCertifications.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {role.requiredCertifications.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.requiredCertifications.map((certification, index) => (
                        <Chip
                          key={index}
                          label={certification}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Keine Zertifizierungen erforderlich
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon fontSize="small" />
                    <Typography variant="body2">
                      Fähigkeiten ({role.requiredSkills.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {role.requiredSkills.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.requiredSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Keine besonderen Fähigkeiten erforderlich
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Rollenname"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Rollentyp</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <MenuItem value="specialist">Spezialist</MenuItem>
                  <MenuItem value="assistant">Assistent</MenuItem>
                  <MenuItem value="shift_leader">Schichtleiter</MenuItem>
                  <MenuItem value="nurse">Krankenpfleger</MenuItem>
                  <MenuItem value="nurse_manager">Pflegeleitung</MenuItem>
                  <MenuItem value="helper">Hilfskraft</MenuItem>
                  <MenuItem value="doctor">Arzt</MenuItem>
                  <MenuItem value="technician">Techniker</MenuItem>
                  <MenuItem value="administrator">Administrator</MenuItem>
                  <MenuItem value="cleaner">Reinigungskraft</MenuItem>
                  <MenuItem value="security">Sicherheitsdienst</MenuItem>
                  <MenuItem value="other">Sonstiges</MenuItem>
                </Select>
              </FormControl>
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
                value={formData.colorCode}
                onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
              />
              <TextField
                fullWidth
                label="Prioritätslevel"
                type="number"
                value={formData.priorityLevel}
                onChange={(e) => setFormData({ ...formData, priorityLevel: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1, max: 10 }}
                helperText="1-10, höher = wichtiger"
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
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {availablePermissions.map((permission) => (
                  <MenuItem key={permission} value={permission}>
                    {permission}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Erforderliche Zertifizierungen</InputLabel>
              <Select
                multiple
                value={formData.requiredCertifications}
                onChange={(e) => setFormData({ ...formData, requiredCertifications: e.target.value as string[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" color="primary" />
                    ))}
                  </Box>
                )}
              >
                {availableCertifications.map((certification) => (
                  <MenuItem key={certification} value={certification}>
                    {certification}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Erforderliche Fähigkeiten</InputLabel>
              <Select
                multiple
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value as string[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" color="secondary" />
                    ))}
                  </Box>
                )}
              >
                {availableSkills.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
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