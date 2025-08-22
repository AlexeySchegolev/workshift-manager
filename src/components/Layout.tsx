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
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Rule as RuleIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout-Komponente mit Navigation
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationLinks = [
    { title: 'Dashboard', path: '/', icon: <DashboardIcon />, description: 'Übersicht und Statistiken' },
    { title: 'Schichtplanung', path: '/schichtplanung', icon: <CalendarIcon />, description: 'Schichtpläne erstellen und verwalten' },
    { title: 'Mitarbeiter', path: '/mitarbeiter', icon: <PeopleIcon />, description: 'Mitarbeiterdaten verwalten' },
    { title: 'Standorte', path: '/standorte', icon: <BusinessIcon />, description: 'Standorte und Praxen verwalten' },
    { title: 'Schichtregeln', path: '/schichtregeln', icon: <RuleIcon />, description: 'Regeln und Vorgaben für die Schichtplanung' }
  ];


  const drawer = (
    <Box sx={{ width: 280 }} role="presentation" onClick={handleDrawerToggle}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            <DashboardIcon />
          </Avatar>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Schichtplanungssystem
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider />
      
      {/* Navigation */}
      <List sx={{ px: 2, py: 1 }}>
        {navigationLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <ListItem
              key={link.path}
              disablePadding
              sx={{ mb: 0.5 }}
            >
              <Button
                component={RouterLink}
                to={link.path}
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
                      : alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                startIcon={
                  <Box
                    sx={{
                      p: 0.5,
                      borderRadius: 1,
                      backgroundColor: isActive
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.grey[500], 0.1),
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {link.icon}
                  </Box>
                }
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 500 }}>
                    {link.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {link.description}
                  </Typography>
                </Box>
              </Button>
            </ListItem>
          );
        })}
      </List>
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
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              sx={{
                mr: 2,
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              ShiftCare
            </Typography>
          </Box>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navigationLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Button
                    key={link.path}
                    component={RouterLink}
                    to={link.path}
                    startIcon={link.icon}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      backgroundColor: isActive
                        ? alpha(theme.palette.primary.main, 0.1)
                        : 'transparent',
                      border: isActive
                        ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        : '1px solid transparent',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      fontWeight: isActive ? 600 : 500,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {link.title}
                  </Button>
                );
              })}
              
              {/* Zusätzliche Header-Aktionen */}
              <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    },
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    },
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Bessere Performance auf Mobilgeräten
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
              © {new Date().getFullYear()} Dialysepraxis Schichtplanungssystem
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Version 2.0
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Professionelles Dashboard
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;