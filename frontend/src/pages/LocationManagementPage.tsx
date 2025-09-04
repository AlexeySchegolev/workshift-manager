import React, {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Fade,
    useTheme,
    Paper,
} from '@mui/material';
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