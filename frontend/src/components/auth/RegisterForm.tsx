import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { PersonAdd as PersonAddIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterDto } from '@/api/data-contracts.ts';

interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'super_admin' | 'organization_admin' | 'employee';
  phoneNumber: string;
  organizationName: string;
}

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'employee',
    phoneNumber: '',
    organizationName: '',
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (formData.password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    // Validate organization name
    if (!formData.organizationName.trim()) {
      setError('Organisationsname ist erforderlich');
      return;
    }

    if (formData.organizationName.trim().length < 2) {
      setError('Organisationsname muss mindestens 2 Zeichen lang sein');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Map local form data to the format expected by the backend
      const registerData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        organizationName: formData.organizationName.trim(),
      };
      
      await register(registerData as any); // Cast as any since the API types haven't been updated yet
      setSuccess(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message || 
        'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Registrierung erfolgreich!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Ihr Konto wurde erfolgreich erstellt. Sie können sich jetzt anmelden.
            </Typography>
            <Button 
              component={RouterLink} 
              to="/login" 
              variant="contained" 
              size="large"
              sx={{ mt: 2 }}
            >
              Zur Anmeldung
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonAddIcon />
          </Avatar>
          
          <Typography component="h1" variant="h4" gutterBottom>
            Registrieren
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Erstellen Sie Ihr Workshift Manager Konto
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Vorname"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nachname"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="E-Mail Adresse"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="organizationName"
                  label="Organisationsname"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  helperText="Name Ihrer Organisation (wird automatisch erstellt)"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  label="Telefonnummer (optional)"
                  name="phoneNumber"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="role-label">Rolle</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                    label="Rolle"
                    disabled={isLoading}
                  >
                    <MenuItem value="employee">Mitarbeiter</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="planner">Planer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Passwort"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  variant="outlined"
                  helperText="Mindestens 8 Zeichen"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Passwort bestätigen"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || !formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.organizationName}
              size="large"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Registrierung läuft...
                </>
              ) : (
                'Registrieren'
              )}
            </Button>

            <Grid container justifyContent="center">
              <Grid size={{ xs: 12 }}>
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  variant="body2"
                  sx={{ textDecoration: 'none' }}
                >
                  Bereits registriert? Anmelden
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterForm;