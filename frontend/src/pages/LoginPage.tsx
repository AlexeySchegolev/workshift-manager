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
  useTheme,
  alpha,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

/**
 * Login Page with LoginForm component
 * Provides proper page layout for user authentication
 */
const LoginPage: React.FC = () => {
  const theme = useTheme();

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
            {/* Back Button */}
            <Button
              component={RouterLink}
              to="/"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Zurück
            </Button>

            <Box sx={{ flexGrow: 1 }} />

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
                  Anmeldung
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.light, 0.01)} 100%)`,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
              backgroundColor: 'background.paper',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Anmeldung
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Melden Sie sich an, um auf das Schichtplanungssystem zuzugreifen
              </Typography>
            </Box>

            {/* Login Form */}
            <LoginForm />
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 2,
          px: 3,
          backgroundColor: alpha(theme.palette.grey[500], 0.05),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" textAlign="center">
            © 2024 WorkShift Manager. Sichere Anmeldung für Ihr Schichtplanungssystem.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;