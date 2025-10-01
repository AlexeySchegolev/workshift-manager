import {
  Business as BusinessIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import {
  alpha,
  Avatar,
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * UserInfo Component - Zeigt User und Organisation im Header an
 */
const UserInfo: React.FC = () => {
  const { user, organization, logout } = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!user || !organization) {
    return null;
  }

  // Initialen für Avatar generieren
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Menu handlers
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
    } catch (error) {
      // Silent error handling
    }
  };


  return (
    <>
      <Box
        onClick={handleClick}
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

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Abmelden</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserInfo;