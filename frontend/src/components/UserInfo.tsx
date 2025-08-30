import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

/**
 * UserInfo Component - Zeigt User und Organisation im Header an
 */
const UserInfo: React.FC = () => {
  const { user, organization } = useAuth();
  const theme = useTheme();

  if (!user || !organization) {
    return null;
  }

  // Initialen für Avatar generieren
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Rolle übersetzen
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Administrator';
      case 'MANAGER':
        return 'Manager';
      case 'USER':
        return 'Benutzer';
      default:
        return role;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      {/* User Avatar */}
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          width: 36,
          height: 36,
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        {getInitials(user.firstName, user.lastName)}
      </Avatar>

      {/* User und Organisation Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* User Name und Rolle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '150px',
            }}
          >
            {user.firstName} {user.lastName}
          </Typography>
          <Chip
            label={getRoleDisplayName(user.role)}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.75rem',
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              color: 'success.main',
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          />
        </Box>

        {/* Organisation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <BusinessIcon
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '180px',
            }}
          >
            {organization.name}
          </Typography>
        </Box>
      </Box>

    </Box>
  );
};

export default UserInfo;