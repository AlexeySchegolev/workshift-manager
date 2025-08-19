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
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  Home as HomeIcon
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
    { title: 'Startseite', path: '/', icon: <HomeIcon /> },
    { title: 'Schichtplanung', path: '/schichtplanung', icon: <CalendarIcon /> },
    { title: 'Mitarbeiter', path: '/mitarbeiter', icon: <PeopleIcon /> }
  ];

  // Aktuelle Seite ermitteln
  const currentPageTitle = navigationLinks.find(
    link => link.path === location.pathname
  )?.title || 'Dialysepraxis Schichtplanung';

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Dialysepraxis
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Schichtplanungssystem
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <ListItem
              key={link.path}
              disablePadding
            >
              <Button
                component={RouterLink}
                to={link.path}
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  paddingLeft: 2,
                  paddingRight: 2,
                  textAlign: 'left',
                  backgroundColor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.dark' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.light' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                startIcon={link.icon}
              >
                {link.title}
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {currentPageTitle}
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationLinks.map((link) => (
                <Button
                  key={link.path}
                  color="inherit"
                  component={RouterLink}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    backgroundColor: location.pathname === link.path 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    },
                  }}
                >
                  {link.title}
                </Button>
              ))}
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
      
      <Container maxWidth={false} sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          mt: 'auto', 
          py: 2, 
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Dialysepraxis Schichtplanungssystem
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;