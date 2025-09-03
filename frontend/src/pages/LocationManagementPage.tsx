import React, {useState, useEffect} from 'react';
import {
    Box,
    Typography,
    Container,
    Fade,
    useTheme,
    alpha,
    Paper,
} from '@mui/material';
import {
    Business as BusinessIcon
} from '@mui/icons-material';
import LocationManagement from '../components/LocationManagement';
import {LocationResponseDto} from '../api/data-contracts';
import {locationService} from '@/services';

/**
 * Modern Location Management Page in Dashboard Style
 */
const LocationManagementPage: React.FC = () => {
    const theme = useTheme();

    // Location list - load via API
    const [locations, setLocations] = useState<LocationResponseDto[]>([]);

    // Fetch locations when component loads
    useEffect(() => {
        const loadLocations = async () => {
            try {
                const data = await locationService.getAllLocations();
                setLocations(data);
            } catch (error) {
                console.error('Error loading locations:', error);
            }
        };

        loadLocations();
    }, []);

    // Animation control
    const [showCards, setShowCards] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Update locations
    const handleLocationsChange = (updatedLocations: LocationResponseDto[]) => {
        setLocations(updatedLocations);
    };


    return (
        <Container maxWidth="xl" sx={{py: 3}}>
            {/* Hero section */}
            <Fade in timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        p: {xs: 3, md: 4},
                        mb: 4,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                    }}
                >
                    <Box sx={{position: 'relative', zIndex: 1}}>
                        <Typography
                            variant="h3"
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
                            Standortverwaltung
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{mb: 2, maxWidth: 600}}
                        >
                            Verwalten Sie alle Standorte zentral und optimieren Sie deren Betrieb
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <BusinessIcon sx={{color: 'primary.main', fontSize: '1.2rem'}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {locations.filter(loc => loc.isActive).length} von {locations.length} Standorten aktiv
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Fade>

            {/* Location management - full width */}
            <Fade in={showCards} timeout={1400}>
                <Paper
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        mb: 4,
                    }}
                    data-testid="location-management"
                >
                    <Box sx={{p: 3}}>
                        <LocationManagement
                            locations={locations}
                            onLocationsChange={handleLocationsChange}
                        />
                    </Box>
                </Paper>
            </Fade>
        </Container>
    );
};

export default LocationManagementPage;