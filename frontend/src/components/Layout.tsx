import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  useMediaQuery,
  useTheme,
  alpha,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  Rule as RuleIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Apps as AppsIcon,
  KeyboardArrowDown as ArrowDownIcon,
  WorkOutline as WorkIcon,
  GroupWork as GroupIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import UserInfo from './UserInfo';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component with Navigation
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shiftMenuAnchorEl, setShiftMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [employeeMenuAnchorEl, setEmployeeMenuAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleShiftMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setShiftMenuAnchorEl(event.currentTarget);
  };

  const handleShiftMenuClose = () => {
    setShiftMenuAnchorEl(null);
  };

  const handleEmployeeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setEmployeeMenuAnchorEl(event.currentTarget);
  };

  const handleEmployeeMenuClose = () => {
    setEmployeeMenuAnchorEl(null);
  };

  const navigationLinks = [
    { title: 'Dashboard', path: '/', icon: <DashboardIcon />, description: 'Übersicht und Statistiken', category: 'main' },
    { title: 'Schichtplanung', path: '/schichtplanung', icon: <CalendarIcon />, description: 'Schichtpläne erstellen und verwalten', category: 'shifts' },
    { title: 'Schichten', path: '/schichten', icon: <ScheduleIcon />, description: 'Einzelne Schichten verwalten', category: 'shifts' },
    { title: 'Schichtkonfiguration', path: '/schichtregeln', icon: <RuleIcon />, description: 'Konfiguration und Vorgaben für die Schichtplanung', category: 'shifts' },
    { title: 'Mitarbeiter', path: '/mitarbeiter', icon: <PeopleIcon />, description: 'Mitarbeiterdaten verwalten', category: 'employees' },
    { title: 'Standorte', path: '/standorte', icon: <BusinessIcon />, description: 'Standorte und Betriebsstätten verwalten', category: 'employees' },
    { title: 'Rollen', path: '/rollen', icon: <AdminPanelSettingsIcon />, description: 'Rollen und Berechtigungen verwalten', category: 'employees' }
  ];

  const shiftLinks = navigationLinks.filter(link => link.category === 'shifts');
  const employeeLinks = navigationLinks.filter(link => link.category === 'employees');

  const getCurrentPageTitle = () => {
    const currentLink = navigationLinks.find(link => link.path === location.pathname);
    return currentLink ? currentLink.title : 'Dashboard';
  };

  const isShiftMenuOpen = Boolean(shiftMenuAnchorEl);
  const isEmployeeMenuOpen = Boolean(employeeMenuAnchorEl);


  const drawer = (
    <Box sx={{ width: 300 }} role="presentation">
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.03)} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }}
          >
            <DashboardIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              WorkShift Manager
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Schichtplanungssystem
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      {/* Navigation */}
      <List sx={{ px: 2, py: 2 }}>
        {navigationLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <ListItem
              key={link.path}
              disablePadding
              sx={{ mb: 1 }}
            >
              <Button
                component={RouterLink}
                to={link.path}
                onClick={handleDrawerToggle}
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'left',
                  backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  border: isActive ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                startIcon={
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1.5,
                      backgroundColor: isActive
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.grey[500], 0.08),
                      color: isActive ? 'primary.main' : 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {link.icon}
                  </Box>
                }
              >
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 500, mb: 0.5 }}>
                    {link.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>
                    {link.description}
                  </Typography>
                </Box>
              </Button>
            </ListItem>
          );
        })}
      </List>
      
      <Divider sx={{ mx: 2 }} />
      
      {/* Mobile User Info */}
      <Box sx={{ p: 2 }}>
        <UserInfo />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          backdropFilter: 'blur(20px)',
          boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.05)}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              px: 0,
              py: 1,
              minHeight: { xs: 56, md: 64 },
              gap: 2,
            }}
          >
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                size="medium"
                edge="start"
                sx={{
                  color: 'text.primary',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo/Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                <DashboardIcon sx={{ fontSize: '1.2rem' }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  component={RouterLink}
                  to="/"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                >
                  WorkShift Manager
                </Typography>
                {!isMobile && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                    {getCurrentPageTitle()}
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Quick Dashboard Access */}
                <Button
                  component={RouterLink}
                  to="/"
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: location.pathname === '/' ? 'primary.main' : 'text.primary',
                    backgroundColor: location.pathname === '/'
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.grey[500], 0.05),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Dashboard
                </Button>
                
                {/* Schichtbezogene Navigation */}
                <Button
                  onClick={handleShiftMenuOpen}
                  endIcon={<ArrowDownIcon />}
                  startIcon={<ScheduleIcon />}
                  sx={{
                    color: 'text.primary',
                    backgroundColor: isShiftMenuOpen
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.grey[500], 0.05),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Schichten
                </Button>

                {/* Mitarbeiterbezogene Navigation */}
                <Button
                  onClick={handleEmployeeMenuOpen}
                  endIcon={<ArrowDownIcon />}
                  startIcon={<PeopleIcon />}
                  sx={{
                    color: 'text.primary',
                    backgroundColor: isEmployeeMenuOpen
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.grey[500], 0.05),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  Mitarbeiter
                </Button>
                
                {/* User Info */}
                <UserInfo />
              </Box>
            )}
            
            {/* Mobile Current Page Indicator */}
            {isMobile && (
              <Chip
                label={getCurrentPageTitle()}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Schichtbezogene Navigation Dropdown */}
      <Menu
        anchorEl={shiftMenuAnchorEl}
        open={isShiftMenuOpen}
        onClose={handleShiftMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
            backdropFilter: 'blur(20px)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {shiftLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <MenuItem
              key={link.path}
              component={RouterLink}
              to={link.path}
              onClick={handleShiftMenuClose}
              sx={{
                py: 1.5,
                px: 2,
                backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
                transition: 'background-color 0.2s ease-in-out',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  minWidth: 36,
                }}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.title}
                secondary={link.description}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'primary.main' : 'text.primary',
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>

      {/* Mitarbeiterbezogene Navigation Dropdown */}
      <Menu
        anchorEl={employeeMenuAnchorEl}
        open={isEmployeeMenuOpen}
        onClose={handleEmployeeMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
            backdropFilter: 'blur(20px)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {employeeLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <MenuItem
              key={link.path}
              component={RouterLink}
              to={link.path}
              onClick={handleEmployeeMenuClose}
              sx={{
                py: 1.5,
                px: 2,
                backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
                transition: 'background-color 0.2s ease-in-out',
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? 'primary.main' : 'text.secondary',
                  minWidth: 36,
                }}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.title}
                secondary={link.description}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'primary.main' : 'text.primary',
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile devices
        }}
      >
        {drawer}
      </Drawer>
      
      <Box sx={{ flex: 1, backgroundColor: 'background.default' }}>
        {children}
      </Box>
      
      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 3,
          px: 3,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Schichtplanungs- und Zeitmanagement-System
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Version 2.0
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;