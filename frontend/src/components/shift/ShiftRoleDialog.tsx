import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { ShiftRoleResponseDto, RoleResponseDto } from '@/api/data-contracts';
import { useRoles } from '@/hooks/useRoles';

interface ShiftRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { roleId: string; count: number }) => Promise<void>;
  shiftRole?: ShiftRoleResponseDto | null;
  existingRoleIds?: string[];
}

const ShiftRoleDialog: React.FC<ShiftRoleDialogProps> = ({
  open,
  onClose,
  onSave,
  shiftRole,
  existingRoleIds = [],
}) => {
  const [roleId, setRoleId] = useState('');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ roleId?: string; count?: string }>({});

  const { roles, loading: rolesLoading } = useRoles();

  const isEditing = !!shiftRole;

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (shiftRole) {
        setRoleId(shiftRole.roleId);
        setCount(shiftRole.count);
      } else {
        setRoleId('');
        setCount(1);
      }
      setErrors({});
    }
  }, [open, shiftRole]);

  const validateForm = (): boolean => {
    const newErrors: { roleId?: string; count?: string } = {};

    if (!roleId) {
      newErrors.roleId = 'Rolle ist erforderlich';
    } else if (!isEditing && existingRoleIds.includes(roleId)) {
      newErrors.roleId = 'Diese Rolle ist bereits zugewiesen';
    }

    if (count < 1) {
      newErrors.count = 'Anzahl muss mindestens 1 sein';
    } else if (count > 99) {
      newErrors.count = 'Anzahl darf maximal 99 sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave({ roleId, count });
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const availableRoles = roles.filter(role => 
    isEditing ? true : !existingRoleIds.includes(role.id)
  );

  const selectedRole = roles.find(role => role.id === roleId);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          fontWeight: 600,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="primary" />
          {isEditing ? 'Rolle bearbeiten' : 'Rolle hinzufügen'}
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth error={!!errors.roleId}>
            <InputLabel>Rolle</InputLabel>
            <Select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              label="Rolle"
              disabled={loading || rolesLoading || isEditing}
            >
              {availableRoles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Typography sx={{ flexGrow: 1 }}>
                      {role.name}
                    </Typography>
                    {(role as any).color && (
                      <Chip
                        size="small"
                        label={(role as any).code || ''}
                        sx={{
                          backgroundColor: (role as any).color,
                          color: 'white',
                          fontSize: '0.75rem',
                          height: 20,
                        }}
                      />
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.roleId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.roleId}
              </Typography>
            )}
          </FormControl>

          {selectedRole && (selectedRole as any).description && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Beschreibung:</strong> {(selectedRole as any).description}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Anzahl benötigter Mitarbeiter"
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            error={!!errors.count}
            helperText={errors.count || 'Anzahl der Mitarbeiter, die für diese Rolle benötigt werden'}
            inputProps={{ min: 1, max: 99 }}
            disabled={loading}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Abbrechen
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading || rolesLoading || !roleId}
        >
          {isEditing ? 'Aktualisieren' : 'Hinzufügen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftRoleDialog;