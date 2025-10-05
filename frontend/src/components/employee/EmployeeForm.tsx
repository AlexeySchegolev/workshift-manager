import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { RoleResponseDto } from '@/api/data-contracts';
import { EmployeeFormData, EmployeeFormErrors } from './hooks/useEmployeeForm';
import { useLocations } from '@/hooks/useLocations';
import { useRoles } from '@/hooks/useRoles';
import RoleSelector from './RoleSelector';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: EmployeeFormData;
  errors: EmployeeFormErrors;
  onUpdateField: <K extends keyof EmployeeFormData>(
    field: K,
    value: EmployeeFormData[K]
  ) => void;
  isEditing?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  onClose,
  onSave,
  formData,
  errors,
  onUpdateField,
  isEditing = false,
}) => {
  const { locations, loading: locationsLoading, error: locationsError } = useLocations();
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();

  const handleRolesChange = (selectedRoles: RoleResponseDto[]) => {
    onUpdateField('roles', selectedRoles);
    
    // Wenn keine Rollen mehr ausgewählt sind, Hauptrolle zurücksetzen
    if (selectedRoles.length === 0) {
      onUpdateField('primaryRole', null);
      return;
    }
    
    // Wenn die aktuell ausgewählte Hauptrolle nicht mehr in den ausgewählten Rollen ist, zurücksetzen
    if (formData.primaryRole && !selectedRoles.some(role => role.id === formData.primaryRole?.id)) {
      onUpdateField('primaryRole', null);
    }
    
    // Wenn noch keine Hauptrolle ausgewählt ist und Rollen vorhanden sind, erste als Standard setzen
    if (!formData.primaryRole && selectedRoles.length > 0) {
      onUpdateField('primaryRole', selectedRoles[0]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
        <PersonAddIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
        {isEditing ? 'Mitarbeiter bearbeiten' : 'Neuen Mitarbeiter hinzufügen'}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            pt: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Vorname"
            variant="outlined"
            value={formData.firstName}
            onChange={(e) => onUpdateField('firstName', e.target.value)}
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
            value={formData.lastName}
            onChange={(e) => onUpdateField('lastName', e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Box sx={{ gridColumn: { md: 'span 2' } }}>
            <RoleSelector
              roles={roles}
              selectedRoles={formData.roles}
              onRolesChange={handleRolesChange}
              loading={rolesLoading}
              error={rolesError}
              helperText={errors.role}
            />
          </Box>

          {/* Primary Role Selection */}
          <FormControl fullWidth error={!!errors.primaryRole} sx={{ gridColumn: { md: 'span 2' } }}>
            <InputLabel id="primary-role-label">Hauptrolle (nur eine auswählbar)</InputLabel>
            <Select
              labelId="primary-role-label"
              value={formData.primaryRole?.id || ''}
              label="Hauptrolle (nur eine auswählbar)"
              onChange={(e) => {
                const selectedRole = formData.roles.find(role => role.id === e.target.value);
                onUpdateField('primaryRole', selectedRole || null);
              }}
              disabled={formData.roles.length === 0}
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value="">
                <em>Eine Hauptrolle auswählen</em>
              </MenuItem>
              {formData.roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.displayName || role.name}
                </MenuItem>
              ))}
            </Select>
            {errors.primaryRole && <FormHelperText>{errors.primaryRole}</FormHelperText>}
            {formData.roles.length === 0 ? (
              <FormHelperText>
                Wählen Sie zuerst eine oder mehrere Rollen aus
              </FormHelperText>
            ) : (
              <FormHelperText>
                Wählen Sie genau eine Rolle als Hauptrolle aus den oben ausgewählten Rollen
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.location} sx={{ gridColumn: { md: 'span 2' } }}>
            <InputLabel id="modal-location-label">Standort</InputLabel>
            <Select
              labelId="modal-location-label"
              value={formData.location?.id || ''}
              label="Standort"
              onChange={(e) => {
                const selectedLocation = locations.find(loc => loc.id === e.target.value);
                onUpdateField('location', selectedLocation || null);
              }}
              disabled={locationsLoading}
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value="">
                <em>Bitte wählen</em>
              </MenuItem>
              {locationsLoading ? (
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">Lade Standorte...</Typography>
                  </Box>
                </MenuItem>
              ) : locationsError ? (
                <MenuItem disabled>
                  <Typography variant="body2" color="error">
                    {locationsError}
                  </Typography>
                </MenuItem>
              ) : (
                locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                    {location.city && ` - ${location.city}`}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.location && <FormHelperText>{errors.location}</FormHelperText>}
          </FormControl>

          <TextField
            label="Arbeitsstunden pro Monat"
            variant="outlined"
            type="number"
            value={formData.monthlyWorkHours ? Math.round(formData.monthlyWorkHours) : ''}
            onChange={(e) => onUpdateField('monthlyWorkHours', e.target.value ? parseInt(e.target.value, 10) : undefined)}
            error={!!errors.monthlyWorkHours}
            helperText={errors.monthlyWorkHours}
            fullWidth
            inputProps={{
              min: 0,
              max: 744,
              step: 1
            }}
            sx={{
              gridColumn: { md: 'span 2' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
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
          onClick={onSave}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          {isEditing ? 'Aktualisieren' : 'Hinzufügen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;