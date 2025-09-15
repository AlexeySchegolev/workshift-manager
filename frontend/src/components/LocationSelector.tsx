import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  Business as BusinessIcon
} from '@mui/icons-material';
import { LocationResponseDto } from '@/api/data-contracts';
import { locationService } from '@/services';

interface LocationSelectorProps {
  selectedLocationId: string | null;
  onLocationChange: (locationId: string | null) => void;
}

/**
 * Component for selecting the location for shift planning
 */
const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  selectedLocationId, 
  onLocationChange 
}) => {
  const [locations, setLocations] = useState<LocationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load locations from API
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const locationsData = await locationService.getAllLocations({
          activeOnly: true,
          includeEmployees: false
        });
        
        setLocations(locationsData);
        
        // Auto-select first location if none selected and locations available
        if (!selectedLocationId && locationsData.length > 0) {
          onLocationChange(locationsData[0].id);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Locations:', error);
        setError('Locations konnten nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [selectedLocationId, onLocationChange]);

  // Handle location change
  const handleLocationChange = (event: SelectChangeEvent<string>) => {
    const locationId = event.target.value;
    onLocationChange(locationId || null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        minWidth: 200
      }}>
        <BusinessIcon sx={{ color: 'primary.main' }} />
        <CircularProgress size={20} />
        <Typography variant="body2">Lade Standorte...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        padding: '10px',
        backgroundColor: '#ffebee',
        borderRadius: '8px',
        minWidth: 200
      }}>
        <BusinessIcon sx={{ color: 'error.main' }} />
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      minWidth: 200
    }}>
      <BusinessIcon sx={{ color: 'primary.main' }} />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <Select
          value={selectedLocationId || ''}
          onChange={handleLocationChange}
          displayEmpty
          sx={{
            fontSize: '0.9rem',
            fontWeight: 600,
            '& .MuiSelect-select': {
              padding: '4px 8px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: '1px solid',
              borderColor: 'primary.main',
            },
          }}
        >
          <MenuItem value="" disabled>
            <Typography variant="body2" color="text.secondary">
              Standort wählen
            </Typography>
          </MenuItem>
          {locations.map((location) => (
            <MenuItem key={location.id} value={location.id}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {location.name}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LocationSelector;