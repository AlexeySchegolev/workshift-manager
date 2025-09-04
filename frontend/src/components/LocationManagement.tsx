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
  useTheme,
  alpha,
  CircularProgress,
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
  People as PeopleIcon,
} from '@mui/icons-material';
import { locationService } from '@/services';
import {CreateLocationDto, UpdateLocationDto, LocationResponseDto} from '../api/data-contracts';
import { getCurrentTimestamp } from '../utils/date.utils';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { extractErrorMessage, getErrorDisplayDuration } from '../utils/errorUtils';
import DeleteConfirmationDialog from './common/DeleteConfirmationDialog';
import { LocationOn as LocationIcon2, Business as BusinessIcon2 } from '@mui/icons-material';

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
  const { organizationId } = useAuth();
  const { showSuccess, showError } = useToast();
  const [locations, setLocations] = useState<LocationResponseDto[]>(propLocations || []);
  const [selectedLocation, setSelectedLocation] = useState<LocationResponseDto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<LocationResponseDto | null>(null);

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
      const data = await locationService.getAllLocations();
      setLocations(data);
      onLocationsChange?.(data);
    } catch (err) {
      console.error('Error loading locations:', err);
      const errorMessage = extractErrorMessage(err);
      const duration = getErrorDisplayDuration(err);
      showError(errorMessage, duration);
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
        organizationId: organizationId || '',
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Germany',
        phone: '',
        email: '',
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

  // Helper function to filter location data for updates
  const createUpdateLocationData = (location: LocationResponseDto): UpdateLocationDto => {
    return {
      organizationId: location.organizationId,
      name: location.name,
      code: location.code,
      address: location.address,
      city: location.city,
      postalCode: location.postalCode,
      state: location.state,
      country: location.country,
      phone: location.phone,
      email: location.email,
      timezone: location.timezone,
      operatingHours: location.operatingHours,
      isActive: location.isActive,
    };
  };

  // Save location
  const handleSaveLocation = async () => {
    if (!selectedLocation) return;

    try {
      setLoading(true);

      if (isEditing) {
        // Update location - only send allowed fields
        const updateData = createUpdateLocationData(selectedLocation);
        const updatedLocation = await locationService.updateLocation(selectedLocation.id, updateData);
        const updatedLocations = locations.map(loc =>
          loc.id === selectedLocation.id ? updatedLocation : loc
        );
        setLocations(updatedLocations);
        onLocationsChange?.(updatedLocations);
        showSuccess(`Standort ${selectedLocation.name} wurde erfolgreich aktualisiert`);
      } else {
        // Create new location - validate organizationId is available
        if (!selectedLocation?.organizationId) {
          showError('Standort kann nicht erstellt werden: Keine Organisation verfügbar');
          return;
        }
        
        const newLocation = await locationService.createLocation(selectedLocation as CreateLocationDto);
        const updatedLocations = [...locations, newLocation];
        setLocations(updatedLocations);
        onLocationsChange?.(updatedLocations);
        showSuccess(`Standort ${selectedLocation.name} wurde erfolgreich erstellt`);
      }

      handleCloseDialog();
    } catch (err) {
      console.error('Error saving location:', err);
      const errorMessage = extractErrorMessage(err);
      const duration = getErrorDisplayDuration(err);
      showError(errorMessage, duration);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (location: LocationResponseDto) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setLocationToDelete(null);
  };

  // Delete location (called from confirmation dialog)
  const handleDeleteLocation = async () => {
    if (!locationToDelete) return;

    try {
      setLoading(true);
      await locationService.deleteLocation(locationToDelete.id);
      const updatedLocations = locations.filter(loc => loc.id !== locationToDelete.id);
      setLocations(updatedLocations);
      onLocationsChange?.(updatedLocations);
      showSuccess(`Standort ${locationToDelete.name} wurde erfolgreich gelöscht`);
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting location:', err);
      const errorMessage = extractErrorMessage(err);
      const duration = getErrorDisplayDuration(err);
      showError(errorMessage, duration);
    } finally {
      setLoading(false);
    }
  };

  // Better formatted operating hours component
  const formatOperatingHoursStructured = (location: LocationResponseDto) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    
    const activeDays = days
      .map((day, index) => ({
        name: dayNames[index],
        slots: location.operatingHours[day] || []
      }))
      .filter(day => Array.isArray(day.slots) && day.slots.length > 0);

    if (activeDays.length === 0) {
      return (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Geschlossen
        </Typography>
      );
    }

    // Group consecutive days with same hours
    const groupedDays: Array<{ days: string[], slots: any[] }> = [];
    
    activeDays.forEach(day => {
      const slotsStr = day.slots.map((slot: any) => `${slot.start}-${slot.end}`).join(', ');
      const existingGroup = groupedDays.find(g => 
        g.slots.map((slot: any) => `${slot.start}-${slot.end}`).join(', ') === slotsStr
      );
      
      if (existingGroup) {
        existingGroup.days.push(day.name);
      } else {
        groupedDays.push({ days: [day.name], slots: day.slots });
      }
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {groupedDays.map((group, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', minWidth: '50px' }}>
              {group.days.length > 2 ? `${group.days[0]}-${group.days[group.days.length - 1]}` : group.days.join(', ')}:
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1, textAlign: 'right' }}>
              {group.slots.map((slot: any) => `${slot.start}-${slot.end}`).join(', ')}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box>

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
                  background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: location.isActive 
                      ? 'linear-gradient(90deg, #4caf50, #81c784)'
                      : 'linear-gradient(90deg, #f44336, #ef5350)',
                    zIndex: 1,
                  },
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.02)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    '&::before': {
                      height: '6px',
                    },
                  },
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          background: location.isActive
                            ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                            : 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)',
                          width: 56,
                          height: 56,
                          border: `3px solid ${location.isActive 
                            ? alpha(theme.palette.primary.main, 0.2)
                            : alpha(theme.palette.grey[400], 0.2)}`,
                          boxShadow: location.isActive
                            ? '0 4px 12px rgba(25, 118, 210, 0.15)'
                            : '0 4px 12px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <BusinessIcon sx={{ fontSize: '1.8rem', color: 'white' }} />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            lineHeight: 1.2, 
                            mb: 0.5,
                            fontSize: '1.2rem',
                            background: location.isActive
                              ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
                              : 'linear-gradient(135deg, #757575, #9e9e9e)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {location.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={location.isActive ? 'Aktiv' : 'Inaktiv'}
                            size="small"
                            sx={{
                              background: location.isActive
                                ? 'linear-gradient(135deg, #4caf50, #81c784)'
                                : 'linear-gradient(135deg, #f44336, #ef5350)',
                              color: 'white',
                              fontWeight: 600,
                              borderRadius: '12px',
                              height: '26px',
                              boxShadow: location.isActive
                                ? '0 2px 8px rgba(76, 175, 80, 0.3)'
                                : '0 2px 8px rgba(244, 67, 54, 0.3)',
                              '& .MuiChip-label': {
                                px: 1.5,
                              },
                            }}
                          />
                          {location.code && (
                            <Chip
                              label={location.code}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: alpha(theme.palette.info.main, 0.4),
                                color: 'info.main',
                                fontWeight: 600,
                                borderRadius: '12px',
                                height: '26px',
                                backgroundColor: alpha(theme.palette.info.main, 0.05),
                              }}
                            />
                          )}
                        </Box>
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
                        onClick={() => handleOpenDeleteDialog(location)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Address & Contact Info */}
                  <Box 
                    sx={{ 
                      mb: 3,
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
                    }}
                  >
                    {/* Address */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2.5 }}>
                      <Box
                        sx={{
                          p: 0.75,
                          borderRadius: '50%',
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 32,
                          minHeight: 32,
                        }}
                      >
                        <LocationIcon sx={{ color: 'primary.main', fontSize: '1.1rem' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                          Adresse
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                          {location.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                          {location.postalCode} {location.city}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Contact */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {location.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              p: 0.75,
                              borderRadius: '50%',
                              backgroundColor: alpha(theme.palette.success.main, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 32,
                              minHeight: 32,
                            }}
                          >
                            <PhoneIcon sx={{ color: 'success.main', fontSize: '1.1rem' }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              Telefon
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {location.phone}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {location.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              p: 0.75,
                              borderRadius: '50%',
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: 32,
                              minHeight: 32,
                            }}
                          >
                            <EmailIcon sx={{ color: 'info.main', fontSize: '1.1rem' }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              E-Mail
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {location.email}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Statistics */}
                  <Box 
                    sx={{ 
                      mb: 3,
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.secondary.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.08)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box
                        sx={{
                          p: 0.75,
                          borderRadius: '50%',
                          backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 32,
                          minHeight: 32,
                        }}
                      >
                        <PeopleIcon sx={{ color: 'secondary.main', fontSize: '1.1rem' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main', lineHeight: 1 }}>
                          {location.employees.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Mitarbeiter zugeordnet
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Operating hours */}
                  <Box 
                    sx={{ 
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.warning.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.08)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box
                        sx={{
                          p: 0.75,
                          borderRadius: '50%',
                          backgroundColor: alpha(theme.palette.warning.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 32,
                          minHeight: 32,
                        }}
                      >
                        <ScheduleIcon sx={{ color: 'warning.main', fontSize: '1.1rem' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                          Öffnungszeiten
                        </Typography>
                        {formatOperatingHoursStructured(location)}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions 
                  sx={{ 
                    pt: 2.5, 
                    px: 3, 
                    pb: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.4)} 100%)`,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    gap: 1
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<AssessmentIcon />}
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      background: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.1),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                      }
                    }}
                  >
                    Details
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(location)}
                    sx={{ 
                      color: 'info.main',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      background: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: alpha(theme.palette.info.main, 0.1),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.2)}`,
                      }
                    }}
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        config={{
          title: 'Standort löschen',
          entityName: 'den folgenden Standort',
          entityDisplayName: locationToDelete?.name,
          showDetailedView: true,
          icon: <LocationIcon2 color="primary" />,
          chips: [
            ...(locationToDelete?.code ? [{
              label: locationToDelete.code,
              color: 'primary' as const,
              variant: 'outlined' as const,
            }] : []),
            {
              label: locationToDelete?.isActive ? 'Aktiv' : 'Inaktiv',
              color: locationToDelete?.isActive ? 'success' : 'default',
              variant: 'outlined' as const,
            },
            {
              label: `${locationToDelete?.employees?.length || 0} Mitarbeiter`,
              icon: <BusinessIcon2 />,
              variant: 'outlined' as const,
            },
          ],
          fields: [
            { label: 'Adresse', value: locationToDelete?.address || '' },
            { label: 'Stadt', value: `${locationToDelete?.city || ''} ${locationToDelete?.postalCode || ''}`.trim() },
            ...(locationToDelete?.phone ? [{ label: 'Telefon', value: locationToDelete.phone }] : []),
            ...(locationToDelete?.email ? [{ label: 'E-Mail', value: locationToDelete.email }] : []),
          ].filter(field => field.value),
        }}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteLocation}
      />
    </Box>
  );
};

export default LocationManagement;