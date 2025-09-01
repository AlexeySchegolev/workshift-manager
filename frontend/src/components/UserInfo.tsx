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


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.grey[50], 0.8),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        backdropFilter: 'blur(8px)',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        },
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
      }}
    >
      {/* User Avatar */}
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          width: 32,
          height: 32,
          fontSize: '0.8rem',
          fontWeight: 700,
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        {getInitials(user.firstName, user.lastName)}
      </Avatar>

      {/* User und Organisation Info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        {/* User Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px',
              fontSize: '0.875rem',
            }}
          >
            {user.firstName} {user.lastName}
          </Typography>
        </Box>

        {/* Organisation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <BusinessIcon
            sx={{
              fontSize: '0.75rem',
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
              maxWidth: '140px',
              fontSize: '0.7rem',
              fontWeight: 500,
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