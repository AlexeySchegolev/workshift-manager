import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Toolbar,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Login as LoginIcon,
  Dashboard as DashboardIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Public HomePage for unauthenticated users
 * Shows welcome information and provides login access
 */
const PublicHomePage: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <ScheduleIcon />,
      title: 'Schichtplanung',
      description: 'Automatisierte Erstellung und Verwaltung von Schichtplänen'
    },
    {
      icon: <PeopleIcon />,
      title: 'Mitarbeiterverwaltung',
      description: 'Umfassende Verwaltung von Mitarbeiterdaten und Qualifikationen'
    },
    {
      icon: <BusinessIcon />,
      title: 'Standortverwaltung',
      description: 'Verwaltung mehrerer Standorte und deren Anforderungen'
    },
    {
      icon: <SecurityIcon />,
      title: 'Sichere Lösung',
      description: 'Moderne Authentifizierung und Datenschutz'
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
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
          <Toolbar sx={{ px: 0, py: 1, minHeight: { xs: 56, md: 64 } }}>
            {/* Logo/Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                <DashboardIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  WorkShift Manager
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                  Schichtplanungssystem
                </Typography>
              </Box>
            </Box>

            {/* Login Button */}
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Anmelden
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Willkommen beim WorkShift Manager
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.4,
              }}
            >
              Die professionelle Lösung für effiziente Schichtplanung und Mitarbeiterverwaltung
            </Typography>
            
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              Jetzt anmelden
            </Button>
          </Box>

          {/* Features Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Funktionen im Überblick
            </Typography>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 2,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.1)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 16px auto',
                          color: 'primary.main',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          px: 3,
          mt: 'auto',
          backgroundColor: alpha(theme.palette.grey[500], 0.05),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2024 WorkShift Manager. Professionelle Schichtplanung für Ihr Unternehmen.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicHomePage;