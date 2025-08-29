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
import { LocationResponseDto, RoleResponseDto } from '@/api/data-contracts';
import { EmployeeFormData, EmployeeFormErrors } from './hooks/useEmployeeForm';
import { useLocations } from '@/hooks/useLocations';

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
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon sx={{ fontSize: '1.25rem', color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {isEditing ? 'Mitarbeiter bearbeiten' : 'Neuen Mitarbeiter hinzufügen'}
          </Typography>
        </Box>
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

          <FormControl fullWidth error={!!errors.role}>
            <InputLabel id="modal-role-label">Rolle</InputLabel>
            <Select
              labelId="modal-role-label"
              value={formData.primaryRole || ''}
              label="Rolle"
              onChange={(e) =>
                onUpdateField('primaryRole', e.target.value as RoleResponseDto)
              }
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
            inputProps={{ min: 1, max: 180, step: '0.1' }}
            value={formData.hoursPerMonth || ''}
            onChange={(e) =>
              onUpdateField(
                'hoursPerMonth',
                e.target.value === '' ? null : Number(e.target.value)
              )
            }
            error={!!errors.hoursPerMonth}
            helperText={errors.hoursPerMonth}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

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