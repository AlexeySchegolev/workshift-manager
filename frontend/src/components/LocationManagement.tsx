import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { locationService } from '@/services';
import {CreateLocationDto, UpdateLocationDto, LocationResponseDto} from '../api/data-contracts';
import { getCurrentTimestamp } from '../utils/date.utils';

interface LocationManagementProps {
  locations?: LocationResponseDto[];
  onLocationsChange?: (locations: LocationResponseDto[]) => void;
}

/**
 * Location Management Component
 */
const LocationManagement: React.FC<LocationManagementProps> = ({
  locations: propLocations,
  onLocationsChange,
}) => {
  const theme = useTheme();
  const [locations, setLocations] = useState<LocationResponseDto[]>(propLocations || []);
  const [selectedLocation, setSelectedLocation] = useState<LocationResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load locations from API
  useEffect(() => {
    if (!propLocations) {
      loadLocations();
    } else {
      setLocations(propLocations);
    }
  }, [propLocations]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await locationService.getAllLocations();
      setLocations(data);
      onLocationsChange?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Standorte');
    } finally {
      setLoading(false);
    }
  };

  // Open dialog
  const handleOpenDialog = (location?: LocationResponseDto) => {
    if (location) {
      setSelectedLocation(location);
      setIsEditing(true);
    } else {
      setSelectedLocation({
        id: '',
        organizationId: '',
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Germany',
        phone: '',
        email: '',
        currentCapacity: 0,
        timezone: 'Europe/Berlin',
        operatingHours: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
        isActive: true,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        employees: [],
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedLocation(null);
    setIsEditing(false);
  };

  // Save location
  const handleSaveLocation = async () => {
    if (!selectedLocation) return;

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        // Update location
        const updatedLocation = await locationService.updateLocation(selectedLocation.id, selectedLocation as UpdateLocationDto);
        const updatedLocations = locations.map(loc =>
          loc.id === selectedLocation.id ? updatedLocation : loc
        );
        setLocations(updatedLocations);
        onLocationsChange?.(updatedLocations);
      } else {
        // Create new location
        const newLocation = await locationService.createLocation(selectedLocation as CreateLocationDto);
        const updatedLocations = [...locations, newLocation];
        setLocations(updatedLocations);
        onLocationsChange?.(updatedLocations);
      }

      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern des Standorts');
    } finally {
      setLoading(false);
    }
  };

  // Delete location
  const handleDeleteLocation = async (locationId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Standort löschen möchten?')) {
      try {
        setLoading(true);
        setError(null);
        await locationService.deleteLocation(locationId);
        const updatedLocations = locations.filter(loc => loc.id !== locationId);
        setLocations(updatedLocations);
        onLocationsChange?.(updatedLocations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Löschen des Standorts');
      } finally {
        setLoading(false);
      }
    }
  };

  // Format operating hours
  const formatOperatingHours = (location: LocationResponseDto): string => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    
    const activeDays = days
      .map((day, index) => ({
        name: dayNames[index],
        slots: location.operatingHours[day] || []
      }))
      .filter(day => Array.isArray(day.slots) && day.slots.length > 0);

    if (activeDays.length === 0) return 'Geschlossen';
    
    return activeDays
      .map(day => `${day.name}: ${day.slots.map((slot: any) => `${slot.start}-${slot.end}`).join(', ')}`)
      .join(' • ');
  };

  return (
    <Box>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Standortverwaltung
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
          disabled={loading}
        >
          Neuer Standort
        </Button>
      </Box>

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Location Cards */}
      <Grid container spacing={3}>
        {locations.map((location) => {
          return (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={location.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: location.isActive ? 'success.main' : 'grey.400',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <BusinessIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {location.name}
                        </Typography>
                        <Chip
                          label={location.isActive ? 'Aktiv' : 'Inaktiv'}
                          size="small"
                          color={location.isActive ? 'success' : 'default'}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(location)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteLocation(location.id.toString())}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Address */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                    <Typography variant="body2" color="text.secondary">
                      {location.address}, {location.postalCode} {location.city}
                    </Typography>
                  </Box>

                  {/* Contact */}
                  {location.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <PhoneIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {location.phone}
                      </Typography>
                    </Box>
                  )}

                  {location.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {location.email}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/* Statistics */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                        {location.currentCapacity}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Aktuelle Kapazität
                      </Typography>
                    </Box>
                      <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                              {location.employees.length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                              Anzahl Mitarbeiter
                          </Typography>
                      </Box>
                  </Box>


                  {/* Operating hours */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                      {formatOperatingHours(location)}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    startIcon={<AssessmentIcon />}
                    sx={{ color: 'primary.main' }}
                  >
                    Details
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(location)}
                    sx={{ color: 'info.main' }}
                  >
                    Bearbeiten
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          {isEditing ? 'Standort bearbeiten' : 'Neuer Standort'}
        </DialogTitle>
        <DialogContent>
          {selectedLocation && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={selectedLocation.name}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      name: e.target.value
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Adresse"
                    value={selectedLocation.address}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      address: e.target.value
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="PLZ"
                    value={selectedLocation.postalCode}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      postalCode: e.target.value
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Stadt"
                    value={selectedLocation.city}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      city: e.target.value
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={selectedLocation.phone || ''}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      phone: e.target.value
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="E-Mail"
                    value={selectedLocation.email || ''}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      email: e.target.value
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedLocation.isActive}
                        onChange={(e) => setSelectedLocation({
                          ...selectedLocation,
                          isActive: e.target.checked
                        })}
                      />
                    }
                    label="Aktiv"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Abbrechen
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveLocation}
            sx={{ borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (isEditing ? 'Speichern' : 'Erstellen')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocationManagement;