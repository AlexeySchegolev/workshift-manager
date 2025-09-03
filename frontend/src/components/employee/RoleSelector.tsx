import React from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  FormControl,
  FormLabel,
  FormHelperText,
  Paper,
  alpha,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from '@mui/icons-material';
import { RoleResponseDto } from '@/api/data-contracts';

interface RoleSelectorProps {
  roles: RoleResponseDto[];
  selectedRoles: RoleResponseDto[];
  onRolesChange: (roles: RoleResponseDto[]) => void;
  loading?: boolean;
  error?: string | null;
  helperText?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  roles,
  selectedRoles,
  onRolesChange,
  loading = false,
  error = null,
  helperText,
}) => {
  const handleRoleToggle = (role: RoleResponseDto) => {
    const isSelected = selectedRoles.some(selectedRole => selectedRole.id === role.id);
    
    if (isSelected) {
      // Rolle entfernen
      const newRoles = selectedRoles.filter(r => r.id !== role.id);
      onRolesChange(newRoles);
    } else {
      // Rolle hinzufügen
      const newRoles = [...selectedRoles, role];
      onRolesChange(newRoles);
    }
  };
    if (loading) {
    return (
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend" sx={{ mb: 2, fontSize: '0.875rem', fontWeight: 600 }}>
          Rollen
        </FormLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 3 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Lade Rollen...
          </Typography>
        </Box>
      </FormControl>
    );
  }

  if (error) {
    return (
      <FormControl component="fieldset" fullWidth error>
        <FormLabel component="legend" sx={{ mb: 2, fontSize: '0.875rem', fontWeight: 600 }}>
          Rollen
        </FormLabel>
        <Typography variant="body2" color="error" sx={{ py: 2 }}>
          {error}
        </Typography>
      </FormControl>
    );
  }

  return (
    <FormControl component="fieldset" fullWidth error={!!helperText}>
      <FormLabel component="legend" sx={{ mb: 2, fontSize: '0.875rem', fontWeight: 600 }}>
        Rollen
        {selectedRoles.length > 0 && (
          <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
            ({selectedRoles.length} ausgewählt)
          </Typography>
        )}
      </FormLabel>
      
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5),
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            minHeight: '40px',
            alignItems: 'flex-start',
          }}
        >
          {roles.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              Keine Rollen verfügbar
            </Typography>
          ) : (
            roles.map((role) => {
              const isSelected = selectedRoles.some(selectedRole => selectedRole.id === role.id);
              const roleColor = '#1976d2'; // Default color since role.type doesn't exist
              
              return (
                <Chip
                  key={role.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {isSelected ? (
                        <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ fontSize: '1rem', opacity: 0.5 }} />
                      )}
                      <Typography variant="body2" sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                        {role.name}
                      </Typography>
                    
                    </Box>
                  }
                  onClick={() => handleRoleToggle(role)}
                  variant={isSelected ? 'filled' : 'outlined'}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: 2,
                    height: 'auto',
                    py: 0.5,
                    px: 1,
                    backgroundColor: isSelected 
                      ? alpha(roleColor, 0.1)
                      : 'transparent',
                    borderColor: isSelected 
                      ? alpha(roleColor, 0.3)
                      : alpha('#000', 0.12),
                    color: isSelected 
                      ? roleColor
                      : 'text.primary',
                    '&:hover': {
                      backgroundColor: alpha(roleColor, isSelected ? 0.15 : 0.05),
                      borderColor: alpha(roleColor, 0.4),
                      transform: 'translateY(-1px)',
                      boxShadow: (theme) => `0 2px 8px ${alpha(roleColor, 0.2)}`,
                    },
                    '& .MuiChip-label': {
                      px: 0,
                    },
                  }}
                />
              );
            })
          )}
        </Box>
      </Paper>
      
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default RoleSelector;